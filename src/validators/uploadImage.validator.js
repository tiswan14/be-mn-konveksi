export const validateImageUpload = (req, res, next) => {
    // file opsional
    if (!req.file) return next();

    const file = req.file;

    // ==============================
    // MIME TYPE
    // ==============================
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(422).json({
            success: false,
            message: "Format file tidak didukung",
            errors: [
                {
                    field: "foto",
                    message: "Hanya boleh upload JPG, PNG, atau WEBP",
                },
            ],
        });
    }

    // ==============================
    // SIZE LIMIT (5 MB)
    // ==============================
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_SIZE) {
        return res.status(422).json({
            success: false,
            message: "Ukuran file terlalu besar",
            errors: [
                {
                    field: "foto",
                    message: "Ukuran maksimal file adalah 5MB",
                },
            ],
        });
    }

    next();
};
