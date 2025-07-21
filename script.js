// Avatar SVG Templates - Using your GitHub repository
const AVATAR_PARTS = {
    front: {
        head: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-Head.svg',
        coreBody: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-CoreBody.svg',
        leftUpperArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-LeftUpperArm.svg',
        leftLowerArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-LeftLowerArm.svg',
        leftHand: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-LeftHand.svg',
        rightUpperArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-RightUpperArm.svg',
        rightLowerArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-RightLowerArm.svg',
        rightHand: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-RightHand.svg',
        leftUpperLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-LeftUpperLeg.svg',
        leftLowerLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-LeftLowerLeg.svg',
        leftFoot: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-LeftFoot.svg',
        rightUpperLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-RightUpperLeg.svg',
        rightLowerLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-RightLowerLeg.svg',
        rightFoot: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/front-body-flesh-RightFoot.svg'
    },
    back: {
        head: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-Head.svg',
        coreBody: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-CoreBody.svg',
        leftUpperArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-LeftUpperArm.svg',
        leftLowerArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-LeftLowerArm.svg',
        leftHand: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-LeftHand.svg',
        rightUpperArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-RightUpperArm.svg',
        rightLowerArm: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-RightLowerArm.svg',
        rightHand: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-RightHand.svg',
        leftUpperLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-LeftUpperLeg.svg',
        leftLowerLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-LeftLowerLeg.svg',
        leftFoot: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-LeftFoot.svg',
        rightUpperLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-RightUpperLeg.svg',
        rightLowerLeg: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-RightLowerLeg.svg',
        rightFoot: 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/back-body-flesh-RightFoot.svg'
    }
};

// ViewBox configurations for different views
const VIEW_CONFIGS = {
    front: {
        viewBox: "-50 -150 100 200",
        width: "300",
        height: "400"
    },
    back: {
        viewBox: "-50 -150 100 200",
        width: "300", 
        height: "400"
    }
};

// Application State
let currentUser = null;
let currentView = 'front';
let avatarCache = {};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const homePage = document.getElementById('homePage');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeUser = document.getElementById('welcomeUser');
const avatarDisplay = document.getElementById('avatarDisplay');
const toggleViewBtn = document.getElementById('toggleView');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');

// Utility Functions
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function showSuccess(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function switchToForm(targetForm) {
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    targetForm.classList.add('active');
}

function switchToHome() {
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    homePage.classList.add('active');
}

// Local Storage Functions
function saveUser(userData) {
    const users = JSON.parse(localStorage.getItem('jogangUsers') || '[]');
    users.push(userData);
    localStorage.setItem('jogangUsers', JSON.stringify(users));
}

function findUser(username, password) {
    const users = JSON.parse(localStorage.getItem('jogangUsers') || '[]');
    return users.find(user => user.username === username && user.password === password);
}

function userExists(username, email) {
    const users = JSON.parse(localStorage.getItem('jogangUsers') || '[]');
    return users.some(user => user.username === username || user.email === email);
}

function saveCurrentUser(user) {
    localStorage.setItem('jogangCurrentUser', JSON.stringify(user));
    currentUser = user;
}

function loadCurrentUser() {
    const user = localStorage.getItem('jogangCurrentUser');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

function clearCurrentUser() {
    localStorage.removeItem('jogangCurrentUser');
    currentUser = null;
}

// Avatar Functions
async function fetchSVGContent(url) {
    if (avatarCache[url]) {
        return avatarCache[url];
    }
    
    try {
        const response = await fetch(url);
        const svgText = await response.text();
        avatarCache[url] = svgText;
        return svgText;
    } catch (error) {
        console.error('Error fetching SVG:', error);
        return null;
    }
}

function extractSVGContent(svgText) {
    // Extract the content inside the SVG tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (svgElement) {
        // Get all child elements except the SVG wrapper
        const children = Array.from(svgElement.children);
        return children.map(child => child.outerHTML).join('');
    }
    return '';
}

function extractSVGViewBox(svgText) {
    // Extract viewBox from SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (svgElement) {
        return svgElement.getAttribute('viewBox');
    }
    return null;
}

function calculateOptimalViewBox(svgTexts, view) {
    // Try to extract and merge viewBoxes from all SVG parts
    const viewBoxes = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    svgTexts.forEach(svgText => {
        const viewBox = extractSVGViewBox(svgText);
        if (viewBox) {
            const [x, y, width, height] = viewBox.split(' ').map(Number);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
            viewBoxes.push({ x, y, width, height });
        }
    });
    
    // If we found valid viewBoxes, calculate the combined bounds
    if (viewBoxes.length > 0 && minX !== Infinity) {
        const totalWidth = maxX - minX;
        const totalHeight = maxY - minY;
        
        // Use consistent padding for both views
        const padding = 15;
        const paddedX = minX - padding;
        const paddedY = minY - padding;
        const paddedWidth = totalWidth + (padding * 2);
        const paddedHeight = totalHeight + (padding * 2);
        
        // Ensure consistent sizing between views by using a standardized approach
        const aspectRatio = paddedWidth / paddedHeight;
        const targetAspectRatio = 0.75; // 3:4 ratio to match container
        
        let finalX = paddedX;
        let finalY = paddedY;
        let finalWidth = paddedWidth;
        let finalHeight = paddedHeight;
        
        // Adjust to maintain consistent aspect ratio and centering
        if (aspectRatio > targetAspectRatio) {
            // Too wide, adjust height and center vertically
            finalHeight = finalWidth / targetAspectRatio;
            finalY = paddedY - (finalHeight - paddedHeight) / 2;
        } else if (aspectRatio < targetAspectRatio) {
            // Too tall, adjust width and center horizontally
            finalWidth = finalHeight * targetAspectRatio;
            finalX = paddedX - (finalWidth - paddedWidth) / 2;
        }
        
        // Round values to avoid sub-pixel issues
        finalX = Math.round(finalX * 10) / 10;
        finalY = Math.round(finalY * 10) / 10;
        finalWidth = Math.round(finalWidth * 10) / 10;
        finalHeight = Math.round(finalHeight * 10) / 10;
        
        return `${finalX} ${finalY} ${finalWidth} ${finalHeight}`;
    }
    
    // Fallback to default configuration
    return VIEW_CONFIGS[view].viewBox;
}

async function loadAvatar(view = 'front') {
    const avatarContainer = document.getElementById('avatarDisplay');
    avatarContainer.classList.add('switching');
    
    try {
        // Create a combined SVG with all body parts
        const parts = AVATAR_PARTS[view];
        const svgContents = [];
        const svgTexts = [];
        
        // Define the correct layering order for avatar parts
        const layerOrder = [
            'rightUpperArm', 'rightLowerArm', 'rightHand',  // Right arm behind body
            'rightUpperLeg', 'rightLowerLeg', 'rightFoot',  // Right leg behind body
            'coreBody',                                      // Body in middle
            'leftUpperLeg', 'leftLowerLeg', 'leftFoot',     // Left leg in front of body
            'leftUpperArm', 'leftLowerArm', 'leftHand',     // Left arm in front of body
            'head'                                           // Head on top
        ];
        
        // Load SVG parts in the correct order
        for (const partName of layerOrder) {
            if (parts[partName]) {
                const svgContent = await fetchSVGContent(parts[partName]);
                if (svgContent) {
                    svgTexts.push(svgContent);
                    const content = extractSVGContent(svgContent);
                    if (content) {
                        svgContents.push(content);
                    }
                }
            }
        }
        
        // Get view configuration
        const config = VIEW_CONFIGS[view];
        
        // Calculate optimal viewBox based on all SVG parts
        // Always recalculate to ensure consistency between views
        const viewBox = calculateOptimalViewBox(svgTexts, view);
        console.log(`Calculated viewBox for ${view} view:`, viewBox);
        
        // Create combined SVG with proper viewBox for the current view
        const combinedSVG = `
            <svg xmlns:xlink="http://www.w3.org/1999/xlink" 
                 xmlns="http://www.w3.org/2000/svg" 
                 aria-label="user avatar" 
                 viewBox="${viewBox}" 
                 preserveAspectRatio="xMidYMid meet" 
                 width="${config.width}" 
                 height="${config.height}"
                 style="max-width: 100%; max-height: 100%; display: block; margin: auto;">
                ${svgContents.join('')}
            </svg>
        `;
        
        avatarContainer.innerHTML = combinedSVG;
        
        // Add view-specific class for additional styling if needed
        avatarContainer.className = `avatar-display ${view}-view`;
        
    } catch (error) {
        console.error('Error loading avatar:', error);
        avatarContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666;">
                <p>Avatar Loading...</p>
                <p style="font-size: 12px; margin-top: 10px;">Please wait while we load your avatar</p>
            </div>
        `;
    }
    
    setTimeout(() => {
        avatarContainer.classList.remove('switching');
    }, 300);
}

// Event Listeners
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchToForm(registerForm);
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchToForm(loginForm);
});

registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const birthday = document.getElementById('registerBirthday').value;
    
    // Validation
    if (username.length < 3) {
        showError(registerError, 'Username must be at least 3 characters long');
        return;
    }
    
    if (password.length < 6) {
        showError(registerError, 'Password must be at least 6 characters long');
        return;
    }
    
    if (userExists(username, email)) {
        showError(registerError, 'Username or email already exists');
        return;
    }
    
    // Calculate age
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) {
        showError(registerError, 'You must be at least 13 years old to register');
        return;
    }
    
    // Save user
    const userData = {
        username,
        email,
        password,
        birthday,
        registeredAt: new Date().toISOString()
    };
    
    saveUser(userData);
    showSuccess(registerSuccess, 'Account created successfully! Please login.');
    
    // Clear form and switch to login
    registerFormElement.reset();
    setTimeout(() => {
        switchToForm(loginForm);
    }, 2000);
});

loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const user = findUser(username, password);
    
    if (user) {
        saveCurrentUser(user);
        welcomeUser.textContent = `Welcome, ${user.username}!`;
        switchToHome();
        loadAvatar(currentView);
    } else {
        showError(loginError, 'Invalid username or password');
    }
});

logoutBtn.addEventListener('click', () => {
    clearCurrentUser();
    switchToForm(loginForm);
    loginFormElement.reset();
});

toggleViewBtn.addEventListener('click', () => {
    currentView = currentView === 'front' ? 'back' : 'front';
    toggleViewBtn.textContent = currentView === 'front' ? 'Switch to Back View' : 'Switch to Front View';
    loadAvatar(currentView);
});

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (loadCurrentUser()) {
        welcomeUser.textContent = `Welcome, ${currentUser.username}!`;
        switchToHome();
        loadAvatar(currentView);
    } else {
        switchToForm(loginForm);
    }
    
    // Pre-load some avatar parts for better performance
    setTimeout(() => {
        Object.values(AVATAR_PARTS.front).forEach(url => {
            fetchSVGContent(url);
        });
    }, 1000);
});

// Add some demo users for testing (remove in production)
if (!localStorage.getItem('jogangUsers')) {
    const demoUsers = [
        {
            username: 'demo',
            email: 'demo@jogang.com',
            password: 'demo123',
            birthday: '1990-01-01',
            registeredAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('jogangUsers', JSON.stringify(demoUsers));
}