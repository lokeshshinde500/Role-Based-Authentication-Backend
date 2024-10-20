import { Router } from "express";

import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";

const routes = Router();

// Auth Routes
routes.use("/auth", authRoutes);

// Admin Routes
routes.use("/admin", adminRoutes);

export default routes;
