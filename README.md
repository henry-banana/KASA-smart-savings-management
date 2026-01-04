# KASA Smart Savings Management

This repository contains the source code for **KASA Smart Savings Management**, a course project for the subject **Introduction to Software Engineering** at FIT@HCMUS.

## Project Overview

KASA is a web-based application designed to manage savings accounts, supporting features such as account creation, deposits, withdrawals, reporting, and regulations management. The system demonstrates the application of software engineering principles, including modular design, testing, and role-based access control.

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, JWT Authentication
- **Testing:** Jest, React Testing Library
- **Deployment:**
  - Frontend: Vercel
  - Backend: AW2 EC2

## Live Demo

The web application is deployed at:  
👉 **[https://kasa-smart-savings-management.vercel.app](https://kasa-smart-savings-management.vercel.app)**

## Features

- User authentication and role-based access (Teller, Accountant, Admin)
- Open, deposit, and withdraw savings accounts
- Customer and account search
- Daily and monthly financial reports
- Regulation management for savings products
- Responsive UI and error handling

## How to Run Locally

1. **Clone the repository:**
   ```sh
   https://github.com/nphoang-itus/KASA_SmartSavingsManagement.git
   cd KASA_SmartSavingsManagement
   ```

2. **Install dependencies for frontend and backend:**
   ```sh
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Start the backend server:**
   ```sh
   npm run dev
   ```

4. **Start the frontend:**
   ```sh
   cd ../frontend
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```txt
├── backend/                        # Backend source code (Node.js, Express)
│   ├── src/
│   │   ├── config/                 # Configuration files (DB, Swagger)
│   │   ├── controllers/            # Route handlers (business logic)
│   │   ├── middleware/             # Express middlewares (auth, validation, logger)
│   │   ├── models/                 # Data models (ORM/DB schema)
│   │   ├── repositories/           # Data access layer (DB queries)
│   │   ├── routers/                # API route definitions
│   │   ├── services/               # Business logic/services
│   │   └── utils/                  # Utility/helper functions
│   ├── tests/                      # Unit & integration tests for backend
│   ├── app.js                      # Main Express app entry point
│   ├── package.json                # Backend dependencies & scripts
│   └── ...                         # Other backend config files
├── frontend/                       # Frontend source code (React)
│   ├── public/                     # Static assets (favicon, svg, etc.)
│   ├── src/
│   │   ├── api/                    # API client functions
│   │   ├── assets/                 # Images, vectors, etc.
│   │   ├── components/             # Reusable React components
│   │   ├── config/                 # Frontend config (env, constants)
│   │   ├── constants/              # Constant values (roles, messages)
│   │   ├── contexts/               # React context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── mocks/                  # Mock data & adapters for testing/dev
│   │   ├── pages/                  # Page-level React components (routes)
│   │   ├── services/               # Business logic/services (frontend)
│   │   ├── styles/                 # CSS files
│   │   ├── utils/                  # Utility/helper functions
│   │   ├── App.jsx                 # Main React app component
│   │   └── main.jsx                # React entry point
│   ├── tests/                      # Frontend unit/component/integration tests
│   ├── package.json                # Frontend dependencies & scripts
│   └── ...                         # Other frontend config files
├── LICENSE                         # Project license
├── package.json                    # Root dependencies & scripts (if any)
└── README.md                       # Project documentation
```

## Authors

| Student ID | Name                    |
|------------|-------------------------|
| 23120242   | Nguyễn Văn Bình Dương   |
| 23120252   | Nguyễn Phúc Hậu         |
| 23120255   | Lê Tấn Hiệp             |
| 23120262   | Tống Dương Thái Hoà     |
| 23120264   | Nguyễn Phúc Hoàng       |
