# 🧾 Pesanan API Documentation

MN-Konveksi Backend

Dokumentasi endpoint pemesanan produk oleh customer, detail pesanan, update status oleh admin, serta summary dashboard.

---

## 🌐 Base URL

http://localhost:5000/api/pesanan

yaml
Copy code

---

## 🔑 Authentication & Authorization

Menggunakan **JWT (Bearer Token)**

Authorization: Bearer <token>

yaml
Copy code

### Role Access

| Endpoint           | Customer | Admin |
| ------------------ | -------- | ----- |
| POST /             | ✅       | ❌    |
| GET /me            | ✅       | ❌    |
| GET /me/summary    | ✅       | ❌    |
| GET /:id           | ✅       | ✅    |
| PATCH /:id/status  | ❌       | ✅    |
| GET /admin/summary | ❌       | ✅    |

---

## 📌 1. Create Pesanan

### Endpoint

POST /

shell
Copy code

### Access

Protected (CUSTOMER)

> ❌ Admin **tidak diperbolehkan** membuat pesanan

### Headers

Authorization: Bearer <token>
Content-Type: application/json

bash
Copy code

### Request Body

```json
{
  "id_produk": 1,
  "qty": 10,
  "harga_satuan": 75000
}
Business Rules
qty harus > 0

Produk harus tersedia

total_harga = qty × harga_satuan

dp_wajib = 50% dari total_harga

Success Response (201)
json
Copy code
{
  "success": true,
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id_pesanan": 1,
    "id_user": "uuid",
    "id_produk": 1,
    "qty": 10,
    "harga_satuan": 75000,
    "total_harga": 750000,
    "dp_wajib": 375000,
    "status_pesanan": "MENUNGGU_DP"
  }
}
Error Responses
403 (Admin)

json
Copy code
{
  "success": false,
  "message": "Admin tidak diperbolehkan membuat pesanan"
}
404 (Produk tidak ditemukan)

json
Copy code
{
  "success": false,
  "message": "Produk tidak ditemukan"
}
📌 2. Get Pesanan User
Endpoint
vbnet
Copy code
GET /me
Access
Protected (CUSTOMER)

Success Response (200)
json
Copy code
{
  "success": true,
  "data": [
    {
      "id_pesanan": 1,
      "nama_produk": "Kaos Custom",
      "qty": 10,
      "total_harga": 750000,
      "status_pesanan": "MENUNGGU_DP"
    }
  ]
}
📌 3. Get Detail Pesanan
Endpoint
bash
Copy code
GET /:id
Access
Protected (CUSTOMER / ADMIN)

Success Response (200)
json
Copy code
{
  "success": true,
  "data": {
    "id_pesanan": 1,
    "qty": 10,
    "harga_satuan": 75000,
    "total_harga": 750000,
    "dp_wajib": 375000,
    "status_pesanan": "MENUNGGU_DP",
    "produk": {
      "nama_produk": "Kaos Custom"
    }
  }
}
Error Response (404)
json
Copy code
{
  "success": false,
  "message": "Pesanan tidak ditemukan"
}
📌 4. Update Status Pesanan
Endpoint
ruby
Copy code
PATCH /:id/status
Access
Protected (ADMIN)

Headers
pgsql
Copy code
Authorization: Bearer <token>
Content-Type: application/json
Request Body
json
Copy code
{
  "status_pesanan": "DIPROSES"
}
Status yang Digunakan
MENUNGGU_DP

DIPROSES

MENUNGGU_PELUNASAN

SELESAI

Success Response (200)
json
Copy code
{
  "success": true,
  "message": "Status pesanan diperbarui",
  "data": {
    "id_pesanan": 1,
    "status_pesanan": "DIPROSES"
  }
}
📌 5. Dashboard Summary Customer
Endpoint
vbnet
Copy code
GET /me/summary
Access
Protected (CUSTOMER)

Success Response (200)
json
Copy code
{
  "success": true,
  "data": {
    "total_pesanan": 5,
    "menunggu_dp": 2,
    "diproses": 1,
    "menunggu_pelunasan": 1,
    "selesai": 1
  }
}
📌 6. Dashboard Summary Admin
Endpoint
pgsql
Copy code
GET /admin/summary
Access
Protected (ADMIN)

Success Response (200)
json
Copy code
{
  "success": true,
  "data": {
    "total_pesanan": 25,
    "menunggu_dp": 5,
    "diproses": 8,
    "menunggu_pelunasan": 4,
    "selesai": 8,
    "total_pendapatan": 125000000
  }
}
```
