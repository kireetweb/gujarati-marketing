import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- REPLACE WITH YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Developed by MYR");

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Navbar Scroll Logic
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Fetch Data
    const { data: ads, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    renderUI(ads);
});

function renderUI(ads) {
    const carousel = document.getElementById('carousel');
    const sponsorsContainer = document.getElementById('sponsor-container');
    const cardsContainer = document.getElementById('cards-container');

    let carouselHTML = '';
    let sponsorsHTML = '';
    let cardsHTML = '';

    ads.forEach((ad) => {
        // Build Slides
        const imageSrc = ad.banner_image_url || 'https://via.placeholder.com/600x400?text=No+Image';
        carouselHTML += `
            <div class="slide">
                <div class="slide-text">
                    <h2>${ad.banner_heading || 'Ad Title'}</h2>
                    <p>${ad.banner_text || 'Premium Ad Placement.'}</p>
                </div>
                <div class="slide-image">
                    <img src="${imageSrc}" alt="Ad Image">
                </div>
            </div>
        `;

        // Build Sponsors
        const logoSrc = ad.sponsor_logo_url || 'https://via.placeholder.com/150?text=Logo';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="Sponsor">`;

        // Build Cards
        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="btn">Visit Product</a>`
            : `<a href="#" class="btn disabled">Unavailable</a>`;

        cardsHTML += `
            <div class="card glass">
                <div class="card-header">
                    <h3>${ad.bio_name || 'Brand Name'}</h3>
                    <h4>Sponsor</h4>
                </div>
                <p>${ad.card_subtext || 'Information about the advertiser goes here.'}</p>
                <div class="card-footer">
                    <a href="${ad.social_link || '#'}" target="_blank"><i class="${iconClass} social-icon"></i></a>
                    ${buttonHTML}
                </div>
            </div>
        `;
    });

    carousel.innerHTML = carouselHTML;
    sponsorsContainer.innerHTML = sponsorsHTML;
    cardsContainer.innerHTML = cardsHTML;

    initCarousel(ads.length);
    initScrollReveal();
}

function getSocialIcon(platform) {
    if(platform === 'IG') return 'fa-brands fa-instagram';
    if(platform === 'YT') return 'fa-brands fa-youtube';
    if(platform === 'X') return 'fa-brands fa-x-twitter';
    return 'fa-solid fa-link';
}

// 3. Carousel Logic
function initCarousel(totalSlides) {
    const carousel = document.getElementById('carousel');
    const scrollIndicator = document.getElementById('scroll-indicator');
    let currentIndex = 0;
    let cycleCount = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
        
        if (currentIndex === totalSlides - 1) cycleCount++;
        
        // Show scroll indicator after 1 full cycle
        if (cycleCount >= 1) {
            scrollIndicator.classList.remove('hidden');
        }
    }, 3000);
}

// 4. Intersection Observer for Scroll Reveals
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
}
