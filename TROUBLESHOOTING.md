# Troubleshooting Blog API

## Perbaikan yang Telah Dilakukan

### 1. Posisi Script
- ✓ Memindahkan `<script src="assets/blog-api.js"></script>` keluar dari tag `</footer>`
- ✓ Script sekarang berada sebelum `</body>` untuk memastikan DOM sudah siap

### 2. Debugging
- ✓ Menambahkan console.log di berbagai titik untuk tracking
- ✓ Menambahkan fallback script untuk memanggil loadAllBlogs() jika DOMContentLoaded sudah fired

### 3. File Test
Buat 3 file test untuk debugging:

1. **test-direct-api.html** - Test paling sederhana, langsung fetch API
2. **test-blog-simple.html** - Test dengan blog-api.js dan CSS
3. **test-blog-api.html** - Test lengkap dengan styling

## Cara Debugging

### Langkah 1: Buka Browser Console
1. Buka `ai-software-blog.html` di browser
2. Tekan F12 untuk membuka Developer Tools
3. Pilih tab "Console"
4. Refresh halaman (F5)

### Langkah 2: Periksa Console Messages
Anda harus melihat pesan seperti:
```
DOMContentLoaded fired
Looking for blog-container: [object HTMLDivElement]
Calling loadAllBlogs
loadAllBlogs called
Container found: [object HTMLDivElement]
Fetching from: https://adm.createch.id/getartikel
Response status: 200
API Result: {success: true, data: Array(18)}
Blogs count: 18
Generated HTML length: [number]
Blogs loaded successfully!
```

### Langkah 3: Periksa Network Tab
1. Pilih tab "Network" di Developer Tools
2. Refresh halaman
3. Cari request ke `getartikel`
4. Klik untuk melihat response

### Langkah 4: Test dengan File Test
Jika halaman utama tidak bekerja, coba buka file test:

1. **test-direct-api.html** - Jika ini tidak bekerja, masalahnya adalah:
   - CORS issue
   - API down
   - Network problem

2. **test-blog-simple.html** - Jika ini tidak bekerja tapi test-direct-api.html bekerja:
   - Masalah di blog-api.js
   - Masalah dengan CSS/styling

3. **test-blog-api.html** - Test dengan styling lengkap

## Kemungkinan Masalah

### 1. CORS Error
Jika di console muncul error CORS:
```
Access to fetch at 'https://adm.createch.id/getartikel' from origin 'file://' has been blocked by CORS policy
```

**Solusi:**
- Jalankan dengan local server (tidak bisa dibuka langsung dengan file://)
- Gunakan Live Server extension di VS Code
- Atau gunakan: `python -m http.server 8000`

### 2. Script Tidak Dimuat
Jika console menunjukkan `loadAllBlogs is not defined`:
- Periksa path `assets/blog-api.js` benar
- Pastikan file ada di folder assets

### 3. Container Tidak Ditemukan
Jika console menunjukkan `Container found: null`:
- Periksa ID element: `id="blog-container"`
- Pastikan tidak ada typo

### 4. API Error
Jika response status bukan 200:
- API mungkin down
- URL salah
- Network problem

## Solusi Sementara

Jika masih tidak bekerja, tambahkan ini di console browser:
```javascript
// Manual test
fetch('https://adm.createch.id/getartikel')
  .then(r => r.json())
  .then(d => console.log('API works:', d))
  .catch(e => console.error('API error:', e));

// Manual load
if (typeof loadAllBlogs === 'function') {
  loadAllBlogs();
} else {
  console.error('Function not found');
}
```

## Checklist

- [ ] File blog-api.js ada di folder assets
- [ ] Script tag ada sebelum </body>
- [ ] Element dengan id="blog-container" ada
- [ ] Tidak ada error CORS di console
- [ ] API mengembalikan data (test dengan test-direct-api.html)
- [ ] Browser console menunjukkan "Blogs loaded successfully!"

## Kontak

Jika masih ada masalah, kirim screenshot dari:
1. Browser console (tab Console)
2. Network tab (request ke getartikel)
3. Elements tab (cari id="blog-container")
