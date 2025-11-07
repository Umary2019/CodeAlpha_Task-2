class Comment {
    constructor(id, postId, userId, content) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.createdAt = new Date().toISOString();
    }
}

module.exports = Comment;