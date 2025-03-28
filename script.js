document.addEventListener("DOMContentLoaded", () => {
  const url = "https://api.freeapi.app/api/v1/public/books";
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const pageInfo = document.getElementById("pageInfo");
  const viewToggleBtn = document.getElementById("viewToggle");
  const booksContainer = document.getElementById("booksContainer");
  const searchInput = document.getElementById("search-bar");
  const sortSelect = document.getElementById("sortSelect"); // Sorting dropdown

  let currentPage = 1;
  let isGridView = true;
  let booksData = []; // Store fetched books for sorting

  booksContainer.classList.add("grid-view");

  viewToggleBtn.addEventListener("click", () => {
    booksContainer.classList.toggle("grid-view");
    booksContainer.classList.toggle("list-view");
    isGridView = !isGridView;                                   //toggle
    viewToggleBtn.textContent = isGridView ? "List View" : "Grid View";
  });

  async function getBooks(page) {
    try {
      const response = await fetch(`${url}?page=${page}`);
      const data = await response.json();
      booksData = data.data.data || [];
      displayBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  function displayBooks(books) {
    booksContainer.innerHTML = "";

    books.forEach((book) => {
      const bookLink = document.createElement("a");
      bookLink.target = "_self";

      const bookElement = document.createElement("div");
      bookElement.classList.add("book");

      const rating = book.volumeInfo.averageRating;
      const ratingStars = rating
        ? '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(rating))
        : "N/A";

      bookElement.innerHTML = `
        <img src="${book.volumeInfo.imageLinks?.smallThumbnail || "placeholder.jpg"}" alt="${book.volumeInfo.title}">
        <h2>${book.volumeInfo.title}</h2>
        <p>Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown"}</p>
        <p>Published: ${book.volumeInfo.publishedDate || "N/A"}</p>
        <p>Ratings: ${ratingStars}</p>
      `;

      bookLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("selectedBook", JSON.stringify(book));
        window.location.href = "bookDetails.html";
      });

      bookLink.appendChild(bookElement);
      booksContainer.appendChild(bookLink);
    });
  }

  nextBtn.addEventListener("click", () => {
    currentPage++;
    getBooks(currentPage);
    pageInfo.innerHTML = `<p>${currentPage}</p>`;
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      getBooks(currentPage);
      pageInfo.innerHTML = `<p>${currentPage}</p>`;
    }
  });

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredBooks = booksData.filter((book) => {
      const title = book.volumeInfo.title.toLowerCase();
      const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ").toLowerCase() : "unknown";
      return title.includes(query) || authors.includes(query);
    });
    displayBooks(filteredBooks);
  });

  // Sorting Functionality
  sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;
    let sortedBooks = [...booksData];

    if (sortBy === "title") {
      sortedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
    } else if (sortBy === "date") {
      sortedBooks.sort((a, b) => (a.volumeInfo.publishedDate > b.volumeInfo.publishedDate ? 1 : -1));
    }

    displayBooks(sortedBooks);
  });

  getBooks(currentPage);
});
