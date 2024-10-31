import { fetchPosts, fetchPostById } from "./fetchData.js";

let allPosts = [];
let carouselPosts = [];
let currentIndex = 0;

async function displayLatestPosts() {
    allPosts = await fetchPosts();
    const blogContainer = document.getElementById('blogContainer');

    if (blogContainer) {
        blogContainer.innerHTML = '';
        const latestPosts = allPosts
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .slice(0, 12);

        for (const post of latestPosts) {
            const detailedPost = await fetchPostById(post.id);
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <a href="./HTML/one-post.html?id=${detailedPost.id}">
                    <img src="${detailedPost.media.url}" alt="${detailedPost.media.alt}">
                    <h2>${detailedPost.title}</h2>
                </a>
            `;
            blogContainer.appendChild(postElement);
        }
    }
}

async function displayPopularPosts() {
    const popularPosts = allPosts
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3);

    const popularContainer = document.querySelector('.popular-posts');
    if (popularContainer) {
        popularContainer.innerHTML = '';

        for (const post of popularPosts) {
            const detailedPost = await fetchPostById(post.id);
            const postElement = document.createElement('div');
            postElement.classList.add('popular-post');
            postElement.innerHTML = `
                <a href="./HTML/one-post.html?id=${detailedPost.id}">
                    <img src="${detailedPost.media.url}" alt="${detailedPost.media.alt}">
                    <h2>${detailedPost.title}</h2>
                    <p>${detailedPost.shortDescription}</p>
                </a>
            `;
            popularContainer.appendChild(postElement);
        }
    }
}

async function getLatestPostsForCarousel() {
    const latestPosts = allPosts
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 3);

    const carouselData = [];
    for (const post of latestPosts) {
        const detailedPost = await fetchPostById(post.id);
        if (detailedPost) {
            carouselData.push(detailedPost);
        } else {
            console.warn(`Post with ID ${post.id} could not be fetched`);
        }
    }
    return carouselData;
}

async function renderCarousel() {
    carouselPosts = await getLatestPostsForCarousel();

    if (carouselPosts.length === 0) {
        console.error("Ingen innlegg tilgjengelige for karusellen.");
        return;
    }

    const mainImageContainer = document.querySelector('.dynamic-carousel-container .main-image');
    const introduce = document.querySelector('.dynamic-carousel-container .introduce');
    const ordinalNumber = document.querySelector('.dynamic-carousel-container .ordinal-number h2');


    if (!mainImageContainer || !introduce || !ordinalNumber) {
        console.error("Ett eller flere nødvendige karusellelementer mangler i HTML-en.");
        return;
    }

    const currentPost = carouselPosts[currentIndex];
    

    if (!currentPost || !currentPost.media || !currentPost.media.url) {
        console.error("Current post data is missing required fields");
        mainImageContainer.innerHTML = "Error loading image";
        return;
    }

    mainImageContainer.classList.remove("show");
    mainImageContainer.innerHTML = "Loading...";

    setTimeout(() => {
        mainImageContainer.style.backgroundImage = currentPost.media.url
            ? `url(${currentPost.media.url})`
            : "url('default.jpg')";
        
        mainImageContainer.innerHTML = "";
        introduce.querySelector('.continent').textContent = currentPost.continent || "Ukjent";
        introduce.querySelector('.place').textContent = currentPost.title || "Uten tittel";
        introduce.querySelector('.describe').textContent = currentPost.shortDescription || "No description available";
        ordinalNumber.textContent = `0${currentIndex + 1}`;

        mainImageContainer.onclick = () => {
            window.location.href = `./HTML/one-post.html?id=${currentPost.id}`;
        };

        mainImageContainer.classList.add("show");
    }, 100);
}




function showNextSlide() {
    currentIndex = (currentIndex + 1) % carouselPosts.length;
    renderCarousel();
}

function showPreviousSlide() {
    currentIndex = (currentIndex - 1 + carouselPosts.length) % carouselPosts.length;
    renderCarousel();
}

function startCarousel() {
    renderCarousel();

    const nextButton = document.querySelector('.dynamic-carousel-container .carousel-btn.next');
    const prevButton = document.querySelector('.dynamic-carousel-container .carousel-btn.prev');

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', showNextSlide);
        prevButton.addEventListener('click', showPreviousSlide);
    } else {
        console.error("Navigeringsknappene for karusellen finnes ikke.");
    }
}



document.addEventListener("DOMContentLoaded", async () => {
    await displayLatestPosts();
    await displayPopularPosts();
    startCarousel();
});
