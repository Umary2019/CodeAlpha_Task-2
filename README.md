Name: UMAR ABUBAKAR

Company: CODEALPHA

ID: CA/SE1/20845

Domain: Full Stack Web Development

Duration: 20th October to 20th November, 2025

Mentor: SWATI SRIVASTAVA


# SocialConnect - Social Media Platform

A complete full-stack social media application built with vanilla JavaScript and Node.js.

## Features

### 🔐 Authentication
- User registration with username, email, and password
- User login with email and password
- JWT token-based authentication
- Persistent login sessions

### 📱 Social Features
- **Create Posts**: Share text and image posts
- **Like System**: Like and unlike posts
- **Comments**: Add comments to posts
- **User Profiles**: View user profiles with posts
- **Follow System**: Follow and unfollow other users
- **Explore Page**: Discover and connect with other users

### 🎨 User Interface
- Responsive design
- Modern and clean interface
- Real-time updates
- Loading states and error handling

## Project Structure
social-media-app/
├── backend/
│ ├── config/
│ │ └── database.js # In-memory database setup
│ ├── controllers/
│ │ ├── authController.js # Authentication logic
│ │ ├── userController.js # User management
│ │ ├── postController.js # Post operations
│ │ └── commentController.js # Comment operations
│ ├── middleware/
│ │ ├── auth.js # Authentication middleware
│ │ └── validation.js # Input validation
│ ├── models/
│ │ ├── User.js # User model
│ │ ├── Post.js # Post model
│ │ ├── Comment.js # Comment model
│ │ └── Follow.js # Follow model
│ ├── routes/
│ │ ├── auth.js # Auth routes
│ │ ├── users.js # User routes
│ │ ├── posts.js # Post routes
│ │ └── comments.js # Comment routes
│ ├── package.json
│ └── server.js # Main server file
├── frontend/
│ ├── css/
│ │ ├── style.css # Main styles
│ │ └── auth.css # Auth page styles
│ ├── js/
│ │ ├── app.js # Main application logic
│ │ ├── auth.js # Authentication handling
│ │ ├── posts.js # Post management
│ │ └── profile.js # Profile management
│ ├── index.html # Landing page
│ ├── login.html # Login page
│ ├── register.html # Registration page
│ ├── feed.html # Main feed
│ ├── profile.html # User profile
│ └── explore.html # User discovery
└── README.md

