📊 Smart Employee Management System (Frontend)

A modern, responsive, and production-ready Employee Management System frontend built using React.js, Vite, and Tailwind CSS, designed for efficient HR and workforce management with real-time backend integration.

🚀 Overview

This application connects to a Spring Boot backend API and provides a complete HR management dashboard for managing employees, departments, salary processing, reports, and analytics.

It is designed as a SaaS-style enterprise UI with clean architecture, reusable components, and scalable structure.

✨ Key Features
🔐 Authentication & Security
JWT-based authentication system
Protected routes with role-based access
Persistent login using localStorage
Forgot password (security question-based flow)
Automatic session handling
📊 Dashboard & Analytics
Real-time statistics (employees, departments, salaries)
Interactive charts using Recharts
Department-wise insights
Recent activity overview
👨‍💼 Employee Management
Full CRUD operations (Create, Read, Update, Delete)
Advanced search, filter, and sorting
Pagination support
Department mapping
Clean and responsive table UI
🏢 Department Module
Department overview cards
Employee distribution analytics
Department-wise salary insights
💰 Salary & Payroll System
Salary calculation engine
Payslip generation
Tax, bonus, and PF handling
Export-ready payroll reports
📑 Reports & Analytics
Performance analytics
Salary reports
Department reports
Export support (CSV / PDF)
🔔 Notification System
Real-time notification dropdown UI
Unread count badge
Mark as read / mark all as read
Event-based notifications (employee actions)
🎨 UI/UX Features
Fully responsive design (mobile, tablet, desktop)
Dark / Light mode support
Reusable component architecture
Smooth animations using Framer Motion
Toast notifications for user feedback
🧱 Tech Stack
React 18
Vite
Tailwind CSS
Axios
Recharts
React Router DOM
Context API
Framer Motion
React Hot Toast
📁 Project Structure
src/
│
├── api/               # API service layer (Axios setup)
├── components/        # Reusable UI components
│   ├── layout/        # Navbar, Sidebar
│   └── ui/            # Buttons, Inputs, Tables, Modals
├── context/           # Auth & Theme context
├── layouts/           # Main application layout
├── pages/             # Application pages
│   ├── auth/
│   ├── dashboard/
│   ├── employees/
│   ├── departments/
│   ├── salary/
│   ├── reports/
│   └── settings/
├── routes/            # Routing & protected routes
├── assets/            # Static assets
└── main.jsx           # Application entry point
⚙️ Backend Integration

This frontend is designed to work with a Spring Boot backend API.

🔗 Base URL
http://localhost:4141
🔐 Authentication Flow
JWT token stored in localStorage
Axios interceptor attaches token automatically
Handles 401/403 responses globally
🛠️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/smart-ems-frontend.git
cd smart-ems-frontend
2️⃣ Install Dependencies
npm install
3️⃣ Start Development Server
npm run dev

Application runs at:

http://localhost:5173
🔑 Default Login (Development Only)
Username: admin
Password: Admin@123
📡 API Requirements

Ensure backend is running at:

http://localhost:4141

Required modules:

Authentication API
Employee API
Department API
Salary API
Reports API
Notification API (optional enhancement)
🔔 Notification System (Optional Upgrade)

Planned enhancements:

Backend-driven persistent notifications
Database-stored alerts
Real-time updates
Bell icon dropdown system
📦 Build for Production
npm run build
🧪 Testing Checklist
Login authentication works
Protected routes function correctly
Employee CRUD operations work
Dashboard charts load properly
API integration successful
Responsive UI verified across devices
🚀 Future Improvements
WebSocket real-time updates
Advanced HR analytics dashboard
Attendance tracking module
Email notification system
Role-based admin panel enhancements
👨‍💻 Author

Shivanand Ulgulwad

📜 License

This project is for educational and portfolio demonstration purposes.
