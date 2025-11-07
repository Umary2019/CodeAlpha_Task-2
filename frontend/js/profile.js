class ProfileManager {
    constructor() {
        this.apiBase = 'http://localhost:5001/api';
        this.init();
    }

    init() {
        if (window.location.pathname.includes('profile.html')) {
            this.loadProfile();
        }
        if (window.location.pathname.includes('explore.html')) {
            this.loadUsers();
        }
    }

    async loadProfile() {
        if (!app.isAuthenticated()) {
            this.showLoginPrompt();
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id') || app.currentUser.id;

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/users/${userId}`, {
                headers: app.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                this.displayProfile(data.data);
            } else {
                this.showError('Profile not found');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showError('Error loading profile');
        } finally {
            this.showLoading(false);
        }
    }

    displayProfile(profileData) {
        const container = document.getElementById('profile-content');
        if (!container) return;

        const { user, posts, isFollowing, isOwnProfile } = profileData;

        container.innerHTML = `
            <div class="profile-header">
                <img src="${user.avatar}" alt="${user.name}" class="profile-avatar">
                <h1>${user.name}</h1>
                <p class="profile-username">@${user.username}</p>
                <p class="profile-bio">${user.bio}</p>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="count">${user.followers}</span>
                        <span class="label">Followers</span>
                    </div>
                    <div class="profile-stat">
                        <span class="count">${user.following}</span>
                        <span class="label">Following</span>
                    </div>
                    <div class="profile-stat">
                        <span class="count">${posts.length}</span>
                        <span class="label">Posts</span>
                    </div>
                </div>
                <div class="profile-actions">
                    ${isOwnProfile ? 
                        '<button class="btn btn-outline">Edit Profile</button>' : 
                        `<button class="btn ${isFollowing ? 'btn-outline' : 'btn-primary'}" onclick="profileManager.followUser(${user.id})">
                            ${isFollowing ? 'Following' : 'Follow'}
                        </button>`
                    }
                </div>
            </div>
            <div class="profile-posts">
                <h2>Posts</h2>
                ${posts.length === 0 ? 
                    '<p style="text-align: center; color: #666; padding: 2rem;">No posts yet</p>' :
                    '<div class="posts-grid">' + posts.map(post => `
                        <div class="post-card">
                            <div class="post-content">
                                <p class="post-text">${post.content}</p>
                                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                            </div>
                            <div class="post-stats">
                                <span>❤️ ${post.likes}</span>
                                <span>💬 ${post.comments}</span>
                            </div>
                        </div>
                    `).join('') + '</div>'
                }
            </div>
        `;
    }

    async loadUsers() {
        if (!app.isAuthenticated()) {
            this.showLoginPrompt();
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/users`, {
                headers: app.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                this.displayUsers(data.data);
            } else {
                this.showNoUsers();
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.showNoUsers();
        } finally {
            this.showLoading(false);
        }
    }

    displayUsers(users) {
        const container = document.getElementById('users-grid');
        const noUsers = document.getElementById('no-users');
        const loginPrompt = document.getElementById('login-prompt');

        if (!container) return;

        const filteredUsers = users.filter(user => !user.isCurrentUser);

        if (filteredUsers.length === 0) {
            container.style.display = 'none';
            if (noUsers) noUsers.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        if (noUsers) noUsers.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'none';

        container.innerHTML = filteredUsers.map(user => `
            <div class="user-card">
                <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                <h3>${user.name}</h3>
                <p class="user-username">@${user.username}</p>
                <p class="user-bio">${user.bio}</p>
                <div class="user-stats">
                    <div class="user-stat">
                        <span class="count">${user.followers}</span>
                        <span class="label">Followers</span>
                    </div>
                    <div class="user-stat">
                        <span class="count">${user.following}</span>
                        <span class="label">Following</span>
                    </div>
                </div>
                <button class="btn ${user.isFollowing ? 'btn-outline' : 'btn-primary'}" onclick="profileManager.followUser(${user.id})">
                    ${user.isFollowing ? 'Following' : 'Follow'}
                </button>
            </div>
        `).join('');
    }

    async followUser(userId) {
        if (!app.isAuthenticated()) {
            alert('Please login to follow users');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/users/${userId}/follow`, {
                method: 'POST',
                headers: app.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                // Reload the current page
                if (window.location.pathname.includes('explore.html')) {
                    this.loadUsers();
                } else {
                    this.loadProfile();
                }
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    showLoginPrompt() {
        const loginPrompt = document.getElementById('login-prompt');
        const profileContent = document.getElementById('profile-content');
        const usersGrid = document.getElementById('users-grid');
        
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (profileContent) profileContent.style.display = 'none';
        if (usersGrid) usersGrid.style.display = 'none';
    }

    showNoUsers() {
        const noUsers = document.getElementById('no-users');
        const usersGrid = document.getElementById('users-grid');
        
        if (noUsers) noUsers.style.display = 'block';
        if (usersGrid) usersGrid.style.display = 'none';
    }

    showError(message) {
        const container = document.getElementById('profile-content');
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }

    showLoading(show) {
        app.showLoading(show);
    }
}

// Initialize profile manager
document.addEventListener('DOMContentLoaded', function() {
    window.profileManager = new ProfileManager();
});