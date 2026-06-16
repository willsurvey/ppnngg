# Implementation Plan — Aplikasi Direktori Cafe Ponorogo
**Proyek Akhir D3 PJJ Teknik Informatika — PENS**
**Mahasiswa:** Wildan Khoiru Rijal Nur Wahid | NRP: 3124510106

---

## ⚠️ Catatan Kritis (Baca Dulu Sebelum Mulai)

> PPT asli menyebut Flutter untuk UI Web + Android, namun **Flutter Web memiliki kelemahan nyata**: SEO buruk, load time lambat, aksesibilitas rendah, dan tidak ideal untuk direktori publik yang perlu diindeks mesin pencari. **Keputusan yang tepat adalah mengganti Flutter Web dengan React (Next.js)**. Flutter tetap dipakai hanya untuk Android.
>
> Backend di PPT menggunakan Node.js + MySQL. Ini **valid dan tidak perlu diubah**.
>
> Arsitektur seluruh sistem menggunakan **MVVM (Model–View–ViewModel)**.

---

## 1. Tech Stack Final (Kritis & Realistis)

| Layer | Teknologi | Alasan |
|---|---|---|
| **Web Frontend** | Next.js 14 (App Router) + TailwindCSS | SSR/SSG untuk SEO direktori, routing mudah, ekosistem React |
| **Android App** | Flutter 3.x (Dart) | Performa native, UI konsisten, sesuai proposal asli |
| **Backend API** | Node.js + Express.js | RESTful API, ringan, cepat untuk CRUD + filter |
| **Database** | MySQL 8 | Relasional, mendukung query filter kompleks |
| **ORM** | Sequelize (Node.js) | Migrasi & query lebih aman |
| **Auth** | JWT (JSON Web Token) | Stateless, cocok untuk admin login |
| **File Storage** | Multer + Local Storage / Cloudinary | Upload foto cafe |
| **Maps** | Google Maps Embed API + Maps JavaScript API | Integrasi peta sesuai proposal |
| **State Management Web** | Zustand | Ringan, tidak boilerplate seperti Redux |
| **State Management Android** | Riverpod / Provider | Standard Flutter state management |
| **HTTP Client Android** | Dio | Lebih powerful dari http package |
| **Containerisasi** | Docker + Docker Compose | Konsistensi dev & deployment |

---

## 2. Arsitektur Sistem — MVVM

### Penerapan MVVM per Platform

#### Web (Next.js)
```
View        → React Components / Pages (app/*)
ViewModel   → Custom Hooks (useViewModel) + Zustand Store
Model       → API Service Layer (lib/api/*.ts) + TypeScript interfaces
```

#### Android (Flutter)
```
View        → Widget (screens/*, widgets/*)
ViewModel   → ChangeNotifier / StateNotifier (viewmodels/*)
Model       → Repository + Data Models (models/*, repositories/*)
```

#### Backend (Node.js)
```
Model       → Sequelize Models (models/*)
Controller  → Express Controllers (controllers/*) ← setara ViewModel di backend
Service     → Business Logic (services/*)
Route       → Express Routes (routes/*)
```

### Diagram Arsitektur High-Level

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │   Web (Next.js)     │  │   Android (Flutter)      │  │
│  │  View → ViewModel   │  │  Widget → ViewModel      │  │
│  │  → API Service      │  │  → Repository → Dio      │  │
│  └──────────┬──────────┘  └────────────┬─────────────┘  │
└─────────────┼───────────────────────────┼────────────────┘
              │ HTTPS REST API            │
┌─────────────▼───────────────────────────▼────────────────┐
│                BACKEND LAYER (Node.js + Express)          │
│   Routes → Controllers → Services → Sequelize Models      │
└──────────────────────────────┬───────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────┐
│              DATA LAYER                                   │
│   MySQL 8 Database    │   Local File Storage / Cloudinary │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Struktur Database (ERD — Tabel & Relasi)

### Tabel Utama

```sql
-- Tabel Admin
tbl_admin
  id INT PK AUTO_INCREMENT
  username VARCHAR(50) UNIQUE
  password VARCHAR(255)  -- bcrypt hash
  created_at TIMESTAMP

-- Tabel Cafe (inti)
tbl_cafe
  id INT PK AUTO_INCREMENT
  nama VARCHAR(150)
  slug VARCHAR(160) UNIQUE  -- untuk SEO URL
  alamat TEXT
  kecamatan ENUM('Ponorogo','Babadan','Jenangan','Mlarak',...) -- 21 kecamatan Ponorogo
  latitude DECIMAL(10,8)
  longitude DECIMAL(11,8)
  harga_min INT  -- harga minimum menu dalam Rupiah
  harga_max INT
  jam_buka TIME
  jam_tutup TIME
  buka_24jam BOOLEAN DEFAULT FALSE
  sesi_buka ENUM('pagi','siang','sore','malam','24jam')
  suasana VARCHAR(100)  -- aesthetic, study, outdoor, dll
  instagram VARCHAR(100)
  google_maps_url TEXT
  completeness_pct TINYINT DEFAULT 0  -- 0-100 indikator kelengkapan
  is_active BOOLEAN DEFAULT TRUE
  created_at TIMESTAMP
  updated_at TIMESTAMP

-- Tabel Fasilitas Cafe (11 fasilitas)
tbl_fasilitas
  id INT PK AUTO_INCREMENT
  cafe_id INT FK → tbl_cafe.id
  ac BOOLEAN DEFAULT FALSE
  wifi BOOLEAN DEFAULT FALSE
  toilet BOOLEAN DEFAULT FALSE
  mushola BOOLEAN DEFAULT FALSE
  ruang_rapat BOOLEAN DEFAULT FALSE
  parkir BOOLEAN DEFAULT FALSE
  colokan BOOLEAN DEFAULT FALSE

-- Tabel Foto Cafe
tbl_foto_cafe
  id INT PK AUTO_INCREMENT
  cafe_id INT FK → tbl_cafe.id
  url_foto VARCHAR(500)
  urutan TINYINT  -- urutan tampil di carousel
  caption VARCHAR(200)
  created_at TIMESTAMP

-- Tabel Kategori Suasana (opsional, bisa string saja)
tbl_suasana
  id INT PK AUTO_INCREMENT
  nama VARCHAR(80)
  slug VARCHAR(80) UNIQUE
```

### Relasi
- `tbl_cafe` 1:1 → `tbl_fasilitas`
- `tbl_cafe` 1:N → `tbl_foto_cafe`
- `tbl_cafe` N:1 → `tbl_suasana` (opsional, bisa enum)

---

## 4. API Endpoints (Minimum 15 Endpoint)

**Base URL:** `https://api.ponorogocafe.id/v1`

**Auth Header (admin only):** `Authorization: Bearer <JWT_TOKEN>`

---

### 🔐 Auth Endpoints

#### POST `/auth/login`
Admin login untuk mendapatkan JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "rahasia123"
}
```
**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```
**Error:** 401 jika kredensial salah.

---

#### POST `/auth/logout`
Invalidate token (blacklist via Redis atau hapus dari client).

**Header:** `Authorization: Bearer <token>`
**Response 200:** `{ "message": "Logout berhasil" }`

---

### ☕ Cafe Endpoints (Public)

#### GET `/cafes`
Ambil semua cafe dengan filter & pagination.

**Query Params:**
| Param | Type | Contoh |
|---|---|---|
| `kecamatan` | string | `Ponorogo` |
| `harga_max` | int | `30000` |
| `ac` | boolean | `true` |
| `wifi` | boolean | `true` |
| `mushola` | boolean | `true` |
| `toilet` | boolean | `true` |
| `parkir` | boolean | `true` |
| `ruang_rapat` | boolean | `true` |
| `colokan` | boolean | `true` |
| `sesi_buka` | string | `sore` |
| `suasana` | string | `study` |
| `page` | int | `1` |
| `limit` | int | `10` |

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Kopi Nusantara",
      "slug": "kopi-nusantara",
      "alamat": "Jl. Diponegoro No. 12",
      "kecamatan": "Ponorogo",
      "harga_min": 8000,
      "harga_max": 30000,
      "sesi_buka": "pagi",
      "suasana": "aesthetic",
      "thumbnail": "https://...",
      "fasilitas": { "ac": true, "wifi": true, "parkir": false },
      "completeness_pct": 85
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "total_pages": 5
  }
}
```

---

#### GET `/cafes/:slug`
Detail lengkap satu cafe berdasarkan slug (SEO-friendly).

**Response 200:**
```json
{
  "id": 1,
  "nama": "Kopi Nusantara",
  "slug": "kopi-nusantara",
  "alamat": "Jl. Diponegoro No. 12, Ponorogo",
  "kecamatan": "Ponorogo",
  "latitude": -7.865913,
  "longitude": 111.464715,
  "harga_min": 8000,
  "harga_max": 30000,
  "jam_buka": "07:00",
  "jam_tutup": "22:00",
  "buka_24jam": false,
  "sesi_buka": "pagi",
  "suasana": "aesthetic",
  "instagram": "kopinusantara_pnrg",
  "google_maps_url": "https://maps.google.com/?q=...",
  "fasilitas": {
    "ac": true, "wifi": true, "toilet": true,
    "mushola": false, "ruang_rapat": false,
    "parkir": true, "colokan": true
  },
  "fotos": [
    { "id": 1, "url_foto": "https://...", "urutan": 1, "caption": "Area dalam" },
    { "id": 2, "url_foto": "https://...", "urutan": 2, "caption": "Menu andalan" }
  ],
  "completeness_pct": 85
}
```

---

#### GET `/cafes/search`
Pencarian cafe berdasarkan nama atau alamat (full-text search ringan).

**Query Params:** `?q=kopi&limit=5`

**Response 200:**
```json
{
  "data": [
    { "id": 1, "nama": "Kopi Nusantara", "slug": "kopi-nusantara", "kecamatan": "Ponorogo" }
  ]
}
```

---

#### GET `/cafes/nearby`
Cafe terdekat berdasarkan koordinat pengguna (menggunakan Haversine formula di query MySQL).

**Query Params:** `?lat=-7.866&lng=111.464&radius=3`  (radius dalam km)

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Kopi Nusantara",
      "jarak_km": 0.45,
      "latitude": -7.865913,
      "longitude": 111.464715
    }
  ]
}
```

---

### ☕ Cafe Endpoints (Admin — Protected)

#### POST `/admin/cafes`
Tambah cafe baru.

**Header:** `Authorization: Bearer <token>`
**Request Body:**
```json
{
  "nama": "Rumah Kopi Ponorogo",
  "alamat": "Jl. Batoro Katong No. 5",
  "kecamatan": "Ponorogo",
  "latitude": -7.866,
  "longitude": 111.464,
  "harga_min": 10000,
  "harga_max": 35000,
  "jam_buka": "08:00",
  "jam_tutup": "23:00",
  "buka_24jam": false,
  "sesi_buka": "siang",
  "suasana": "study",
  "instagram": "rumahkopi_pnrg"
}
```
**Response 201:** Data cafe yang baru dibuat.

---

#### PUT `/admin/cafes/:id`
Update data cafe.

**Header:** `Authorization: Bearer <token>`
**Request Body:** Field yang ingin diupdate (partial update).
**Response 200:** Data cafe setelah diupdate.

---

#### DELETE `/admin/cafes/:id`
Hapus cafe (soft delete: set `is_active = false`).

**Header:** `Authorization: Bearer <token>`
**Response 200:** `{ "message": "Cafe berhasil dihapus" }`

---

### 🏗️ Fasilitas Endpoints (Admin — Protected)

#### PUT `/admin/cafes/:id/fasilitas`
Update fasilitas cafe (semua 7 fasilitas sekaligus, atau partial).

**Header:** `Authorization: Bearer <token>`
**Request Body:**
```json
{
  "ac": true,
  "wifi": true,
  "toilet": true,
  "mushola": false,
  "ruang_rapat": true,
  "parkir": true,
  "colokan": true
}
```
**Response 200:** Data fasilitas yang telah diupdate.

---

### 📸 Foto Endpoints (Admin — Protected)

#### POST `/admin/cafes/:id/fotos`
Upload foto cafe (multipart/form-data).

**Header:** `Authorization: Bearer <token>`
**Request:** `multipart/form-data` — field: `foto` (file image), `caption` (string), `urutan` (int)
**Validasi:** Maks 5MB per foto, format jpg/png/webp.
**Response 201:**
```json
{
  "id": 10,
  "url_foto": "https://storage.ponorogocafe.id/fotos/cafe-1-2025.jpg",
  "urutan": 1,
  "caption": "Suasana malam"
}
```

---

#### DELETE `/admin/fotos/:foto_id`
Hapus satu foto cafe.

**Header:** `Authorization: Bearer <token>`
**Response 200:** `{ "message": "Foto berhasil dihapus" }`

---

#### PUT `/admin/cafes/:id/fotos/reorder`
Atur ulang urutan foto carousel.

**Header:** `Authorization: Bearer <token>`
**Request Body:**
```json
{
  "urutan": [3, 1, 5, 2, 4]
}
```
(Array berisi ID foto dalam urutan baru)
**Response 200:** `{ "message": "Urutan foto berhasil diperbarui" }`

---

### 📊 Dashboard & Utilitas (Admin — Protected)

#### GET `/admin/dashboard/stats`
Statistik ringkas untuk dashboard admin.

**Header:** `Authorization: Bearer <token>`
**Response 200:**
```json
{
  "total_cafe": 42,
  "cafe_aktif": 40,
  "cafe_tidak_lengkap": 7,
  "cafe_per_kecamatan": [
    { "kecamatan": "Ponorogo", "total": 18 },
    { "kecamatan": "Babadan", "total": 9 }
  ],
  "rata_rata_completeness": 73
}
```

---

#### GET `/cafes/filters/options`
Ambil opsi filter yang tersedia (kecamatan list, suasana list). Digunakan frontend untuk render dropdown filter secara dinamis.

**Response 200:**
```json
{
  "kecamatan": ["Ponorogo", "Babadan", "Jenangan", "Mlarak"],
  "suasana": ["aesthetic", "study", "outdoor", "cozy", "industrial"],
  "sesi_buka": ["pagi", "siang", "sore", "malam", "24jam"]
}
```

---

### Ringkasan Semua Endpoint

| No | Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|---|
| 1 | POST | `/auth/login` | Public | Admin login |
| 2 | POST | `/auth/logout` | Admin | Admin logout |
| 3 | GET | `/cafes` | Public | List cafe + filter + pagination |
| 4 | GET | `/cafes/search` | Public | Pencarian nama/alamat cafe |
| 5 | GET | `/cafes/nearby` | Public | Cafe terdekat (by koordinat) |
| 6 | GET | `/cafes/filters/options` | Public | Opsi dropdown filter |
| 7 | GET | `/cafes/:slug` | Public | Detail cafe by slug |
| 8 | POST | `/admin/cafes` | Admin | Tambah cafe baru |
| 9 | PUT | `/admin/cafes/:id` | Admin | Update data cafe |
| 10 | DELETE | `/admin/cafes/:id` | Admin | Hapus cafe (soft delete) |
| 11 | PUT | `/admin/cafes/:id/fasilitas` | Admin | Update 7 fasilitas cafe |
| 12 | POST | `/admin/cafes/:id/fotos` | Admin | Upload foto cafe |
| 13 | DELETE | `/admin/fotos/:foto_id` | Admin | Hapus foto cafe |
| 14 | PUT | `/admin/cafes/:id/fotos/reorder` | Admin | Atur urutan carousel foto |
| 15 | GET | `/admin/dashboard/stats` | Admin | Statistik dashboard |

> **Total: 15 endpoint** — semuanya realistis, tidak ada yang halu, semua punya use case jelas dari kebutuhan fungsional di PPT.

---

## 5. Struktur Folder Project

### 5.1 Backend (Node.js + Express)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize config
│   │   └── app.js               # Express app setup
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Cafe.js
│   │   ├── Fasilitas.js
│   │   └── FotoCafe.js
│   ├── repositories/            # Query layer (Model)
│   │   ├── cafeRepository.js
│   │   └── fotoRepository.js
│   ├── services/                # Business logic (ViewModel equiv.)
│   │   ├── cafeService.js       # filter, completeness calc, dll
│   │   ├── authService.js
│   │   └── fotoService.js
│   ├── controllers/             # Request handler
│   │   ├── cafeController.js
│   │   ├── authController.js
│   │   └── fotoController.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── cafe.routes.js
│   │   └── admin.routes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verify
│   │   ├── uploadMiddleware.js  # Multer config
│   │   └── errorHandler.js
│   └── utils/
│       ├── haversine.js         # Kalkulasi jarak koordinat
│       └── completeness.js      # Hitung % kelengkapan profil cafe
├── migrations/                  # Sequelize migrations
├── seeders/                     # Data dummy
├── uploads/                     # Foto (atau pakai Cloudinary)
├── .env
├── .env.example
├── package.json
└── Dockerfile
```

### 5.2 Web Frontend (Next.js 14)

```
web/
├── app/                         # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                 # Halaman utama / direktori
│   ├── cafes/
│   │   ├── page.tsx             # List cafe + filter
│   │   └── [slug]/
│   │       └── page.tsx         # Detail cafe (SSG/ISR)
│   └── admin/
│       ├── login/page.tsx
│       ├── dashboard/page.tsx
│       ├── cafes/
│       │   ├── page.tsx         # List cafe admin
│       │   ├── new/page.tsx     # Form tambah cafe
│       │   └── [id]/
│       │       └── edit/page.tsx
│       └── layout.tsx           # Admin layout (protected)
├── components/
│   ├── ui/                      # Reusable UI (button, input, modal)
│   ├── cafe/
│   │   ├── CafeCard.tsx
│   │   ├── CafeDetail.tsx
│   │   ├── CafeFilter.tsx       # Panel filter 11 fasilitas
│   │   ├── CafeCarousel.tsx     # Galeri foto
│   │   └── CafeMap.tsx          # Google Maps embed
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── CafeForm.tsx
│       ├── FotoManager.tsx      # Upload + reorder foto
│       └── FasilitasToggle.tsx
├── lib/
│   ├── api/                     # API service layer (Model)
│   │   ├── cafeApi.ts
│   │   ├── authApi.ts
│   │   └── adminApi.ts
│   └── utils/
│       └── formatRupiah.ts
├── store/                       # Zustand stores (ViewModel)
│   ├── useCafeStore.ts          # State list cafe + filter
│   ├── useAuthStore.ts          # State admin auth
│   └── useAdminStore.ts
├── hooks/                       # Custom hooks (ViewModel bridge)
│   ├── useCafeList.ts
│   ├── useCafeDetail.ts
│   └── useAdminCafe.ts
├── types/
│   └── index.ts                 # TypeScript interfaces
├── public/
├── tailwind.config.ts
├── next.config.ts
└── Dockerfile
```

### 5.3 Android (Flutter)

```
flutter_app/
├── lib/
│   ├── main.dart
│   ├── core/
│   │   ├── config/
│   │   │   └── api_config.dart       # Base URL, timeout
│   │   ├── network/
│   │   │   └── dio_client.dart       # Dio setup + interceptor
│   │   └── utils/
│   │       └── format_rupiah.dart
│   ├── models/                       # Model (MVVM)
│   │   ├── cafe_model.dart
│   │   ├── fasilitas_model.dart
│   │   └── foto_model.dart
│   ├── repositories/                 # Data layer
│   │   ├── cafe_repository.dart
│   │   └── auth_repository.dart
│   ├── viewmodels/                   # ViewModel (MVVM)
│   │   ├── cafe_list_viewmodel.dart
│   │   ├── cafe_detail_viewmodel.dart
│   │   └── filter_viewmodel.dart
│   ├── views/                        # View/Screen (MVVM)
│   │   ├── home/
│   │   │   └── home_screen.dart
│   │   ├── cafe_list/
│   │   │   ├── cafe_list_screen.dart
│   │   │   └── widgets/
│   │   │       ├── cafe_card_widget.dart
│   │   │       └── filter_bottom_sheet.dart
│   │   ├── cafe_detail/
│   │   │   ├── cafe_detail_screen.dart
│   │   │   └── widgets/
│   │   │       ├── foto_carousel_widget.dart
│   │   │       ├── fasilitas_chip_widget.dart
│   │   │       └── maps_button_widget.dart
│   │   └── search/
│   │       └── search_screen.dart
│   └── routes/
│       └── app_router.dart           # GoRouter
├── pubspec.yaml
└── Dockerfile (opsional untuk CI)
```

---

## 6. Fitur & Logika Bisnis Kritis

### 6.1 Completeness Percentage (0-100%)

Hitung otomatis berapa persen profil cafe sudah lengkap. Logika di `utils/completeness.js`:

```javascript
// Bobot tiap field (total = 100)
const weights = {
  nama: 10,
  alamat: 10,
  kecamatan: 5,
  latitude: 10,
  longitude: 10,
  harga_min: 5,
  harga_max: 5,
  jam_buka: 5,
  sesi_buka: 5,
  suasana: 5,
  instagram: 5,
  fasilitas_filled: 10,  // jika tbl_fasilitas sudah ada
  foto_min_1: 10,        // minimal 1 foto
  foto_min_3: 5,         // bonus jika >= 3 foto
};
// Jumlahkan weight dari field yang terisi
```

Trigger: Recalculate setiap kali `PUT /admin/cafes/:id`, `PUT fasilitas`, `POST foto`, `DELETE foto`.

### 6.2 Filter Query (Backend)

Filter di `GET /cafes` diproses di `cafeService.js` — bukan di frontend. Query builder dengan Sequelize `where` clause dinamis:

```javascript
const where = { is_active: true };
if (kecamatan) where.kecamatan = kecamatan;
if (harga_max) where.harga_min = { [Op.lte]: harga_max };
if (sesi_buka) where.sesi_buka = sesi_buka;
if (suasana) where.suasana = { [Op.like]: `%${suasana}%` };

// Join ke tbl_fasilitas jika ada filter fasilitas
const fasilitasWhere = {};
if (ac === 'true') fasilitasWhere.ac = true;
if (wifi === 'true') fasilitasWhere.wifi = true;
// dst...
```

### 6.3 Google Maps Integration

**Web (Next.js):**
- Detail cafe: Google Maps Embed API (iframe) — gratis, tanpa billing
- Tombol "Buka di Maps": link ke `https://maps.google.com/?q={lat},{lng}`
- (Opsional advanced) Maps JavaScript API untuk pin marker

**Android (Flutter):**
- Package `google_maps_flutter` untuk tampilkan peta dengan marker
- Fallback: `url_launcher` untuk buka Google Maps app
- **Perhatian:** Wajib aktifkan billing di Google Cloud Console, meski ada free tier

### 6.4 Foto Carousel

**Web:** Gunakan library `Embla Carousel` atau `Swiper.js` (ringan).
**Android:** `PageView` widget Flutter dengan dot indicator.

Urutan foto diambil dari field `urutan` di `tbl_foto_cafe`, disorting ASC.

### 6.5 Admin Auth Flow

```
Login → POST /auth/login → dapat JWT token
→ Simpan di:
   - Web: httpOnly cookie (lebih aman) ATAU localStorage
   - Android: FlutterSecureStorage
→ Setiap request admin: kirim header Authorization: Bearer <token>
→ Middleware authMiddleware.js verify token
→ Token expire 24 jam → redirect ke login
```

---

## 7. Rencana Pengerjaan (Timeline Realistis)

> Asumsi: dikerjakan part-time sebagai proyek akhir D3, sekitar 3-4 bulan.

### Fase 1 — Setup & Fondasi (Minggu 1-2)
- [ ] Setup repository Git (monorepo atau 3 repo terpisah)
- [ ] Setup Docker Compose: MySQL + Node.js + Next.js
- [ ] Buat schema database + migrations Sequelize
- [ ] Setup Express.js dengan struktur folder MVVM
- [ ] Setup Next.js 14 dengan TailwindCSS + TypeScript
- [ ] Setup Flutter project dengan folder MVVM
- [ ] Konfigurasi Dio + Riverpod di Flutter

### Fase 2 — Backend API (Minggu 3-5)
- [ ] Implementasi endpoint auth (login/logout) + JWT
- [ ] Implementasi CRUD cafe (endpoint 8, 9, 10)
- [ ] Implementasi endpoint GET cafe public (3, 4, 5, 6, 7)
- [ ] Implementasi endpoint fasilitas (11)
- [ ] Implementasi upload foto + reorder (12, 13, 14)
- [ ] Implementasi dashboard stats (15)
- [ ] Implementasi logic completeness %
- [ ] Unit test endpoint dengan Postman/Thunder Client

### Fase 3 — Web Frontend (Minggu 6-9)
- [ ] Halaman list cafe + filter panel (11 filter)
- [ ] Halaman detail cafe + carousel foto
- [ ] Integrasi Google Maps Embed
- [ ] Fitur pencarian live (debounce)
- [ ] Admin: login page
- [ ] Admin: dashboard stats
- [ ] Admin: CRUD cafe form
- [ ] Admin: fasilitas toggle
- [ ] Admin: foto manager (upload + drag reorder)
- [ ] Responsive design (mobile-friendly)

### Fase 4 — Android (Flutter) (Minggu 8-12)
- [ ] Home screen + navigasi GoRouter
- [ ] List cafe screen + filter bottom sheet
- [ ] Detail cafe screen + carousel foto
- [ ] Integrasi Google Maps (google_maps_flutter)
- [ ] Search screen
- [ ] Loading state + error handling + empty state

### Fase 5 — Testing & Finalisasi (Minggu 12-14)
- [ ] Input data cafe asli Ponorogo
- [ ] Testing di berbagai ukuran layar Android
- [ ] Testing web di mobile browser
- [ ] Bug fixing
- [ ] Dokumentasi API (Postman Collection / Swagger)
- [ ] Laporan proyek akhir

---

## 8. Hal-Hal yang Harus Diperhatikan (Catatan Kritis)

### ⚠️ Google Maps API Key
- Buat project di Google Cloud Console
- Aktifkan: Maps JavaScript API, Maps Embed API, Maps SDK for Android
- Buat 2 API key terpisah: satu untuk web (restrict by domain), satu untuk Android (restrict by package name)
- **Jangan push API key ke Git** → gunakan `.env`
- Cek billing alert: Maps API punya free tier $200/bulan, cukup untuk proyek skala Ponorogo

### ⚠️ Upload Foto
- Validasi ukuran (maks 5MB) dan format (jpg, png, webp) di backend
- Jika deploy ke VPS biasa: simpan di folder `uploads/` dan serve via Express static
- Jika ingin lebih robust: pakai Cloudinary free tier (25GB storage, 25GB bandwidth/bulan)
- **Jangan simpan file di database (BLOB)** — ini salah kaprah yang umum

### ⚠️ SEO (Web)
- Gunakan slug (`/cafes/kopi-nusantara`) bukan ID (`/cafes/1`)
- Manfaatkan Next.js `generateMetadata` per halaman cafe untuk meta title/description
- Gunakan `generateStaticParams` untuk SSG halaman detail cafe (performa optimal)

### ⚠️ Soft Delete vs Hard Delete
- Jangan hapus data cafe secara permanen dari database
- Gunakan `is_active = false` sehingga data tetap ada untuk keperluan audit
- Hard delete hanya untuk foto yang tidak dipakai

### ⚠️ Batasan Sistem (Dari Proposal)
- Tidak ada fitur pemesanan/reservasi → jangan scope creep
- Tidak ada iOS → tidak perlu setup Apple Developer Account
- Data cafe hanya dari admin → tidak ada user-generated content
- Wilayah Ponorogo saja → tidak perlu multi-kota

---

## 9. Dependensi & Package Utama

### Backend
```json
{
  "dependencies": {
    "express": "^4.18",
    "sequelize": "^6.35",
    "mysql2": "^3.6",
    "jsonwebtoken": "^9.0",
    "bcryptjs": "^2.4",
    "multer": "^1.4",
    "cors": "^2.8",
    "dotenv": "^16.0",
    "express-validator": "^7.0"
  }
}
```

### Web (Next.js)
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "tailwindcss": "^3.4",
    "zustand": "^4.5",
    "axios": "^1.6",
    "embla-carousel-react": "^8.0",
    "lucide-react": "latest",
    "@tanstack/react-query": "^5.0"
  }
}
```

### Android (Flutter) — pubspec.yaml
```yaml
dependencies:
  flutter_riverpod: ^2.4.0
  dio: ^5.4.0
  go_router: ^12.0.0
  google_maps_flutter: ^2.5.0
  flutter_secure_storage: ^9.0.0
  carousel_slider: ^4.2.1
  cached_network_image: ^3.3.0
  url_launcher: ^6.2.0
```

---

## 10. Lingkungan Development

### File `.env` Backend
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ponorogocafe_db
DB_USER=root
DB_PASSWORD=secret
JWT_SECRET=ganti_dengan_string_random_panjang
JWT_EXPIRES_IN=86400
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
BASE_URL=http://localhost:3001
```

### File `.env.local` Next.js
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIza...
```

### Flutter `api_config.dart`
```dart
class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:3001/v1'; // emulator
  // static const String baseUrl = 'https://api.ponorogocafe.id/v1'; // produksi
  static const String googleMapsKey = 'AIza...';
}
```

### Docker Compose (dev)
```yaml
version: '3.8'
services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: ponorogocafe_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - db
    env_file: ./backend/.env

  web:
    build: ./web
    ports:
      - "3000:3000"
    env_file: ./web/.env.local

volumes:
  mysql_data:
```

---

## 11. Definisi "Done" per Fitur

Agar tidak terjebak dalam pengembangan tanpa arah:

| Fitur | Done Criteria |
|---|---|
| List cafe | Data muncul, pagination berjalan, loading state ada |
| Filter | Semua 11 filter berjalan, bisa kombinasi |
| Detail cafe | Semua field muncul, carousel jalan, koordinat tampil |
| Google Maps | Pin muncul di peta, tombol buka Maps app berfungsi |
| Admin CRUD | Tambah, edit, hapus cafe berfungsi dari dashboard |
| Upload foto | Foto tersimpan, muncul di carousel, bisa diurutkan |
| Completeness % | Angka berubah saat data diupdate |
| Auth | Login dapat token, logout hapus sesi, route admin terlindungi |
| Android | Bisa install APK debug, semua screen render, API terhubung |

---

*Dokumen ini dibuat berdasarkan analisis mendalam proposal seminar proyek akhir. Semua teknologi, endpoint, dan struktur folder bersifat implementatif dan langsung dapat dijadikan acuan pengerjaan tanpa perlu interpretasi tambahan.*

*Dibuat untuk: Wildan Khoiru Rijal Nur Wahid — PENS D3 PJJ Teknik Informatika 2025/2026*
