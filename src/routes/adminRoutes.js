import { Router } from "express";
import { deleteUser, getUsers } from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middleware/authenticate.js";
const routes = Router();

// get all users
routes.get("/user", authenticate, isAdmin, getUsers);

// delete user by id
routes.delete("/user/:userId", authenticate, isAdmin, deleteUser);

export default routes;
