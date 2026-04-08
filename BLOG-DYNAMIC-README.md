# Blog Dinamis - Dokumentasi

## Ringkasan
Bagian blog di website telah diubah menjadi dinamis menggunakan API dari https://createch.id/blog

## File yang Dimodifikasi

### 1. assets/blog-api.js (BARU)
File JavaScript yang menangani:
- Fetch data dari API `https://createch.id/blog`
- Format data blog dengan struktur:
  - Foto/gambar artikel
  - Nama penulis
  - Tanggal publikasi
  - Judul blog
  - Potongan deskripsi (maksimal 100 karakter)
- Menampilkan 7 artikel di homepage (swiper format)
- Menampilkan semua artikel di halaman blog (grid format)

### 2. ai-software.html
Perubahan:
- Menambahkan `id="homepage-blog-container"` pada swiper wrapper
- Menambahkan `<script src="assets/blog-api.js"></script>` sebelum `</body>`
- Mengubah judul dari "Latest articles published by Pision" menjadi "Latest articles published by Createch"
- Artikel statis telah dihapus (akan dimuat dari API)

### 3. ai-software-blog.html
Perubahan:
- Menambahkan `id="blog-container"` pada grid container
- Menambahkan `<script src="assets/blog-api.js"></script>` sebelum `</body>`
- Artikel statis perlu dihapus secara manual (masih ada di file)

## Cara Kerja

### Homepage (ai-software.html)
1. Saat halaman dimuat, script akan mendeteksi element dengan ID `homepage-blog-container`
2. Script akan fetch data dari API
3. Mengambil 7 artikel pertama
4. Membuat HTML card untuk setiap artikel dalam format swiper-slide
5. Memasukkan ke dalam swiper wrapper
6. Swiper akan otomatis update untuk menampilkan artikel

### Halaman Blog (ai-software-blog.html)
1. Saat halaman dimuat, script akan mendeteksi element dengan ID `blog-container`
2. Script akan fetch data dari API
3. Mengambil semua artikel
4. Membuat HTML card untuk setiap artikel dalam format grid
5. Memasukkan ke dalam grid container

## Format Data API yang Diharapkan

Script mendukung berbagai format response API:
```javascript
// Format 1
{
  "data": [...]
}

// Format 2
{
  "blogs": [...]
}

// Format 3
[...] // Array langsung
```

Setiap artikel harus memiliki struktur (fleksibel):
```javascript
{
  "title": "Judul Artikel",
  "description" atau "excerpt": "Deskripsi artikel",
  "image" atau "featured_image" atau "thumbnail": "URL gambar",
  "author" atau "author_name": "Nama Penulis",
  "date" atau "published_at": "2025-04-07",
  "category" atau "categories": "Kategori",
  "slug" atau "id": "artikel-slug"
}
```

## Error Handling
- Jika API gagal, akan menampilkan pesan error
- Jika tidak ada artikel, akan menampilkan pesan "No blogs available"
- Jika gambar gagal dimuat, akan menggunakan fallback image `images/ns-img-428.png`

## Catatan Penting
- Artikel statis di ai-software-blog.html masih perlu dihapus secara manual
- Pastikan API https://createch.id/blog dapat diakses dan mengembalikan data yang valid
- Script akan otomatis berjalan saat halaman dimuat (DOMContentLoaded event)
