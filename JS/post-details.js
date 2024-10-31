import { fetchPostById } from "./fetchData.js";

async function displayPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id"); // Henter ID fra URL-en
  
  if (!postId) {
    console.error("Post ID is missing in the URL.");
    document.getElementById("blogContainer").innerHTML = "<p>Error: Post ID is missing.</p>";
    return;
  }

  try {
    const post = await fetchPostById(postId);
    
    if (!post) {
      document.getElementById("blogContainer").innerHTML = "<p>Error: Post not found.</p>";
      return;
    }

    document.getElementById("blogContainer").innerHTML = `
      <article class="single-post">
        <img src="${post.media.url}" alt="${post.media.alt}">
        <h2>${post.title}</h2>
        <p><em>Published on: ${new Date(post.created).toLocaleDateString()}</em></p>
        <p>${post.fullDescription}</p>
      </article>
    `;
  } catch (error) {
    console.error("Error fetching the post:", error);
    document.getElementById("blogContainer").innerHTML = "<p>Error loading post data.</p>";
  }
}

displayPost();