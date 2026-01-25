function checkImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

const projects = [
    {
        id: 1,
        title: "Fall Winter 2021",
        desc: "Models: Alina, Tilen, Kim, Žan, Leilani<br><br>MUA: Lea Bole<br><br>Photographer: Rok Vrečer",
        folder: "2021 FALL_WINTER",
        featureImg: "img/MOOD FALL WINTER 2021.webp"
    },
    {
        id: 2,
        title: "Spring 2021",
        desc: "Models: Teja, Petra, Luka, Denis <br><br>Mateja, Klara, Matjaž, Nejc<br><br>MUA: Nina Burazor<br><br>Photographer: Rok Vrečer",
        folder: "2021 SPRING",
        featureImg: "img/MOOD SPRING 2021.webp"
    },
    {
        id: 3,
        title: "Summer 2021",
        desc: "Models: Marko, Sarah, Jaka, Ema<br><br>MUA: Maša Pavlič<br><br>Photographer: Rok Vrečer",
        folder: "2021 SUMMER",
        featureImg: "img/MOOD SUMMER 2021.webp"
    },
    {
        id: 4,
        title: "Fall Winter 2022",
        desc: "Models: Robin, Andjela, Aleksa, Sandro<br><br>MUA: Nina Burazor<br><br>Photographer: Rok Vrečer",
        folder: "2022 FALL_WINTER",
        featureImg: "img/MOOD FALL WINTER 2022.webp"
    },
    {
        id: 5,
        title: "Spring Summer 2022",
        desc: "Models: Katja, Sara, Marko, Jaka<br><br>MUA: Lea Bole<br><br>Photographer: Rok Vrečer",
        folder: "2022 SPRING_SUMMER",
        featureImg: "img/MOOD SPRING SUMMER 2022.webp"
    },
    {
        id: 6,
        title: "Spring Summer 2023",
        desc: "Models: Neža, Maša, Laura, Jaka, Luka, Mark<br><br>MUA: Lea Bole<br><br>Photographer: Rok Vrečer",
        folder: "2023 SPRING_SUMMER",
        featureImg: "img/MOOD SPRING SUMMER 2023.webp",
        video: "img/vid2.mp4"
    },
    {
        id: 7,
        title: "Spring Summer 2024",
        desc: "Models: Laura and Luka<br><br>MUA: Nina Butkovič<br><br>Photographer: Rok Vrečer",
        folder: "2024 SPRING_SUMMER",
        featureImg: "img/MOOD SPRING SUMMER 2024.webp"
    },
    {
        id: 8,
        title: "Summer 2025",
        desc: "Models: Laura and Luka<br><br>MUA: Lea Bole<br><br>Photographer: Rok Vrečer",
        folder: "2025 SPRING_SUMMER",
        featureImg: "img/MOOD SPRING SUMMER 2025.webp",
        video: "img/vid.mp4"
    }
];

let currentProjectImages = [];
let currentLightboxIndex = 0;

// Scroll logic for arrows
window.scrollGallery = (direction) => {
    const gallery = document.getElementById('gallery-scroll');
    const scrollAmount = window.innerWidth * 0.6; // Scroll 60% of screen width
    gallery.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
};

// Lightbox logic
window.openLightbox = (index) => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    currentLightboxIndex = index;
    lightbox.style.display = 'flex';
    lightboxImg.src = currentProjectImages[currentLightboxIndex];
};

window.changeLightboxImage = (direction) => {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentProjectImages.length - 1;
    if (currentLightboxIndex >= currentProjectImages.length) currentLightboxIndex = 0;
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = currentProjectImages[currentLightboxIndex];
};

window.closeLightbox = () => {
    document.getElementById('lightbox').style.display = 'none';
};

// Check if we are on the project page and load data
document.addEventListener('DOMContentLoaded', async () => {
    const projectView = document.getElementById('project-view');
    if (!projectView) return; // Not on project page

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    const data = projects.find(p => p.id === id);
    
    if (!data) {
        projectView.innerHTML = '<p>Project not found.</p>';
        return;
    }

    // Show loading state
    projectView.innerHTML = '<div style="text-align:center; padding: 4rem; font-size: 1.2rem;">Loading gallery...</div>';

    // Dynamically check for images (limit 50)
    const maxImages = 50;
    const imagePromises = [];
    for (let i = 1; i <= maxImages; i++) {
        const src = `img/${data.folder}/img (${i}).webp`;
        imagePromises.push(checkImage(src).then(exists => exists ? src : null));
    }
    const results = await Promise.all(imagePromises);
    data.images = results.filter(src => src !== null);

    currentProjectImages = data.images;

    // Build HTML dynamically
    projectView.innerHTML = `
        <a href="index.html" class="close-btn">&larr; Back to Portfolio</a>
        
        <div class="gallery-wrapper">
            <button class="scroll-arrow left" onclick="scrollGallery(-1)">&#8249;</button>
            <div class="scrolling-gallery" id="gallery-scroll">
                ${data.images.map((img, index) => `<img src="${img}" class="gallery-img" data-index="${index}" alt="Gallery Image" draggable="false">`).join('')}
            </div>
            <button class="scroll-arrow right" onclick="scrollGallery(1)">&#8250;</button>
        </div>

        <div class="split-section glass-panel" style="padding: 2rem;">
            <div class="split-left">
                <img src="${data.featureImg}" alt="Feature">
            </div>
            <div class="split-right">
                <div>
                    <h2>${data.title}</h2>
                    <p>${data.desc}</p>
                </div>
                ${data.video ? `<video controls class="project-video">
                    <source src="${data.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>` : ''}
            </div>
        </div>
    `;

    const gallery = document.getElementById('gallery-scroll');
    if (gallery) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging = false;

        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.classList.add('active');
            startX = e.pageX;
            scrollLeft = gallery.scrollLeft;
            isDragging = false;
        });

        document.addEventListener('mouseup', () => { 
            if(isDown) {
                isDown = false; 
                gallery.classList.remove('active'); 
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) isDragging = true; // If mouse moves more than 5px, it's a drag
            gallery.scrollLeft = scrollLeft - walk;
        });

        // Handle click vs drag for lightbox
        gallery.querySelectorAll('.gallery-img').forEach(img => {
            img.addEventListener('click', e => {
                if (isDragging) {
                    e.preventDefault();
                    return;
                }
                const index = parseInt(e.currentTarget.dataset.index);
                openLightbox(index);
            });
        });
    }
});