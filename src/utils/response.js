export const ok = (res, data) => {
    return res.json({
        success: true,
        data,
    });
};

export const badRequest = (res, message) => {
    return res.status(400).json({
        success: false,
        message,
    });
};

export const serverError = (res, error) => {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
    });
};
