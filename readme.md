# 🏏 GICPL - Grand Indian Cricket Premier League

A full-stack web application built using the MERN stack to manage player auctions, teams, match schedules, stats, and MVP rankings for the GICPL fantasy cricket league.

---

## 🚀 Live Demo

[🔗 Visit GICPL Website]( https://gicpl-fullstack-frontend.onrender.com)

---

## 📌 Features

- 🧑‍💼 **Player Management** – Add, update, and remove players with base price, auction price, and role.
- 💰 **Auction Dashboard** – Real-time auction updates with team-wise spend tracking.
- 🏏 **Team Building** – Franchise-wise player allocation and budget tracking.
- 📊 **Leaderboard & MVP** – Auto-calculated rankings based on live stats and match data.
- 🗓️ **Schedule Management** – Add, edit, and view upcoming matches.
- 🔐 **Admin Panel** – Secure admin-only features for auction control, player stats update, and team config.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Others |
|---------|---------|----------|--------|
| ReactJS | ExpressJS | MongoDB | Node.js, Axios, TailwindCSS, JWT, Cloudinary |

---

## 🗂️ Folder Structure

gicpl/ │ ├── backend/ │ ├── models/ │ ├── routes/ │ ├── controllers/ │ ├── middleware/ │ ├── config/ │ └── server.js │ ├── frontend/ │ ├── public/ │ └── src/ │ ├── components/ │ ├── pages/ │ ├── api/ │ ├── utils/ │ ├── App.js │ └── index.js │ ├── .env ├── package.json └── README.md


---

## 🧪 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/gicpl.git
cd gicpl
```

2. Backend Setup
```
cd backend
npm install
npm run dev
```

3. Frontend Setup
```
cd frontend
npm install
npm start
```
Make sure MongoDB is running and .env files are configured in both /backend and /frontend.


🔐 Environment Variables

Backend .env
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Frontend .env
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

📈 Future Enhancements

->Player profile page with career stats

->Live score integration

->In-app chat for team managers

->AI-based MVP prediction

->Auction timer with WebSocket