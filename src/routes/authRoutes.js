import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
const routes = Router();

// Register
routes.post("/register", register);

// Login
routes.post("/login", login);

// Profile
routes.get("/profile", authenticate, profile);

// Logout
routes.get("/logout", logout);

export default routes;
