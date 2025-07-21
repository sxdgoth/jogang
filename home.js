// Home page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set body class for home page styling
    document.body.classList.add('home-page');
    
    // Load user data and display
    loadUserData();
    
    // Load avatar template
    loadAvatarTemplate();
    
    // Setup logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Setup menu buttons (placeholder functionality)
    setupMenuButtons();
});

// Load and display user data
function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update welcome message
    document.getElementById('welcome-message').textContent = `Welcome, ${user.username}!`;
    
    // Display user details
    const userDetailsDiv = document.getElementById('user-details');
    userDetailsDiv.innerHTML = `
        <div class="user-detail">
            <strong>Username:</strong> ${user.username}
        </div>
        <div class="user-detail">
            <strong>Email:</strong> ${user.email}
        </div>
        <div class="user-detail">
            <strong>Birthday:</strong> ${formatDate(user.birthday)}
        </div>
        <div class="user-detail">
            <strong>Member Since:</strong> ${formatDate(user.createdAt)}
        </div>
    `;
}

// Load avatar template
function loadAvatarTemplate() {
    const avatarContainer = document.getElementById('avatar-container');
    
    // This is where we'll load your SVG template
    // For now, showing placeholder until you provide the GitHub link
    avatarContainer.innerHTML = `
        <div class="avatar-placeholder">
            <h3>Your Avatar</h3>
            <p>🧑‍💼</p>
            <p>Avatar template will be loaded here</p>
            <p style="font-size: 12px; color: #999;">Please provide your SVG template GitHub link</p>
        </div>
    `;
    
    // TODO: Replace with actual SVG loading once GitHub link is provided
    // loadSVGFromGitHub('YOUR_GITHUB_SVG_URL');
}

// Function to load SVG from GitHub (will be implemented once you provide the link)
async function loadSVGFromGitHub(githubUrl) {
    try {
        const response = await fetch(githubUrl);
        const svgContent = await response.text();
        
        const avatarContainer = document.getElementById('avatar-container');
        avatarContainer.innerHTML = svgContent;
        
        // Add CSS class to the SVG for styling
        const svgElement = avatarContainer.querySelector('svg');
        if (svgElement) {
            svgElement.classList.add('avatar-svg');
        }
        
    } catch (error) {
        console.error('Error loading avatar template:', error);
        avatarContainer.innerHTML = `
            <div class="avatar-placeholder">
                <p>❌ Error loading avatar template</p>
                <p>Please check the GitHub link</p>
            </div>
        `;
    }
}

// Setup menu button functionality
function setupMenuButtons() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            
            switch(buttonText) {
                case 'Customize Avatar':
                    showComingSoon('Avatar customization');
                    break;
                case 'Explore World':
                    showComingSoon('World exploration');
                    break;
                case 'Friends':
                    showComingSoon('Friends system');
                    break;
                case 'Settings':
                    showComingSoon('Settings panel');
                    break;
                default:
                    showComingSoon('This feature');
            }
        });
    });
}

// Show coming soon message
function showComingSoon(feature) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `${feature} coming soon! 🚀`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);