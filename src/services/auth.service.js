import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import { signToken } from "../utils/jwt.js";

// ======================================================
// REGISTER
// ======================================================
export const registerService = async (data) => {
    const { nama, email, password, no_hp, alamat } = data;

    // Cek email sudah dipakai atau belum
    const exist = await prisma.user.findUnique({
        where: { email },
    });
    if (exist) {
        throw new Error("Email sudah digunakan");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Simpan user
    const user = await prisma.user.create({
        data: {
            nama,
            email,
            password: hashed,
            no_hp,
            alamat,
            role: "CUSTOMER",
        },
    });

    return user;
};

// ======================================================
// LOGIN
// ======================================================
export const loginService = async ({ email, password }) => {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("Akun tidak ditemukan");

    // Cocokkan password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Password salah");

    // Generate token
    const token = signToken({
        id: user.id_user,
        role: user.role,
    });

    return { user, token };
};

// ======================================================
// ME (PROFILE)
// ======================================================
export const meService = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id_user: userId },
        select: {
            id_user: true,
            nama: true,
            email: true,
            role: true,
            no_hp: true,
            alamat: true,
        },
    });

    return user;
};

// ======================================================
// LOGOUT
// ======================================================
export const logoutService = async () => {
    // Tidak perlu logic khusus karena JWT stateless
    return {
        message: "Logout berhasil",
    };
};
