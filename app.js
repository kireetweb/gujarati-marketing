import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Injected User API Keys
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {

    // Cinematic Center-to-Left Nav Trigger
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fetch Data
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
                    <span class="slide-eyebrow">Aura ${index + 1}</span>
                    <h2>${ad.banner_heading || 'Reach Further'}</h2>
                    <p>${ad.banner_text || 'An airy, unboxed approach to putting your brand in front of the audiences that matter most.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${imageSrc}" alt="Brand Imagery" loading="lazy">
                    </div>
                </div>
            </div>
        `;
        carouselHTML += slideHtml;

        // Using transparent placeholders for the unboxed look
        const logoSrc = ad.sponsor_logo_url || 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="${ad.bio_name}" loading="lazy">`;

        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="btn">View Link</a>`
            : `<a href="#" class="btn disabled">Unavailable</a>`;

        cardsHTML += `
            <div class="card">
                <div class="card-header">
                    <h3>${ad.bio_name || 'Brand Identity'}</h3>
                    <h4>Verified</h4>
                </div>
                <p>"${ad.card_subtext || 'An elegant approach to digital growth without the clutter.'}"</p>
                <div class="card-footer">
                    ${buttonHTML}
                    <a href="${ad.social_link || '#'}" target="_blank" class="social-icon"><i class="${iconClass}"></i></a>
                </div>
            </div>
        `;
    });

    // Invisible clone for smooth loop
    if(ads.length > 0) {
        const cloneImageSrc = ads[0].banner_image_url || 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800';
        const firstSlideHTML = `
            <div class="slide clone">
                <div class="slide-content">
                     <span class="slide-eyebrow">Aura 1</span>
                    <h2>${ads[0].banner_heading || 'Reach Further'}</h2>
                    <p>${ads[0].banner_text || 'An airy, unboxed approach to putting your brand in front of the audiences that matter most.'}</p>
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
    return 'fa-solid fa-arrow-up-right';
}

function initSeamlessCarousel(realSlideCount) {
    const track = document.getElementById('carousel-track');
    let currentIndex = 0;
    const transitionStyle = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'; 

    setTimeout(() => {
        setInterval(() => {
            currentIndex++;
            track.style.transition = transitionStyle;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
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
