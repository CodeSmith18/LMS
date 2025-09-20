import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: (Number(process.env.JWT_REFRESH_TOKEN_EXP) || 60 * 60 * 24 * 7) * 1000
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email)
      return res.status(400).json({ error: "username, email and password are required" });

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email already exists. Try Login !!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    return res.status(201).json({ message: "User Registration Done", userId: user._id });
  } catch (err) {
    console.error("signUp error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXP }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Email id is not registered" });

    const isPassWordCorrect = await bcrypt.compare(password, user.password);
    if (!isPassWordCorrect) return res.status(401).json({ error: "Incorrect Password" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken, message: "Login Successful" });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No Refresh Token" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Invalid refresh Token" });
    }

    const user = await User.findOne({ email: payload.email });
    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Refresh Token not found" });
    }

    if (user.refreshToken !== token) {
      user.refreshToken = null;
      await user.save();
      return res.status(401).json({ message: "Token mismatch" });
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .status(200)
      .json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("refreshToken error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
