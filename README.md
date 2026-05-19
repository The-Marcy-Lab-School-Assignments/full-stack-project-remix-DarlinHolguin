# 🕰️ Pocket Watch

Pocket Watch is a full-stack expense tracking application that helps users take control of their daily spending habits. By allowing creators to log expenses across a wide variety of personal categories—such as food, restaurants, hobbies, video games, and gifts—Pocket Watch provides data clarity without requiring clunky bank connections. It is a streamlined tool built for anyone looking to be intentional about every dollar they spend.

---

## 👥 MVP User Stories

- **Auth:** As a guest, I can register for an account with a unique username and password.
- **Auth:** As a registered user, I can log in securely and log out of my session.
- **Session:** As a returning user, my session automatically rehydrates when I refresh the page so I stay logged in.
- **Read:** As a logged-in user, I can view a list of all my own logged expenses.
- **Create:** As a logged-in user, I can add a new expense with a title, amount, category, and an optional note.
- **Delete:** As a logged-in user, I can delete any of my own expenses, instantly updating my list.
- **Filter:** As a logged-in user, I can filter my expenses by category to easily spot my spending patterns.

---

## 📊 Database Schema

The database uses a clean one-to-many relationship where a single user can have multiple expenses assigned to them via a foreign key (user_id).

```SQL
users─────────────────────────────────────────────────────
id SERIAL PRIMARY KEY
username VARCHAR(50) UNIQUE NOT NULL
password_hash TEXT NOT NULL
created_at TIMESTAMP DEFAULT NOW()

expenses──────────────────────────────────────────────────
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
title VARCHAR(150) NOT NULL
amount NUMERIC(10, 2) NOT NULL
category VARCHAR(50) NOT NULL
note TEXT
created_at TIMESTAMP DEFAULT NOW()
```

### 🏷️ Supported Predefined Categories

Expenses can be flagged with any of the following values:
'food', 'restaurants', 'groceries', 'transport', 'hobbies', 'video games', 'gifts', 'clothing', 'subscriptions', 'other'

---

## 📑 API Contract

### Auth Endpoints

| Method | Endpoint           | Request Body               | Response                                 |
| :----- | :----------------- | :------------------------- | :--------------------------------------- |
| POST   | /api/auth/register | { "username", "password" } | { "id", "username" }                     |
| POST   | /api/auth/login    | { "username", "password" } | { "id", "username" }                     |
| DELETE | /api/auth/logout   | —                          | { "message": "Logged out successfully" } |
| GET    | /api/auth/me       | —                          | { "id", "username" } or null             |

### Expense Endpoints (All require authentication)

| Method | Endpoint          | Request Body                              | Response                                                     |
| :----- | :---------------- | :---------------------------------------- | :----------------------------------------------------------- |
| GET    | /api/expenses     | —                                         | [{ "id", "title", "amount", "category", "note", "user_id" }] |
| POST   | /api/expenses     | { "title", "amount", "category", "note" } | { "id", "title", "amount", "category", "note", "user_id" }   |
| DELETE | /api/expenses/:id | —                                         | { "message": "Expense deleted successfully" }                |

---

```
## 📂 Application Structure

pocket-watch/
├── frontend/
│ ├── src/
│ │ ├── adapters/
│ │ │ ├── auth-adapters.js
│ │ │ └── expense-adapters.js
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── ExpenseList.jsx
│ │ │ ├── ExpenseItem.jsx
│ │ │ └── AddExpenseForm.jsx
│ │ ├── pages/
│ │ │ ├── AuthPage.jsx
│ │ │ └── DashboardPage.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ └── package.json
│
├── server/
│ ├── db/
│ │ ├── schema.sql
│ │ └── seed.js
│ ├── middleware/
│ │ ├── checkAuthentication.js
│ │ └── logRoutes.js
│ ├── models/
│ │ ├── userModel.js
│ │ └── expenseModel.js
│ ├── controllers/
│ │ ├── authControllers.js
│ │ └── expenseControllers.js
│ ├── app.js
│ └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Environment Variables

In the backend/ directory, create a .env file based on the provided .env.template:
PORT=8000
PGURI=postgres://username:password@localhost:5432/pocket_watch
SESSION_SECRET=your_super_secret_session_key
NODE_ENV=development

### 2. Database Initialization

Ensure PostgreSQL is running locally, then initialize and seed your tables by running the seed script from the backend:
cd backend
npm install
npm run seed

### 3. Running the Backend Server

Start the Express API development server:
npm run dev

### 4. Running the Frontend Server

Open a new terminal window, navigate to the frontend directory, install dependencies, and start Vite:
cd frontend
npm install
npm run dev

---

## 🗺️ Roadmap (Stretch Features)

- 🔄 Edit Expense (Bonus Target): Add a PATCH /api/expenses/:id endpoint alongside an inline edit form on the frontend to modify mistakes.
- 🎯 Savings Goals: Introduce a goals feature where users can target a specific item (e.g., "Save $500 for a PS5") and track progress.
- 📊 Spending Summaries: Integrate a frontend data visualization library (like Chart.js or Recharts) to render total spending dynamically by category.
- 📅 Monthly Breakdown: Enable global date filters to let users look through previous months of log history.
