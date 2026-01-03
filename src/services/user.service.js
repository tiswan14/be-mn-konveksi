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
        // Proteksi field sensitif
        delete data.password;
        delete data.email;

        return userRepo.update(id_user, data);
    }
}

export default new UserService();
