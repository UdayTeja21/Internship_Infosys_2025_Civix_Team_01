# 🏛️ Digital Civic Engagement & Petition Platform

**Digital Civic Engagement & Petition Platform** is a full-stack MERN web application that empowers citizens to actively participate in civic processes.
Users can **create, update, sign, and delete petitions**, **participate in polls**, and **provide community feedback**, all from their personalized **Citizen Dashboard**.

Officials, on the other hand, can **verify petitions**, **monitor polls**, **respond to feedback**, **track petition progress**, and **generate monthly civic reports** from their **Official Dashboard**.
The system is built using **Node.js**, **Express**, **React**, and **MongoDB** to ensure a smooth, secure, and scalable experience.

---

## ✨ Features

* 👤 Users can create, update, sign, and delete petitions
* 🗳️ Participate in active polls created by officials
* 📊 View petition status and updates on the dashboard
* 💬 Community feedback system
* 🧑‍💼 Officials can create and manage polls related to petitions
* 📨 Password reset with email verification (via **Nodemailer**)
* 📅 **Officials can generate monthly civic reports** 
* 🔐 Secure authentication using JWT
* ⚡ Real-time data updates from MongoDB

---

## 🧠 Tech Stack

**Frontend:** React, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Email Service:** Nodemailer
**Authentication:** JWT, bcrypt.js
**Version Control:** Git & GitHub

---

## ⚙️ How to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/UdayTeja21/Internship_Infosys_2025_Civix_Team_01.git
   ```

2. **Install backend dependencies**

   ```bash
   cd Backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../Frontend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory and add:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:3000
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

5. **Start the backend server**

   ```bash
   npm run dev
   # or
   node server.js
   ```

6. **Start the frontend**

   ```bash
   npm run dev
   # or
   npm start
   ```

7. Open the app in your browser at 👉 `http://localhost:3000/`

---

## 🧩 How It Works

* 📝 Users register and log in to the platform.
* 📑 Authenticated users can perform CRUD operations on petitions.
* 🗳️ Users can participate in polls and provide community feedback.
* 🔐 If a user forgets their password, they can request a reset link via email.
* 🧾 Officials verify petitions, manage polls, respond to feedback, and generate civic reports.
* 💾 All data is stored securely in **MongoDB** and reflected in real-time on the dashboard.

---

## 📁 Folder Structure

```
├── Backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Petition.js
│   │   ├── Test.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── petitions.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   └── Sample Backend.txt
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.tsx
│   │   ├── pages/
│   │   │   ├── CreatePetitions.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OfficialDashboard.jsx
│   │   │   ├── Officials.jsx
│   │   │   ├── ParticipatePolls.jsx
│   │   │   ├── Petitions.jsx
│   │   │   ├── Polls.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── TrackResponses.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── postcss.config.js
```

---

## 🚀 Future Feature Improvements

* 📧 Add email notifications for petition updates
* 🎨 Enhance UI/UX design for better accessibility
* 🧾 Integrate analytics dashboard for petition trends
  

---

