// src/routes/user.route.js
import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
    userIdParamValidator,
    updateUserValidator,
} from "../validators/user.validator.js";

const router = Router();

// ===============================
// ADMIN USER MANAGEMENT
// ===============================
router.get(
    "/admin/users",
    auth(),
    requireAdmin,
    userController.getAll
);

router.get(
    "/admin/users/:id",
    auth(),
    requireAdmin,
    userIdParamValidator,
    validate,
    userController.getDetail
);

router.patch(
    "/admin/users/:id",
    auth(),
    requireAdmin,
    userIdParamValidator,
    updateUserValidator,
    validate,
    userController.update
);

export default router;
