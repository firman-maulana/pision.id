// Blog API Integration - Debug Version
// File ini sama dengan blog-api.js tapi dengan console.log untuk debugging

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
  return dateString || 'Unknown Date';
}

// Fungsi untuk fetch data blog dari API
async function fetchBlogData() {
  console.log('[Blog API] Fetching data from:', API_URL);
  try {
    const response = await fetch(API_URL);
    console.log('[Blog API] Response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog data');
    }
    
    const result = await response.json();
    console.log('[Blog API] Response data:', result);
    console.log('[Blog API] Number of articles:', result.data?.length || 0);
    
    return result.data || [];
  } catch (error) {
    console.error('[Blog API] Error fetching blog data:', error);
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
  const category = 'Technology';
  
  console.log('[Blog API] Creating swiper slide for:', title);
  
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
              <a href="/detail-blog" aria-label="Read full article about ${title}">
                ${title}
              </a>
            </h3>
            <p class="sm:text-tagline-1 text-tagline-2 text-secondary/60 dark:text-accent/60 font-normal">
              ${description}
            </p>
          </div>
          <div>
            <a href="/detail-blog" class="btn btn-md btn-white hover:btn-primary dark:btn-transparent inline-block" aria-label="Read full article">
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
  const category = 'Technology';
  
  console.log('[Blog API] Creating blog card for:', title);
  
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
              <a href="/detail-blog" aria-label="Read more about ${title}">
                ${title}
              </a>
            </h3>
            <p class="sm:text-tagline-1 text-tagline-2 font-normal text-secondary/60 dark:text-accent/60 line-clamp-2">
              ${description}
            </p>
          </div>
          <div>
            <a href="/detail-blog" class="btn btn-md btn-white hover:btn-primary dark:btn-transparent inline-block absolute bottom-6" aria-label="Read full article">
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
  console.log('[Blog API] Loading homepage blogs...');
  
  // Di homepage ada 2 section blog:
  // 1. Swiper section (jika ada)
  // 2. Grid section dengan 3 blog cards
  
  const swiperWrapper = document.querySelector('.blog-article-swiper .swiper-wrapper');
  const blogGrid = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');
  
  console.log('[Blog API] Found swiper wrapper:', !!swiperWrapper);
  console.log('[Blog API] Found blog grids:', blogGrid.length);
  
  const blogs = await fetchBlogData();
  if (!blogs || blogs.length === 0) {
    console.warn('[Blog API] No blog data available');
    return;
  }

  // Ambil 3 blog terbaru
  const latestBlogs = blogs.slice(0, 3);
  console.log('[Blog API] Displaying', latestBlogs.length, 'latest blogs');
  
  // Load ke swiper jika ada
  if (swiperWrapper) {
    swiperWrapper.innerHTML = '';
    
    latestBlogs.forEach(blog => {
      swiperWrapper.innerHTML += createSwiperSlide(blog);
    });

    console.log('[Blog API] Swiper blogs loaded');

    // Reinitialize swiper if needed
    if (typeof Swiper !== 'undefined') {
      const swiper = document.querySelector('.blog-article-swiper').swiper;
      if (swiper) {
        swiper.update();
        console.log('[Blog API] Swiper updated');
      }
    }
  }
  
  // Load ke grid section (untuk section "Latest articles")
  if (blogGrid.length > 0) {
    const targetGrid = blogGrid[0];
    console.log('[Blog API] Loading blogs to grid section');
    targetGrid.innerHTML = '';
    
    latestBlogs.forEach((blog, index) => {
      const delay = (0.3 + index * 0.1).toFixed(1);
      targetGrid.innerHTML += createBlogCard(blog, delay);
    });
    
    console.log('[Blog API] Grid blogs loaded successfully');
    
    // Trigger animation library jika ada
    triggerAnimations();
  }
}

// Fungsi untuk load blog di blog page (ai-software-blog.html)
async function loadBlogPageBlogs() {
  console.log('[Blog API] Loading blog page blogs...');
  
  const swiperWrapper = document.querySelector('.blog-article-swiper .swiper-wrapper');
  const allGrids = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');
  
  console.log('[Blog API] Found swiper wrapper:', !!swiperWrapper);
  console.log('[Blog API] Found grids:', allGrids.length);
  
  const blogs = await fetchBlogData();
  if (!blogs || blogs.length === 0) {
    console.warn('[Blog API] No blog data available');
    return;
  }

  // Load 3 blog terbaru di swiper
  if (swiperWrapper) {
    const latestBlogs = blogs.slice(0, 3);
    console.log('[Blog API] Loading', latestBlogs.length, 'blogs to swiper');
    
    swiperWrapper.innerHTML = '';
    
    latestBlogs.forEach(blog => {
      swiperWrapper.innerHTML += createSwiperSlide(blog);
    });

    // Reinitialize swiper
    if (typeof Swiper !== 'undefined') {
      const swiper = document.querySelector('.blog-article-swiper').swiper;
      if (swiper) {
        swiper.update();
        console.log('[Blog API] Swiper updated');
      }
    }
  }

  // Load semua blog di grid dengan pagination (9 per halaman)
  if (allGrids.length > 0) {
    const blogGrid = allGrids[0];
    console.log('[Blog API] Initializing pagination for', blogs.length, 'blogs');
    initPagination(blogs, blogGrid);
  }
}

// State untuk pagination
let currentPage = 1;
const itemsPerPage = 9;

// Fungsi untuk inisialisasi pagination
function initPagination(blogs, blogGrid) {
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  console.log('[Blog API] Total pages:', totalPages);
  
  // Render halaman pertama (tanpa scroll)
  renderPage(blogs, blogGrid, 1, false);
  
  // Render pagination controls
  renderPaginationControls(totalPages, blogs, blogGrid);
}

// Fungsi untuk render blog di halaman tertentu
function renderPage(blogs, blogGrid, page, shouldScroll = true) {
  console.log('[Blog API] Rendering page', page, '| shouldScroll:', shouldScroll);
  currentPage = page;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageBlogs = blogs.slice(startIndex, endIndex);
  
  console.log('[Blog API] Showing blogs', startIndex + 1, 'to', Math.min(endIndex, blogs.length));
  
  blogGrid.innerHTML = '';
  
  pageBlogs.forEach((blog, index) => {
    const delay = (0.3 + (index % 3) * 0.1).toFixed(1);
    blogGrid.innerHTML += createBlogCard(blog, delay);
  });
  
  console.log('[Blog API] Page rendered with', pageBlogs.length, 'blogs');
  
  // Trigger animation
  triggerAnimations();
  
  // Scroll to top of blog section (hanya jika shouldScroll = true)
  if (shouldScroll) {
    console.log('[Blog API] Scrolling to blog section');
    const blogSection = blogGrid.closest('section');
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    console.log('[Blog API] Scroll skipped (initial load)');
  }
}

// Fungsi untuk render pagination controls
function renderPaginationControls(totalPages, blogs, blogGrid) {
  console.log('[Blog API] Rendering pagination controls');
  const paginationContainer = document.querySelector('ul.flex.items-center.justify-center.mt-14');
  
  if (!paginationContainer) {
    console.warn('[Blog API] Pagination container not found');
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
      console.log('[Blog API] Previous page clicked');
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
      console.log('[Blog API] Page', i, 'clicked');
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
      console.log('[Blog API] Next page clicked');
      renderPage(blogs, blogGrid, currentPage + 1);
      renderPaginationControls(totalPages, blogs, blogGrid);
    }
  });
  paginationContainer.appendChild(nextLi);
  
  console.log('[Blog API] Pagination controls rendered:', totalPages, 'pages');
}

// Fungsi helper untuk trigger animasi
function triggerAnimations() {
  console.log('[Blog API] Triggering animations...');
  
  // Coba trigger animasi jika library tersedia
  // Untuk ScrollTrigger (GSAP)
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
    console.log('[Blog API] ScrollTrigger refreshed');
  }
  
  // Untuk custom animation library yang mungkin digunakan
  if (typeof window.initAnimations === 'function') {
    window.initAnimations();
    console.log('[Blog API] Custom animations initialized');
  }
  
  // Fallback: trigger manual dengan menambahkan class
  setTimeout(() => {
    const articles = document.querySelectorAll('article.group');
    console.log('[Blog API] Animating', articles.length, 'articles');
    
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
  console.log('[Blog API] Current page:', currentPage);
  
  if (currentPage.includes('./') || currentPage.endsWith('/')) {
    console.log('[Blog API] Detected homepage, loading homepage blogs');
    loadHomepageBlogs();
  } else if (currentPage.includes('/blog')) {
    console.log('[Blog API] Detected blog page, loading blog page blogs');
    loadBlogPageBlogs();
  } else {
    console.log('[Blog API] Page not recognized, skipping blog load');
  }
});
