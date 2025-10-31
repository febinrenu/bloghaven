import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { notifyComment, notifyUpvote, notifyPostApproved, notifyPostRejected } from '../utils/notifications.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Author, Admin)
export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, coverImage, status } = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags,
      coverImage,
      author: req.user._id,
      status: status || 'draft',
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all published posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, sort = '-publishedAt' } = req.query;

    const query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name avatar bio')
      .exec();

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar bio followers')
      .populate({
        path: 'upvotes',
        select: 'name avatar',
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author, Admin)
export const updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, coverImage, status } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    
    if (status) {
      post.status = status;
    }

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name avatar');

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author, Admin)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: req.params.id });

    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upvote/Unvote post
// @route   POST /api/posts/:id/upvote
// @access  Private
export const toggleUpvote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = post.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userId.toString());
      post.upvoteCount = Math.max(0, post.upvoteCount - 1);
    } else {
      // Add upvote
      post.upvotes.push(userId);
      post.upvoteCount += 1;

      // Send notification to post author (if not self-upvote)
      if (post.author.toString() !== userId.toString()) {
        await notifyUpvote(userId, post.author, post._id, post.title);
      }
    }

    await post.save();

    res.json({ upvoted: !hasUpvoted, upvoteCount: post.upvoteCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's own posts
// @route   GET /api/posts/my/posts
// @access  Private
export const getMyPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { author: req.user._id };

    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name avatar')
      .exec();

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit post for review (change status to pending)
// @route   POST /api/posts/:id/submit
// @access  Private (Author)
export const submitPostForReview = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (post.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft posts can be submitted' });
    }

    post.status = 'pending';
    await post.save();

    res.json({ message: 'Post submitted for review', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
