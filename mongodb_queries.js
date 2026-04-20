// Your project uses MongoDB (NoSQL) with Mongoose. 
// In MongoDB, you don't actually need to "create" a database or a collection explicitly. 
// They are created automatically the exact moment you insert the first document.
// 
// However, if you want to run explicit MongoDB Shell (mongosh) commands to initialize 
// your database, collections, and set up the indexes/rules just like your Mongoose models, 
// here are the exact MongoDB queries:

// ==========================================
// 1. SELECT / CREATE THE DATABASE
// ==========================================
use employeeDB;

// ==========================================
// 2. CREATE COLLECTIONS & INDEXES
// ==========================================

// Create Users Collection
db.createCollection("users");
// Create Unique Indexes for Users (Ensures no two users have same email or employeeId)
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "employeeId": 1 }, { unique: true, sparse: true });

// Create Leaves Collection
db.createCollection("leaves");
db.leaves.createIndex({ "userId": 1 });

// Create Salaries Collection
db.createCollection("salaries");
db.salaries.createIndex({ "userId": 1 });

// Create Documents Collection
db.createCollection("documents");
db.documents.createIndex({ "employeeId": 1 });

// ==========================================
// 3. EXAMPLE QUERIES USED IN YOUR BACKEND
// ==========================================

// Example: How a New Employee Signup is Inserted
db.users.insertOne({
  employeeId: "EMP001",
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$hashedpasswordstring",
  role: "employee",
  status: "pending",
  phone: "1234567890",
  city: "Mumbai",
  dob: new Date("1995-05-15"),
  bloodGroup: "O+",
  profileImage: "",
  documents: [
    {
      filename: "170000000-aadhar.pdf",
      originalName: "aadhar.pdf",
      path: "/uploads/documents/170000000-aadhar.pdf",
      mimetype: "application/pdf",
      docType: "Aadhar",
      uploadedAt: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Example: How Admin Logs In (Finds User by Email)
db.users.findOne({ email: "admin@gmail.com" });

// Example: How an Employee Applies for Leave
db.leaves.insertOne({
  userId: ObjectId("60d5ec49b20b4a1b2c8b4567"), // Matches User's _id
  employeeId: "EMP001",
  employeeName: "John Doe",
  leaveType: "sick",
  fromDate: new Date("2024-05-01"),
  toDate: new Date("2024-05-03"),
  reason: "Fever and Cold",
  status: "pending",
  adminComment: "",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Example: Get all approved leaves for an employee
db.leaves.find({ 
  userId: ObjectId("60d5ec49b20b4a1b2c8b4567"), 
  status: "approved" 
});

// Example: Insert Salary Record
db.salaries.insertOne({
  userId: ObjectId("60d5ec49b20b4a1b2c8b4567"),
  employeeId: "EMP001",
  employeeName: "John Doe",
  month: "2024-04",
  basic: 50000,
  bonus: 5000,
  deductions: 2000,
  netSalary: 53000, // basic + bonus - deductions
  notes: "Performance bonus included",
  createdAt: new Date(),
  updatedAt: new Date()
});
