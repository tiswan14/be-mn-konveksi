export const requireAdmin = (req, res, next) => {
    try {
        // Pastikan user sudah login (middleware auth harus jalan dulu)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Anda harus login terlebih dahulu",
            });
        }

        // Cek apakah role user adalah ADMIN
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Anda tidak memiliki akses untuk aksi ini",
            });
        }

        // jika aman → lanjut
        next();
    } catch (error) {
        console.error("Role Middleware Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada permission",
            error: error.message,
        });
    }
};
