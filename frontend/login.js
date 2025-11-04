// Set the URL for your backend.
// If you run both locally, this will be localhost.
// When deployed, you'll change this to your Render URL.
const BACKEND_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            errorMessage.textContent = ''; // Clear previous errors

            try {
                const response = await fetch(`${BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Login successful
                    console.log('Login successful');
                    // Redirect to the main pokedex page
                    window.location.href = 'pokedex.html';
                } else {
                    // Login failed
                    errorMessage.textContent = data.message || 'Login failed. Please try again.';
                }
            } catch (error) {
                console.error('Error during login:', error);
                errorMessage.textContent = 'An error occurred. Please check the console.';
            }
        });
    }
});
