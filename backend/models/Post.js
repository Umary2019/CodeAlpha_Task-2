class Post {
    constructor(id, userId, content, image = '') {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.image = image;
        this.likes = 0;
        this.comments = 0;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
}

module.exports = Post;