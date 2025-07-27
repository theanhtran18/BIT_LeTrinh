const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById,
} = require("../controllers/Post.controller");

const router = require("express").Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
