export const requireQuery = (res, query, fields) => {
    for (const field of fields) {
        if (!query[field]) {
            res.status(400).json({
                success: false,
                message: `Parameter ${field} wajib diisi`,
            });
            return false;
        }
    }
    return true;
};
