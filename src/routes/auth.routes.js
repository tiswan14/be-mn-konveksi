import { Router } from "express";
import {
    register,
    login,
    me,
    logout,
} from "../controllers/auth.controller.js";

import {
    registerValidator,
    loginValidator,
} from "../validators/auth.validator.js";

import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// ==============================
// PUBLIC AUTH ROUTES
// ==============================
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

// ==============================
// PROTECTED AUTH ROUTES
// ==============================
router.get("/me", auth(), me);
router.post("/logout", auth(), logout);

export default router;
