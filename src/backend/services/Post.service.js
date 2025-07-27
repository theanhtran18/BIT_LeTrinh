/**
 * CRUD operations for Post
 * @module services/Post.service
 */

const { Post } = require("../models");

/**
 * Get all posts
 * @returns {Promise<Post[]>}
 */
exports.getAllPosts = async () => {
  return await Post.findAll();
};

/**
 * Get a post by id
 * @param {string} id - The id of the post
 * @returns {Promise<Post>} A promise that contains the post
 */
exports.getPostById = async (id) => {
  return await Post.findByPk(id);
};

/**
 * Create a new post
 * @param {Object} post - The post data
 * @returns {Promise<Post>}
 */
exports.createPost = async (post) => {
  return await Post.create(post);
};

/**
 * Update a post by id
 * @param {string} id - The id of the post to update
 * @param {Object} post - The updated post data
 * @returns {Promise<boolean>} True if updated, false otherwise
 */
exports.updatePost = async (id, post) => {
  const existing = await Post.findByPk(id);
  if (!existing) return false;

  const updatedPost = {
    title: post.title ?? existing.title,
    content: post.content ?? existing.content,
  };

  const [affectedCount] = await Post.update(updatedPost, { where: { id } });
  return affectedCount > 0;
};

/**
 * Delete a post by id
 * @param {string} id - The id of the post to delete
 * @returns {Promise<number>} Number of rows deleted
 */
exports.deletePost = async (id) => {
  return await Post.destroy({
    where: { id },
  });
};
