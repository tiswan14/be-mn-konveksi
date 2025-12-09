import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth(), me);

export default router;
