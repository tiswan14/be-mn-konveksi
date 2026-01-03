import { verifyToken } from "../utils/jwt.js";

export const auth = () => {
    return (req, res, next) => {
        try {
            const header = req.headers.authorization;

            if (!header) {
                return res.status(401).json({
                    success: false,
                    message: "Token tidak ditemukan",
                });
            }

            const parts = header.split(" ");
            if (parts.length !== 2 || parts[0] !== "Bearer") {
                return res.status(401).json({
                    success: false,
                    message: "Format authorization tidak valid",
                });
            }

            const token = parts[1];

            // Verifikasi token
            const decoded = verifyToken(token);

            // Simpan payload user ke request
            req.user = decoded;

            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid atau sudah kedaluwarsa",
            });
        }
    };
};
