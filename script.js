document.addEventListener("DOMContentLoaded", () => {
  const url = 'https://api.freeapi.app/api/v1/public/books';
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const pageInfo = document.getElementById('pageInfo');
  const viewToggleBtn = document.getElementById('viewToggle');
  const booksContainer = document.getElementById('booksContainer');

  let currentPage = 1;
  let isGridView = true; // start with grid view
  
  // Initially, set container to grid view
  booksContainer.classList.add('grid-view');

  // Toggle view event listener
  viewToggleBtn.addEventListener('click', () => {
    if (isGridView) {
      // Switch to list view: remove grid layout and add list layout
      booksContainer.classList.remove('grid-view');
      booksContainer.classList.add('list-view');
      // Change button text so user knows clicking again switches to grid view
      viewToggleBtn.textContent = 'Grid View';
      isGridView = false;
    } else {
      // Switch to grid view: remove list layout and add grid layout
      booksContainer.classList.remove('list-view');
      booksContainer.classList.add('grid-view');
      viewToggleBtn.textContent = 'List View';
      isGridView = true;
    }
  });

  async function getBooks(currentPage) {
    try {  
      const response = await fetch(`${url}?page=${currentPage}`);
      const data = await response.json();
      console.log(data.data);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  nextBtn.addEventListener('click', () => {
    currentPage++;
    getBooks(currentPage).then(data => {
      displayBooks(data);
    });
    pageInfo.innerHTML = `<p>${currentPage}</p>`;
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      pageInfo.innerHTML = `<p>${currentPage}</p>`;
      getBooks(currentPage).then(data => {
        displayBooks(data);
      });
    }
  });

  // Initial fetch 
  getBooks(currentPage).then(data => {
    displayBooks(data);
  });

  // Display the books in the DOM
  function displayBooks(data) {
    const books = data.data.data; 
    booksContainer.innerHTML = ''; 

    books.forEach(book => {
      const bookLink = document.createElement('a');          
      bookLink.target = "_self";
      
      const bookElement = document.createElement('div');
      bookElement.classList.add('book');
      const rating = book.volumeInfo.averageRating;
      const ratingStars = rating ? '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(rating)) : 'N/A';
      bookElement.innerHTML = `
        <img src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="${book.volumeInfo.title}">
        <h2>${book.volumeInfo.title}</h2>
        <p>Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
        <p>Published: ${book.volumeInfo.publishedDate || 'N/A'}</p>
        <p>Ratings: ${ratingStars}</p>
      `;
      
      bookLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem("selectedBook", JSON.stringify(book));
        window.location.href = "bookDetails.html";
      });
      
      bookLink.appendChild(bookElement);
      booksContainer.appendChild(bookLink);
    });
  }

  // Search function
  const searchInput = document.getElementById('search-bar');    
  searchInput.addEventListener('input', (input) => {
    const searchQuery = input.target.value.toLowerCase();
    
    getBooks(currentPage)
      .then(data => {
        const books = data.data.data;
        const filteredBooks = books.filter(book => {
          const title = book.volumeInfo.title.toLowerCase();
          const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ').toLowerCase() : 'unknown';
          return title.includes(searchQuery) || authors.includes(searchQuery);
        });
        displayBooks({ data: { data: filteredBooks } });
      })
      .catch(error => console.error('Error filtering books:', error));
  });
});
