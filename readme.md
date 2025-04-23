# Book Store Version 1

Teknologi yang digunakan:

- TypeScript
- Node.js (TS)
- Drizzle ORM
- PostgreSQL (database)

## Installation

### Step 1: Setup Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

### Step 2: Install Dependencies

Jalankan perintah berikut untuk menginstal semua package:

```bash
npm install
```

## Menjalankan Migration dan Seeder

Untuk informasi lebih lanjut, baca dokumentasi resmi di [Drizzle ORM Documentation](https://orm.drizzle.team/docs/get-started/postgresql-new).

### Step 1: Generate dari Model

```bash
npx drizzle-kit generate
```

### Step 2: Menjalankan Migration

```bash
npx drizzle-kit push
```

### Step 3: Menjalankan Seeder

Jalankan file seeder sesuai dengan nama file di folder `seeders`. Contoh:

```bash
ts-node src/seeders/userSeeder.ts
```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi, gunakan perintah berikut:

```bash
npm run dev
```
