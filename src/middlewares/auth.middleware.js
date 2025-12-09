import { verifyToken } from "../utils/jwt.js";

export const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            const header = req.headers.authorization;

            // Tidak ada token
            if (!header) {
                return res.status(401).json({
                    success: false,
                    message: "Token required",
                });
            }

            // Format harus "Bearer <token>"
            const parts = header.split(" ");
            if (parts.length !== 2 || parts[0] !== "Bearer") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authorization format",
                });
            }

            const token = parts[1];

            // Verifikasi token
            const decoded = verifyToken(token);

            // Role-based authorization (opsional)
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            // Simpan payload token
            req.user = decoded;

            return next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    };
};
