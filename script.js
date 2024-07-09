const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResults = document.getElementById("search-results");
const moreBtn = document.querySelector("#showMore > button");

let keyword = "";
let page = 1;
const apiKey = "vO2pwVWCEVG64XSTj4aKLLMPrOw1H461jwVI65nAEZA";


// Function to set liked images to local storage
const setLikedImages = (likedImages) => {
  localStorage.setItem("likedImages", JSON.stringify(likedImages));
};

// Function to get liked images from local storage
const getLikedImages = () => {
  return JSON.parse(localStorage.getItem("likedImages")) || [];
};

const searchImage = async () => {
  keyword = searchBox.value.trim();
  if (keyword === "") {
    searchResults.innerHTML = "";
    moreBtn.style.display = "none";
    return;
  }
  try{
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${apiKey}&per_page=12`;
  const response = await fetch(url);
  const data = await response.json();
  const result = data.results;

  if (page === 1) {
    searchResults.innerHTML = ""; // Clear previous results for a new search
  }

  const likedImages = getLikedImages(); // Get liked images from local storage

  result.forEach((elm) => {
    const img = document.createElement("img");
    img.src = elm.urls.small;

    const imageLink = document.createElement("a");
    imageLink.href = elm.links.html;
    imageLink.target = "_blank";
    imageLink.appendChild(img);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      imageContainer.remove();
    });

    // Create like button and set its initial state
    const likeButton = document.createElement("button");
    likeButton.classList.add("likeBtn");
    const isLiked = likedImages.includes(elm.id); // Check if image is liked
    likeButton.innerHTML = isLiked
      ? `<i class="fa-solid fa-heart"></i>` // Filled heart if liked
      : `<i class="fa-regular fa-heart"></i>`; // Empty heart if not liked
    likeButton.addEventListener("click", () => {
      if (likedImages.includes(elm.id)) {
        // If image is already liked, remove it from likedImages
        likedImages.splice(likedImages.indexOf(elm.id), 1);
        likeButton.innerHTML = `<i class="fa-regular fa-heart"></i>`; // Set to empty heart
      } else {
        // If image is not liked, add it to likedImages
        likedImages.push(elm.id);
        likeButton.innerHTML = `<i class="fa-solid fa-heart"></i>`; // Set to filled heart
      }
      setLikedImages(likedImages); // Save updated likedImages to local storage
    });

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageContainer.appendChild(imageLink);
    imageContainer.appendChild(deleteButton);
    imageContainer.appendChild(likeButton);
    searchResults.appendChild(imageContainer);
  });

  if (result.length > 0) {
    moreBtn.style.display = "block"; // Show the "Show More" button if there are results
  } else {
    moreBtn.style.display = "none"; // Hide the "Show More" button if there are no results
  }
}catch(error){
  console.error("Error fetching images:", error);
  searchResults.innerHTML = "<p>An error occurred while fetching images. Please try again later.</p>";
  moreBtn.style.display = "none";
}
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImage();
});

moreBtn.addEventListener("click", () => {
  page++;
  searchImage();
});
