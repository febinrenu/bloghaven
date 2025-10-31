import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { notifyComment } from '../utils/notifications.js';

// @desc    Create comment on a post
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null,
    });

    // If it's a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    // Update post comment count
    post.commentCount += 1;
    await post.save();

    // Notify post author
    if (post.author.toString() !== req.user._id.toString()) {
      await notifyComment(req.user._id, post.author, post._id, post.title);
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar')
      .populate('parentComment');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ post: postId, parentComment: null })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' },
      })
      .exec();

    const count = await Comment.countDocuments({ post: postId, parentComment: null });

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = content;
    comment.isEdited = true;

    const updatedComment = await comment.save();
    const populatedComment = await Comment.findById(updatedComment._id).populate(
      'author',
      'name avatar'
    );

    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all replies
    await Comment.deleteMany({ parentComment: comment._id });

    // Update post comment count
    const post = await Post.findById(comment.post);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      await post.save();
    }

    // Remove from parent's replies if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
