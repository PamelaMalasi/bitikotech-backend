import Contact from "../models/Contact.js";

export const createContactMessage = async (req, res) => {
  try {
    const {
      formType,
      name,
      email,
      consultationType,
      company,
      phone,
      preferredDate,
      projectDetails,
      subject,
      message,
    } = req.body;

    if (!formType || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Form type, name, and email are required.",
      });
    }

    if (formType === "consultation" && !projectDetails) {
      return res.status(400).json({
        success: false,
        message: "Please tell us about your project.",
      });
    }

    if (formType === "contact" && (!subject || !message)) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required.",
      });
    }

    const newContact = await Contact.create({
      formType,
      name,
      email,
      consultationType,
      company,
      phone,
      preferredDate,
      projectDetails,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully.",
      data: newContact,
    });
  } catch (error) {
    console.error("createContactMessage error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting form.",
    });
  }
};