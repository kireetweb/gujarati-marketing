import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Injected User API Keys
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("God-Tier UI Initialized. Crafted by MYR.");

document.addEventListener('DOMContentLoaded', async () => {

    // Mobile-Safe Navbar Scroll Logic
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fetch Supabase Data
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
    const track = document.getElementById('carousel-track');
    const sponsorsContainer = document.getElementById('sponsor-container');
    const cardsContainer = document.getElementById('cards-container');

    let carouselHTML = '';
    let sponsorsHTML = '';
    let cardsHTML = '';

    ads.forEach((ad, index) => {
        const imageSrc = ad.banner_image_url || 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800';
        
        const slideHtml = `
            <div class="slide" data-index="${index}">
                <div class="slide-content">
                    <span class="slide-eyebrow">Slot 0${index + 1}</span>
                    <h2>${ad.banner_heading || 'Elite Marketing'}</h2>
                    <p>${ad.banner_text || 'Premium placement designed exclusively for visionary brands aiming to dominate the market.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${imageSrc}" alt="Brand Imagery">
                    </div>
                </div>
            </div>
        `;
        carouselHTML += slideHtml;

        const logoSrc = ad.sponsor_logo_url || 'https://via.placeholder.com/160/050505/FFFFFF?text=Brand';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="${ad.bio_name}">`;

        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="btn">Explore Platform</a>`
            : `<a href="#" class="btn disabled">Currently Unavailable</a>`;

        cardsHTML += `
            <div class="card">
                <div class="card-header">
                    <h3>${ad.bio_name || 'Premium Brand'}</h3>
                    <h4>Verified Partner</h4>
                </div>
                <p>"${ad.card_subtext || 'Uncompromising excellence in the digital marketing space. Connect with high-value audiences today.'}"</p>
                <div class="card-footer">
                    <a href="${ad.social_link || '#'}" target="_blank" class="social-icon"><i class="${iconClass}"></i></a>
                    ${buttonHTML}
                </div>
            </div>
        `;
    });

    // SEAMLESS LOOP LOGIC: Clone First Slide
    if(ads.length > 0) {
        const cloneImageSrc = ads[0].banner_image_url || 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800';
        const firstSlideHTML = `
            <div class="slide clone">
                <div class="slide-content">
                     <span class="slide-eyebrow">Slot 01</span>
                    <h2>${ads[0].banner_heading || 'Elite Marketing'}</h2>
                    <p>${ads[0].banner_text || 'Premium placement designed exclusively for visionary brands aiming to dominate the market.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${cloneImageSrc}" alt="Brand Imagery">
                    </div>
                </div>
            </div>
        `;
        carouselHTML += firstSlideHTML;
    }

    track.innerHTML = carouselHTML;
    sponsorsContainer.innerHTML = sponsorsHTML;
    cardsContainer.innerHTML = cardsHTML;

    initSeamlessCarousel(ads.length);
    initScrollReveal();
}

function getSocialIcon(platform) {
    if(platform === 'IG') return 'fa-brands fa-instagram';
    if(platform === 'YT') return 'fa-brands fa-youtube';
    if(platform === 'X') return 'fa-brands fa-x-twitter';
    return 'fa-solid fa-arrow-up-right-from-square';
}

// True Seamless Continuous Infinite Loop
function initSeamlessCarousel(realSlideCount) {
    const track = document.getElementById('carousel-track');
    const scrollIndicator = document.getElementById('scroll-indicator');
    let currentIndex = 0;
    
    const transitionStyle = 'transform 1.2s cubic-bezier(0.85, 0, 0.15, 1)';

    setTimeout(() => {
        setInterval(() => {
            currentIndex++;
            track.style.transition = transitionStyle;
            track.style.transform = `translateX(-${currentIndex * 100}vw)`;
            
            if (currentIndex === 1 && scrollIndicator) {
                 scrollIndicator.classList.remove('hidden');
            }

            // Reset loop
            if (currentIndex === realSlideCount) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0vw)`;
                }, 1200); 
            }
        }, 5000); 
    }, 1500);
}

// Cinematic Scroll Reveals
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

    reveals.forEach(reveal => observer.observe(reveal));
}
