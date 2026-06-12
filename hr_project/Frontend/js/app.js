// ====================== APP ROUTER & MODAL ======================
let currentPage = 'login';
let isAuthenticated = false;
const AUTH_KEY = 'hrapp_auth';

const APP_USERS = [
  { email: 'admin@company.com', password: 'Admin@123' },
  { email: 'hr@company.com', password: 'Hr@12345' }
];

const PAGE_RENDERERS = {
  'dashboard':    renderDashboard,
  'employees':    renderEmployees,
  'add-employee': renderAddEmployee,
  'attendance':   renderAttendance,
  'payroll':      renderPayroll,
  'departments':  renderDepartments,
  'attrition':    renderAttrition,
  'insights':     renderInsights,
  'reports':      renderReports,
};

function showLoginScreen() {
  document.getElementById('login-screen')?.classList.remove('hidden');
  document.querySelector('.app')?.classList.add('hidden');
}

function showAppScreen() {
  document.getElementById('login-screen')?.classList.add('hidden');
  document.querySelector('.app')?.classList.remove('hidden');
}

function setAppAuth(value) {
  isAuthenticated = value;
  if (value) {
    showAppScreen();
  } else {
    showLoginScreen();
  }
}

function navigate(page) {
  if (!isAuthenticated) {
    showLoginScreen();
    return;
  }

  destroyCharts();
  currentPage = page;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.querySelector(`.nav-item[onclick="navigate('${page}')"]`);
  if (activeEl) activeEl.classList.add('active');

  // Render page
  const main = document.getElementById('main-content');
  const renderer = PAGE_RENDERERS[page] || renderDashboard;
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

function authenticate(email, password) {
  return APP_USERS.some(user => user.email === email && user.password === password);
}

function saveAuthState() {
  localStorage.setItem(AUTH_KEY, isAuthenticated ? '1' : '0');
}

function restoreAuthState() {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored === '1';
}

function logout() {
  setAppAuth(false);
  saveAuthState();
  navigate('login');
}

// Expose globals used in onclick attributes
window.navigate         = navigate;
window.closeModal       = closeModal;
window.filterEmployees  = filterEmployees;
window.addEmployee      = addEmployee;
window.deleteEmployee   = deleteEmployee;
window.saveEdit         = saveEdit;
window.showEmployeeDetail = showEmployeeDetail;
window.showEditEmployee   = showEditEmployee;
window.generateInsight    = generateInsight;
window.generateTeamInsight = generateTeamInsight;
window.logout = logout;

// Boot
setAppAuth(restoreAuthState());
if (!isAuthenticated) {
  navigate('login');
} else {
  fetchEmployees()
    .then(() => navigate('dashboard'))
    .catch(err => {
      console.error(err);
      document.body.innerHTML = `<div style="padding:40px;font-family:sans-serif;color:#333"><h1>Unable to load application</h1><p>${err.message}</p><p>Make sure Flask is running and open <strong>http://localhost:5000</strong>.</p></div>`;
    });
}