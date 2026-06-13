// ====================== EMPLOYEE APP ROUTER & MODAL ======================
let currentEmployeePage = 'login';
let isEmployeeAuthenticated = false;
const EMPLOYEE_AUTH_KEY = 'empapp_auth';
const EMPLOYEE_USER_KEY = 'empapp_user';

const EMPLOYEE_USERS = [
  { email: 'employee@company.com', password: 'Emp@123', name: 'Sarah Johnson', empId: 'EMP001' },
  { email: 'john@company.com', password: 'John@456', name: 'John Smith', empId: 'EMP002' },
  { email: 'mike@company.com', password: 'Mike@789', name: 'Mike Davis', empId: 'EMP003' },
  { email: 'emma@company.com', password: 'Emma@321', name: 'Emma Wilson', empId: 'EMP004' }
];

let currentEmployeeUser = null;

const EMPLOYEE_PAGE_RENDERERS = {
  'dashboard':  renderEmployeeDashboard,
  'profile':    renderEmployeeProfile,
  'attendance': renderEmployeeAttendance,
  'leaves':     renderEmployeeLeaves,
  'salary':     renderEmployeeSalary,
};

function showEmployeeLoginScreen() {
  document.getElementById('login-screen')?.classList.remove('hidden');
  document.querySelector('.app')?.classList.add('hidden');
}

function showEmployeeAppScreen() {
  document.getElementById('login-screen')?.classList.add('hidden');
  document.querySelector('.app')?.classList.remove('hidden');
}

function setEmployeeAuth(value) {
  isEmployeeAuthenticated = value;
  if (value) {
    showEmployeeAppScreen();
  } else {
    showEmployeeLoginScreen();
  }
}

function navigateEmployee(page) {
  if (!isEmployeeAuthenticated) {
    showEmployeeLoginScreen();
    return;
  }

  destroyCharts();
  currentEmployeePage = page;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.querySelector(`.nav-item[onclick="navigateEmployee('${page}')"]`);
  if (activeEl) activeEl.classList.add('active');

  // Render page
  const main = document.getElementById('main-content');
  const renderer = EMPLOYEE_PAGE_RENDERERS[page] || renderEmployeeDashboard;
  main.innerHTML = renderer();

  // Init charts after DOM update
  setTimeout(() => initCharts(page), 50);

  // Scroll to top
  window.scrollTo(0, 0);
}

// Modal helpers
function showModal(html) {
  document.getElementById('modal-container').innerHTML =
    `<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
       <div class="modal">${html}</div>
     </div>`;
}

function closeModal() {
  document.getElementById('modal-container').innerHTML = '';
}

// Auth helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function authenticateEmployee(email, password) {
  return EMPLOYEE_USERS.find(user => user.email === email && user.password === password);
}

function saveEmployeeAuthState() {
  localStorage.setItem(EMPLOYEE_AUTH_KEY, isEmployeeAuthenticated ? '1' : '0');
  if (currentEmployeeUser) {
    localStorage.setItem(EMPLOYEE_USER_KEY, JSON.stringify(currentEmployeeUser));
  }
}

function restoreEmployeeAuthState() {
  const stored = localStorage.getItem(EMPLOYEE_AUTH_KEY);
  if (stored === '1') {
    const userStr = localStorage.getItem(EMPLOYEE_USER_KEY);
    if (userStr) {
      currentEmployeeUser = JSON.parse(userStr);
      return true;
    }
  }
  return false;
}

function employeeLogout() {
  setEmployeeAuth(false);
  currentEmployeeUser = null;
  localStorage.removeItem(EMPLOYEE_AUTH_KEY);
  localStorage.removeItem(EMPLOYEE_USER_KEY);
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-alert').innerHTML = '';
}

function submitEmployeeLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const alertBox = document.getElementById('login-alert');

  if (!email || !password) {
    alertBox.innerHTML = `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i>Please enter both email and password.</div>`;
    return;
  }
  if (!validateEmail(email)) {
    alertBox.innerHTML = `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i>Please enter a valid email address.</div>`;
    return;
  }
  
  const user = authenticateEmployee(email, password);
  if (!user) {
    alertBox.innerHTML = `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i>Incorrect email or password.</div>`;
    return;
  }

  currentEmployeeUser = user;
  setEmployeeAuth(true);
  saveEmployeeAuthState();
  navigateEmployee('dashboard');
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  if (restoreEmployeeAuthState()) {
    setEmployeeAuth(true);
    navigateEmployee('dashboard');
  } else {
    showEmployeeLoginScreen();
  }
});
