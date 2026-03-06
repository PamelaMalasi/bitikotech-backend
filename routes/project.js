import express from "express";
import Project from "../models/Project.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * CREATE project (admin only, with image)
 */
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, link } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "bitikotech-projects" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const project = await Project.create({
      title,
      description,
      link,
      image: imageUrl,
    });

    res.json(project);
  } catch (error) {
    console.error("Failed to create project:", error);
    res.status(400).json({ message: "Failed to create project" });
  }
});
/**
 * PUBLIC — get all projects
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// GET one project (public)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});


/**
 * DELETE project (admin only)
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
});

// UPDATE project (admin only, with optional image)
router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
    };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "bitikotech-projects" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      updateData.image = result.secure_url;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(400).json({ message: "Update failed" });
  }
});



export default router;
