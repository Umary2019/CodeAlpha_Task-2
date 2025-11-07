// In-memory database
const database = {
    users: [],
    posts: [],
    comments: [],
    follows: [],
    likes: []
};

// Seed initial data
function seedData() {
    if (database.users.length === 0) {
        const sampleUsers = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                username: "johndoe",
                password: Buffer.from("password123").toString('base64'),
                bio: "Digital creator and tech enthusiast",
                avatar: "https://ui-avatars.com/api/?name=John+Doe&background=3498db&color=fff",
                followers: 150,
                following: 89,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Sarah Wilson",
                email: "sarah@example.com",
                username: "sarahw",
                password: Buffer.from("password123").toString('base64'),
                bio: "Photographer and travel blogger",
                avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=e74c3c&color=fff",
                followers: 230,
                following: 145,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Mike Chen",
                email: "mike@example.com",
                username: "mikechen",
                password: Buffer.from("password123").toString('base64'),
                bio: "Software engineer and open source contributor",
                avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=27ae60&color=fff",
                followers: 89,
                following: 120,
                createdAt: new Date().toISOString()
            }
        ];
        database.users.push(...sampleUsers);
    }

    if (database.posts.length === 0) {
        const samplePosts = [
            {
                id: 1,
                userId: 1,
                content: "Just launched my new website! Built with modern web technologies and focusing on user experience.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
                likes: 24,
                comments: 5,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                userId: 2,
                content: "Sunset views from the mountains today. Nature always has a way of putting things in perspective. 🌄",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
                likes: 156,
                comments: 12,
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                userId: 3,
                content: "Working on some exciting new features for our open source project. The community feedback has been incredible! 💻",
                image: "",
                likes: 42,
                comments: 8,
                createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
            }
        ];
        database.posts.push(...samplePosts);
    }

    if (database.comments.length === 0) {
        const sampleComments = [
            { id: 1, postId: 1, userId: 2, content: "This looks amazing! Great work on the design.", createdAt: new Date().toISOString() },
            { id: 2, postId: 1, userId: 3, content: "Love the clean interface! What tech stack did you use?", createdAt: new Date().toISOString() },
            { id: 3, postId: 2, userId: 1, content: "Stunning capture! The colors are incredible.", createdAt: new Date().toISOString() }
        ];
        database.comments.push(...sampleComments);
    }

    if (database.likes.length === 0) {
        const sampleLikes = [
            { id: 1, postId: 1, userId: 2, createdAt: new Date().toISOString() },
            { id: 2, postId: 1, userId: 3, createdAt: new Date().toISOString() },
            { id: 3, postId: 2, userId: 1, createdAt: new Date().toISOString() },
            { id: 4, postId: 2, userId: 3, createdAt: new Date().toISOString() }
        ];
        database.likes.push(...sampleLikes);
    }

    if (database.follows.length === 0) {
        const sampleFollows = [
            { id: 1, followerId: 1, followingId: 2, createdAt: new Date().toISOString() },
            { id: 2, followerId: 1, followingId: 3, createdAt: new Date().toISOString() },
            { id: 3, followerId: 2, followingId: 1, createdAt: new Date().toISOString() }
        ];
        database.follows.push(...sampleFollows);
    }
}

// Initialize data
seedData();

module.exports = database;