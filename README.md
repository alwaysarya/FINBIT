# 🏦 FINBIT - Full Stack Banking Application

FINBIT is a modern, full-stack banking web application built with React, Node.js, Express, and MongoDB. It features a beautiful dark-themed UI and allows users to manage their accounts, transfer money, and view transaction history.

## ✨ Features

- **User Authentication:** Secure Register/Login using JWT (JSON Web Tokens).
- **Dashboard:** View real-time account balance and account number.
- **Transfer Money:** Send money to other users by account number.
- **Deposit Money:** Add money to your account (for testing purposes).
- **Transaction History:** View a detailed log of all past transactions.
- **User Profile:** View personal details and account information.
- **Responsive Design:** Works beautifully on both desktop and mobile devices.
- **Toast Notifications:** Smooth success/error popups.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- CSS3 (Custom Styling, Dark Theme)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Bcrypt.js (Password hashing)

## 🚀 How to Run Locally

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine.

### 1. Clone the Repository
\`\`\`bash
git clone <your-github-repo-link>
cd FINBIT
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd server
npm install
\`\`\`
Create a \`.env\` file in the \`server\` directory and add:
\`\`\`env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/finbit
JWT_SECRET=your_super_secret_key
NODE_ENV=development
\`\`\`
Start the backend:
\`\`\`bash
npm run dev
\`\`\`

### 3. Setup Frontend
Open a new terminal:
\`\`\`bash
cd client
npm install
\`\`\`
Start the frontend:
\`\`\`bash
npm run dev
\`\`\`

### 4. Open the App
Go to \`http://localhost:5173\` in your browser.

## 🔒 API Endpoints

- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/account/me\` - Get account details
- \`GET /api/account/transactions\` - Get transaction history
- \`POST /api/transaction/transfer\` - Transfer money
- \`POST /api/transaction/deposit\` - Deposit money

---
Made with ❤️ by Aryan Thakur
