document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded. Checking sign-in status...');
    checkSignInStatus(); // Check if the user is signed in
});

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
        // User is not signed in, show Sign In button
        signInButton.textContent = 'Sign In';
        signInButton.onclick = () => {
            window.location.href = 'sign_in.html'; // Redirect to sign-in page
        };

        signOutButton.style.display = 'none'; // Hide sign-out button
    }
}

// Function to handle the sign-out action
function signOut() {
    localStorage.removeItem('user'); // Remove user data from localStorage
    checkSignInStatus(); // Update UI to show Sign In button
}
document.querySelector(".nav-menu button").addEventListener("click", () => {
    signOut()
    window.location.href = "/Book_Vault/index.html";
});
