// Sample book data
const books = [
    { id: 1, title: "The Midnight Library", author: "Matt Haig", category: "fiction", status: "available", cover: "📚" },
    { id: 2, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "fantasy", status: "borrowed", cover: "⚡" },
    { id: 3, title: "The Silent Patient", author: "Alex Michaelides", category: "mystery", status: "available", cover: "🕵️" },
    { id: 4, title: "A Brief History of Time", author: "Stephen Hawking", category: "science", status: "available", cover: "🌌" },
    { id: 5, title: "Becoming", author: "Michelle Obama", category: "biography", status: "borrowed", cover: "👩" },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", category: "fantasy", status: "available", cover: "🐉" },
    { id: 7, title: "Where the Crawdads Sing", author: "Delia Owens", category: "fiction", status: "available", cover: "🐚" },
    { id: 8, title: "The Very Hungry Caterpillar", author: "Eric Carle", category: "children", status: "borrowed", cover: "🐛" },
    { id: 9, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "science", status: "available", cover: "🧠" },
    { id: 10, title: "The Girl on the Train", author: "Paula Hawkins", category: "mystery", status: "available", cover: "🚂" },
    { id: 11, title: "Educated", author: "Tara Westover", category: "biography", status: "borrowed", cover: "🎓" },
    { id: 12, title: "Goodnight Moon", author: "Margaret Wise Brown", category: "children", status: "available", cover: "🌙" }
];

// Sample borrowing history
let borrowingHistory = [
    { date: "2023-10-15", bookTitle: "Harry Potter and the Sorcerer's Stone", action: "borrowed", person: "Alex Johnson" },
    { date: "2023-10-10", bookTitle: "Becoming", action: "borrowed", person: "Sam Davis" },
    { date: "2023-10-05", bookTitle: "Educated", action: "borrowed", person: "Taylor Smith" },
    { date: "2023-10-03", bookTitle: "The Very Hungry Caterpillar", action: "borrowed", person: "Jamie Wilson" },
    { date: "2023-09-28", bookTitle: "The Hobbit", action: "returned", person: "Casey Brown" },
    { date: "2023-09-25", bookTitle: "Where the Crawdads Sing", action: "returned", person: "Jordan Miller" }
];

// DOM elements
const bookListElement = document.getElementById('bookList');
const categoryListElement = document.getElementById('categoryList');
const borrowingHistoryElement = document.getElementById('borrowingHistory');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const totalBooksElement = document.getElementById('totalBooks');
const availableBooksElement = document.getElementById('availableBooks');
const borrowedBooksElement = document.getElementById('borrowedBooks');
const categoriesCountElement = document.getElementById('categoriesCount');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayBooks(books);
    displayBorrowingHistory();
    updateStats();
    setupCategoryFilter();
    setupSearch();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Display books in the book list
function displayBooks(booksToDisplay) {
    bookListElement.innerHTML = '';
    
    if (booksToDisplay.length === 0) {
        bookListElement.innerHTML = '<p style="text-align: center; color: var(--dark-purple); font-size: 1.2rem;">No books found. Try a different search or category.</p>';
        return;
    }
    
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        const statusClass = book.status === 'available' ? 'available' : 'borrowed';
        const statusText = book.status === 'available' ? 'Available' : 'Borrowed';
        const buttonText = book.status === 'available' ? 'Borrow' : 'Return';
        const buttonClass = book.status === 'available' ? 'btn-borrow' : 'btn-return';
        
        bookCard.innerHTML = `
            <div class="book-cover">${book.cover}</div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <span class="book-category">${book.category}</span>
                <span class="book-status ${statusClass}">${statusText}</span>
                <div class="action-buttons">
                    <button class="btn ${buttonClass}" data-id="${book.id}">${buttonText}</button>
                </div>
            </div>
        `;
        
        bookListElement.appendChild(bookCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-borrow, .btn-return').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            toggleBookStatus(bookId);
        });
    });
}

// Toggle book status between available and borrowed
function toggleBookStatus(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;
    
    const book = books[bookIndex];
    const newStatus = book.status === 'available' ? 'borrowed' : 'available';
    
    // Update book status
    books[bookIndex].status = newStatus;
    
    // Add to borrowing history
    const action = newStatus === 'borrowed' ? 'borrowed' : 'returned';
    const person = newStatus === 'borrowed' ? 'Friend' : 'Me';
    const historyEntry = {
        date: new Date().toISOString().split('T')[0],
        bookTitle: book.title,
        action: action,
        person: person
    };
    
    borrowingHistory.unshift(historyEntry);
    
    // Update the display
    displayBooks(getFilteredBooks());
    displayBorrowingHistory();
    updateStats();
    
    // Show notification
    showNotification(`"${book.title}" has been ${action}!`);
}

// Display borrowing history
function displayBorrowingHistory() {
    borrowingHistoryElement.innerHTML = '';
    
    // Show only the most recent 10 history items
    const recentHistory = borrowingHistory.slice(0, 10);
    
    recentHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const actionIcon = entry.action === 'borrowed' ? 'fa-arrow-right' : 'fa-arrow-left';
        const actionColor = entry.action === 'borrowed' ? 'var(--primary-purple)' : 'var(--dark-purple)';
        
        historyItem.innerHTML = `
            <div class="history-date">
                <i class="fas fa-calendar-alt"></i> ${formatDate(entry.date)}
            </div>
            <div class="history-book">
                <i class="fas fa-book" style="color: ${actionColor};"></i> 
                "${entry.bookTitle}"
                <i class="fas ${actionIcon}" style="color: ${actionColor}; margin: 0 8px;"></i>
                by ${entry.person}
            </div>
            <div>
                <span style="background-color: ${entry.action === 'borrowed' ? '#f8d7da' : '#d4edda'}; 
                      color: ${entry.action === 'borrowed' ? '#721c24' : '#155724'}; 
                      padding: 3px 10px; border-radius: 15px; font-size: 0.9rem;">
                    ${entry.action === 'borrowed' ? 'Borrowed' : 'Returned'}
                </span>
            </div>
        `;
        
        borrowingHistoryElement.appendChild(historyItem);
    });
    
    // Show a message if there's no history
    if (recentHistory.length === 0) {
        borrowingHistoryElement.innerHTML = '<p style="text-align: center; color: var(--dark-purple);">No borrowing history yet.</p>';
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Update library statistics
function updateStats() {
    totalBooksElement.textContent = books.length;
    
    const availableCount = books.filter(book => book.status === 'available').length;
    availableBooksElement.textContent = availableCount;
    
    const borrowedCount = books.filter(book => book.status === 'borrowed').length;
    borrowedBooksElement.textContent = borrowedCount;
    
    // Count unique categories
    const categories = [...new Set(books.map(book => book.category))];
    categoriesCountElement.textContent = categories.length;
}

// Set up category filtering
function setupCategoryFilter() {
    categoryListElement.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            categoryListElement.querySelectorAll('li').forEach(li => {
                li.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get selected category
            const selectedCategory = this.getAttribute('data-category');
            
            // Filter and display books
            const filteredBooks = selectedCategory === 'all' 
                ? books 
                : books.filter(book => book.category === selectedCategory);
            
            displayBooks(filteredBooks);
        });
    });
}

// Set up search functionality
function setupSearch() {
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show books based on selected category
            const activeCategory = document.querySelector('.category-list li.active').getAttribute('data-category');
            const filteredBooks = activeCategory === 'all' 
                ? books 
                : books.filter(book => book.category === activeCategory);
            
            displayBooks(filteredBooks);
            return;
        }
        
        // Filter books by title or author
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
        
        displayBooks(filteredBooks);
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

// Get filtered books based on active category and search term
function getFilteredBooks() {
    const activeCategory = document.querySelector('.category-list li.active').getAttribute('data-category');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let filteredBooks = activeCategory === 'all' 
        ? books 
        : books.filter(book => book.category === activeCategory);
    
    if (searchTerm !== '') {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredBooks;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <i class="fas fa-book"></i> 
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Add a new book to the library (bonus feature)
function addNewBook(title, author, category, cover) {
    const newBook = {
        id: books.length + 1,
        title: title,
        author: author,
        category: category,
        status: "available",
        cover: cover || "📖"
    };
    
    books.push(newBook);
    displayBooks(getFilteredBooks());
    updateStats();
    
    // Show notification
    showNotification(`"${title}" has been added to your library!`);
}

// Example of how to use addNewBook function (you can call this from browser console)
// addNewBook("The Great Gatsby", "F. Scott Fitzgerald", "fiction", "🎩");