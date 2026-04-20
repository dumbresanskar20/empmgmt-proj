# EmpSphere - Employee Management System

A full-stack Employee Management System built with Node.js, Express, MongoDB Atlas, and a responsive HTML/CSS/JS frontend featuring Chart.js analytics.

## Features
- **Admin Dashboard**: Comprehensive charts, employee approvals, leave tracking, and salary management.
- **Employee Portal**: Leave application, document uploading, profile management, and personal analytics.
- **Role-Based Auth**: Secure JWT authentication and bcrypt password hashing.

---

## 🚀 How to Run the Project

Since the frontend is directly served by the backend server, you only need to run **one command** to start the entire application!

### 1. Open your Terminal (or Command Prompt)
Navigate to the `backend` folder:
```bash
cd backend
```

### 2. Start the Server
Run the following command:
```bash
npm start
```
*(Alternatively, you can use `npm run dev` to start it with Nodemon for automatic restarts during development).*

### 3. Access the Application
Once you see the message `✅ MongoDB Connected`, open your web browser and go to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🔑 Login Credentials

### Admin Login (Pre-configured)
- **Email**: `Admin@gmail.com`
- **Password**: `AdminPassword123`

### Employee Login
1. Go to **Sign Up** from the homepage.
2. Fill in the details and upload at least one document.
3. The account will be in **Pending** status.
4. Log in as an **Admin** to approve the new employee.
5. After approval, the employee can log in with their registered credentials!
