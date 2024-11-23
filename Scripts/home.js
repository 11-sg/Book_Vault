let allBooks = []; // Store all books globally
let availableBooks = []; // Store available books titles globally

// Function to fetch all books from the server
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books');
        allBooks = await response.json(); // Store the fetched books
        await fetchAvailability(); // Fetch availability and merge with books
        displaysearch(allBooks); // Display all books initially
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Failed to fetch books. Please try again later.');
    }
}

// Function to fetch available books data from available.json file
// Function to fetch available books data from available.json file
async function fetchAvailability() {
    try {
        const response = await fetch('/node/not_available.json'); // Path to available.json file
        const data = await response.json(); // Get the available books
        availableBooks = data.books.map(book => book.title); // Assuming "available" is an array of titles

        // Merge availability status into the books dataset
        allBooks = allBooks.map(book => ({
            ...book,
            availability: availableBooks.includes(book.title) ? 'No' : 'Yes' // Check availability status

        }));

    } catch (error) {
        console.error('Error fetching availability:', error);
        alert('Failed to load availability data.');
    }
}

// Function to display the fetched books in a table
// function displayBooks(books) {
//     const tableBody = document.querySelector('#books-table tbody');
//     tableBody.innerHTML = ''; 

//     books.forEach(book => {
//         const bookElement = document.createElement('tr');
//         bookElement.innerHTML = `
//             <td>${book.title}</td>
//             <td>${book.author}</td>
//             <td>${book.genre}</td>
//             <td>${book.description}</td>
//             <td>${book.availability}</td> <!-- Display availability -->
//         `;
//         tableBody.appendChild(bookElement);
//     });
// }
// function displaysearch(books) {
//     const tableBody = document.querySelector('#books-table tbody');
//     tableBody.innerHTML = ''; // Clear previous entries

//     books.forEach(book => {
//         const imageURL = book.image;
//         document.getElementById('image').innerHTML = `<img src="${imageURL}" alt="Sample Image" style="width: 150px; height: 150px;">`;
//         document.querySelector('#title').innerHTML = book.title
//         document.querySelector('#author').innerHTML = book.author
//         document.querySelector('#genre').innerHTML = book.genre
//         document.querySelector('#descrption').innerHTML = book.description
//         document.querySelector('#availability').innerHTML = "Available : " + (availableBooks.includes(book.title) ? 'No' : 'Yes');
//     });
// }

function displaysearch(books) {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }
    
    resultsContainer.innerHTML = ''; // Clear previous results

    if (books.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 20px;">
                <p style="color: #666; font-size: 1.1em;">No books found matching your search criteria.</p>
            </div>`;
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.style.cssText = 'border: 1px solid #ccc; padding: 15px; margin: 10px; width: 300px; display: inline-block; text-align: left; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        
        bookCard.innerHTML = `
            <img src="${book.image || 'placeholder.jpg'}" alt="${book.title}" 
                style="width: 100%; height: auto; object-fit: cover; margin-bottom: 10px; border-radius: 4px;">
            <h3 style="margin: 10px 0; color: #333;">${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Description:</strong> ${book.description}</p>
            <p style="color: ${book.availability === 'Yes' ? 'green' : 'red'};">
                <strong>Availability:</strong> ${book.availability}
            </p>
        `;
        
        resultsContainer.appendChild(bookCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded. Checking sign-in status...');
    checkSignInStatus();
    fetchBooks();

     // Attach event listener for the search button
     const searchButton = document.getElementById('search-form');
     if (searchButton) {
         searchButton.addEventListener('submit', handleSearch); // Bind the click event
     }
});


// Handle the search form submission and filter the books
function handleSearch(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    console.log('Search query:', query); 
    // const foundBook = allBooks.find(book => book.title.toLowerCase().includes(query));

    // const imageURL = foundBook.image; // Replace with your image URL
    // Filter books based on the search query

    // document.querySelector('#books-table').innerHTML = '';
    // document.getElementById('image').innerHTML = `<img src="${imageURL}" alt="Sample Image" style="width: 150px; height: 150px;">`;
    // document.querySelector('#title').innerHTML = foundBook.title
    // document.querySelector('#author').innerHTML = foundBook.author
    // document.querySelector('#genre').innerHTML = foundBook.genre
    // document.querySelector('#availability').innerHTML = "Available : " + (availableBooks.includes(foundBook.title) ? 'No' : 'Yes');

    const filteredBooks = allBooks.filter(book => {

        console.log('Book:', book);
        return(
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
        );
    });

    console.log('Filtered Books:', filteredBooks);
    document.querySelector('#results-container').innerHTML = '';
    displaysearch(filteredBooks); // Display filtered books
}



// Function to check the sign-in status of the user
function checkSignInStatus() {
    const user = JSON.parse(localStorage.getItem('user'));

    const navMenu = document.getElementById('nav-menu');
    const signInButton = navMenu.querySelector('button');
    const signOutButton = navMenu.querySelector('.signed-in');

    if (user) {
        // User is signed in, show Sign Out
        signInButton.textContent = 'Sign Out';
        signInButton.onclick = () => {
            signOut(); // Handle sign out
        };

        signOutButton.style.display = 'inline-block'; // Show sign-out button
    } else {

        signInButton.textContent = 'Sign In';
        signInButton.onclick = () => {
            window.location.href = '/Pages/sign_in.html'; // Redirect to sign-in page
        };

        signOutButton.style.display = 'none';
    }
}

// Function to handle the sign-out action
function signOut() {
    localStorage.removeItem('user'); // Remove user data from localStorage
    window.location.href = "/index.html"; // Redirect to home page
}

// Nav bar toggle for mobile menu
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
    navMenu.setAttribute(
        'aria-expanded',
        navMenu.classList.contains('active').toString()
    );
}
