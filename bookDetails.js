document.addEventListener("DOMContentLoaded", () => {
    const bookData = localStorage.getItem("selectedBook");
    if (bookData) {
      const book = JSON.parse(bookData);
      displayBookDetails(book);
    } else {
      document.getElementById("book-detail").innerHTML = "<p>No book details available.</p>";
    }
  });
  
  function displayBookDetails(book) {
    const container = document.getElementById("book-detail");
    console.log(book);
    container.innerHTML = `
  <h1>${book.volumeInfo.title ?? 'No Title Available'}</h1>
  <img src="${book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'}" alt="${book.volumeInfo.title || 'No title'}">
  <p><strong>Author:</strong> ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
  <p><strong>Published:</strong> ${book.volumeInfo.publishedDate || 'N/A'}</p>
  <p><strong>Pages:</strong> ${book.volumeInfo.pageCount || 'N/A'}</p>
  <p><strong>Publisher:</strong> ${book.volumeInfo.publisher || 'N/A'}</p>
  <p><strong>Language:</strong> ${book.volumeInfo.language || 'N/A'}</p>
  <p><strong>Description:</strong> ${book.volumeInfo.description || 'No description available.'}</p>
`;
  }
  