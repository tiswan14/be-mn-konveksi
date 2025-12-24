# 🧵 MN-Konveksi Backend API

Backend REST API untuk sistem **MN-Konveksi**, sebuah platform pemesanan produk konveksi berbasis web yang mendukung autentikasi pengguna, manajemen produk, sistem pesanan, serta pembayaran otomatis menggunakan **Midtrans**.

🌐 **Production URL**  
https://be-mn-konveksi.vercel.app/

---

## 🚀 Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Login & register menggunakan **JWT (JSON Web Token)**
- Role-based access control (Admin & Customer)
- Proteksi endpoint sensitif menggunakan middleware

### 📦 Manajemen Produk
- CRUD produk konveksi
- Upload dan manajemen gambar menggunakan **Vercel Blob**
- Akses khusus admin

### 🛒 Sistem Pesanan
- Pelanggan dapat membuat dan melihat pesanan pribadi
- Admin dapat mengelola status pesanan
- Alur pesanan terstruktur dari awal hingga selesai

### 💳 Pembayaran Otomatis
- Integrasi **Midtrans Snap API**
- Mendukung:
  - Pembayaran **Down Payment (DP)**
  - Pembayaran **Pelunasan**
- Webhook untuk sinkronisasi status transaksi secara real-time

### 🛡️ Keamanan API
- Helmet untuk HTTP security headers
- Rate Limiting untuk mencegah brute force
- Kebijakan CORS terkontrol

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi |
|--------|----------|
| Runtime | Node.js |
| Framework | Express.js v5.1.0 |
| Database | PostgreSQL |
| ORM | Prisma ORM v5.15.0 |
| Storage | @vercel/blob |
| Payment Gateway | Midtrans Snap API |
| Auth | JWT |
| Deployment | Vercel |

---

## 📂 Struktur Proyek

```
src/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

---

## ⚙️ Instalasi Lokal

### Clone Repository
```bash
git clone https://github.com/tiswan14/be-mn-konveksi.git
cd be-mn-konveksi
```

### Install Dependency
```bash
npm install
```

### Konfigurasi Environment (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mn_konveksi"
JWT_SECRET="your_jwt_secret"
MIDTRANS_SERVER_KEY="your_midtrans_server_key"
MIDTRANS_CLIENT_KEY="your_midtrans_client_key"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

### Migrasi Database
```bash
npx prisma migrate dev
npx prisma generate
```

### Jalankan Server
```bash
npm run dev
```

---

## 🔌 API Endpoint Ringkasan

### Authentication
| Method | Endpoint | Akses |
|------|--------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |

### Produk
| Method | Endpoint | Akses |
|------|--------|------|
| POST | /api/produk | Admin |
| GET | /api/produk | Public |

### Pesanan
| Method | Endpoint | Akses |
|------|--------|------|
| GET | /api/pesanan/me | Customer |

### Transaksi
| Method | Endpoint | Akses |
|------|--------|------|
| POST | /api/transaksi/create | Customer |
| POST | /api/transaksi/webhook | Midtrans |

---

## 👨‍💻 Author
**Tiswan**  
GitHub: https://github.com/tiswan14

---

## 📄 License
Academic & portfolio purpose only.
