const db = require('../config/database');
const auth = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');

class PostController {
    getAllPosts(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const userPosts = db.posts.map(post => {
            const postUser = db.users.find(u => u.id === post.userId);
            const userLiked = db.likes.find(like => like.postId === post.id && like.userId === currentUser.id);
            const postComments = db.comments.filter(comment => comment.postId === post.id);
            
            return {
                ...post,
                user: {
                    id: postUser.id,
                    name: postUser.name,
                    username: postUser.username,
                    avatar: postUser.avatar
                },
                likes: db.likes.filter(like => like.postId === post.id).length,
                comments: postComments.length,
                liked: !!userLiked,
                commentPreview: postComments.slice(0, 2).map(comment => {
                    const commentUser = db.users.find(u => u.id === comment.userId);
                    return {
                        id: comment.id,
                        content: comment.content,
                        user: {
                            id: commentUser.id,
                            name: commentUser.name,
                            username: commentUser.username,
                            avatar: commentUser.avatar
                        }
                    };
                })
            };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: userPosts
        }));
    }

    createPost(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                const requiredCheck = validateRequired(['content'], data);
                if (!requiredCheck.isValid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: requiredCheck.error }));
                    return;
                }

                if (!data.content.trim()) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Post content cannot be empty' }));
                    return;
                }

                const post = {
                    id: db.posts.length + 1,
                    userId: currentUser.id,
                    content: data.content.trim(),
                    image: data.image || '',
                    likes: 0,
                    comments: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                db.posts.push(post);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    data: post
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
    }

    likePost(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const postId = parseInt(req.url.split('/')[3]);
        const existingLike = db.likes.find(like => like.postId === postId && like.userId === currentUser.id);

        if (existingLike) {
            // Unlike
            db.likes = db.likes.filter(like => !(like.postId === postId && like.userId === currentUser.id));
        } else {
            // Like
            db.likes.push({
                id: db.likes.length + 1,
                postId,
                userId: currentUser.id,
                createdAt: new Date().toISOString()
            });
        }

        const post = db.posts.find(p => p.id === postId);
        if (post) {
            post.likes = db.likes.filter(like => like.postId === postId).length;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            liked: !existingLike,
            likes: db.likes.filter(like => like.postId === postId).length
        }));
    }
}

module.exports = new PostController();