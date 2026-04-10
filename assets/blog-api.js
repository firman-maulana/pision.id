// Blog API Integration
const API_URL = 'https://adm.createch.id/getartikel';

// Fungsi untuk memotong teks
function truncateText(text, maxLength) {
  if (!text) return '';
  const cleanText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
  return cleanText.length > maxLength 
    ? cleanText.substring(0, maxLength) + '...' 
    : cleanText;
}

// Fungsi untuk format tanggal
function formatDate(dateString) {
  // API sudah mengembalikan format yang bagus seperti "Apr, 05 2023"
  // Jadi kita langsung return saja
  return dateString || 'Unknown Date';
}

// Fungsi untuk fetch data blog dari API
async function fetchBlogData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch blog data');
    }
    const result = await response.json();
    // API mengembalikan object dengan property 'data' yang berisi array artikel
    return result.data || [];
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

// Fungsi untuk membuat HTML card blog untuk swiper (homepage & blog page)
function createSwiperSlide(article) {
  const imageUrl = article.gambar || 'images/ns-img-492.png';
  const author = article.penulis || 'Admin';
  const date = formatDate(article.tanggal);
  const title = article.judul || 'No Title';
  const description = truncateText(article.deskripsi, 100);
  const category = 'Technology'; // API tidak menyediakan kategori, jadi kita set default
  
  return `
    <div class="swiper-slide">
      <article class="scale-100 transition-transform duration-500 hover:scale-[99%] hover:transition-transform hover:duration-500">
        <figure class="max-h-[550px] w-full overflow-hidden rounded-t-[20px]">
          <img src="${imageUrl}" alt="${title}" class="h-full w-full object-cover" />
        </figure>
        <div class="bg-background-1 dark:bg-background-6 space-y-6 rounded-b-[20px] px-4 py-8 md:p-8">
          <div class="flex items-center gap-2">
            <span class="badge badge-green mr-1">${category}</span>
            <span rel="author" class="text-tagline-3 text-secondary/60 dark:text-accent/60 font-normal">${author}</span>
            <span class="h-[6px] w-[5px] rounded-full bg-[#ECE8FF]"></span>
            <time class="text-tagline-3 text-secondary/60 dark:text-accent/60 font-normal">${date}</time>
          </div>
          <div>
            <h3 class="sm:text-heading-5 text-tagline-1 mb-2 font-normal">
              <a href="ai-software-blog-details.html" aria-label="Read full article about ${title}">
                ${title}
              </a>
            </h3>
            <p class="sm:text-tagline-1 text-tagline-2 text-secondary/60 dark:text-accent/60 font-normal">
              ${description}
            </p>
          </div>
          <div>
            <a href="ai-software-blog-details.html" class="btn btn-md btn-white hover:btn-primary dark:btn-transparent inline-block" aria-label="Read full article">
              <span>Read more</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  `;
}

// Fungsi untuk membuat HTML card blog untuk grid (blog page - all blogs)
function createBlogCard(article, delay = '0.3') {
  const imageUrl = article.gambar || 'images/ns-img-428.png';
  const author = article.penulis || 'Admin';
  const date = formatDate(article.tanggal);
  const title = article.judul || 'No Title';
  const description = truncateText(article.deskripsi, 100);
  const category = 'Technology'; // API tidak menyediakan kategori, jadi kita set default
  
  return `
    <article class="group">
      <div class="bg-background-1 dark:bg-background-6 rounded-[20px] overflow-hidden relative md:min-h-[552px] min-h-[480px] scale-100 hover:scale-[102%] transition-transform duration-500 hover:transition-transform hover:duration-500">
        <figure class="md:min-h-[260px] md:max-h-[260px] max-w-full xl:max-w-[409px] overflow-hidden">
          <img src="${imageUrl}" alt="${title}" loading="lazy" class="w-full h-full object-cover" />
        </figure>
        <div class="px-4 py-6 md:p-6 space-y-6">
          <div class="flex items-center gap-2">
            <span class="badge badge-green">${category}</span>
            <span rel="author" class="text-tagline-3 font-normal text-secondary/60 dark:text-accent/60 text-nowrap">${author}</span>
            <span class="w-[5px] h-[6px] bg-[#ECE8FF] rounded-full"></span>
            <time class="text-tagline-3 font-normal text-secondary/60 dark:text-accent/60 text-nowrap">${date}</time>
          </div>
          <div>
            <h3 class="font-normal sm:text-heading-5 text-tagline-1 mb-2">
              <a href="ai-software-blog-details.html" aria-label="Read more about ${title}">
                ${title}
              </a>
            </h3>
            <p class="sm:text-tagline-1 text-tagline-2 font-normal text-secondary/60 dark:text-accent/60 line-clamp-2">
              ${description}
            </p>
          </div>
          <div>
            <a href="ai-software-blog-details.html" class="btn btn-md btn-white hover:btn-primary dark:btn-transparent inline-block absolute bottom-6" aria-label="Read full article">
              <span>Read more</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Fungsi untuk load blog di homepage (ai-software.html) - 3 blog terbaru
async function loadHomepageBlogs() {
  // Di homepage ada 2 section blog:
  // 1. Swiper section (jika ada)
  // 2. Grid section dengan 3 blog cards
  
  const swiperWrapper = document.querySelector('.blog-article-swiper .swiper-wrapper');
  const blogGrid = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');
  
  const blogs = await fetchBlogData();
  if (!blogs || blogs.length === 0) {
    console.log('No blog data available');
    return;
  }

  // Ambil 3 blog terbaru
  const latestBlogs = blogs.slice(0, 3);
  
  // Load ke swiper jika ada
  if (swiperWrapper) {
    swiperWrapper.innerHTML = '';
    
    latestBlogs.forEach(blog => {
      swiperWrapper.innerHTML += createSwiperSlide(blog);
    });

    // Reinitialize swiper if needed
    if (typeof Swiper !== 'undefined') {
      const swiper = document.querySelector('.blog-article-swiper').swiper;
      if (swiper) {
        swiper.update();
      }
    }
  }
  
  // Load ke grid section (untuk section "Latest articles")
  // Cari grid yang ada di section dengan heading "Latest articles"
  if (blogGrid.length > 0) {
    // Ambil grid pertama (biasanya yang di homepage)
    const targetGrid = blogGrid[0];
    targetGrid.innerHTML = '';
    
    latestBlogs.forEach((blog, index) => {
      const delay = (0.3 + index * 0.1).toFixed(1);
      targetGrid.innerHTML += createBlogCard(blog, delay);
    });
    
    // Trigger animation library jika ada
    triggerAnimations();
  }
}

// Fungsi untuk load blog di blog page (ai-software-blog.html)
async function loadBlogPageBlogs() {
  const swiperWrapper = document.querySelector('.blog-article-swiper .swiper-wrapper');
  const allGrids = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');
  
  const blogs = await fetchBlogData();
  if (!blogs || blogs.length === 0) {
    console.log('No blog data available');
    return;
  }

  // Load 3 blog terbaru di swiper
  if (swiperWrapper) {
    const latestBlogs = blogs.slice(0, 3);
    swiperWrapper.innerHTML = '';
    
    latestBlogs.forEach(blog => {
      swiperWrapper.innerHTML += createSwiperSlide(blog);
    });

    // Reinitialize swiper
    if (typeof Swiper !== 'undefined') {
      const swiper = document.querySelector('.blog-article-swiper').swiper;
      if (swiper) {
        swiper.update();
      }
    }
  }

  // Load semua blog di grid dengan pagination (9 per halaman)
  if (allGrids.length > 0) {
    const blogGrid = allGrids[0];
    initPagination(blogs, blogGrid);
  }
}

// State untuk pagination
let currentPage = 1;
const itemsPerPage = 9;

// Fungsi untuk inisialisasi pagination
function initPagination(blogs, blogGrid) {
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  
  // Render halaman pertama (tanpa scroll)
  renderPage(blogs, blogGrid, 1, false);
  
  // Render pagination controls
  renderPaginationControls(totalPages, blogs, blogGrid);
}

// Fungsi untuk render blog di halaman tertentu
function renderPage(blogs, blogGrid, page, shouldScroll = true) {
  currentPage = page;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageBlogs = blogs.slice(startIndex, endIndex);
  
  blogGrid.innerHTML = '';
  
  pageBlogs.forEach((blog, index) => {
    const delay = (0.3 + (index % 3) * 0.1).toFixed(1);
    blogGrid.innerHTML += createBlogCard(blog, delay);
  });
  
  // Trigger animation
  triggerAnimations();
  
  // Scroll to top of blog section (hanya jika shouldScroll = true)
  if (shouldScroll) {
    const blogSection = blogGrid.closest('section');
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Fungsi untuk render pagination controls
function renderPaginationControls(totalPages, blogs, blogGrid) {
  const paginationContainer = document.querySelector('ul.flex.items-center.justify-center.mt-14');
  
  if (!paginationContainer) {
    console.log('Pagination container not found');
    return;
  }
  
  paginationContainer.innerHTML = '';
  
  // Previous button
  const prevLi = document.createElement('li');
  prevLi.className = 'group';
  prevLi.innerHTML = `
    <a href="#" class="flex w-10 h-10 items-center justify-center border border-stroke-3 dark:border-stroke-7 rounded-full hover:bg-primary-500 duration-300 group ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path d="M12.5 6H1.5M1.5 6L6 1.5M1.5 6L6 10.5" class="stroke-secondary dark:stroke-accent group-hover:stroke-white duration-300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </a>
  `;
  prevLi.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      renderPage(blogs, blogGrid, currentPage - 1);
      renderPaginationControls(totalPages, blogs, blogGrid);
    }
  });
  paginationContainer.appendChild(prevLi);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement('li');
    pageLi.className = currentPage === i ? 'group page-active' : 'group';
    pageLi.innerHTML = `
      <a href="#" class="flex w-10 h-10 items-center text-tagline-2 font-medium justify-center rounded-full dark:text-accent hover:bg-primary-500 duration-300 hover:text-accent group-[.page-active]:bg-primary-500 group-[.page-active]:text-accent dark:group-[.page-active]:text-accent">
        ${i}
      </a>
    `;
    pageLi.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      renderPage(blogs, blogGrid, i);
      renderPaginationControls(totalPages, blogs, blogGrid);
    });
    paginationContainer.appendChild(pageLi);
  }
  
  // Next button
  const nextLi = document.createElement('li');
  nextLi.className = 'group';
  nextLi.innerHTML = `
    <a href="#" class="flex w-10 h-10 items-center justify-center border border-stroke-3 dark:border-stroke-7 rounded-full hover:bg-primary-500 duration-300 group ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path d="M1.5 6H12.5M12.5 6L8 1.5M12.5 6L8 10.5" class="stroke-secondary dark:stroke-accent group-hover:stroke-white duration-300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </a>
  `;
  nextLi.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      renderPage(blogs, blogGrid, currentPage + 1);
      renderPaginationControls(totalPages, blogs, blogGrid);
    }
  });
  paginationContainer.appendChild(nextLi);
}

// Fungsi helper untuk trigger animasi
function triggerAnimations() {
  // Coba trigger animasi jika library tersedia
  // Biasanya animation library punya method untuk re-scan DOM
  
  // Untuk ScrollTrigger (GSAP)
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
  
  // Untuk custom animation library yang mungkin digunakan
  if (typeof window.initAnimations === 'function') {
    window.initAnimations();
  }
  
  // Fallback: trigger manual dengan menambahkan class
  setTimeout(() => {
    const articles = document.querySelectorAll('article.group');
    articles.forEach((article, index) => {
      article.style.opacity = '0';
      article.style.transform = 'translateY(20px)';
      article.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 50);
}

// Initialize berdasarkan halaman
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('ai-software.html') || currentPage.endsWith('/')) {
    loadHomepageBlogs();
  } else if (currentPage.includes('ai-software-blog.html')) {
    loadBlogPageBlogs();
  }
});
