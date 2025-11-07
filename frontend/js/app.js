class SocialMediaApp {
    constructor() {
        this.apiBase = 'http://localhost:5001/api';
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user) {
            this.currentUser = user;
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const authLinks = document.getElementById('auth-links');
        const userLinks = document.getElementById('user-links');
        const userName = document.getElementById('user-name');
        const profileLink = document.getElementById('profile-link');

        if (this.currentUser) {
            if (authLinks) authLinks.style.display = 'none';
            if (userLinks) userLinks.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.name;
            if (profileLink) profileLink.href = `profile.html?id=${this.currentUser.id}`;
        } else {
            if (authLinks) authLinks.style.display = 'flex';
            if (userLinks) userLinks.style.display = 'none';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const messageDiv = document.getElementById('login-message');
        const loginBtn = document.getElementById('login-btn');

        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';
        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                
                this.showMessage('✅ Login successful! Redirecting...', 'success', messageDiv);
                
                setTimeout(() => {
                    window.location.href = 'feed.html';
                }, 1000);
            } else {
                this.showMessage(`❌ ${data.error}`, 'error', messageDiv);
            }
        } catch (error) {
            this.showMessage('❌ Network error. Please try again.', 'error', messageDiv);
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const messageDiv = document.getElementById('register-message');
        const registerBtn = document.getElementById('register-btn');

        if (password.length < 6) {
            this.showMessage('❌ Password must be at least 6 characters', 'error', messageDiv);
            return;
        }

        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating Account...';
        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, username, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                
                this.showMessage('✅ Registration successful! Redirecting...', 'success', messageDiv);
                
                setTimeout(() => {
                    window.location.href = 'feed.html';
                }, 1000);
            } else {
                this.showMessage(`❌ ${data.error}`, 'error', messageDiv);
            }
        } catch (error) {
            this.showMessage('❌ Network error. Please try again.', 'error', messageDiv);
        } finally {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
            this.showLoading(false);
        }
    }

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.updateAuthUI();
        window.location.href = 'index.html';
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
        }
    }

    showMessage(message, type, container) {
        if (container) {
            container.innerHTML = `
                <div class="message ${type}">
                    ${message}
                </div>
            `;
            container.style.display = 'block';
        }
    }

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    window.app = new SocialMediaApp();
});