# 📊 Smart Employee Management System (Frontend)

A modern, responsive, and production-ready Employee Management System frontend built using React.js, Vite, and Tailwind CSS, designed for efficient HR and workforce management with real-time backend integration.

---

# 🚀 Overview

This frontend connects to a Spring Boot backend API and provides a complete HR dashboard for managing employees, departments, salary processing, reports, and analytics.

It is designed as a SaaS-style enterprise UI with clean architecture, reusable components, and scalable folder structure.

---

# ✨ Features

## 🔐 1. Authentication & Security
- JWT-based authentication system
- Login functionality
- Protected routes (role-based access)
- Persistent login using localStorage
- Forgot password (security question flow)
- Auto logout on token expiry

---

## 📊 2. Dashboard & Analytics
- Real-time employee statistics
- Department insights
- Salary summaries
- Interactive charts using Recharts
- Recent activity overview

---

## 👨‍💼 3. Employee Management
- Add Employee
- Update Employee
- Delete Employee
- Search, filter, and sort employees
- Pagination support
- Department mapping
- Clean responsive table UI

---

## 🏢 4. Department Module
- Department overview cards
- Employee distribution per department
- Department-wise analytics
- Salary insights by department

---

## 💰 5. Salary & Payroll System
- Salary calculation UI
- Payslip generation UI
- Bonus, tax, and PF breakdown
- Payroll reports visualization

---

## 📑 6. Reports & Analytics
- Salary reports
- Performance reports
- Department reports
- Export-ready UI (CSV/PDF support backend-ready)

---

## 🔔 7. Notification System (UI Layer)
- Notification dropdown UI
- Unread count badge
- Mark as read / mark all as read UI
- Event-based notifications (employee actions)

---

## 🎨 8. UI / UX Features
- Fully responsive design (mobile, tablet, desktop)
- Dark / Light mode support
- Reusable component architecture
- Smooth animations using Framer Motion
- Toast notifications (react-hot-toast)

---

# 🧱 Technology Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Context API (State Management)
- Recharts
- Framer Motion
- React Hot Toast

---

# 📁 Project Structure

src/
│
├── api/              # API service layer (Axios setup)
├── components/       # Reusable UI components
│   ├── layout/
│   └── ui/
├── context/          # Auth & Theme context
├── layouts/          # Main layout (Navbar, Sidebar)
├── pages/            # Application pages
│   ├── auth/
│   ├── dashboard/
│   ├── employees/
│   ├── departments/
│   ├── salary/
│   ├── reports/
│   └── settings/
├── routes/           # Routing system
├── assets/           # Static assets
└── main.jsx          # Entry point

---

# ⚙️ Backend Integration

This frontend is designed to work with a Spring Boot backend API.

---

# 🔗 Base URL

http://localhost:4141

---

# 🔐 Authentication Flow

- JWT token stored in localStorage
- Axios interceptor automatically attaches token
- Handles 401 / 403 responses globally

---

# 🛠️ Installation & Setup

## Clone Repository

git clone https://github.com/your-username/smart-ems-frontend.git

---

## Install Dependencies

npm install

---

## Start Development Server

npm run dev

---

# 🌐 Application Runs At

http://localhost:5173

---

# 🔑 Default Login (Development Only)

Username: admin  
Password: Admin@123  

---

# 📡 API Requirements

Backend must be running at:

http://localhost:4141

Required modules:
- Authentication API
- Employee API
- Department API
- Salary API
- Report API



---

# 📦 Build for Production

npm run build

---

# 🧪 Testing Checklist

- Login authentication works
- Protected routes working
- Employee CRUD operations working
- Dashboard charts rendering
- API integration successful
- Responsive UI verified
- Theme switching working

---

# 🚀 Future Improvements

- WebSocket real-time notifications
- Advanced HR analytics dashboard
- Attendance tracking module
- Email notification system
- Role-based admin panel
- Export system (CSV / PDF)

---

# 👨‍💻 Author

Developed by Shivanand Ulgulwad

---

# 📜 License

This project is for educational and portfolio demonstration purposes only.
