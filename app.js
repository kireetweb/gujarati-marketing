import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Injected User API Keys
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Elite UI Initialized. Crafted by MYR.");

document.addEventListener('DOMContentLoaded', async () => {

    // Center-to-Left Navbar Cinematic Scroll Trigger
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
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
                    <span class="slide-eyebrow">Edition 0${index + 1}</span>
                    <h2>${ad.banner_heading || 'Elite Marketing'}</h2>
                    <p>${ad.banner_text || 'Premium placement designed exclusively for visionary brands aiming to dominate the digital landscape.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${imageSrc}" alt="Brand Imagery" loading="lazy">
                    </div>
                </div>
            </div>
        `;
        carouselHTML += slideHtml;

        const logoSrc = ad.sponsor_logo_url || 'https://via.placeholder.com/150/F8FAFC/0B1120?text=Brand';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="${ad.bio_name}" loading="lazy">`;

        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="btn">View Platform</a>`
            : `<a href="#" class="btn disabled">Unavailable</a>`;

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

    // SEAMLESS LOOP: Clone First Slide invisibly
    if(ads.length > 0) {
        const cloneImageSrc = ads[0].banner_image_url || 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800';
        const firstSlideHTML = `
            <div class="slide clone">
                <div class="slide-content">
                     <span class="slide-eyebrow">Edition 01</span>
                    <h2>${ads[0].banner_heading || 'Elite Marketing'}</h2>
                    <p>${ads[0].banner_text || 'Premium placement designed exclusively for visionary brands aiming to dominate the digital landscape.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${cloneImageSrc}" alt="Brand Imagery" loading="lazy">
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

// Perfect Hardware-Accelerated Sliding Loop
function initSeamlessCarousel(realSlideCount) {
    const track = document.getElementById('carousel-track');
    let currentIndex = 0;
    const transitionStyle = 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)'; // Fluid Ease

    setTimeout(() => {
        setInterval(() => {
            currentIndex++;
            track.style.transition = transitionStyle;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Invisible Reset
            if (currentIndex === realSlideCount) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0%)`;
                }, 1200); 
            }
        }, 5000); 
    }, 1500);
}

// Intersection Observer for Smooth Entry Animations
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(reveal => observer.observe(reveal));
}
