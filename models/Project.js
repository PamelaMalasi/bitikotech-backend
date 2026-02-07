
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
      type: String, // optional external link (e.g. live site)
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", ProjectSchema);
