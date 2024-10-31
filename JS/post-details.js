import { fetchPosts, fetchPostById } from "./fetchData.js";

let currentPage = 1;
const postsPerPage = 12;
let allPosts = [];
let filteredPosts = [];

async function fetchAllPosts() {
  try {
    allPosts = await fetchPosts();
    filteredPosts = allPosts; // Start med å vise alle innlegg
    displayPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function displayPosts() {
  const blogContainer = document.getElementById('blogContainer');
  const postCount = document.getElementById('postCount');
  const loadMoreButton = document.getElementById('loadMoreButton');

  const previousScrollPosition = window.pageYOffset;

  if (currentPage === 1) {
    blogContainer.innerHTML = "";
  }

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToShow = filteredPosts.slice(startIndex, endIndex);

  for (const post of postsToShow) {
    const detailedPost = await fetchPostById(post.id);
    const postElement = document.createElement('div');
    postElement.classList.add('blog-post');
    postElement.innerHTML = `
      <a href="./HTML/one-post.html?id=${detailedPost.id}">
        <img src="${detailedPost.media.url}" alt="${detailedPost.media.alt}">
        <h2>${detailedPost.title}</h2>
        <p>${new Date(detailedPost.created).toLocaleDateString()}</p>
        <p>${detailedPost.shortDescription}</p>
      </a>
    `;
    blogContainer.appendChild(postElement);
  }

  const displayedPosts = Math.min(currentPage * postsPerPage, filteredPosts.length);
  postCount.textContent = `You have looked at ${displayedPosts} of ${filteredPosts.length} posts`;

  if (displayedPosts >= filteredPosts.length) {
    loadMoreButton.style.display = 'none';
  } else {
    loadMoreButton.style.display = 'block';
  }

  window.scrollTo(0, previousScrollPosition);
}

document.getElementById('loadMoreButton').addEventListener('click', () => {
  currentPage++;
  displayPosts();
});

function applyFilter(filterType) {
  if (filterType === "newest") {
    filteredPosts = allPosts.slice().sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (filterType === "oldest") {
    filteredPosts = allPosts.slice().sort((a, b) => new Date(a.created) - new Date(b.created));
  } else if (filterType === "popular") {
    filteredPosts = allPosts.slice().sort((a, b) => b.popularity - a.popularity);
  }
  currentPage = 1; // Tilbakestill til første side
  displayPosts();
}

function applyContinentFilter(continent) {
  if (continent === "See all") {
    filteredPosts = allPosts; // Vis alle innlegg
  } else {
    filteredPosts = allPosts.filter(post => post.continent === continent);
  }
  currentPage = 1; // Tilbakestill til første side
  displayPosts();
}

// Hent innleggene og initialiser visningen
fetchAllPosts();

// Event listener for filtreringsknappene
document.getElementById("filterButton").addEventListener("click", function () {
  const filterOptions = document.getElementById("filterOptions");
  filterOptions.style.display = filterOptions.style.display === "block" ? "none" : "block";
});

document.querySelectorAll(".filter-options p").forEach(option => {
  option.addEventListener("click", function () {
    document.querySelectorAll(".filter-options p").forEach(p => p.classList.remove("active"));
    this.classList.add("active");

    const filterType = this.getAttribute("data-filter");
    applyFilter(filterType);

    // Skjul filtervalgene etter et valg
    document.getElementById("filterOptions").style.display = "none";
  });
});

// Event listener for kontinent-knappene
document.querySelectorAll(".filter-section .filter-btn").forEach(button => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".filter-section .filter-btn").forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");

    const continent = this.textContent.trim(); // Hent kontinent-navn fra knapp
    applyContinentFilter(continent);
  });
});

document.getElementById("hamburgerMenu").addEventListener("click", () => {
  const mobileFilterMenu = document.getElementById("mobileFilterMenu");
  mobileFilterMenu.classList.toggle("active");
});
