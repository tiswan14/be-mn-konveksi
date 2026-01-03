# 🔐 Auth API Documentation

MN-Konveksi Backend

Dokumentasi endpoint autentikasi untuk registrasi, login, mengambil profil user, dan logout.

---

## 🌐 Base URL

http://localhost:5000/api/auth

yaml
Copy code

---

## 🔑 Authentication

-   Menggunakan **JWT (JSON Web Token)**
-   Token dikirim melalui header:

Authorization: Bearer <token>

yaml
Copy code

-   Endpoint yang membutuhkan token:
    -   `GET /me`
    -   `POST /logout`

---

## 📌 1. Register User

### Endpoint

POST /register

shell
Copy code

### Access

Public

### Headers

Content-Type: application/json

bash
Copy code

### Request Body

```json
{
  "nama": "Tiswan",
  "email": "tiswan@example.com",
  "password": "123456",
  "no_hp": "081234567890",
  "alamat": "Tasikmalaya"
}
Validation Rules
Field	Rule
nama	Wajib, minimal 3 karakter
email	Wajib, format email valid
password	Wajib, minimal 6 karakter
no_hp	Wajib, angka, 10–15 digit
alamat	Opsional

Success Response (201)
json
Copy code
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid",
    "nama": "Tiswan",
    "email": "tiswan@example.com",
    "role": "CUSTOMER",
    "created_at": "2026-01-03T10:00:00.000Z"
  }
}
Error Response (400)
json
Copy code
{
  "success": false,
  "message": "Email sudah digunakan"
}
📌 2. Login
Endpoint
bash
Copy code
POST /login
Access
Public

Headers
pgsql
Copy code
Content-Type: application/json
Request Body
json
Copy code
{
  "email": "tiswan@example.com",
  "password": "123456"
}
Success Response (200)
json
Copy code
{
  "success": true,
  "message": "Login berhasil",
  "token": "JWT_TOKEN_HERE",
  "data": {
    "id": "uuid",
    "nama": "Tiswan",
    "email": "tiswan@example.com",
    "role": "CUSTOMER"
  }
}
Error Response (401)
json
Copy code
{
  "success": false,
  "message": "Email atau password salah"
}
Catatan: Pesan error dibuat generic demi keamanan.

📌 3. Get Profile (Me)
Endpoint
vbnet
Copy code
GET /me
Access
Protected (JWT)

Headers
makefile
Copy code
Authorization: Bearer <token>
Success Response (200)
json
Copy code
{
  "success": true,
  "data": {
    "id_user": "uuid",
    "nama": "Tiswan",
    "email": "tiswan@example.com",
    "role": "CUSTOMER",
    "no_hp": "081234567890",
    "alamat": "Tasikmalaya",
    "created_at": "2026-01-03T10:00:00.000Z"
  }
}
Error Response (404)
json
Copy code
{
  "success": false,
  "message": "User tidak ditemukan"
}
📌 4. Logout
Endpoint
bash
Copy code
POST /logout
Access
Protected (JWT)

Headers
makefile
Copy code
Authorization: Bearer <token>
Success Response (200)
json
Copy code
{
  "success": true,
  "message": "Logout berhasil"
}
```
