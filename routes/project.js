import express from "express";
import Project from "../models/Project.js";
import requireAdmin from "../middleware/requireAdmin.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

const multiUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf",   maxCount: 1 },
]);

async function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) =>
      error ? reject(error) : resolve(result)
    );
    stream.end(buffer);
  });
}

// CREATE project (admin only)
router.post("/", requireAdmin, multiUpload, async (req, res) => {
  try {
    const { title, description, link } = req.body;

    let imageUrl = "";
    let pdfUrl   = "";

    if (req.files?.image?.[0]) {
      const result = await uploadToCloudinary(req.files.image[0].buffer, {
        folder: "bitikotech-projects",
      });
      imageUrl = result.secure_url;
    }

    if (req.files?.pdf?.[0]) {
      const result = await uploadToCloudinary(req.files.pdf[0].buffer, {
        folder: "bitikotech-projects-pdf",
        resource_type: "raw",
      });
      pdfUrl = result.secure_url;
    }

    const project = await Project.create({
      title,
      description,
      link,
      image: imageUrl,
      pdf: pdfUrl,
    });

    res.json(project);
  } catch (error) {
    console.error("Failed to create project:", error);
    res.status(400).json({ message: "Failed to create project" });
  }
});

// GET all projects (public)
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

// UPDATE project (admin only)
router.put("/:id", requireAdmin, multiUpload, async (req, res) => {
  try {
    const updateData = {
      title:       req.body.title,
      description: req.body.description,
      link:        req.body.link,
    };

    if (req.files?.image?.[0]) {
      const result = await uploadToCloudinary(req.files.image[0].buffer, {
        folder: "bitikotech-projects",
      });
      updateData.image = result.secure_url;
    }

    if (req.files?.pdf?.[0]) {
      const result = await uploadToCloudinary(req.files.pdf[0].buffer, {
        folder: "bitikotech-projects-pdf",
        resource_type: "raw",
      });
      updateData.pdf = result.secure_url;
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(400).json({ message: "Update failed" });
  }
});

// DELETE project (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
});

export default router;
