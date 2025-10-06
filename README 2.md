# Mentari Hospital Starter (Next.js + Tailwind + TypeScript)

## Cara jalanin (lokal)
1. Buka terminal di folder proyek ini.
2. Install dependencies:
   ```bash
   npm install
   # atau
   yarn
   # atau
   pnpm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:3000`

## Struktur
```
src/
  pages/
    _app.tsx       -> import Tailwind (globals.css)
    index.tsx      -> halaman utama, render <PageCover />
  components/
    PageCover/
      index.tsx    -> komponen cover/hero + navbar
  styles/
    globals.css     -> Tailwind + font
```

## Catatan
- Font **Be Vietnam Pro** diambil dari Google Fonts via `globals.css`.
- Gambar background masih pakai placeholder `https://placehold.co/...` (silakan ganti).
- Layout sudah responsif dasar (navbar, hero, tombol, search).
