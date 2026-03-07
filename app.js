import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- REPLACE WITH YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://zxzlemixeecxyymydwsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emxlbWl4ZWVjeHl5bXlkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDAzODksImV4cCI6MjA4ODQ3NjM4OX0.ivIdCQEejXTDgtDqCM7zJHeTHg-uRqSRmKfBHD7Ft9U';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Developed by MYR");

document.addEventListener('DOMContentLoaded', async () => {
    // Top Navbar Reveal
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
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
        const imageSrc = ad.banner_image_url || 'https://via.placeholder.com/650x500/0A0A0A/FFFFFF?text=Premium';
        const slideHtml = `
            <div class="slide" data-index="${index}">
                <div class="slide-content">
                    <h2>${ad.banner_heading || 'Elite Marketing'}</h2>
                    <p>${ad.banner_text || 'Premium placement for visionary brands.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${imageSrc}" alt="Brand Imagery">
                    </div>
                </div>
            </div>
        `;
        carouselHTML += slideHtml;

        const logoSrc = ad.sponsor_logo_url || 'https://via.placeholder.com/180/0A0A0A/FFFFFF?text=Brand';
        sponsorsHTML += `<img src="${logoSrc}" class="sponsor-logo" alt="${ad.bio_name}">`;

        const iconClass = getSocialIcon(ad.social_platform);
        const buttonHTML = ad.product_link 
            ? `<a href="${ad.product_link}" target="_blank" class="btn">View Product</a>`
            : `<a href="#" class="btn disabled">Unavailable</a>`;

        cardsHTML += `
            <div class="card">
                <div class="card-header">
                    <h3>${ad.bio_name || 'Premium Brand'}</h3>
                    <h4>Featured Leader</h4>
                </div>
                <p>"${ad.card_subtext || 'Uncompromising excellence in the marketing space.'}"</p>
                <div class="card-footer">
                    <a href="${ad.social_link || '#'}" target="_blank" class="social-icon"><i class="${iconClass}"></i></a>
                    ${buttonHTML}
                </div>
            </div>
        `;
    });

    // SEAMLESS LOOP LOGIC: Clone the first slide and append it to the end
    if(ads.length > 0) {
        const firstSlideHTML = `
            <div class="slide clone">
                <div class="slide-content">
                    <h2>${ads[0].banner_heading || 'Elite Marketing'}</h2>
                    <p>${ads[0].banner_text || 'Premium placement for visionary brands.'}</p>
                </div>
                <div class="slide-visual">
                    <div class="img-wrapper">
                        <img src="${ads[0].banner_image_url || 'https://via.placeholder.com/650x500/0A0A0A/FFFFFF?text=Premium'}" alt="Brand Imagery">
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
    
    // Smooth cinematic transition variable
    const transitionStyle = 'transform 1s cubic-bezier(0.85, 0, 0.15, 1)';

    setTimeout(() => {
        setInterval(() => {
            currentIndex++;
            track.style.transition = transitionStyle;
            track.style.transform = `translateX(-${currentIndex * 100}vw)`;
            
            // Show scroll indicator after first slide moves
            if (currentIndex === 1) {
                scrollIndicator.classList.remove('hidden');
            }

            // If we reached the clone (which is at index = realSlideCount)
            if (currentIndex === realSlideCount) {
                // Wait for the slide transition to finish (1000ms)
                setTimeout(() => {
                    // Instantly snap back to the REAL first slide without animation
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0vw)`;
                }, 1000); 
            }
        }, 4000); 
    }, 1500);
}

// Cinematic Scroll Reveals with Staggering
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(reveal => observer.observe(reveal));
}
