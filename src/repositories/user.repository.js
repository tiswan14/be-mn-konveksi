// src/repositories/user.repository.js
import prisma from "../prisma/client.js";

class UserRepository {

    async findAll() {
        return prisma.user.findMany({
            select: {
                id_user: true,
                nama: true,
                email: true,
                no_hp: true,
                alamat: true,
                role: true,
                created_at: true,
            },
            orderBy: { created_at: "desc" },
        });
    }

    async findById(id_user) {
        return prisma.user.findUnique({
            where: { id_user },
            select: {
                id_user: true,
                nama: true,
                email: true,
                no_hp: true,
                alamat: true,
                role: true,
                created_at: true,
                pesanan: true,
            },
        });
    }

    async update(id_user, data) {
        return prisma.user.update({
            where: { id_user },
            data,
            select: {
                id_user: true,
                nama: true,
                email: true,
                no_hp: true,
                alamat: true,
                role: true,
                updated_at: true,
            },
        });
    }
}

export default new UserRepository();
