class User {
    constructor(id, name, email, username, password, bio = '', avatar = '') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.bio = bio;
        this.avatar = avatar;
        this.followers = 0;
        this.following = 0;
        this.createdAt = new Date().toISOString();
    }
}

module.exports = User;