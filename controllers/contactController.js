import Contact from "../models/Contact.js";
import { Resend } from "resend";

function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
      to: process.env.ADMIN_EMAIL,
      subject:
        formType === "consultation"
          ? "New Consultation Request"
          : "New Contact Form Submission",
      html: `
        <h3>New ${esc(formType)} submission</h3>
        <p><b>Name:</b> ${esc(name)}</p>
        <p><b>Email:</b> ${esc(email)}</p>
        ${
          formType === "consultation"
            ? `
              <p><b>Consultation Type:</b> ${esc(consultationType)}</p>
              <p><b>Company:</b> ${esc(company)}</p>
              <p><b>Phone:</b> ${esc(phone)}</p>
              <p><b>Preferred Date:</b> ${esc(preferredDate)}</p>
              <p><b>Project Details:</b> ${esc(projectDetails)}</p>
            `
            : `
              <p><b>Subject:</b> ${esc(subject)}</p>
              <p><b>Message:</b> ${esc(message)}</p>
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