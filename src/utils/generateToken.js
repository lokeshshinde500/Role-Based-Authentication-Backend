import jwt from "jsonwebtoken";
import constant from "../config/constant.js";

// create new token
export const createToken = async (payload) => {
  const token = await jwt.sign({ userId: payload }, constant.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });
  return token;
};
