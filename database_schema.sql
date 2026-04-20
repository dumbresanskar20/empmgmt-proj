-- Note: Your current application uses MongoDB (a NoSQL database) which does not require SQL queries to create databases and collections.
-- Mongoose automatically creates collections when data is inserted. 
-- However, if you are looking for the relational SQL equivalents based on your Mongoose schemas, here they are:

CREATE DATABASE IF NOT EXISTS employee_mgmt;
USE employee_mgmt;

-- 1. Users Table (Maps to User.js model)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Maps to MongoDB ObjectId
    employeeId VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    phone VARCHAR(20),
    city VARCHAR(100),
    dob DATE,
    bloodGroup ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''),
    profileImage VARCHAR(500) DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1b. User Documents Table (Maps to the embedded 'documents' array in User.js)
CREATE TABLE IF NOT EXISTS user_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    filename VARCHAR(255),
    originalName VARCHAR(255),
    path VARCHAR(500),
    mimetype VARCHAR(100),
    docType VARCHAR(100),
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Leaves Table (Maps to Leave.js model)
CREATE TABLE IF NOT EXISTS leaves (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    employeeId VARCHAR(50) NOT NULL,
    employeeName VARCHAR(255),
    leaveType ENUM('sick', 'casual', 'annual', 'maternity', 'other') DEFAULT 'casual',
    fromDate DATE NOT NULL,
    toDate DATE NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    adminComment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Salaries Table (Maps to Salary.js model)
CREATE TABLE IF NOT EXISTS salaries (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    employeeId VARCHAR(50) NOT NULL,
    employeeName VARCHAR(255),
    month VARCHAR(20), -- e.g. "2024-04"
    basic DECIMAL(10, 2) DEFAULT 0,
    bonus DECIMAL(10, 2) DEFAULT 0,
    deductions DECIMAL(10, 2) DEFAULT 0,
    netSalary DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- Older / Alternative Models (Employee & Document)
-- ==========================================

-- 4. Employees Table (Maps to Employee.js model)
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    joiningDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    avatar VARCHAR(500) DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Documents Table (Maps to Document.js model)
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(255) PRIMARY KEY,
    employeeId VARCHAR(255) NOT NULL,
    documentType ENUM('Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Utility Bills') NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    originalName VARCHAR(255),
    fileSize INT,
    mimeType VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);
