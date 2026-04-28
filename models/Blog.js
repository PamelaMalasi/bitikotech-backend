import mongoose from "mongoose";

export const BLOG_CATEGORIES = [
  "Marketing",
  "Web Development",
  "Design",
  "Business",
  "Technology",
  "Analytics",
];

const BlogSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    excerpt:  { type: String, required: true },
    content:  { type: String, required: true },
    image:    { type: String, required: true },
    category: { type: String, enum: BLOG_CATEGORIES, default: "Marketing" },
    author:   { type: String, default: "Bitiko Team" },
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
