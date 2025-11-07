class Follow {
    constructor(id, followerId, followingId) {
        this.id = id;
        this.followerId = followerId;
        this.followingId = followingId;
        this.createdAt = new Date().toISOString();
    }
}

module.exports = Follow;