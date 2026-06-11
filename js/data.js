// ====================== DATA STORE ======================
const DB = {
  employees: [
    { id:1, name:"Priya Sharma",   email:"priya@company.com",   dept:"Engineering", role:"Senior Developer",    salary:85000, attendance:92, overtime:12, experience:6, satisfaction:4, leaveFreq:2, status:"active", joined:"2019-03-15", phone:"9876543210" },
    { id:2, name:"Rahul Gupta",    email:"rahul@company.com",    dept:"Sales",       role:"Sales Manager",       salary:72000, attendance:78, overtime:18, experience:4, satisfaction:2, leaveFreq:5, status:"active", joined:"2021-01-20", phone:"9765432109" },
    { id:3, name:"Ananya Patel",   email:"ananya@company.com",   dept:"HR",          role:"HR Specialist",       salary:58000, attendance:96, overtime:5,  experience:8, satisfaction:5, leaveFreq:1, status:"active", joined:"2017-07-11", phone:"9654321098" },
    { id:4, name:"Vikram Nair",    email:"vikram@company.com",   dept:"Finance",     role:"Financial Analyst",   salary:78000, attendance:85, overtime:14, experience:5, satisfaction:3, leaveFreq:3, status:"active", joined:"2020-04-08", phone:"9543210987" },
    { id:5, name:"Deepika Rao",    email:"deepika@company.com",  dept:"Marketing",   role:"Marketing Lead",      salary:68000, attendance:71, overtime:22, experience:3, satisfaction:2, leaveFreq:7, status:"active", joined:"2022-09-01", phone:"9432109876" },
    { id:6, name:"Arjun Mehta",    email:"arjun@company.com",    dept:"Engineering", role:"DevOps Engineer",     salary:90000, attendance:94, overtime:8,  experience:7, satisfaction:4, leaveFreq:1, status:"active", joined:"2018-11-23", phone:"9321098765" },
    { id:7, name:"Sneha Joshi",    email:"sneha@company.com",    dept:"Operations",  role:"Operations Manager",  salary:65000, attendance:88, overtime:10, experience:5, satisfaction:3, leaveFreq:3, status:"active", joined:"2020-06-15", phone:"9210987654" },
    { id:8, name:"Kiran Kumar",    email:"kiran@company.com",    dept:"Engineering", role:"Junior Developer",    salary:48000, attendance:67, overtime:25, experience:1, satisfaction:1, leaveFreq:9, status:"active", joined:"2024-01-10", phone:"9109876543" },
  ],
  departments: ["Engineering", "HR", "Sales", "Finance", "Marketing", "Operations"],
  nextId: 9
};

// Build payroll from employee salary
DB.employees.forEach(e => {
  e.payroll = {
    basic:       Math.floor(e.salary * 0.50),
    hra:         Math.floor(e.salary * 0.20),
    allowances:  Math.floor(e.salary * 0.10),
    deductions:  Math.floor(e.salary * 0.15),
    net:         Math.floor(e.salary * 0.85)
  };
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  e.attendanceHistory = months.map(m => ({
    month: m,
    present: Math.max(10, Math.floor(e.attendance / 100 * 22 + (Math.random() * 4 - 2))),
    total: 22
  }));
});
