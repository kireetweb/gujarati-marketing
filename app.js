import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- REPLACE WITH YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Developed by MYR");

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Elegant Navbar Reveal on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Fetch Data (The skeletons are showing while this happens)
    const { data: ads, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    // Small timeout purely to ensure the beautiful skeleton is seen for a split second 
    // even if internet is extremely fast (optional, but feels premium)
    setTimeout(() => {
        renderUI(ads);
    }, 800);
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
        const imageSrc = ad.banner_image_url || 'https://via.placeholder.com/600x500?text=Premium+Slot';
        carouselHTML += `
            <div class="slide">
                <div class="slide-text">
                    <h2>${ad.banner_heading || 'Elevate Your Reach'}</h2>
                    <p>${ad.banner_text || 'Secure this premium placement to showcase your brand to thousands of daily visitors.'}</p>
                </div>
                <div class="slide-image">
                    <img src="${imageSrc}" alt="Brand Imagery">
                </div>
            </div>
        `;

        // Build Sponsors
        const logoSrc = ad.sponsor_logo_url || 'https://via.placeholder.com/160?text=Logo';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="${ad.bio_name || 'Sponsor'}">`;

        // Build Cards
        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="btn">View Product</a>`
            : `<a href="#" class="btn disabled">Coming Soon</a>`;

        cardsHTML += `
            <div class="card">
                <div class="card-header">
                    <h3>${ad.bio_name || 'Premium Brand'}</h3>
                    <h4>Featured Partner</h4>
                </div>
                <p>"${ad.card_subtext || 'We partner with industry leaders to bring you the best in the business.'}"</p>
                <div class="card-footer">
                    <a href="${ad.social_link || '#'}" target="_blank" class="social-icon"><i class="${iconClass}"></i></a>
                    ${buttonHTML}
                </div>
            </div>
        `;
    });

    // Replace Skeletons with Real Data
    carousel.innerHTML = carouselHTML;
    sponsorsContainer.innerHTML = sponsorsHTML;
    cardsContainer.innerHTML = cardsHTML;

    // Initialize Interactions
    initCarousel(ads.length);
    initScrollReveal();
}

function getSocialIcon(platform) {
    if(platform === 'IG') return 'fa-brands fa-instagram';
    if(platform === 'YT') return 'fa-brands fa-youtube';
    if(platform === 'X') return 'fa-brands fa-x-twitter';
    return 'fa-solid fa-arrow-up-right-from-square';
}

// 3. Silky Smooth Carousel Logic
function initCarousel(totalSlides) {
    const carousel = document.getElementById('carousel');
    const scrollIndicator = document.getElementById('scroll-indicator');
    let currentIndex = 0;
    let cycleCount = 0;

    // Wait a brief moment before starting the auto-scroll
    setTimeout(() => {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
            
            if (currentIndex === totalSlides - 1) cycleCount++;
            
            // Show scroll indicator after 1 full cycle
            if (cycleCount >= 1) {
                scrollIndicator.classList.remove('hidden');
            }
        }, 4000); // Increased to 4s so users can read the elegant text
    }, 2000);
}

// 4. Intersection Observer for Cinematic Scroll Reveals
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after reveal so it stays visible
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => observer.observe(reveal));
}
