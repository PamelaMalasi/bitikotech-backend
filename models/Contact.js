import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      enum: ["consultation", "contact"],
      required: true,
    },

    // common
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    // consultation fields
    consultationType: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    preferredDate: {
      type: String,
      default: "",
    },
    projectDetails: {
      type: String,
      default: "",
      trim: true,
    },

    // contact fields
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;