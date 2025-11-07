const db = require('../config/database');
const auth = require('../middleware/auth');

class UserController {
    getAllUsers(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const usersList = db.users.map(user => {
            const isFollowing = db.follows.find(f => f.followerId === currentUser.id && f.followingId === user.id);
            return {
                id: user.id,
                name: user.name,
                username: user.username,
                bio: user.bio,
                avatar: user.avatar,
                followers: user.followers,
                following: user.following,
                isFollowing: !!isFollowing,
                isCurrentUser: currentUser.id === user.id
            };
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: usersList
        }));
    }

    getUserProfile(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const userId = parseInt(req.url.split('/').pop());
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'User not found' }));
            return;
        }

        const userPosts = db.posts.filter(post => post.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(post => ({
                ...post,
                likes: db.likes.filter(like => like.postId === post.id).length,
                comments: db.comments.filter(comment => comment.postId === post.id).length,
                liked: !!db.likes.find(like => like.postId === post.id && like.userId === currentUser.id)
            }));

        const isFollowing = db.follows.find(f => f.followerId === currentUser.id && f.followingId === userId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    bio: user.bio,
                    avatar: user.avatar,
                    followers: user.followers,
                    following: user.following,
                    createdAt: user.createdAt
                },
                posts: userPosts,
                isFollowing: !!isFollowing,
                isOwnProfile: currentUser.id === userId
            }
        }));
    }

    followUser(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const followingId = parseInt(req.url.split('/')[3]);
        
        if (currentUser.id === followingId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Cannot follow yourself' }));
            return;
        }

        const existingFollow = db.follows.find(f => f.followerId === currentUser.id && f.followingId === followingId);
        
        if (existingFollow) {
            // Unfollow
            db.follows = db.follows.filter(f => !(f.followerId === currentUser.id && f.followingId === followingId));
            
            // Update user counts
            const follower = db.users.find(u => u.id === currentUser.id);
            const following = db.users.find(u => u.id === followingId);
            if (follower) follower.following--;
            if (following) following.followers--;
        } else {
            // Follow
            db.follows.push({
                id: db.follows.length + 1,
                followerId: currentUser.id,
                followingId: followingId,
                createdAt: new Date().toISOString()
            });
            
            // Update user counts
            const follower = db.users.find(u => u.id === currentUser.id);
            const following = db.users.find(u => u.id === followingId);
            if (follower) follower.following++;
            if (following) following.followers++;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            following: !existingFollow
        }));
    }
}

module.exports = new UserController();