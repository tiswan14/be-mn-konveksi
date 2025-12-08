import {
    registerService,
    loginService,
    meService,
} from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const user = await registerService(req.body);
        res.json({ message: "Registrasi berhasil", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { user, token } = await loginService(req.body);
        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id_user,
                nama: user.nama,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const user = await meService(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal error" });
    }
};
