// Getting the main page elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const bookList = document.getElementById('bookList');
const message = document.getElementById('message');

const genreFilter = document.getElementById('genreFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const sortSelect = document.getElementById('sortSelect');

// Stores the books returned by the backend
let currentBooks = [];

// Adds the available genres to the genre dropdown
const updateGenreOptions = (books) => {
    const genres = [
        ...new Set(
            books
                .map((book) => book.genre)
                .filter((genre) => genre)
        )
    ].sort();

    genreFilter.innerHTML = '<option value="">All genres</option>';

    genres.forEach((genre) => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
};

// Shows the books on the page
const displayBooks = (books) => {
    bookList.innerHTML = '';
    message.textContent = '';

    // If there are no matching books, show a message
    if (books.length === 0) {
        message.textContent = 'No books found.';
        return;
    }

    // Create one card for each book
    books.forEach((book) => {
        const card = document.createElement('div');
        card.classList.add('book-card');

        // Showing the book information
        card.innerHTML = `
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre || 'Not specified'}</p>
            <p><strong>Availability:</strong> ${book.available ? 'Available' : 'Unavailable'}</p>
        `;

        // Add the card to the page
        bookList.appendChild(card);
    });
};

// Applies the selected filters and sorting
const applyFiltersAndSorting = () => {
    let booksToDisplay = [...currentBooks];

    const selectedGenre = genreFilter.value;
    const selectedAvailability = availabilityFilter.value;
    const selectedSort = sortSelect.value;

    // Filter books by genre
    if (selectedGenre) {
        booksToDisplay = booksToDisplay.filter(
            (book) => book.genre === selectedGenre
        );
    }

    // Filter books by availability
    if (selectedAvailability === 'available') {
        booksToDisplay = booksToDisplay.filter(
            (book) => book.available === true
        );
    }

    if (selectedAvailability === 'unavailable') {
        booksToDisplay = booksToDisplay.filter(
            (book) => book.available === false
        );
    }

    // Sort books using the selected option
    if (selectedSort === 'title-asc') {
        booksToDisplay.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    if (selectedSort === 'title-desc') {
        booksToDisplay.sort((a, b) =>
            b.title.localeCompare(a.title)
        );
    }

    if (selectedSort === 'author-asc') {
        booksToDisplay.sort((a, b) =>
            a.author.localeCompare(b.author)
        );
    }

    displayBooks(booksToDisplay);
};

// This function loads books from our backend API
const loadBooks = async (searchTerm = '') => {
    try {
        // Show a loading message while we wait for the server
        message.textContent = 'Loading books...';

        // Clear old book results before showing new ones
        bookList.innerHTML = '';

        // Build the API URL
        let url = '/api/books';

        // If the user searched for something, add it to the URL
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        // Ask the backend for the books
        const response = await fetch(url);

        // If the server gives an error, stop here
        if (!response.ok) {
            throw new Error('Unable to load books');
        }

        // Convert the response into JavaScript data
        const books = await response.json();

        currentBooks = books;

        // Add the genres returned by the backend to the filter
        updateGenreOptions(books);

        // Display the books using the selected filters and sorting
        applyFiltersAndSorting();

    } catch (error) {
        // Show a simple error message if something goes wrong
        message.textContent = 'Unable to load books. Please try again.';
        console.error(error);
    }
};

// When the search button is clicked, search using the typed text
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    loadBooks(searchTerm);
});

// Also allow the Enter key to search
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        loadBooks(searchTerm);
    }
});

// Apply filters whenever a filter option changes
genreFilter.addEventListener('change', applyFiltersAndSorting);
availabilityFilter.addEventListener('change', applyFiltersAndSorting);
sortSelect.addEventListener('change', applyFiltersAndSorting);

// Load all books when the page first opens
loadBooks();