const url = require('url');
const userController = require('../controllers/userController');

class UserRoutes {
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const method = req.method;

        if (path === '/api/users' && method === 'GET') {
            userController.getAllUsers(req, res);
        } else if (path.startsWith('/api/users/') && path.endsWith('/follow') && method === 'POST') {
            userController.followUser(req, res);
        } else if (path.startsWith('/api/users/') && method === 'GET') {
            userController.getUserProfile(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'User route not found' }));
        }
    }
}

module.exports = new UserRoutes();