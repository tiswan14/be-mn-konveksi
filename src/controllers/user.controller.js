// src/controllers/user.controller.js
import userService from "../services/user.service.js";

class UserController {

    async getAll(req, res) {
        try {
            const data = await userService.getAllUsers();
            res.json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async getDetail(req, res) {
        try {
            const id_user = Number(req.params.id);
            const data = await userService.getUserDetail(id_user);
            res.json({ success: true, data });
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    }

    async update(req, res) {
        try {
            const id_user = Number(req.params.id);

            if (isNaN(id_user)) {
                return res.status(400).json({
                    success: false,
                    message: "ID user tidak valid",
                });
            }

            const data = await userService.updateUser(id_user, req.body);

            return res.json({
                success: true,
                message: "User berhasil diperbarui",
                data,
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "Gagal memperbarui user",
            });
        }
    }


}

export default new UserController();
