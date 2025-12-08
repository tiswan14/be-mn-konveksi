import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";
import { signToken } from "../utils/jwt.js";

export const registerService = async (data) => {
    const { nama, username, password, no_hp, alamat } = data;

    const exist = await prisma.user.findUnique({
        where: { username },
    });
    if (exist) {
        throw new Error("Username sudah dipakai");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            nama,
            username,
            password: hashed,
            no_hp,
            alamat,
            role: "CUSTOMER",
        },
    });

    return user;
};

export const loginService = async ({ username, password }) => {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) throw new Error("Akun tidak ditemukan");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Password salah");

    const token = signToken({
        id: user.id_user,
        role: user.role,
    });

    return { user, token };
};

export const meService = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id_user: userId },
        select: {
            id_user: true,
            nama: true,
            username: true,
            role: true,
            no_hp: true,
            alamat: true,
        },
    });

    return user;
};
