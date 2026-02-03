import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as User from "../models/user.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (!existingUser) {
      return res.status(403).json({
        message: "Auth failed",
        success: false,
      });
    }
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(403).json({
        message: "password didnt match",
        success: false,
      });
    }
    const jwttoken = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "login successful",
      success: true,
      jwttoken,
      email: existingUser.email,
      name: existingUser.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
