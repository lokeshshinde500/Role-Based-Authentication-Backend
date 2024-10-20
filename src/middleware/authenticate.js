import jwt from "jsonwebtoken";
import constant from "../config/constant.js";
import userModel from "../models/userModel.js";

// authenticate token
export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;

    //if in bearer token passed
    //const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Login required!", success: false });
    }

    jwt.verify(token, constant.JWT_SECRET_KEY, async (error, user) => {
      if (error) {
        return res
          .status(401)
          .json({ message: "Unauthorized!", success: false });
      }

      req.user = await userModel.findById(user.userId);
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!", success: false });
  }
};

// admin role authentication
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Access denined!", success: false });
  }
  next();
};
