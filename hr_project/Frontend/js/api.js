const API_ROOT = "";

function formatEmployee(emp) {
  if (!emp.payroll) {
    emp.payroll = {
      basic: Math.floor(emp.salary * 0.50),
      hra: Math.floor(emp.salary * 0.20),
      allowances: Math.floor(emp.salary * 0.10),
      deductions: Math.floor(emp.salary * 0.15),
      net: Math.floor(emp.salary * 0.85)
    };
  }
  if (!emp.attendanceHistory) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun"];
    emp.attendanceHistory = months.map(m => ({
      month: m,
      present: Math.max(10, Math.floor(emp.attendance / 100 * 22)),
      total: 22
    }));
  }
  return emp;
}

async function fetchEmployees() {
  const res = await fetch(`${API_ROOT}/api/employees`);
  if (!res.ok) {
    throw new Error(`Unable to load employees: ${res.status}`);
  }
  const employees = await res.json();
  DB.employees = employees.map(formatEmployee);
  DB.nextId = DB.employees.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  return DB.employees;
}

async function createEmployee(payload) {
  const res = await fetch(`${API_ROOT}/api/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create employee");
  }
  const employee = await res.json();
  return formatEmployee(employee);
}

async function updateEmployee(id, payload) {
  const res = await fetch(`${API_ROOT}/api/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update employee");
  }
  const employee = await res.json();
  return formatEmployee(employee);
}

async function deleteEmployeeById(id) {
  const res = await fetch(`${API_ROOT}/api/employees/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete employee");
  }
  return await res.json();
}
