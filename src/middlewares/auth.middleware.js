import { verifyToken } from "../utils/jwt.js";

export const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            const header = req.headers.authorization;
            if (!header) {
                return res.status(401).json({ message: "Token required" });
            }

            const token = header.split(" ")[1];
            const decoded = verifyToken(token);

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};
