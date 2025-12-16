import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth(), logout);
router.get("/me", auth(), me);

export default router;
