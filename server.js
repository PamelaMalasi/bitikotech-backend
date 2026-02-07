import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blog.js";
import projectRoutes from "./routes/project.js";
import contactRoutes from "./routes/contact.js";
import path from "path";




dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes AFTER cors
app.use("/admin", adminRoutes);
app.use("/blog", blogRoutes);
app.use("/project", projectRoutes);
app.use("/contact", contactRoutes);
app.use("/uploads", express.static("uploads"));




// connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
