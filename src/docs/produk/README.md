# 📦 Produk API Documentation

MN-Konveksi Backend

Dokumentasi endpoint manajemen produk, termasuk upload foto, pagination, dan role-based access.

---

## 🌐 Base URL

http://localhost:5000/api/produk

yaml
Copy code

---

## 🔑 Authentication & Authorization

-   Menggunakan **JWT (Bearer Token)**
-   Header:
    Authorization: Bearer <token>

yaml
Copy code

### Role Access

| Endpoint    | Akses  |
| ----------- | ------ |
| POST /      | ADMIN  |
| PUT /:id    | ADMIN  |
| DELETE /:id | ADMIN  |
| GET /       | Public |
| GET /:id    | Public |

---

## 🖼️ Upload Foto Produk

-   Field file: `foto`
-   Maksimal ukuran: **5 MB**
-   Tipe: image (jpg, jpeg, png, webp)
-   Upload menggunakan **multipart/form-data**
-   File disimpan di **Vercel Blob Storage**

---

## 📌 1. Create Produk

### Endpoint

POST /

shell
Copy code

### Access

Protected (ADMIN)

### Headers

Authorization: Bearer <token>
Content-Type: multipart/form-data

csharp
Copy code

### Form Data

| Field               | Type   | Required |
| ------------------- | ------ | -------- |
| nama_produk         | string | ✅       |
| deskripsi           | string | ✅       |
| harga               | number | ✅       |
| estimasi_pengerjaan | number | ✅       |
| bahan               | string | ✅       |
| foto                | file   | ❌       |

### Success Response (201)

```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id_produk": "uuid",
    "nama_produk": "Kaos Custom",
    "deskripsi": "Kaos cotton combed 30s",
    "harga": 75000,
    "estimasi_pengerjaan": 3,
    "bahan": "Cotton Combed",
    "foto": "https://blob.vercel.com/produk/xxxx.jpg",
    "created_at": "2026-01-03T10:00:00.000Z"
  }
}
Error Response (500)
json
Copy code
{
  "success": false,
  "message": "Gagal membuat produk"
}
📌 2. Get All Produk (Pagination + Search)
Endpoint
sql
Copy code
GET /
Access
Public

Query Params
Param	Type	Default	Keterangan
page	number	1	Halaman
limit	number	10	Data per halaman
q	string	-	Pencarian nama produk

Example
pgsql
Copy code
GET /?page=1&limit=10&q=kaos
Success Response (200)
json
Copy code
{
  "success": true,
  "message": "Data produk berhasil diambil",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_data": 25,
    "total_page": 3
  }
}
📌 3. Get Produk By ID
Endpoint
bash
Copy code
GET /:id
Access
Public

Success Response (200)
json
Copy code
{
  "success": true,
  "data": {
    "id_produk": "uuid",
    "nama_produk": "Kaos Custom",
    "deskripsi": "Kaos cotton combed 30s",
    "harga": 75000,
    "estimasi_pengerjaan": 3,
    "bahan": "Cotton Combed",
    "foto": "https://blob.vercel.com/produk/xxxx.jpg"
  }
}
Error Response (404)
json
Copy code
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
📌 4. Update Produk
Endpoint
bash
Copy code
PUT /:id
Access
Protected (ADMIN)

Headers
makefile
Copy code
Authorization: Bearer <token>
Content-Type: multipart/form-data
Form Data
(Sama dengan create, semua opsional)

Success Response (200)
json
Copy code
{
  "success": true,
  "message": "Produk berhasil diperbarui",
  "data": {
    "id_produk": "uuid",
    "nama_produk": "Kaos Custom Update",
    "harga": 80000,
    "foto": "https://blob.vercel.com/produk/new.jpg"
  }
}
Error Response (404)
json
Copy code
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
📌 5. Delete Produk
Endpoint
bash
Copy code
DELETE /:id
Access
Protected (ADMIN)

Success Response (200)
json
Copy code
{
  "success": true,
  "message": "Produk berhasil dihapus"
}
Error Response (404)
json
Copy code
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
```
