import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipient,
  sender,
  type,
  post,
  comment,
  message,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      comment,
      message,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const notifyFollow = async (followerId, followedId, followerName) => {
  return await createNotification({
    recipient: followedId,
    sender: followerId,
    type: 'follow',
    message: `${followerName} started following you`,
  });
};

export const notifyComment = async (commentAuthorId, postAuthorId, postId, postTitle) => {
  return await createNotification({
    recipient: postAuthorId,
    sender: commentAuthorId,
    type: 'comment',
    post: postId,
    message: `New comment on your post: "${postTitle}"`,
  });
};

export const notifyUpvote = async (voterId, postAuthorId, postId, postTitle) => {
  return await createNotification({
    recipient: postAuthorId,
    sender: voterId,
    type: 'upvote',
    post: postId,
    message: `Someone upvoted your post: "${postTitle}"`,
  });
};

export const notifyPostApproved = async (postAuthorId, postId, postTitle) => {
  return await createNotification({
    recipient: postAuthorId,
    type: 'post_approved',
    post: postId,
    message: `Your post "${postTitle}" has been approved and published`,
  });
};

export const notifyPostRejected = async (postAuthorId, postId, postTitle, reason) => {
  return await createNotification({
    recipient: postAuthorId,
    type: 'post_rejected',
    post: postId,
    message: `Your post "${postTitle}" was rejected. Reason: ${reason}`,
  });
};
