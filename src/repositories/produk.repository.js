import prisma from "../prisma/client.js";

export const produkRepository = {
    // ==============================
    // CREATE
    // ==============================
    create: (data) =>
        prisma.produk.create({ data }),

    // ==============================
    // FIND ALL (PAGINATION + SEARCH)
    // ==============================
    findAll: ({ skip, take, q }) =>
        prisma.produk.findMany({
            where: q
                ? {
                    OR: [
                        {
                            nama_produk: {
                                contains: q,
                                mode: "insensitive",
                            },
                        },
                        {
                            deskripsi: {
                                contains: q,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : undefined,
            orderBy: { created_at: "desc" },
            skip,
            take,
        }),

    // ==============================
    // COUNT (UNTUK PAGINATION)
    // ==============================
    count: (q) =>
        prisma.produk.count({
            where: q
                ? {
                    OR: [
                        {
                            nama_produk: {
                                contains: q,
                                mode: "insensitive",
                            },
                        },
                        {
                            deskripsi: {
                                contains: q,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : undefined,
        }),

    // ==============================
    // FIND BY ID
    // ==============================
    findById: (id) =>
        prisma.produk.findUnique({
            where: { id_produk: Number(id) },
        }),

    // ==============================
    // UPDATE
    // ==============================
    update: (id, data) => {
        const id_produk = Number(id);
        if (isNaN(id_produk)) {
            throw new Error("ID produk tidak valid");
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Data update kosong");
        }

        return prisma.produk.update({
            where: { id_produk },
            data,
        });
    },


    // ==============================
    // FIND BY NAMA (UNTUK VALIDATOR UNIQUE)
    // ==============================
    findByNama: (nama_produk) =>
        prisma.produk.findFirst({
            where: {
                nama_produk: {
                    equals: nama_produk,
                    mode: "insensitive",
                },
            },
        }),


    // ==============================
    // DELETE
    // ==============================
    delete: (id) =>
        prisma.produk.delete({
            where: { id_produk: Number(id) },
        }),
};
