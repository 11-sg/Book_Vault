// Function to switch tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Hide all tab contents
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", ""); // Remove active class from all tabs
    }

    document.getElementById(tabName).style.display = "block"; // Show the selected tab content
    evt.currentTarget.className += " active"; // Add active class to the clicked tab
}

// Function to toggle the navigation menu
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active'); // Toggle the visibility of the nav menu
}

// Fetch user data from the server and display it on the dashboard
const userData = JSON.parse(localStorage.getItem('user'));

if (userData && userData.email) {
    fetch('http://localhost:3000/user_data') // Use the correct server endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log('User Data from Server:', data); // Debugging line

            // Find the user matching the email
            const matchingUser = data.find(item => item.email === userData.email);

            if (matchingUser) {
                console.log('Matching User Data:', matchingUser);
                // Display user details
                document.querySelector('#name').innerHTML = `Name: ${matchingUser.name}`;
                document.querySelector('#email').innerHTML = `Email: ${matchingUser.email}`;
                document.querySelector('#books').innerHTML = `Issued Books: ${matchingUser.book.split(', ').join(', ')}`; // Assuming book is a comma-separated string

                // Update issued books in the "Your Books" tab
                document.querySelector('#issued-books').innerHTML = matchingUser.book.split(', ').join(', '); // Display issued books

                // Fetch recommended books based on issued books
                fetchRecommendedBooks(matchingUser.book.split(', ')); // Split the string into an array
            } else {
                console.warn('No user found for this email');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
} else {
    console.error('No user data found in localStorage');
}

// Function to fetch book data and find recommendations
async function fetchRecommendedBooks(userBooks) {
    try {
        const response = await fetch('../node/data.json'); // Adjust path as necessary
        if (!response.ok) {
            throw new Error('Failed to fetch book data');
        }
        const allBooks = await response.json();
        console.log('All Books Data:', allBooks); // Debugging line

        const recommendedBooks = findSimilarBooks(userBooks, allBooks);
        displayRecommendedBooks(recommendedBooks);
    } catch (error) {
        console.error('Error fetching book data:', error);
    }
}

// Function to find similar books based on genre or author
function findSimilarBooks(userBooks, allBooks) {
    const userBookTitles = userBooks.map(book => book.toLowerCase());
    const userBookDetails = allBooks.filter(book =>
        userBookTitles.includes(book.title.toLowerCase())
    );

    // Get genres and authors of issued books
    const userGenres = new Set(userBookDetails.map(book => book.genre.toLowerCase()));
    const userAuthors = new Set(userBookDetails.map(book => book.author.toLowerCase()));

    // Recommend books with matching genres or authors that are not already borrowed
    const recommendedBooks = allBooks.filter(book =>
        !userBookTitles.includes(book.title.toLowerCase()) &&
        (userGenres.has(book.genre.toLowerCase()) || userAuthors.has(book.author.toLowerCase()))
    );

    return recommendedBooks.slice(0, 5);
}

// Function to display recommended books
function displayRecommendedBooks(recommendedBooks) {
    const recommendedBooksDiv = document.getElementById('recommended-books');
    if (recommendedBooks.length > 0) {
        recommendedBooksDiv.innerHTML = recommendedBooks.map(book =>
            `<div><strong>${book.title}</strong> by ${book.author} (${book.genre})</div>`
        ).join('');
    } else {
        recommendedBooksDiv.innerHTML = '<div>No recommendations available.</div>';
    }
}

// Toggle user menu for mobile view
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    userMenu.classList.toggle('active');
}
