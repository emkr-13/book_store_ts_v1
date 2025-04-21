# Book Store version 1

Teknologi yang dipakai typescript, node TS, drizzle ORM, untuk database pakai postgresql

## Installation

Step 1. setup environment

```bash
cp .env.example .env
```

Step 2. Install Package

```bash
npm install
```

## Menjalankan Migration dan Seedernya

bisa membaca di dokumentasi ini link sini https://orm.drizzle.team/docs/get-started/postgresql-new

Step 1. generate dari model

```bash
npx drizzle-kit generate
```

Step 2. Menjalankan migration

```bash
npx drizzle-kit push
```

Step 3 . Menjalan tergantung nama file folder seeders

```bash
ts-node src/seeders/userSeeder.ts
```

## Menjalankan aplikasi

untuk menjalan aplikasi dengan melakukan perintah 

```bash
npm run dev
```

