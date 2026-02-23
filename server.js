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

const allowedOrigins = [
  "https://bitikotech-frontend.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS blocked for origin: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


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
  console.log(`Backend running on port ${PORT}`);
});
