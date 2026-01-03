import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import {
    findUserByEmail,
    createUser,
    findUserById,
} from "../repositories/auth.repository.js";

// ======================================================
// REGISTER
// ======================================================
export const registerService = async (data) => {
    const { nama, email, password, no_hp, alamat } = data;

    // cek email
    const exist = await findUserByEmail(email);
    if (exist) {
        throw new Error("Email sudah digunakan");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user
    const user = await createUser({
        nama,
        email,
        password: hashedPassword,
        no_hp,
        alamat,
        role: "CUSTOMER",
    });

    // hapus password dari response
    const { password: _, ...safeUser } = user;

    return safeUser;
};

// ======================================================
// LOGIN
// ======================================================
export const loginService = async ({ email, password }) => {
    const user = await findUserByEmail(email);

    // Pesan error GENERIC
    const errorMessage = "Email atau password salah";

    if (!user) {
        throw new Error(errorMessage);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error(errorMessage);
    }

    const token = signToken({
        id: user.id_user,
        role: user.role,
    });

    const { password: _, ...safeUser } = user;

    return {
        user: safeUser,
        token,
    };
};


// ======================================================
// ME (PROFILE)
// ======================================================
export const meService = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new Error("User tidak ditemukan");
    }

    return user;
};

// ======================================================
// LOGOUT
// ======================================================
export const logoutService = async () => {
    return {
        message: "Logout berhasil",
    };
};
