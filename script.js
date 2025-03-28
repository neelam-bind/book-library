document.addEventListener("DOMContentLoaded", () => {
    const url = 'https://api.freeapi.app/api/v1/public/books';
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const pageInfo = document.getElementById('pageInfo');
  
    let currentPage = 1;
    const limit = 10;
  
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
  
    // Update pagination buttons to update the display
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
      const booksContainer = document.getElementById('booksContainer');
      booksContainer.innerHTML = ''; 
  
      books.forEach(book => {
        const bookLink = document.createElement('a');          
        bookLink.target = "_self";
        
        // Create a container for the book details
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
        // Append the book element to the link, then the link to the container
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
  