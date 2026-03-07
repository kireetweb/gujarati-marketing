import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Injected User API Keys
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {

    // Cinematic Center-to-Left Nav Trigger
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
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
        
        // Advanced Overlapping Hero
        const slideHtml = `
            <div class="slide" data-index="${index}">
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${imageSrc}" alt="Brand Imagery" loading="lazy">
                    </div>
                </div>
                <div class="slide-content">
                    <span class="slide-eyebrow">Vision 0${index + 1}</span>
                    <h2>${ad.banner_heading || 'Reach Further'}</h2>
                    <p>${ad.banner_text || 'A radical, fresh approach to putting your brand in front of the audiences that matter most.'}</p>
                </div>
            </div>
        `;
        carouselHTML += slideHtml;

        const logoSrc = ad.sponsor_logo_url || 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="${ad.bio_name}" loading="lazy">`;

        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="magnetic-btn btn">Launch Platform</a>`
            : `<a href="#" class="btn disabled">Unavailable</a>`;

        cardsHTML += `
            <div class="card tilt-card">
                <div class="glare"></div>
                <div class="card-content-wrapper">
                    <div class="card-header">
                        <h3>${ad.bio_name || 'Brand Identity'}</h3>
                        <h4>Verified</h4>
                    </div>
                    <p>"${ad.card_subtext || 'An elegant, highly-converting approach to digital growth.'}"</p>
                    <div class="card-footer">
                        ${buttonHTML}
                        <a href="${ad.social_link || '#'}" target="_blank" class="social-icon"><i class="${iconClass}"></i></a>
                    </div>
                </div>
            </div>
        `;
    });

    // Invisible clone for the hardware-accelerated loop
    if(ads.length > 0) {
        const cloneImageSrc = ads[0].banner_image_url || 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800';
        const firstSlideHTML = `
            <div class="slide clone">
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${cloneImageSrc}" alt="Brand Imagery" loading="lazy">
                    </div>
                </div>
                <div class="slide-content">
                     <span class="slide-eyebrow">Vision 01</span>
                    <h2>${ads[0].banner_heading || 'Reach Further'}</h2>
                    <p>${ads[0].banner_text || 'A radical, fresh approach to putting your brand in front of the audiences that matter most.'}</p>
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
    init3DTilt();
    initMagneticButtons();
}

function getSocialIcon(platform) {
    if(platform === 'IG') return 'fa-brands fa-instagram';
    if(platform === 'YT') return 'fa-brands fa-youtube';
    if(platform === 'X') return 'fa-brands fa-x-twitter';
    return 'fa-solid fa-arrow-up-right-dots';
}

function initSeamlessCarousel(realSlideCount) {
    const track = document.getElementById('carousel-track');
    let currentIndex = 0;
    const transitionStyle = 'transform 1.4s cubic-bezier(0.19, 1, 0.22, 1)'; 

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
                }, 1400); 
            }
        }, 6000); 
    }, 1000);
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

// ==========================================
// OUT OF THE BOX MICRO-INTERACTIONS
// ==========================================

// 1. Native 3D Tilt Effect for Cards
function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        const glare = card.querySelector('.glare');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation (max 10 degrees)
            const rotateX = ((y / rect.height) - 0.5) * -15;
            const rotateY = ((x / rect.width) - 0.5) * 15;
            
            card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Move Glare
            if(glare) {
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.6), transparent 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            if(glare) glare.style.opacity = '0';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition during hover for instant response
            if(glare) glare.style.opacity = '1';
        });
    });
}

// 2. Magnetic Buttons
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn');
    
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            
            // Move button slightly towards mouse
            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        magnet.addEventListener('mouseleave', () => {
            magnet.style.transform = 'translate(0px, 0px)';
        });
    });
}
