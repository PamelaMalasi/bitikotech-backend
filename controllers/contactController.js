import Contact from "../models/Contact.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "pammalasi@outlook.com",
      subject:
        formType === "consultation"
          ? "New Consultation Request"
          : "New Contact Form Submission",
      html: `
        <h3>New ${formType} submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        ${
          formType === "consultation"
            ? `
              <p><b>Consultation Type:</b> ${consultationType || ""}</p>
              <p><b>Company:</b> ${company || ""}</p>
              <p><b>Phone:</b> ${phone || ""}</p>
              <p><b>Preferred Date:</b> ${preferredDate || ""}</p>
              <p><b>Project Details:</b> ${projectDetails || ""}</p>
            `
            : `
              <p><b>Subject:</b> ${subject || ""}</p>
              <p><b>Message:</b> ${message || ""}</p>
            `
        }
      `,
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