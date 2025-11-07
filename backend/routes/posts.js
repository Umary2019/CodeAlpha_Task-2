const url = require('url');
const postController = require('../controllers/postController');

class PostRoutes {
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const method = req.method;

        if (path === '/api/posts' && method === 'GET') {
            postController.getAllPosts(req, res);
        } else if (path === '/api/posts' && method === 'POST') {
            postController.createPost(req, res);
        } else if (path.startsWith('/api/posts/') && path.endsWith('/like') && method === 'POST') {
            postController.likePost(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Post route not found' }));
        }
    }
}

module.exports = new PostRoutes();