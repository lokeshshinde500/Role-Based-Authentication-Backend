
import userModel from "../models/userModel.js";
import { comparePassword, encryptPassword } from "../utils/ecryptPassword.js";
import { createToken } from "../utils/generateToken.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // All fields are required!
    if (!name || !email || !role || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    // check email already registered
    const isEmail = await userModel.findOne({ email: email });
    if (isEmail) {
      return res.status(400).json({
        message: "Email already registered!",
        success: false,
      });
    }

    // invalid role selection
    if (role !== "admin" && role !== "user") {
      return res.status(400).json({
        message: "Invalid role selection! select admin or user!",
        success: false,
      });
    }

    // email validation
    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegx.test(email)) {
      return res.status(400).json({
        message: "Please, enter a valid email!",
        success: false,
      });
    }

    // password >= 3
    if (password.length < 3) {
      return res.status(400).json({
        message: "Password should be at least 3 characters long!",
        success: false,
      });
    }

    // all good store user data in db
    const hashPassword = await encryptPassword(password);

    const newUser = {
      name,
      email,
      role,
      password: hashPassword,
    };

    await userModel.create(newUser);

    return res.status(201).json({
      message: "User register successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, role, password } = req.body;

    // All fields are required!
    if (!email || !role || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    // Validate email format
    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegx.test(email)) {
      return res.status(400).json({
        message: "Please, enter a valid email!",
        success: false,
      });
    }

    // Email not registered
    const verifyUser = await userModel.findOne({ email });

    if (!verifyUser) {
      return res.status(400).json({
        message: "Email not registered!",
        success: false,
      });
    }

    // Wrong password
    const isValidPass = await comparePassword(password, verifyUser.password);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid credentials!",
        success: false,
      });
    }

    // Invalid role selection
    if (role !== verifyUser.role) {
      return res.status(400).json({
        message: "Account doesn't exist with the current role!",
        success: false,
      });
    }

    // All good, user verified
    const token = await createToken(verifyUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successfully.",
      token,
      user: { ...verifyUser._doc, password: "" },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: error.message,
    });
  }
};

// Profile
export const profile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    // if user not found
    if (!user) {
      return res.status(404).json({
        message: "user not found!",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: error.message,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(400).json({
      message: "Logout successfully.",
      success: true,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: error.message,
    });
  }
};
