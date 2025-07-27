/**
 * Post controller
 * @module PostController
 */

const sequelize = require("../models").sequelize;
const postService = require("../services/Post.service");

/**
 * Get all posts
 * @param {Request} req
 * @param {Response} res
 */

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get post by id
 * @param {Request} req
 * @param {Response} res
 */

exports.getPostById = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postService.getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Lỗi khi lấy chi tiết bài đăng" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create post
 * @param {Request} req
 * @param {Response} res
 */

exports.createPost = async (req, res) => {
  const item = req.body;

  try {
    const post = await postService.createPost({
      title: item?.title,
      content: item?.content,
    });

    if (!post) {
      return res.status(400).json({ message: "Lỗi tạo bài viết" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update post
 * @param {Request} req
 * @param  {Response} res
 */

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  try {
    const postnew = await postService.updatePost(id, { title, content });
    if (!postnew) {
      return res.status(404).json({ message: "Lỗi khi chỉnh sửa bài đăng" });
    }
    res.status(200).json({ message: "Chỉnh sửa thành công", postnew });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete post
 * @param {Request} req
 * @param  {Response} res
 */

exports.deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postService.deletePost(id);
    if (!post) {
      return res.status(404).json({ message: "Xoá bài không thành công" });
    }
    res.status(200).json({ status: true, message: "Xoá thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
