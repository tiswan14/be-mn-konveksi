import { verifyToken } from "../utils/jwt.js";

export const auth = () => {
    return (req, res, next) => {
        try {
            const header = req.headers.authorization;

            if (!header) {
                return res.status(401).json({
                    success: false,
                    message: "Token required",
                });
            }

            const parts = header.split(" ");
            if (parts.length !== 2 || parts[0] !== "Bearer") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authorization format",
                });
            }

            const token = parts[1];

            // Verify token
            const decoded = verifyToken(token);

            // Save payload
            req.user = decoded;

            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    };
};
