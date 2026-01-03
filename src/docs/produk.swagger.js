/**
 * @swagger
 * tags:
 *   name: Produk
 *   description: Manajemen data produk konveksi
 *
 * components:
 *   schemas:
 *     Produk:
 *       type: object
 *       properties:
 *         id_produk:
 *           type: integer
 *         nama_produk:
 *           type: string
 *         deskripsi:
 *           type: string
 *         harga:
 *           type: integer
 *         estimasi_pengerjaan:
 *           type: integer
 *         bahan:
 *           type: string
 *         foto:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 * /api/produk:
 *   get:
 *     summary: Ambil semua produk (pagination & search)
 *     tags: [Produk]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian
 *     responses:
 *       200:
 *         description: Data produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produk'
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Gagal mengambil data produk
 *
 *   post:
 *     summary: Tambah produk baru (Admin)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nama_produk
 *               - deskripsi
 *               - harga
 *               - estimasi_pengerjaan
 *               - bahan
 *             properties:
 *               nama_produk:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: integer
 *               estimasi_pengerjaan:
 *                 type: integer
 *               bahan:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Akses admin saja
 *       500:
 *         description: Gagal membuat produk
 *
 * /api/produk/{id}:
 *   get:
 *     summary: Ambil detail produk
 *     tags: [Produk]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail produk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Produk'
 *       404:
 *         description: Produk tidak ditemukan
 *
 *   put:
 *     summary: Update produk (Admin)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_produk:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: integer
 *               estimasi_pengerjaan:
 *                 type: integer
 *               bahan:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Akses admin saja
 *       404:
 *         description: Produk tidak ditemukan
 *
 *   delete:
 *     summary: Hapus produk (Admin)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Akses admin saja
 *       404:
 *         description: Produk tidak ditemukan
 */
