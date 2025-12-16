import {
    registerService,
    loginService,
    logoutService,
    meService,
} from "../services/auth.service.js";

// ======================================================
// REGISTER
// ======================================================
export const register = async (req, res) => {
    try {
        const user = await registerService(req.body);

        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                id: user.id_user,
                nama: user.nama,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

// ======================================================
// LOGIN
// ======================================================
export const login = async (req, res) => {
    try {
        const { user, token } = await loginService(req.body);

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            token,
            data: {
                id: user.id_user,
                nama: user.nama,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

// ======================================================
// ME (PROFILE)
// ======================================================
export const me = async (req, res) => {
    try {
        const user = await meService(req.user.id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const logout = async (req, res) => {
    try {
        const result = await logoutService();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
