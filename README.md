📊 Smart Employee Management System (Frontend)

A modern, responsive, and production-ready Employee Management System frontend built using React.js + Vite + Tailwind CSS, designed for efficient HR and workforce management with real-time backend integration.

🚀 Live Overview

This frontend connects to a Spring Boot backend API and provides a complete HR management dashboard including employees, departments, salary processing, reports, and analytics.

✨ Key Features
🔐 Authentication & Security
JWT-based login system
Protected routes with role-based access
Session persistence using localStorage
Forgot password (security question-based flow)
Auto logout on token expiry
📊 Dashboard & Analytics
Real-time stats (employees, departments, salaries)
Interactive charts using Recharts
Department-wise analytics
Recent activity overview
👨‍💼 Employee Management
Full CRUD operations
Advanced search, filter, and sorting
Pagination support
Department mapping
Clean tabular UI
🏢 Department Module
Department overview cards
Employee distribution per department
Salary insights by department
💰 Salary & Payroll System
Salary calculation engine
Payslip generation
Bonus, tax, and PF handling
Export-ready payroll reports
📑 Reports & Analytics
Performance reports
Salary analytics
Department reports
Export support (CSV / PDF)
🔔 Notification System
Real-time notification dropdown
Unread count badge
Mark as read / mark all as read
Event-based notifications (Employee add/update/delete)
🎨 UI/UX Features
Fully responsive design (mobile + desktop)
Dark / Light mode support
Reusable UI component system
Smooth animations (Framer Motion)
Toast notifications (react-hot-toast)
🧱 Tech Stack
⚛️ React 18
⚡ Vite
🎨 Tailwind CSS
🔗 Axios (API integration)
📊 Recharts (data visualization)
🧠 Context API (state management)
🎞 Framer Motion (animations)
📁 Project Structure
src/
│
├── api/               # API service layer (Axios clients)
├── components/        # Reusable UI components
│   ├── layout/
│   └── ui/
├── context/           # Auth & Theme context
├── layouts/           # Main layout structure
├── pages/             # Application pages
│   ├── auth/
│   ├── dashboard/
│   ├── employees/
│   ├── departments/
│   ├── salary/
│   ├── reports/
│   └── settings/
├── routes/            # App routing & protected routes
├── assets/            # Static assets
└── main.jsx           # App entry point
⚙️ Backend Integration

This frontend is designed to work with a Spring Boot backend API.

🔗 Base URL
http://localhost:4141
🔐 Authentication
JWT token stored in localStorage
Axios interceptor automatically attaches token
🛠️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/smart-ems-frontend.git
cd smart-ems-frontend
2️⃣ Install Dependencies
npm install
3️⃣ Start Development Server
npm run dev

App runs at:

http://localhost:5173
🔑 Default Login (Development Only)
Username: admin
Password: Admin@123
📡 API Requirements

Ensure backend is running at:

http://localhost:4141

Required modules:

Auth API (/auth/login, /auth/forgot-password)
Employee API
Department API
Salary API
Reports API
Notification API (optional enhancement)
🔔 Notification System (Planned/Optional Upgrade)
Backend-driven notifications
Stored in database
Real-time UI updates
Bell icon dropdown system
📦 Build for Production
npm run build
🧪 Testing Checklist
✔ Login authentication works
✔ Protected routes working
✔ Employee CRUD operations
✔ Department analytics load
✔ Dashboard charts render
✔ API integration successful
✔ Responsive UI verified
🚀 Future Improvements
WebSocket-based real-time updates
Advanced HR analytics dashboard
Role-based admin panel
Email notifications system
Attendance tracking module
👨‍💻 Author

Shivanand Ulgulwad

📜 License

This project is licensed for educational and portfolio use.
