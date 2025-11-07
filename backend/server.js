const http = require('http');
const url = require('url');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// Import database
const db = require('./config/database');

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    console.log(`${method} ${path}`);

    // Route handling
    if (path.startsWith('/api/auth')) {
        authRoutes.handleRequest(req, res);
    } else if (path.startsWith('/api/users')) {
        userRoutes.handleRequest(req, res);
    } else if (path.startsWith('/api/posts')) {
        postRoutes.handleRequest(req, res);
    } else if (path.startsWith('/api/comments')) {
        commentRoutes.handleRequest(req, res);
    } else if (path === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Social Media API is running!',
            endpoints: {
                auth: '/api/auth',
                users: '/api/users',
                posts: '/api/posts',
                comments: '/api/comments'
            }
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Route not found' }));
    }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Social Media Server running on http://localhost:${PORT}`);
    console.log(`👤 ${db.users.length} users loaded`);
    console.log(`📝 ${db.posts.length} posts loaded`);
    console.log(`💬 ${db.comments.length} comments loaded`);
    console.log(`👥 ${db.follows.length} follows loaded`);
});