# 📰 News Portal - Full Stack Web Application

A full-stack News Portal built using **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend. This platform enables admins to create, edit, and manage news articles, while users can browse, like/dislike, and comment on posts. Users authenticate using **Auth0**, and admins use **local email/password login**.

---

## 🚀 Features

### 👤 User Side (via Auth0)
- User login via Auth0 (Google or email)
- Browse latest news posts
- View full news details
- Like/Dislike news
- Add comments on posts
- Blocked users cannot access certain news

### 🛠️ Admin Side (via local login)
- Admin login with email and password
- Add, edit, and delete news articles
- View all users who interacted
- Block specific users (by email) from individual news posts

---

## 🧰 Tech Stack

### Frontend:
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Auth0

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcrypt
- JSON Web Tokens (JWT)
- dotenv

---

## 🗂️ Project Structure

```
news-portal/
├── client/                  # Frontend (Vite + React + Tailwind)
│   ├── pages/               # Page-level components
│   ├── components/          # Shared components
│   ├── utils/               # Helper functions (e.g., API utils)
│   ├── App.jsx
│   ├── main.jsx
│   └── tailwind.config.js
│
├── server/                  # Backend (Node + Express + MongoDB)
│   ├── routes/              # Route handlers
│   ├── controllers/         # Controller logic
│   ├── models/              # MongoDB models
│   ├── middleware/          # Middleware (auth, error handling)
│   ├── config/              # DB connection and config
│   └── server.js            # Entry point
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/news-portal.git
cd news-portal
```

### 2. Setup the Backend
```bash
cd server
npm install
```

- Create a `.env` file in `server/` with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

- Start the backend:
```bash
npm start
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
```

- Create a `.env` file in `client/` with the following (for Auth0):
```env
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:5000
```

- Start the frontend:
```bash
npm run dev
```

---

## 🌐 Deployment

### Backend (Render):
1. Deploy `server/` folder to [Render](https://render.com/)
2. Add environment variables in the Render dashboard
3. Ensure MongoDB is accessible remotely (use MongoDB Atlas)

### Frontend (Vercel):
1. Deploy `client/` folder to [Vercel](https://vercel.com/)
2. Set required environment variables in Vercel
3. Connect to backend API hosted on Render

---

## ✅ To Do / Improvements
- Pagination for news list
- User profile page
- Admin dashboard analytics
- Search and filter news
- Email notifications for updates (optional)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Aditya**  
🔗 [Portfolio](https://aditya-csedev.vercel.app/)  
🔗 [LinkedIn](https://www.linkedin.com/in/adityaacse)

---
