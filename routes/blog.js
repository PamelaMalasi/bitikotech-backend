import express from "express";
import Blog from "../models/Blog.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

function calcReadTime(text = "") {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "bitikotech-blogs" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// CREATE blog (admin only)
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt, content, category, author } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      image: imageUrl,
      category: category || "Marketing",
      author: author || "Bitiko Team",
      readTime: calcReadTime(content),
    });

    res.json(blog);
  } catch (err) {
    console.log("CREATE BLOG ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to create blog" });
  }
});

// GET all blogs (public) — supports ?category= filter
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
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
router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt, content, category, author } = req.body;

    const updateData = {
      title,
      excerpt,
      content,
      category,
      author,
      readTime: calcReadTime(content),
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.log("UPDATE BLOG ERROR:", err);
    res.status(400).json({ message: err.message || "Update failed" });
  }
});

// DELETE blog (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
});

export default router;
