import express from "express";
import Blog from "../models/Blog.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// CREATE blog (admin only, with image)
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.json(blog);
 } catch (err) {
  console.log("CREATE BLOG ERROR:", err);
  res.status(500).json({ message: err.message || "Failed to create blog" });
}
});

// GET all blogs (public)
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
});

// GET single blog (public)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
});

// UPDATE blog (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Update failed" });
  }
});





export default router;
