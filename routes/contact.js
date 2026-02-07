import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// PUBLIC — submit contact form
router.post("/", async (req, res) => {
  try {
    await Contact.create(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to send message" });
  }
});

export default router;
