import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// ADMIN LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { admin: true },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

 res.cookie("admin_token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});



  res.json({ success: true });
});

// ✅ AUTH CHECK (used by RequireAdmin)
router.get("/me", (req, res) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({});

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ ok: true });
  } catch {
    res.status(401).json({});
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("admin_token", {
  secure: true,
  sameSite: "none",
});

  res.json({ success: true });
});



export default router;
