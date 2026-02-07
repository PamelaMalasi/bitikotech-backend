import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  try {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
}
