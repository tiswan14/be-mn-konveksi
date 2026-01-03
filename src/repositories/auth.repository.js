import prisma from "../prisma/client.js";

// ==============================
// FIND USER BY EMAIL
// ==============================
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

// ==============================
// CREATE USER
// ==============================
export const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

// ==============================
// FIND USER BY ID (ME)
// ==============================
export const findUserById = async (id_user) => {
  return prisma.user.findUnique({
    where: { id_user },
    select: {
      id_user: true,
      nama: true,
      email: true,
      role: true,
      no_hp: true,
      alamat: true,
      created_at: true,
    },
  });
};
