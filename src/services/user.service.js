// src/services/user.service.js
import userRepo from "../repositories/user.repository.js";

class UserService {

    async getAllUsers() {
        return userRepo.findAll();
    }

    async getUserDetail(id_user) {
        const user = await userRepo.findById(id_user);
        if (!user) throw new Error("User tidak ditemukan");
        return user;
    }

    async updateUser(id_user, data) {
        const { password, email, ...allowedData } = data;

        // Hapus field undefined
        const cleanData = Object.fromEntries(
            Object.entries(allowedData).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(cleanData).length === 0) {
            throw new Error("Tidak ada data yang bisa diupdate");
        }

        return userRepo.update(id_user, cleanData);
    }

}

export default new UserService();
