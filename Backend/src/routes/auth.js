const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "60s";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

function signAccessToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}
function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
}

// Register
router.post(
  "/register",
  body("email").isEmail(),
  body("name").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already used" });
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const user = new User({ name, email, passwordHash });
      await user.save();

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      user.refreshTokens.push({ token: refreshToken });
      await user.save();

      res.json({
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match)
        return res.status(400).json({ message: "Invalid credentials" });

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      user.refreshTokens.push({ token: refreshToken });
      await user.save();

      res.json({
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const found = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!found)
      return res
        .status(401)
        .json({ message: "Refresh token not recognized (maybe logged out)" });

    // issue new access token (and optionally new refresh token)
    const accessToken = signAccessToken(user);
    // (Optional) rotate refresh token
    const newRefreshToken = signRefreshToken(user);
    // remove old and add new
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken required" });

    let payload;
    try {
      payload = jwt.decode(refreshToken);
    } catch (err) {
      payload = null;
    }
    if (!payload || !payload.id)
      return res.status(200).json({ message: "Logged out" });

    const user = await User.findById(payload.id);
    if (!user) return res.status(200).json({ message: "Logged out" });
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    await user.save();
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
