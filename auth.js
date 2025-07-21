// Authentication JavaScript

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    // If we're on login or register page and user is already logged in, redirect to home
    if ((window.location.pathname.includes('index.html') || window.location.pathname.includes('register.html') || window.location.pathname === '/') && isLoggedIn()) {
        window.location.href = 'home.html';
    }
});

// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            window.location.href = 'home.html';
        } else {
            showError('Invalid username or password. Please try again.');
        }
    });
}

// Register Form Handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const birthday = document.getElementById('reg-birthday').value;
        
        if (register(username, email, password, birthday)) {
            showSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showError('Username already exists. Please choose a different username.');
        }
    });
}

// Registration function
function register(username, email, password, birthday) {
    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('avatarUsers') || '[]');
    
    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return false;
    }
    
    // Create new user object
    const newUser = {
        username: username,
        email: email,
        password: password, // In a real app, this should be hashed
        birthday: birthday,
        createdAt: new Date().toISOString(),
        avatar: {
            created: false,
            customizations: {}
        }
    };
    
    // Add user to array and save
    users.push(newUser);
    localStorage.setItem('avatarUsers', JSON.stringify(users));
    
    return true;
}

// Login function
function login(username, password) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('avatarUsers') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    
    return false;
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Basic password validation - at least 6 characters
    return password.length >= 6;
}

function validateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 13; // Minimum age requirement
}