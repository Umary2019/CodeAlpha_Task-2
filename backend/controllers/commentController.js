const db = require('../config/database');
const auth = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');

class CommentController {
    getPostComments(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const postId = parseInt(req.url.split('/')[3]);
        const postComments = db.comments.filter(comment => comment.postId === postId)
            .map(comment => {
                const commentUser = db.users.find(u => u.id === comment.userId);
                return {
                    ...comment,
                    user: {
                        id: commentUser.id,
                        name: commentUser.name,
                        username: commentUser.username,
                        avatar: commentUser.avatar
                    }
                };
            })
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: postComments
        }));
    }

    addComment(req, res) {
        const currentUser = auth(req, res);
        if (!currentUser) return;

        const postId = parseInt(req.url.split('/')[3]);

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
                    res.end(JSON.stringify({ success: false, error: 'Comment content cannot be empty' }));
                    return;
                }

                const comment = {
                    id: db.comments.length + 1,
                    postId,
                    userId: currentUser.id,
                    content: data.content.trim(),
                    createdAt: new Date().toISOString()
                };

                db.comments.push(comment);

                // Update post comments count
                const post = db.posts.find(p => p.id === postId);
                if (post) {
                    post.comments = db.comments.filter(c => c.postId === postId).length;
                }

                const commentUser = db.users.find(u => u.id === currentUser.id);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    data: {
                        ...comment,
                        user: {
                            id: commentUser.id,
                            name: commentUser.name,
                            username: commentUser.username,
                            avatar: commentUser.avatar
                        }
                    }
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
    }
}

module.exports = new CommentController();