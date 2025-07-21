// User Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadStorageInfo();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('refresh-users').addEventListener('click', function() {
        loadUsers();
        loadStorageInfo();
    });
    
    document.getElementById('export-users').addEventListener('click', function() {
        exportUserData();
    });
    
    document.getElementById('clear-users').addEventListener('click', function() {
        if (clearAllUsers()) {
            loadUsers();
            loadStorageInfo();
        }
    });
}

function loadUsers() {
    const users = getAllUsers();
    const usersList = document.getElementById('users-list');
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="no-users">
                <h3>No users registered yet</h3>
                <p>Users will appear here after they register.</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = `
        <h3>Total Users: ${users.length}</h3>
        ${users.map(user => createUserCard(user)).join('')}
    `;
}

function createUserCard(user) {
    const age = calculateAge(user.birthday);
    const joinDate = new Date(user.createdAt).toLocaleDateString();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';
    
    return `
        <div class="user-card">
            <h4>👤 ${user.username}</h4>
            <div class="user-info">
                <span><strong>ID:</strong> ${user.id}</span>
                <span><strong>Email:</strong> ${user.email}</span>
                <span><strong>Password:</strong> ${user.password}</span>
                <span><strong>Age:</strong> ${age} years old</span>
                <span><strong>Birthday:</strong> ${user.birthday}</span>
                <span><strong>Joined:</strong> ${joinDate}</span>
                <span><strong>Last Login:</strong> ${lastLogin}</span>
                <span><strong>Avatar View:</strong> ${user.avatar.view}</span>
                <span><strong>Level:</strong> ${user.stats.level}</span>
            </div>
        </div>
    `;
}

function loadStorageInfo() {
    const users = getAllUsers();
    const backups = getUserBackups();
    const currentUser = getCurrentUser();
    
    const storageDetails = document.getElementById('storage-details');
    
    const storageInfo = {
        totalUsers: users.length,
        currentlyLoggedIn: currentUser ? currentUser.username : 'None',
        backupEntries: backups.length,
        storageKeys: {
            avatarUsers: localStorage.getItem('avatarUsers') ? 'EXISTS' : 'EMPTY',
            userBackups: localStorage.getItem('userBackups') ? 'EXISTS' : 'EMPTY',
            currentUser: localStorage.getItem('currentUser') ? 'EXISTS' : 'EMPTY'
        },
        lastUpdate: new Date().toLocaleString()
    };
    
    storageDetails.textContent = JSON.stringify(storageInfo, null, 2);
}

// Add some additional styles for the users page
const userStyles = document.createElement('style');
userStyles.textContent = `
    .no-users {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .no-users h3 {
        color: #333;
        margin-bottom: 10px;
    }
    
    .users-list h3 {
        color: #333;
        margin-bottom: 20px;
        text-align: center;
        font-size: 1.3em;
    }
`;
document.head.appendChild(userStyles);