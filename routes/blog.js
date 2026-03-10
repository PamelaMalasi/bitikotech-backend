import express from "express";
import Blog from "../models/Blog.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// CREATE blog (admin only, with image)
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "bitikotech-blogs" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      image: imageUrl,
    });

    res.json(blog);
  } catch (err) {
    console.log("CREATE BLOG ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to create blog" });
  }
});

// GET all blogs (public)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
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

// UPDATE blog (admin only, optional new image)
router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
    };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "bitikotech-blogs" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      updateData.image = result.secure_url;
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log("UPDATE BLOG ERROR:", err);
    res.status(400).json({ message: err.message || "Update failed" });
  }
});

export default router;