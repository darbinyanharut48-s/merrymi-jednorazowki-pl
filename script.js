window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 500);
});

function syncHeaderHeight() {
    const header = document.getElementById('header');
    if (!header) return;
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.addEventListener('load', syncHeaderHeight);
window.addEventListener('resize', syncHeaderHeight);

// Reveal Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Ensure image loading attributes are applied without changing markup structure.
document.addEventListener('DOMContentLoaded', () => {
    const heroImage = document.querySelector('.main-ninja');
    const promoBannerImage = document.querySelector('.promo-banner-image');
    syncHeaderHeight();
    document.querySelectorAll('img').forEach((img) => {
        img.decoding = 'async';
        if (img === heroImage || img === promoBannerImage) {
            img.loading = 'eager';
        } else {
            img.loading = 'lazy';
        }
    });
});

// Parallax Effect for Hero
document.addEventListener('mousemove', (e) => {
    const amount = 30;
    const x = (e.clientX - window.innerWidth / 2) / amount;
    const y = (e.clientY - window.innerHeight / 2) / amount;

    const ninja = document.querySelector('.main-ninja');
    const stats = document.querySelectorAll('.floating-stat');

    if (ninja) ninja.style.transform = `translate(${x}px, ${y}px)`;

    stats.forEach((stat, i) => {
        const ratio = (i + 1) * 2;
        stat.style.transform = `translate(${-x * ratio}px, ${-y * ratio}px) translateY(${Math.sin(Date.now() / 1000) * 10}px)`;
    });
});

// Community Info Slider Logic
const infoSlider = document.getElementById('infoSlider');
const infoCards = infoSlider ? Array.from(infoSlider.children) : [];
const infoNext = document.getElementById('infoNext');
const infoPrev = document.getElementById('infoPrev');
const infoDotsContainer = document.getElementById('infoDots');

let infoCurrentIndex = 0;
let infoStartX = 0;
let infoIsDragging = false;

if (infoCards.length > 0) {
    // Initialize dots
    infoCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('info-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToInfoSlide(i));
        let marker = document.body.offsetWidth < 760 ? 5 : document.body.offsetWidth > 1010 ? 3 : 4
        if (i < marker) {

            infoDotsContainer.appendChild(dot);
        }
    });

    const infoDots = Array.from(infoDotsContainer.children);

    function updateInfoSlider() {
        if (!infoSlider || infoCards.length === 0) return;

        const cardWidth = infoCards[0].getBoundingClientRect().width;
        const gap = window.innerWidth > 768 ? 32 : 24;
        const slideWidth = cardWidth + gap;

        infoSlider.style.transform = `translateX(${-infoCurrentIndex * slideWidth}px)`;

        infoDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === infoCurrentIndex);
        });
    }

    function goToInfoSlide(index) {
        const visibleSlides = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        const maxIndex = Math.max(0, infoCards.length - visibleSlides);

        infoCurrentIndex = Math.max(0, Math.min(index, maxIndex));
        updateInfoSlider();
    }

    infoNext.addEventListener('click', () => {
        const visibleSlides = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        const maxIndex = Math.max(0, infoCards.length - visibleSlides);

        if (infoCurrentIndex < maxIndex) {
            goToInfoSlide(infoCurrentIndex + 1);
        } else {
            goToInfoSlide(0); // Loop back to start
        }
    });

    infoPrev.addEventListener('click', () => {
        if (infoCurrentIndex > 0) {
            goToInfoSlide(infoCurrentIndex - 1);
        } else {
            const visibleSlides = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            const maxIndex = Math.max(0, infoCards.length - visibleSlides);
            goToInfoSlide(maxIndex); // Loop to end
        }
    });

    // Touch Events
    infoSlider.addEventListener('touchstart', (e) => {
        infoStartX = e.touches[0].clientX;
        infoIsDragging = true;
    });

    infoSlider.addEventListener('touchmove', (e) => {
        if (!infoIsDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = infoStartX - currentX;

        if (Math.abs(diff) > 60) {
            if (diff > 0) {
                infoNext.click();
            } else {
                infoPrev.click();
            }
            infoIsDragging = false;
        }
    });

    infoSlider.addEventListener('touchend', () => {
        infoIsDragging = false;
    });

    // Update on resize
    window.addEventListener('resize', updateInfoSlider);

    // Initial update
    window.addEventListener('load', updateInfoSlider);
}

// Staggered Review Animation
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.reveal-stagger').forEach(el => staggerObserver.observe(el));

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    function openMenu() {
        mobileMenu.classList.add('is-open');
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('nav-open');
    }

    function closeMenu() {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
    }

    // Toggle menu on hamburger click
    menuToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on close button click, if the optional close button exists.
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });
});



const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");
city.addEventListener("click", toggleCont);
function toggleCont() {
    city.classList.toggle("active");
    Array.from(cont).forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}



// Age verification modal
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
    if (localStorage.getItem("ageConfirmed") != "true") {
        ageModal.style.display = "flex";
    } else {
        ageModal.style.display = "none";
    }
});

yesBtn.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    ageModal.style.display = "none";
});

noBtn.addEventListener("click", () => {
    alert("Dostęp zabroniony. Strona tylko dla osób 18+");
    window.close();
    window.location.href = "https://www.google.pl";
});

