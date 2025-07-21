// Home page JavaScript for Avatar Metaverse

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize the home page
    initializeHomePage();
});

function initializeHomePage() {
    // Load user data and display
    loadUserData();
    
    // Initialize avatar display
    initializeAvatar();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load user stats
    loadUserStats();
}

// Load and display user data
function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update welcome message
    document.getElementById('welcome-message').textContent = `Welcome, ${user.username}!`;
    
    // Display user details
    const userDetailsDiv = document.getElementById('user-details');
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
    `;
}

// Setup all event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Avatar view buttons
    document.getElementById('front-view').addEventListener('click', () => {
        switchAvatarView('front');
    });
    
    document.getElementById('back-view').addEventListener('click', () => {
        switchAvatarView('back');
    });
    
    // Menu buttons
    setupMenuButtons();
}

// Setup menu button functionality
function setupMenuButtons() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
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
                <h3>Account</h3>
                <div class="setting-item">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="setting-item">
                    <label>Email:</label>
                    <span>${user.email}</span>
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
}

// Reset avatar
function resetAvatar() {
    if (confirm('Are you sure you want to reset your avatar to default? This cannot be undone.')) {
        const user = getCurrentUser();
        
        // Reset avatar to default
        user.avatar = {
            view: 'front',
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
                skinColor: '#FDBCB4',
                items: []
            }
        };
        
        updateCurrentUser(user);
        
        // Refresh avatar display
        initializeAvatar();
        
        showNotification('Avatar reset to default!', 'success');
        document.querySelector('.modal-overlay').remove();
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

// Add CSS for modals and notifications
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    .feature-modal {
        text-align: center;
    }
    
    .feature-icon {
        font-size: 4em;
        margin-bottom: 20px;
    }
    
    .feature-modal h2 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .feature-modal p {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.6;
    }
    
    .status-badge {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9em;
    }
    
    .feature-note {
        font-style: italic;
        font-size: 0.9em;
    }
    
    .settings-modal h2 {
        color: #333;
        margin-bottom: 25px;
        text-align: center;
    }
    
    .settings-section {
        margin-bottom: 25px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .settings-section h3 {
        color: #333;
        margin-bottom: 15px;
        font-size: 1.1em;
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .setting-item label {
        font-weight: 600;
        color: #333;
    }
    
    .setting-item select {
        padding: 8px 12px;
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        background: white;
    }
    
    .settings-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
    }
    
    .btn-danger {
        padding: 12px 24px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    
    .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    }
    
    .notification-info {
        background: linear-gradient(135deg, #667eea, #764ba2);
    }
    
    .notification-success {
        background: linear-gradient(135deg, #51cf66, #40c057);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.8;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .avatar-error {
        text-align: center;
        color: #666;
        padding: 40px 20px;
    }
    
    .avatar-error p {
        margin: 10px 0;
    }
`;
document.head.appendChild(additionalStyles);