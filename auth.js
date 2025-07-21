// Authentication JavaScript for Avatar Metaverse

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
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showError('Please fill in all fields.');
            return;
        }
        
        if (login(username, password)) {
            // Add loading effect
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Entering Metaverse...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showError('Invalid username or password. Please try again.');
        }
    });
}

// Register Form Handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const birthday = document.getElementById('reg-birthday').value;
        
        // Validation
        if (!username || !email || !password || !birthday) {
            showError('Please fill in all fields.');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }
        
        if (!validatePassword(password)) {
            showError('Password must be at least 6 characters long.');
            return;
        }
        
        if (!validateAge(birthday)) {
            showError('You must be at least 13 years old to join.');
            return;
        }
        
        if (register(username, email, password, birthday)) {
            showSuccess('Avatar created successfully! Redirecting to login...');
            
            // Add loading effect
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Creating Avatar...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2500);
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
        id: Date.now(), // Simple ID generation
        username: username,
        email: email,
        password: password, // In a real app, this should be hashed
        birthday: birthday,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        avatar: {
            view: 'front', // default view
            bodyParts: {
                head: 'front-body-flesh-Head.svg',
                coreBody: 'front-body-flesh-CoreBody.svg',
                leftUpperArm: 'front-body-flesh-LeftUpperArm.svg',
                leftLowerArm: 'front-body-flesh-LeftLowerArm.svg',
                leftHand: 'front-body-flesh-LeftHand.svg',
                rightUpperArm: 'front-body-flesh-RightUpperArm.svg',
                rightLowerArm: 'front-body-flesh-RightLowerArm.svg',
                rightHand: 'front-body-flesh-RightHand.svg',
                leftUpperLeg: 'front-body-flesh-LeftUpperLeg.svg',
                leftLowerLeg: 'front-body-flesh-LeftLowerLeg.svg',
                leftFoot: 'front-body-flesh-LeftFoot.svg',
                rightUpperLeg: 'front-body-flesh-RightUpperLeg.svg',
                rightLowerLeg: 'front-body-flesh-RightLowerLeg.svg',
                rightFoot: 'front-body-flesh-RightFoot.svg'
            },
            customizations: {
                skinColor: null, // Don't override original colors
                items: []
            }
        },
        stats: {
            level: 1,
            friends: 0,
            items: 0,
            joinDate: new Date().toISOString()
        }
    };
    
    // Add user to array and save
    users.push(newUser);
    localStorage.setItem('avatarUsers', JSON.stringify(users));
    
    // Also save to a separate backup for easy viewing
    saveUserBackup(newUser);
    
    return true;
}

// Save user backup for easy viewing
function saveUserBackup(user) {
    const backups = JSON.parse(localStorage.getItem('userBackups') || '[]');
    backups.push({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        birthday: user.birthday,
        createdAt: user.createdAt
    });
    localStorage.setItem('userBackups', JSON.stringify(backups));
}

// Login function
function login(username, password) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('avatarUsers') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Update user in storage
        const userIndex = users.findIndex(u => u.id === user.id);
        users[userIndex] = user;
        localStorage.setItem('avatarUsers', JSON.stringify(users));
        
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

// Update current user data
function updateCurrentUser(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Also update in users array
    let users = JSON.parse(localStorage.getItem('avatarUsers') || '[]');
    const userIndex = users.findIndex(u => u.username === userData.username);
    if (userIndex !== -1) {
        users[userIndex] = userData;
        localStorage.setItem('avatarUsers', JSON.stringify(users));
    }
}

// Get all users (for admin panel)
function getAllUsers() {
    return JSON.parse(localStorage.getItem('avatarUsers') || '[]');
}

// Get user backups (for easy viewing)
function getUserBackups() {
    return JSON.parse(localStorage.getItem('userBackups') || '[]');
}

// Clear all users
function clearAllUsers() {
    if (confirm('Are you sure you want to delete ALL users? This cannot be undone!')) {
        localStorage.removeItem('avatarUsers');
        localStorage.removeItem('userBackups');
        localStorage.removeItem('currentUser');
        return true;
    }
    return false;
}

// Export user data
function exportUserData() {
    const users = getAllUsers();
    const backups = getUserBackups();
    const data = {
        users: users,
        backups: backups,
        exportDate: new Date().toISOString(),
        totalUsers: users.length
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `avatar-users-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
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
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 13; // Minimum age requirement
}

// Calculate age from birthday
function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}