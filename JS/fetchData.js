const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVG9uamVfQWxiZXJ0aW4iLCJlbWFpbCI6InRvbmFsYjAwMTg3QHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzMwMTMwNTQzfQ.3avjD1bkEu89NQIh6t5BYOAxYXD1UI-gJ03v4TVHTiA";

export async function fetchPosts() {
  try {
    const response = await fetch('https://v2.api.noroff.dev/blog/posts/Tonje_Albertin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from API:", errorResponse); 
      throw new Error("Error fetching data from API.");
    }

    const data = await response.json();
    
    return data.data.map(post => ({
      ...post,
      created: post.created ? new Date(post.created) : generateRandomDate(new Date(2022, 0, 1), new Date()),
      popularity: generateRandomPopularity(),
      continent: mapCountryToContinent(post.title),
      shortDescription: truncateText(post.body, 100),
      media: post.media || { url: 'default.jpg', alt: 'Default image' }
    }));
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return [];
  }
}

export async function fetchPostById(postId) {
  try {
    const url = `https://v2.api.noroff.dev/blog/posts/Tonje_Albertin/${postId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from API:", errorResponse);
      throw new Error("Error fetching post data from API.");
    }

    const result = await response.json();
    const post = result.data;
    

    return {
      ...post,
      created: post.created ? new Date(post.created) : generateRandomDate(new Date(2022, 0, 1), new Date()),
      popularity: generateRandomPopularity(),
      continent: mapCountryToContinent(post.title),
      fullDescription: post.body, 
      media: post.media || { url: 'default.jpg', alt: 'Default image' }
    };
  } catch (error) {
    console.error("Error fetching post:", error.message);
    return null;
  }
}


function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function generateRandomPopularity() {
  return Math.floor(Math.random() * 100) + 1;
}

function mapCountryToContinent(title) {
  const continentMapping = {
    "Marrakech, Morocco": "Africa",
    "Cairo, Egypt": "Africa",
    "Zanzibar, Tanzania": "Africa",
    "Victoria Falls, Zambia": "Africa",
    "Fez, Morocco": "Africa",
    "Kilimanjaro, Tanzania": "Africa",
    "Okavango Delta, Botswana": "Africa",
    "Bangkok, Thailand": "Asia",
    "Tokyo, Japan": "Asia",
    "Bali, Indonesia": "Asia",
    "Phuket, Thailand": "Asia",
    "Hanoi, Vietnam": "Asia",
    "Siem Reap, Cambodia": "Asia",
    "Maldives, Maldives": "Asia",
    "Goa, India": "Asia",
    "Kathmandu, Nepal": "Asia",
    "Kuala Lumpur, Malaysia": "Asia",
    "Taipei, Taiwan": "Asia",
    "Seoul, South Korea": "Asia",
    "Abu Dhabi, United Arab Emirates": "Asia",
    "Istanbul, Turkey": "Europe",
    "Rome, Italy": "Europe",
    "Santorini, Greece": "Europe",
    "Barcelona, Spain": "Europe",
    "Geirangerfjord, Norway": "Europe",
    "Lofoten, Norway": "Europe",
    "Bucharest, Romania": "Europe",
    "Belgrade, Serbia": "Europe",
    "Mostar, Bosnia and Herzegovina": "Europe",
    "Kotor, Montenegro": "Europe",
    "Kraków, Poland": "Europe",
    "New York City, USA": "North America",
    "Los Angeles, USA": "North America",
    "Cancún, Mexico": "North America",
    "Montreal, Canada": "North America",
    "Miami, USA": "North America",
    "Rio de Janeiro, Brazil": "South America",
    "Buenos Aires, Argentina": "South America",
    "Machu Picchu, Peru": "South America",
    "Cartagena, Colombia": "South America",
    "Santiago, Chile": "South America",
    "Fiji (Coral Coast), Fiji": "Oceania",
    "Sydney, Australia": "Oceania",
    "Bora Bora, French Polynesia": "Oceania",
    "Queenstown, New Zealand": "Oceania",
    "Auckland, New Zealand": "Oceania",
    "Uluru, Australia": "Oceania"
  };

  return continentMapping[title] || "Unknown";
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
