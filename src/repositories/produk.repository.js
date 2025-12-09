import { prisma } from '../prisma/client.js';

export const produkRepository = {
    create: (data) => prisma.produk.create({ data }),

    findAll: () => prisma.produk.findMany({
        orderBy: { created_at: "desc" }
    }),

    findById: (id) => prisma.produk.findUnique({
        where: { id_produk: Number(id) }
    }),

    update: (id, data) =>
        prisma.produk.update({
            where: { id_produk: Number(id) },
            data
        }),

    delete: (id) =>
        prisma.produk.delete({
            where: { id_produk: Number(id) }
        }),
};
