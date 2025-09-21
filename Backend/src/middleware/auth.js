const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("auth middleware error", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
