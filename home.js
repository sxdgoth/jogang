// Home page JavaScript for Avatar Metaverse

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loading...');
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize the home page
    initializeHomePage();
});

function initializeHomePage() {
    console.log('Initializing home page...');
    
    // Load user data and display
    loadUserData();
    
    // Setup event listeners first
    setupEventListeners();
    
    // Initialize avatar display after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeAvatar();
    }, 100);
    
    // Load user stats
    loadUserStats();
}

// Load and display user data
function loadUserData() {
    const user = getCurrentUser();
    if (!user) {
        console.error('No current user found in loadUserData');
        return;
    }
    
    console.log('Loading user data for:', user.username);
    
    // Update welcome message with actual username
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${user.username}!`;
        console.log('Updated welcome message for:', user.username);
    } else {
        console.error('Welcome message element not found');
    }
    
    // Display user details
    const userDetailsDiv = document.getElementById('user-details');
    if (userDetailsDiv) {
        const age = calculateAge(user.birthday);
        const memberSince = formatDate(user.createdAt);
        
        userDetailsDiv.innerHTML = `
            <div class="user-detail">
                <strong>👤 Username:</strong> ${user.username}
            </div>
            <div class="user-detail">
                <strong>📧 Email:</strong> ${user.email}
            </div>
            <div class="user-detail">
                <strong>🎂 Age:</strong> ${age} years old
            </div>
            <div class="user-detail">
                <strong>📅 Member Since:</strong> ${memberSince}
            </div>
            <div class="user-detail">
                <strong>👁️ Current View:</strong> ${user.avatar.view || 'front'}
            </div>
            <div class="user-detail">
                <strong>🤚 Left Arm:</strong> Under body (3-part)
            </div>
            <div class="user-detail">
                <strong>🤚 Right Arm:</strong> On top of body (3-part)
            </div>
        `;
        console.log('User details loaded successfully');
    } else {
        console.error('User details element not found');
    }
}

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
        console.log('Logout button listener added');
    }
    
    // Avatar view buttons
    const frontViewBtn = document.getElementById('front-view');
    const backViewBtn = document.getElementById('back-view');
    
    if (frontViewBtn) {
        frontViewBtn.addEventListener('click', () => {
            console.log('Front view button clicked');
            switchAvatarView('front');
        });
    }
    
    if (backViewBtn) {
        backViewBtn.addEventListener('click', () => {
            console.log('Back view button clicked');
            switchAvatarView('back');
        });
    }
    
    // Menu buttons
    setupMenuButtons();
}

// Setup menu button functionality
function setupMenuButtons() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    console.log(`Found ${menuButtons.length} menu buttons`);
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            console.log(`Menu button clicked: ${feature}`);
            handleMenuAction(feature);
        });
    });
}

// Handle menu button actions
function handleMenuAction(feature) {
    switch(feature) {
        case 'customize':
            showFeatureModal('Avatar Customization', 'Customize your avatar with different colors, clothes, and accessories!', '🎨');
            break;
        case 'explore':
            showFeatureModal('Explore World', 'Discover new places, meet other avatars, and go on adventures!', '🌍');
            break;
        case 'friends':
            showFeatureModal('Friends System', 'Add friends, chat, and hang out together in the metaverse!', '👥');
            break;
        case 'settings':
            showSettingsModal();
            break;
        default:
            showComingSoon('This feature');
    }
}

// Show feature modal
function showFeatureModal(title, description, icon) {
    const modal = createModal(`
        <div class="feature-modal">
            <div class="feature-icon">${icon}</div>
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="feature-status">
                <span class="status-badge">Coming Soon</span>
            </div>
            <p class="feature-note">This feature is currently in development and will be available in a future update!</p>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Show settings modal
function showSettingsModal() {
    const user = getCurrentUser();
    const modal = createModal(`
        <div class="settings-modal">
            <h2>⚙️ Settings</h2>
            <div class="settings-section">
                <h3>Avatar Preferences</h3>
                <div class="setting-item">
                    <label>Default View:</label>
                    <select id="default-view">
                        <option value="front" ${user.avatar.view === 'front' ? 'selected' : ''}>Front View</option>
                        <option value="back" ${user.avatar.view === 'back' ? 'selected' : ''}>Back View</option>
                    </select>
                </div>
            </div>
            <div class="settings-section">
                <h3>Avatar Structure</h3>
                <div class="setting-item">
                    <label>Left Arm:</label>
                    <span>Under body (3-part: Upper+Lower+Hand)</span>
                </div>
                <div class="setting-item">
                    <label>Right Arm:</label>
                    <span>On top of body (3-part: Upper+Lower+Hand)</span>
                </div>
                <div class="setting-item">
                    <label>Legs:</label>
                    <span>3-part (UpperLeg + LowerLeg + Foot)</span>
                </div>
                <div class="setting-item">
                    <label>Scaling:</label>
                    <span>Consistent for both front/back views</span>
                </div>
            </div>
            <div class="settings-section">
                <h3>Account</h3>
                <div class="setting-item">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="setting-item">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="setting-item">
                    <label>User ID:</label>
                    <span>${user.id}</span>
                </div>
            </div>
            <div class="settings-actions">
                <button id="save-settings" class="btn-primary">Save Settings</button>
                <button id="reset-avatar" class="btn-danger">Reset Avatar</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // Setup settings event listeners
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-avatar').addEventListener('click', resetAvatar);
}

// Create modal element
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            ${content}
        </div>
    `;
    
    // Close modal functionality
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.remove();
        }
    });
    
    return modal;
}

// Save settings
function saveSettings() {
    const user = getCurrentUser();
    const defaultView = document.getElementById('default-view').value;
    
    user.avatar.view = defaultView;
    updateCurrentUser(user);
    
    // Update current view if different
    if (avatarRenderer.currentView !== defaultView) {
        switchAvatarView(defaultView);
    }
    
    showNotification('Settings saved successfully!', 'success');
    document.querySelector('.modal-overlay').remove();
    
    // Refresh user details display
    loadUserData();
}

// Reset avatar with correct arm layering
function resetAvatar() {
    if (confirm('Are you sure you want to reset your avatar to default? This cannot be undone.')) {
        const user = getCurrentUser();
        
        // Reset avatar to default with correct arm layering (no color overrides)
        user.avatar = {
            view: 'front',
            bodyParts: {
                // Head
                head: 'front-body-flesh-Head.svg',
                // Core body
                coreBody: 'front-body-flesh-CoreBody.svg',
                // Left arm (3 parts) - UNDER body
                leftUpperArm: 'front-body-flesh-LeftUpperArm.svg',
                leftLowerArm: 'front-body-flesh-LeftLowerArm.svg',
                leftHand: 'front-body-flesh-LeftHand.svg',
                // Right arm (3 parts) - ON TOP of body
                rightUpperArm: 'front-body-flesh-RightUpperArm.svg',
                rightLowerArm: 'front-body-flesh-RightLowerArm.svg',
                rightHand: 'front-body-flesh-RightHand.svg',
                // Left leg (3 parts)
                leftUpperLeg: 'front-body-flesh-LeftUpperLeg.svg',
                leftLowerLeg: 'front-body-flesh-LeftLowerLeg.svg',
                leftFoot: 'front-body-flesh-LeftFoot.svg',
                // Right leg (3 parts)
                rightUpperLeg: 'front-body-flesh-RightUpperLeg.svg',
                rightLowerLeg: 'front-body-flesh-RightLowerLeg.svg',
                rightFoot: 'front-body-flesh-RightFoot.svg'
            },
            customizations: {
                skinColor: null, // Don't override original colors
                items: []
            }
        };
        
        updateCurrentUser(user);
        
        // Refresh avatar display
        setTimeout(() => {
            initializeAvatar();
        }, 100);
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('front-view').classList.add('active');
        
        showNotification('Avatar reset with correct arm layering!', 'success');
        document.querySelector('.modal-overlay').remove();
        
        // Refresh user details display
        loadUserData();
    }
}

// Load user stats
function loadUserStats() {
    const user = getCurrentUser();
    if (!user || !user.stats) return;
    
    // Update stats display
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
        statValues[0].textContent = user.stats.level || 1;
        statValues[1].textContent = user.stats.friends || 0;
        statValues[2].textContent = user.stats.items || 0;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Show coming soon message (fallback)
function showComingSoon(feature) {
    showNotification(`${feature} coming soon! 🚀`, 'info');
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