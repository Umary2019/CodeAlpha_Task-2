class PostsManager {
    constructor() {
        this.apiBase = 'http://localhost:5001/api';
        this.currentPostId = null;
        this.init();
    }

    init() {
        if (window.location.pathname.includes('feed.html')) {
            this.loadPosts();
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const createPostBtn = document.getElementById('create-post-btn');
        if (createPostBtn) {
            createPostBtn.addEventListener('click', () => this.createPost());
        }

        const addCommentBtn = document.getElementById('add-comment-btn');
        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', () => this.addComment());
        }

        const closeModal = document.querySelector('.close');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeCommentModal());
        }
    }

    async loadPosts() {
        if (!app.isAuthenticated()) {
            this.showLoginPrompt();
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/posts`, {
                headers: app.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                this.displayPosts(data.data);
                this.showCreatePost();
            } else {
                this.showNoPosts();
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showNoPosts();
        } finally {
            this.showLoading(false);
        }
    }

    displayPosts(posts) {
        const container = document.getElementById('posts-feed');
        const noPosts = document.getElementById('no-posts');
        const loginPrompt = document.getElementById('login-prompt');

        if (!container) return;

        if (!posts || posts.length === 0) {
            container.style.display = 'none';
            if (noPosts) noPosts.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        if (noPosts) noPosts.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'none';

        container.innerHTML = posts.map(post => `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.user.avatar}" alt="${post.user.name}" class="post-avatar">
                    <div class="post-user-info">
                        <h4>${post.user.name}</h4>
                        <p>@${post.user.username}</p>
                    </div>
                    <span class="post-time">${this.formatTime(post.createdAt)}</span>
                </div>
                <div class="post-content">
                    <p class="post-text">${post.content}</p>
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                </div>
                <div class="post-actions">
                    <button class="post-action like-btn ${post.liked ? 'liked' : ''}" onclick="postsManager.likePost(${post.id})">
                        ❤️ ${post.likes}
                    </button>
                    <button class="post-action comment-btn" onclick="postsManager.openCommentModal(${post.id})">
                        💬 ${post.comments}
                    </button>
                </div>
            </div>
        `).join('');
    }

    showCreatePost() {
        const createPost = document.getElementById('create-post');
        if (createPost) {
            createPost.style.display = 'block';
        }
    }

    showLoginPrompt() {
        const loginPrompt = document.getElementById('login-prompt');
        const postsFeed = document.getElementById('posts-feed');
        const createPost = document.getElementById('create-post');
        
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (postsFeed) postsFeed.style.display = 'none';
        if (createPost) createPost.style.display = 'none';
    }

    showNoPosts() {
        const noPosts = document.getElementById('no-posts');
        const postsFeed = document.getElementById('posts-feed');
        
        if (noPosts) noPosts.style.display = 'block';
        if (postsFeed) postsFeed.style.display = 'none';
    }

    async createPost() {
        if (!app.isAuthenticated()) {
            alert('Please login to create a post');
            return;
        }

        const content = document.getElementById('post-content').value;
        const image = document.getElementById('post-image').value;

        if (!content.trim()) {
            alert('Please enter post content');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/posts`, {
                method: 'POST',
                headers: app.getAuthHeaders(),
                body: JSON.stringify({ content, image })
            });

            const data = await response.json();

            if (data.success) {
                document.getElementById('post-content').value = '';
                document.getElementById('post-image').value = '';
                this.loadPosts(); // Reload posts
                this.showToast('✅ Post created successfully!');
            } else {
                alert('Error creating post: ' + data.error);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Network error creating post');
        } finally {
            this.showLoading(false);
        }
    }

    async likePost(postId) {
        if (!app.isAuthenticated()) {
            alert('Please login to like posts');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/posts/${postId}/like`, {
                method: 'POST',
                headers: app.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                this.loadPosts(); // Reload to update likes
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }

    async openCommentModal(postId) {
        if (!app.isAuthenticated()) {
            alert('Please login to comment');
            return;
        }

        this.currentPostId = postId;
        const modal = document.getElementById('comment-modal');
        modal.style.display = 'flex';
        
        await this.loadComments(postId);
    }

    closeCommentModal() {
        const modal = document.getElementById('comment-modal');
        modal.style.display = 'none';
        this.currentPostId = null;
    }

    async loadComments(postId) {
        try {
            const response = await fetch(`${this.apiBase}/posts/${postId}/comments`, {
                headers: app.getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                this.displayComments(data.data);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    displayComments(comments) {
        const container = document.getElementById('comments-list');
        if (!container) return;

        if (!comments || comments.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No comments yet</p>';
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="comment">
                <img src="${comment.user.avatar}" alt="${comment.user.name}" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-username">${comment.user.name}</span>
                        <span class="comment-time">${this.formatTime(comment.createdAt)}</span>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                </div>
            </div>
        `).join('');
    }

    async addComment() {
        if (!this.currentPostId) return;

        const content = document.getElementById('comment-content').value;

        if (!content.trim()) {
            alert('Please enter comment content');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/posts/${this.currentPostId}/comments`, {
                method: 'POST',
                headers: app.getAuthHeaders(),
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (data.success) {
                document.getElementById('comment-content').value = '';
                await this.loadComments(this.currentPostId);
                this.loadPosts(); // Reload posts to update comment count
            } else {
                alert('Error adding comment: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Network error adding comment');
        }
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }

    showLoading(show) {
        app.showLoading(show);
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize posts manager
document.addEventListener('DOMContentLoaded', function() {
    window.postsManager = new PostsManager();
});