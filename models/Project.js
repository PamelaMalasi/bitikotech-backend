
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // image URL/path
      required: true,
    },
    link: {
      type: String,
    },
    pdf: {
      type: String, // Cloudinary URL for the project PDF
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", ProjectSchema);
