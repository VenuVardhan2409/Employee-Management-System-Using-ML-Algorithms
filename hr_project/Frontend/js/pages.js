// ====================== PAGE RENDERERS ======================

// --- DASHBOARD ---
function renderDashboard() {
  const total    = DB.employees.length;
  const highRisk = DB.employees.filter(e => predictAttrition(e).level === 'high').length;
  const avgSat   = (DB.employees.reduce((a,e) => a + e.satisfaction, 0) / total).toFixed(1);
  const avgAtt   = Math.floor(DB.employees.reduce((a,e) => a + e.attendance, 0) / total);
  const totalPay = DB.employees.reduce((a,e) => a + e.payroll.net, 0);

  return `
  <div class="topbar">
    <div>
      <div class="page-title">Dashboard</div>
      <div class="page-sub">Welcome back, HR Admin &middot; ${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div class="topbar-right">
      <button class="btn btn-primary btn-sm" onclick="navigate('add-employee')"><i class="ti ti-plus"></i>Add Employee</button>
      <div class="avatar">HR</div>
    </div>
  </div>

  <div class="grid-4">
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-users" style="color:#4F46E5"></i>Total Employees</div>
      <div class="metric-val">${total}</div>
      <div class="metric-change up"><i class="ti ti-trending-up"></i> Active workforce</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-calendar-check" style="color:#059669"></i>Avg Attendance</div>
      <div class="metric-val">${avgAtt}%</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${avgAtt}%;background:#059669"></div></div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-alert-triangle" style="color:#DC2626"></i>High Attrition Risk</div>
      <div class="metric-val" style="color:#DC2626">${highRisk}</div>
      <div class="metric-change down">Needs immediate attention</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-wallet" style="color:#D97706"></i>Annual Net Payroll</div>
      <div class="metric-val">&#8377;${(totalPay/100000).toFixed(1)}L</div>
      <div class="metric-change" style="color:#6B7280">Across ${total} employees</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-pie" style="color:#4F46E5"></i>Attrition Risk Overview</div>
      <div style="position:relative;height:200px"><canvas id="ch-attritionPie" role="img" aria-label="Attrition risk pie chart">Risk distribution</canvas></div>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-bar" style="color:#059669"></i>Attendance by Department</div>
      <div style="position:relative;height:200px"><canvas id="ch-deptAtt" role="img" aria-label="Attendance by department">Dept attendance</canvas></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="section-title"><i class="ti ti-users" style="color:#7C3AED"></i>Employee Overview</div>
      <table>
        <thead><tr><th>Name</th><th>Department</th><th>Risk</th></tr></thead>
        <tbody>
        ${DB.employees.slice(0,6).map(e => {
          const r = predictAttrition(e);
          return `<tr>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="emp-avatar">${e.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div style="font-weight:500">${e.name}</div>
                  <div style="font-size:11px;color:#6B7280">${e.role}</div>
                </div>
              </div>
            </td>
            <td><span class="dept-badge dept-${e.dept}">${e.dept}</span></td>
            <td><span class="pill ${r.level}">${r.label}</span></td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-star" style="color:#F59E0B"></i>Job Satisfaction Scores</div>
      <div style="position:relative;height:200px"><canvas id="ch-satisfaction" role="img" aria-label="Satisfaction scores">Satisfaction chart</canvas></div>
    </div>
  </div>`;
}

// --- EMPLOYEES ---
function renderEmployees() {
  return `
  <div class="topbar">
    <div>
      <div class="page-title">Employee Management</div>
      <div class="page-sub">View, edit, and manage all employee records</div>
    </div>
    <div class="topbar-right">
      <input type="text" id="emp-search" placeholder="&#128269; Search by name, dept, role..." style="width:240px" oninput="filterEmployees(this.value)"/>
      <button class="btn btn-primary btn-sm" onclick="navigate('add-employee')"><i class="ti ti-plus"></i>Add Employee</button>
    </div>
  </div>
  <div class="card" style="overflow-x:auto">
    <table>
      <thead>
        <tr>
          <th>Employee</th><th>Department</th><th>Role</th>
          <th>Salary</th><th>Attendance</th><th>Satisfaction</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="emp-tbody">${buildEmployeeRows(DB.employees)}</tbody>
    </table>
  </div>`;
}

function buildEmployeeRows(list) {
  if (!list.length) return `<tr><td colspan="8" style="text-align:center;padding:30px;color:#9CA3AF">No employees found.</td></tr>`;
  return list.map(e => {
    const r = predictAttrition(e);
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="emp-avatar">${e.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div style="font-weight:500">${e.name}</div>
            <div style="font-size:11px;color:#9CA3AF">${e.email}</div>
          </div>
        </div>
      </td>
      <td><span class="dept-badge dept-${e.dept}">${e.dept}</span></td>
      <td style="color:#6B7280;font-size:12px">${e.role}</td>
      <td style="font-weight:500">&#8377;${e.salary.toLocaleString()}</td>
      <td>
        <div style="font-weight:500;color:${e.attendance>=90?'#059669':e.attendance>=80?'#D97706':'#DC2626'}">${e.attendance}%</div>
        <div class="progress-bar" style="width:80px">
          <div class="progress-fill" style="width:${e.attendance}%;background:${e.attendance>=90?'#059669':e.attendance>=80?'#D97706':'#DC2626'}"></div>
        </div>
      </td>
      <td>${'&#11088;'.repeat(e.satisfaction)}<span style="font-size:11px;color:#9CA3AF"> ${e.satisfaction}/5</span></td>
      <td><span class="pill active">Active</span></td>
      <td style="white-space:nowrap">
        <button class="btn btn-outline btn-sm" onclick="showEmployeeDetail(${e.id})" title="View"><i class="ti ti-eye"></i></button>
        <button class="btn btn-outline btn-sm" onclick="showEditEmployee(${e.id})" title="Edit" style="margin-left:4px"><i class="ti ti-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${e.id})" title="Delete" style="margin-left:4px"><i class="ti ti-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function filterEmployees(val) {
  const q = val.toLowerCase();
  const filtered = DB.employees.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.dept.toLowerCase().includes(q) ||
    e.role.toLowerCase().includes(q) ||
    e.email.toLowerCase().includes(q)
  );
  document.getElementById('emp-tbody').innerHTML = buildEmployeeRows(filtered);
}

// --- ADD EMPLOYEE ---
function renderAddEmployee() {
  return `
  <div class="topbar">
    <div>
      <div class="page-title">Add New Employee</div>
      <div class="page-sub">Register a new employee into the system</div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="navigate('employees')"><i class="ti ti-arrow-left"></i>Back</button>
  </div>
  <div class="card" style="max-width:680px">
    <div class="section-title"><i class="ti ti-user-plus" style="color:#4F46E5"></i>Employee Registration Form</div>
    <div id="add-alert"></div>
    <div class="form-row">
      <div class="form-group"><label>Full Name *</label><input id="a-name" placeholder="e.g. Ravi Kumar"/></div>
      <div class="form-group"><label>Email Address *</label><input id="a-email" type="email" placeholder="ravi@company.com"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Phone Number</label><input id="a-phone" placeholder="9876543210"/></div>
      <div class="form-group"><label>Date of Joining *</label><input id="a-joined" type="date" value="${new Date().toISOString().split('T')[0]}"/></div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Department *</label>
        <select id="a-dept">${DB.departments.map(d=>`<option>${d}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Role / Designation *</label><input id="a-role" placeholder="e.g. Software Engineer"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Annual Salary (&#8377;) *</label><input id="a-salary" type="number" placeholder="600000" min="0"/></div>
      <div class="form-group"><label>Years of Experience *</label><input id="a-exp" type="number" placeholder="3" min="0"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Attendance % (0-100)</label><input id="a-att" type="number" placeholder="90" min="0" max="100"/></div>
      <div class="form-group"><label>Job Satisfaction Score (1-5)</label><input id="a-sat" type="number" placeholder="4" min="1" max="5"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Avg Overtime Hours / month</label><input id="a-over" type="number" placeholder="8" min="0"/></div>
      <div class="form-group"><label>Leave Frequency / month</label><input id="a-leave" type="number" placeholder="2" min="0"/></div>
    </div>
    <div style="display:flex;gap:12px;margin-top:8px">
      <button class="btn btn-primary" style="flex:1" onclick="addEmployee()"><i class="ti ti-user-plus"></i>Register Employee</button>
      <button class="btn btn-outline" onclick="navigate('employees')">Cancel</button>
    </div>
  </div>`;
}

function addEmployee() {
  const name  = document.getElementById('a-name').value.trim();
  const email = document.getElementById('a-email').value.trim();
  const alertBox = document.getElementById('add-alert');
  if (!name || !email) {
    alertBox.innerHTML = `<div class="alert alert-danger"><i class="ti ti-alert-circle" style="font-size:18px"></i><div>Full Name and Email are required.</div></div>`;
    return;
  }
  const salary = parseInt(document.getElementById('a-salary').value) || 50000;
  const newEmp = {
    id: DB.nextId++,
    name, email,
    phone:       document.getElementById('a-phone').value,
    joined:      document.getElementById('a-joined').value,
    dept:        document.getElementById('a-dept').value,
    role:        document.getElementById('a-role').value || 'Employee',
    salary,
    experience:  parseInt(document.getElementById('a-exp').value)  || 0,
    attendance:  parseInt(document.getElementById('a-att').value)  || 90,
    satisfaction:parseInt(document.getElementById('a-sat').value)  || 3,
    overtime:    parseInt(document.getElementById('a-over').value) || 8,
    leaveFreq:   parseInt(document.getElementById('a-leave').value)|| 2,
    status: 'active'
  };
  newEmp.payroll = {
    basic: Math.floor(salary*0.5), hra: Math.floor(salary*0.2),
    allowances: Math.floor(salary*0.1), deductions: Math.floor(salary*0.15), net: Math.floor(salary*0.85)
  };
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  newEmp.attendanceHistory = months.map(m => ({ month: m, present: Math.floor(newEmp.attendance/100*22), total: 22 }));
  DB.employees.push(newEmp);
  navigate('employees');
}

function deleteEmployee(id) {
  if (!confirm('Are you sure you want to remove this employee?')) return;
  DB.employees = DB.employees.filter(e => e.id !== id);
  navigate('employees');
}

// --- ATTENDANCE ---
function renderAttendance() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const avgAtt = Math.floor(DB.employees.reduce((a,e)=>a+e.attendance,0)/DB.employees.length);
  const lowAtt = DB.employees.filter(e=>e.attendance<80).length;
  const avgOT  = Math.floor(DB.employees.reduce((a,e)=>a+e.overtime,0)/DB.employees.length);
  return `
  <div class="topbar">
    <div><div class="page-title">Attendance & Leave Tracking</div><div class="page-sub">Monthly attendance records for all employees</div></div>
  </div>
  <div class="grid-3">
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-calendar-check" style="color:#059669"></i>Overall Avg Attendance</div>
      <div class="metric-val">${avgAtt}%</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${avgAtt}%;background:#059669"></div></div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-calendar-off" style="color:#DC2626"></i>Below 80% Attendance</div>
      <div class="metric-val" style="color:#DC2626">${lowAtt}</div>
      <div class="metric-change down">Employees at risk</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-clock" style="color:#D97706"></i>Avg Overtime / Month</div>
      <div class="metric-val">${avgOT} hrs</div>
      <div class="metric-change" style="color:#6B7280">Across all staff</div>
    </div>
  </div>
  <div class="card" style="overflow-x:auto">
    <div class="section-title"><i class="ti ti-table" style="color:#4F46E5"></i>6-Month Attendance Records</div>
    <table>
      <thead>
        <tr>
          <th>Employee</th><th>Department</th>
          ${months.map(m=>`<th>${m}</th>`).join('')}
          <th>Overall</th><th>Leaves/mo</th><th>Overtime/mo</th>
        </tr>
      </thead>
      <tbody>
      ${DB.employees.map(e => `
        <tr>
          <td style="font-weight:500;white-space:nowrap">${e.name}</td>
          <td><span class="dept-badge dept-${e.dept}">${e.dept}</span></td>
          ${(e.attendanceHistory||[]).map(a => {
            const pct = Math.floor(a.present/a.total*100);
            return `<td style="color:${pct>=90?'#059669':pct>=80?'#D97706':'#DC2626'};font-weight:500">${pct}%</td>`;
          }).join('')}
          <td>
            <span style="font-weight:600;color:${e.attendance>=90?'#059669':e.attendance>=80?'#D97706':'#DC2626'}">${e.attendance}%</span>
          </td>
          <td style="color:#DC2626;font-weight:500">${e.leaveFreq}</td>
          <td style="color:${e.overtime>18?'#DC2626':e.overtime>10?'#D97706':'#059669'};font-weight:500">${e.overtime}h</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// --- PAYROLL ---
function renderPayroll() {
  const totalNet = DB.employees.reduce((a,e)=>a+e.payroll.net,0);
  const avgSal   = Math.floor(DB.employees.reduce((a,e)=>a+e.salary,0)/DB.employees.length);
  const totalDed = DB.employees.reduce((a,e)=>a+e.payroll.deductions,0);
  return `
  <div class="topbar">
    <div><div class="page-title">Payroll Management</div><div class="page-sub">Annual salary breakdown, HRA, allowances and deductions</div></div>
  </div>
  <div class="grid-3">
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-wallet" style="color:#4F46E5"></i>Total Annual Net Payroll</div>
      <div class="metric-val">&#8377;${(totalNet/100000).toFixed(2)}L</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-trending-up" style="color:#059669"></i>Average CTC</div>
      <div class="metric-val">&#8377;${avgSal.toLocaleString()}</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-minus-circle" style="color:#DC2626"></i>Total Deductions</div>
      <div class="metric-val" style="color:#DC2626">&#8377;${(totalDed/100000).toFixed(2)}L</div>
    </div>
  </div>
  <div class="card" style="overflow-x:auto">
    <div class="section-title"><i class="ti ti-receipt" style="color:#4F46E5"></i>Detailed Payroll Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Employee</th><th>Dept</th><th>Annual CTC</th>
          <th>Basic (50%)</th><th>HRA (20%)</th><th>Allowances (10%)</th>
          <th>Deductions (15%)</th><th>Net Annual</th>
        </tr>
      </thead>
      <tbody>
      ${DB.employees.map(e => `
        <tr>
          <td>
            <div style="font-weight:500">${e.name}</div>
            <div style="font-size:11px;color:#9CA3AF">${e.role}</div>
          </td>
          <td><span class="dept-badge dept-${e.dept}">${e.dept}</span></td>
          <td style="font-weight:500">&#8377;${e.salary.toLocaleString()}</td>
          <td>&#8377;${e.payroll.basic.toLocaleString()}</td>
          <td>&#8377;${e.payroll.hra.toLocaleString()}</td>
          <td>&#8377;${e.payroll.allowances.toLocaleString()}</td>
          <td style="color:#DC2626">-&#8377;${e.payroll.deductions.toLocaleString()}</td>
          <td style="font-weight:700;color:#059669">&#8377;${e.payroll.net.toLocaleString()}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// --- DEPARTMENTS ---
function renderDepartments() {
  const deptData = DB.departments.map(d => {
    const emps = DB.employees.filter(e => e.dept === d);
    const avgSal = emps.length ? Math.floor(emps.reduce((a,e)=>a+e.salary,0)/emps.length) : 0;
    const avgAtt = emps.length ? Math.floor(emps.reduce((a,e)=>a+e.attendance,0)/emps.length) : 0;
    const highRisk = emps.filter(e => predictAttrition(e).level === 'high').length;
    return { dept:d, count:emps.length, avgSal, avgAtt, highRisk };
  });
  return `
  <div class="topbar">
    <div><div class="page-title">Department & Role Management</div><div class="page-sub">Overview and health of each department</div></div>
  </div>
  <div class="grid-3">
  ${deptData.map(d => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <span class="dept-badge dept-${d.dept}" style="font-size:13px;padding:5px 12px">${d.dept}</span>
        <span style="font-size:26px;font-weight:700;color:#111">${d.count}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;color:#6B7280;margin-bottom:12px">
        <div>Avg Salary<div style="color:#111;font-weight:600;font-size:14px;margin-top:2px">&#8377;${(d.avgSal/1000).toFixed(0)}K</div></div>
        <div>Avg Attendance<div style="color:${d.avgAtt>=90?'#059669':d.avgAtt>=80?'#D97706':'#DC2626'};font-weight:600;font-size:14px;margin-top:2px">${d.avgAtt||0}%</div></div>
      </div>
      ${d.count === 0
        ? `<div class="alert alert-info" style="padding:8px 12px;margin-bottom:0"><i class="ti ti-info-circle"></i>No employees yet</div>`
        : d.highRisk > 0
          ? `<div class="alert alert-danger" style="padding:8px 12px;margin-bottom:0"><i class="ti ti-alert-triangle"></i>${d.highRisk} high-risk employee${d.highRisk>1?'s':''}</div>`
          : `<div class="alert alert-success" style="padding:8px 12px;margin-bottom:0"><i class="ti ti-shield-check"></i>No high-risk employees</div>`}
    </div>`).join('')}
  </div>
  <div class="card" style="overflow-x:auto">
    <div class="section-title"><i class="ti ti-list" style="color:#4F46E5"></i>All Employees by Department</div>
    <table>
      <thead><tr><th>Name</th><th>Department</th><th>Role</th><th>Experience</th><th>Salary</th><th>Attrition Risk</th></tr></thead>
      <tbody>
      ${DB.employees.map(e => {
        const r = predictAttrition(e);
        return `<tr>
          <td style="font-weight:500">${e.name}</td>
          <td><span class="dept-badge dept-${e.dept}">${e.dept}</span></td>
          <td style="color:#6B7280;font-size:12px">${e.role}</td>
          <td style="color:#6B7280">${e.experience} yr${e.experience!==1?'s':''}</td>
          <td>&#8377;${e.salary.toLocaleString()}</td>
          <td><span class="pill ${r.level}">${r.label}</span></td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>`;
}

// --- ATTRITION PREDICTION ---
function renderAttrition() {
  const results = DB.employees.map(e => ({...e, risk: predictAttrition(e)}));
  results.sort((a,b) => b.risk.score - a.risk.score);
  const high = results.filter(e => e.risk.level==='high');
  const mod  = results.filter(e => e.risk.level==='moderate');
  const low  = results.filter(e => e.risk.level==='low');
  return `
  <div class="topbar">
    <div>
      <div class="page-title">ML Attrition Prediction</div>
      <div class="page-sub">Algorithm: Random Forest Classifier &middot; 6 input features</div>
    </div>
  </div>
  <div class="alert alert-info" style="margin-bottom:20px">
    <i class="ti ti-cpu" style="font-size:20px;flex-shrink:0"></i>
    <div>
      <strong>Random Forest Classifier</strong> &mdash; Input Features: Attendance %, Salary Level, Overtime Hours, Years of Experience, Job Satisfaction Score, Leave Frequency<br>
      <strong>Output Classes:</strong> Low Attrition Risk &nbsp;|&nbsp; Moderate Attrition Risk &nbsp;|&nbsp; High Attrition Risk
    </div>
  </div>
  <div class="grid-3">
    <div class="card-sm" style="border-left:4px solid #DC2626">
      <div class="metric-label" style="color:#DC2626"><i class="ti ti-alert-triangle"></i>High Risk</div>
      <div class="metric-val" style="color:#DC2626">${high.length}</div>
      <div style="font-size:12px;color:#6B7280">Immediate action required</div>
    </div>
    <div class="card-sm" style="border-left:4px solid #D97706">
      <div class="metric-label" style="color:#D97706"><i class="ti ti-alert-circle"></i>Moderate Risk</div>
      <div class="metric-val" style="color:#D97706">${mod.length}</div>
      <div style="font-size:12px;color:#6B7280">Monitor closely</div>
    </div>
    <div class="card-sm" style="border-left:4px solid #059669">
      <div class="metric-label" style="color:#059669"><i class="ti ti-shield-check"></i>Low Risk</div>
      <div class="metric-val" style="color:#059669">${low.length}</div>
      <div style="font-size:12px;color:#6B7280">Stable employees</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-pie" style="color:#4F46E5"></i>Risk Distribution</div>
      <div style="position:relative;height:200px"><canvas id="ch-riskDist" role="img" aria-label="Risk distribution">Risk chart</canvas></div>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-bar" style="color:#DC2626"></i>Risk Score by Employee</div>
      <div style="position:relative;height:200px"><canvas id="ch-riskScores" role="img" aria-label="Risk scores bar chart">Scores chart</canvas></div>
    </div>
  </div>
  <div class="card" style="margin-bottom:16px;overflow-x:auto">
    <div class="section-title"><i class="ti ti-brain" style="color:#7C3AED"></i>Detailed Prediction Results</div>
    <table>
      <thead>
        <tr><th>Employee</th><th>Dept</th><th>Attendance</th><th>Satisfaction</th><th>Overtime</th><th>Leaves/mo</th><th>Risk Score</th><th>Prediction</th></tr>
      </thead>
      <tbody>
      ${results.map(e => `
        <tr>
          <td style="font-weight:500">${e.name}</td>
          <td><span class="dept-badge dept-${e.dept}">${e.dept}</span></td>
          <td style="color:${e.attendance>=90?'#059669':e.attendance>=80?'#D97706':'#DC2626'};font-weight:500">${e.attendance}%</td>
          <td>${'&#11088;'.repeat(e.satisfaction)} (${e.satisfaction}/5)</td>
          <td style="color:${e.overtime<=10?'#059669':e.overtime<=18?'#D97706':'#DC2626'};font-weight:500">${e.overtime}h</td>
          <td style="color:${e.leaveFreq<=2?'#059669':e.leaveFreq<=5?'#D97706':'#DC2626'};font-weight:500">${e.leaveFreq}</td>
          <td>
            <div class="risk-bar-wrap">
              <div class="risk-bar-inner">
                <div class="progress-bar"><div class="progress-fill" style="width:${e.risk.score}%;background:${e.risk.color}"></div></div>
              </div>
              <span class="risk-score-num" style="color:${e.risk.color}">${e.risk.score}</span>
            </div>
          </td>
          <td><span class="pill ${e.risk.level}">${e.risk.label}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div class="card">
    <div class="section-title"><i class="ti ti-bulb" style="color:#D97706"></i>ML Feature Importance</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    ${FEATURE_IMPORTANCE.map(f => `
      <div class="feature-row">
        <div class="feature-row-top">
          <span class="feature-label">${f.label}</span>
          <span style="font-weight:600;color:${f.color}">${f.value}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${f.value*3}%;background:${f.color}"></div></div>
      </div>`).join('')}
    </div>
  </div>`;
}

// --- AI INSIGHTS ---
function renderInsights() {
  return `
  <div class="topbar">
    <div>
      <div class="page-title">Generative AI Insights</div>
      <div class="page-sub">LLM-powered HR summaries, performance analysis, and strategic recommendations</div>
    </div>
  </div>
  <div class="alert alert-info" style="margin-bottom:20px">
    <i class="ti ti-sparkles" style="font-size:20px;flex-shrink:0"></i>
    <div>
      Powered by <strong>Claude LLM API</strong> &mdash; Generates employee performance summaries, HR insights,
      attendance analysis, and payroll observations. Outputs are AI-generated and data-driven.
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="section-title"><i class="ti ti-user-circle" style="color:#7C3AED"></i>Employee Performance Summary</div>
      <div class="form-group">
        <label>Select Employee</label>
        <select id="ins-emp">${DB.employees.map(e=>`<option value="${e.id}">${e.name} &mdash; ${e.dept}</option>`).join('')}</select>
      </div>
      <div class="form-group">
        <label>Summary Type</label>
        <select id="ins-type">
          <option value="performance">Performance Summary</option>
          <option value="attendance">Attendance Analysis</option>
          <option value="payroll">Payroll & Productivity</option>
          <option value="recommendation">HR Recommendation</option>
        </select>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="generateInsight()">
        <i class="ti ti-sparkles"></i>Generate AI Summary
      </button>
      <div id="insight-output"></div>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-line" style="color:#059669"></i>Team / Department Analysis</div>
      <div class="form-group">
        <label>Select Department</label>
        <select id="ins-dept">
          <option value="all">All Departments</option>
          ${DB.departments.map(d=>`<option>${d}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Analysis Focus</label>
        <select id="ins-focus">
          <option value="overview">Overall HR Overview</option>
          <option value="attrition">Attrition Risk Analysis</option>
          <option value="performance">Performance Trends</option>
          <option value="recommendations">Strategic Recommendations</option>
        </select>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="generateTeamInsight()">
        <i class="ti ti-sparkles"></i>Generate Team Analysis
      </button>
      <div id="team-insight-output"></div>
    </div>
  </div>`;
}

async function generateInsight() {
  const empId = parseInt(document.getElementById('ins-emp').value);
  const type  = document.getElementById('ins-type').value;
  const emp   = DB.employees.find(e => e.id === empId);
  if (!emp) return;
  const risk = predictAttrition(emp);
  const out = document.getElementById('insight-output');
  const typeLabel = { performance:"Performance Summary", attendance:"Attendance Analysis", payroll:"Payroll & Productivity Observation", recommendation:"HR Strategic Recommendation" }[type];

  out.innerHTML = `<div class="ai-bubble"><div class="ai-bubble-label">&#10022; AI</div><div class="loading-wrap"><div class="spinner"></div><span>Generating ${typeLabel}...</span></div></div>`;

  const prompt = `You are an expert HR analytics AI. Generate a concise, professional, data-driven ${typeLabel} for this employee. Be specific, insightful, and actionable. Keep it to 3-4 sentences.

Employee Data:
- Name: ${emp.name} | Department: ${emp.dept} | Role: ${emp.role}
- Annual Salary: INR ${emp.salary.toLocaleString()} | Years of Experience: ${emp.experience}
- Attendance: ${emp.attendance}% | Overtime: ${emp.overtime} hrs/month
- Job Satisfaction: ${emp.satisfaction}/5 | Leave Frequency: ${emp.leaveFreq}/month
- ML Attrition Prediction: ${risk.label} (Score: ${risk.score}/100)

Generate the ${typeLabel}:`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 300, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    const text = data.content?.map(c => c.text || '').join('') || buildFallbackInsight(emp, risk, typeLabel);
    out.innerHTML = `<div class="ai-bubble"><div class="ai-bubble-label">&#10022; AI</div><strong>${typeLabel} &mdash; ${emp.name}</strong><br><br>${text}</div>`;
  } catch(e) {
    out.innerHTML = `<div class="ai-bubble"><div class="ai-bubble-label">&#10022; AI (Offline)</div><strong>${typeLabel} &mdash; ${emp.name}</strong><br><br>${buildFallbackInsight(emp, risk, typeLabel)}</div>`;
  }
}

async function generateTeamInsight() {
  const dept  = document.getElementById('ins-dept').value;
  const focus = document.getElementById('ins-focus').value;
  const out   = document.getElementById('team-insight-output');
  const emps  = dept === 'all' ? DB.employees : DB.employees.filter(e => e.dept === dept);
  if (!emps.length) { out.innerHTML = `<div class="alert alert-warn"><i class="ti ti-alert-circle"></i>No employees in this department.</div>`; return; }

  const avgAtt  = Math.floor(emps.reduce((a,e)=>a+e.attendance,0)/emps.length);
  const avgSat  = (emps.reduce((a,e)=>a+e.satisfaction,0)/emps.length).toFixed(1);
  const highRisk = emps.filter(e => predictAttrition(e).level==='high').length;
  const avgSal  = Math.floor(emps.reduce((a,e)=>a+e.salary,0)/emps.length);
  const focusLabel = { overview:"HR Overview", attrition:"Attrition Risk Analysis", performance:"Performance Trends", recommendations:"Strategic Recommendations" }[focus];

  out.innerHTML = `<div class="ai-bubble"><div class="ai-bubble-label">&#10022; AI</div><div class="loading-wrap"><div class="spinner"></div><span>Generating ${focusLabel}...</span></div></div>`;

  const prompt = `You are an expert HR analytics AI. Generate a professional ${focusLabel} for ${dept==='all'?'the entire organization':dept+' department'}. Be specific and actionable. 4-5 sentences.

Team Stats (${dept==='all'?'All '+emps.length+' employees':dept+', '+emps.length+' employees'}):
- Average Attendance: ${avgAtt}%
- Average Job Satisfaction: ${avgSat}/5
- High Attrition Risk Count: ${highRisk} out of ${emps.length}
- Average Annual Salary: INR ${avgSal.toLocaleString()}

Generate the ${focusLabel}:`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 350, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    const text = data.content?.map(c => c.text||'').join('') || buildTeamFallback(dept, avgAtt, avgSat, highRisk, emps.length, focusLabel);
    out.innerHTML = `<div class="ai-bubble"><div class="ai-bubble-label">&#10022; AI</div><strong>${focusLabel} &mdash; ${dept==='all'?'All Departments':dept}</strong><br><br>${text}</div>`;
  } catch(e) {
    out.innerHTML = `<div class="ai-bubble"><div class="ai-bubble-label">&#10022; AI (Offline)</div><strong>${focusLabel} &mdash; ${dept==='all'?'All Departments':dept}</strong><br><br>${buildTeamFallback(dept, avgAtt, avgSat, highRisk, emps.length, focusLabel)}</div>`;
  }
}

function buildFallbackInsight(emp, risk, label) {
  return `${emp.name} demonstrates an attendance rate of ${emp.attendance}% with a job satisfaction score of ${emp.satisfaction}/5. `+
    `${emp.overtime > 18 ? `The high overtime of ${emp.overtime} hours per month may indicate workload imbalance and could be contributing to lower satisfaction levels.` : `Overtime hours (${emp.overtime}/month) are within acceptable limits.`} `+
    `Based on ML analysis, this employee is classified as <strong>${risk.label}</strong> (Score: ${risk.score}/100). `+
    `${risk.level==='high' ? 'Immediate HR intervention is recommended — consider a 1-on-1 review, salary adjustment, or workload rebalancing.' : risk.level==='moderate' ? 'Regular check-ins and engagement initiatives are advised to prevent deterioration.' : 'Continue current engagement strategy and recognize performance contributions.'}`;
}

function buildTeamFallback(dept, avgAtt, avgSat, highRisk, total, label) {
  return `The ${dept==='all'?'organization':dept+' team'} reports an average attendance of ${avgAtt}% and a collective satisfaction score of ${avgSat}/5. `+
    `${highRisk > 0 ? `${highRisk} out of ${total} employee(s) are flagged as high attrition risk, requiring focused HR intervention.` : 'No employees are currently flagged as high attrition risk — retention is healthy.'} `+
    `${avgSat < 3 ? 'Low satisfaction scores suggest the need for structured engagement programs, workload reviews, and potential compensation adjustments.' : avgSat < 4 ? 'Satisfaction is moderate; targeted recognition programs and career development opportunities could improve retention.' : 'High satisfaction levels reflect a positive work environment — sustain this with consistent feedback cycles and growth opportunities.'}`;
}

// --- REPORTS ---
function renderReports() {
  const risks = { high:0, moderate:0, low:0 };
  DB.employees.forEach(e => risks[predictAttrition(e).level]++);
  const avgSat = (DB.employees.reduce((a,e)=>a+e.satisfaction,0)/DB.employees.length).toFixed(1);
  return `
  <div class="topbar">
    <div><div class="page-title">HR Reports & Analytics</div><div class="page-sub">Comprehensive workforce insights and visualizations</div></div>
  </div>
  <div class="grid-4">
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-users" style="color:#4F46E5"></i>Total Employees</div>
      <div class="metric-val">${DB.employees.length}</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-hierarchy" style="color:#059669"></i>Departments</div>
      <div class="metric-val">${DB.departments.filter(d=>DB.employees.some(e=>e.dept===d)).length}</div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-star" style="color:#F59E0B"></i>Avg Satisfaction</div>
      <div class="metric-val">${avgSat}<span style="font-size:14px;color:#9CA3AF">/5</span></div>
    </div>
    <div class="card-sm">
      <div class="metric-label"><i class="ti ti-alert-triangle" style="color:#DC2626"></i>High Risk</div>
      <div class="metric-val" style="color:#DC2626">${risks.high}</div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-bar" style="color:#4F46E5"></i>Avg Attendance by Department (%)</div>
      <div style="position:relative;height:220px"><canvas id="ch-repAtt" role="img" aria-label="Dept attendance bar chart">Attendance chart</canvas></div>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-bar" style="color:#059669"></i>Avg Annual Salary by Department (&#8377;K)</div>
      <div style="position:relative;height:220px"><canvas id="ch-repSal" role="img" aria-label="Dept salary bar chart">Salary chart</canvas></div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-donut" style="color:#DC2626"></i>Attrition Risk Distribution</div>
      <div style="position:relative;height:200px"><canvas id="ch-repRisk" role="img" aria-label="Risk pie chart">Risk chart</canvas></div>
    </div>
    <div class="card">
      <div class="section-title"><i class="ti ti-chart-scatter" style="color:#D97706"></i>Satisfaction vs. Attendance</div>
      <div style="position:relative;height:200px"><canvas id="ch-scatter" role="img" aria-label="Scatter chart satisfaction vs attendance">Scatter chart</canvas></div>
    </div>
  </div>`;
}

// --- MODALS ---
function showEmployeeDetail(id) {
  const e = DB.employees.find(e => e.id === id);
  if (!e) return;
  const risk = predictAttrition(e);
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Employee Profile</div>
      <button class="close-btn" onclick="closeModal()">&#10005;</button>
    </div>
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div style="width:60px;height:60px;border-radius:50%;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#6D28D9;flex-shrink:0">
        ${e.name.split(' ').map(n=>n[0]).join('')}
      </div>
      <div>
        <div style="font-size:18px;font-weight:700">${e.name}</div>
        <div style="color:#6B7280;margin-top:2px">${e.role} &middot; <span class="dept-badge dept-${e.dept}">${e.dept}</span></div>
        <div style="font-size:12px;color:#9CA3AF;margin-top:4px">Joined ${new Date(e.joined).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <div class="card-sm"><div class="metric-label">Annual Salary</div><div style="font-weight:600;font-size:16px">&#8377;${e.salary.toLocaleString()}</div></div>
      <div class="card-sm"><div class="metric-label">Attendance</div><div style="font-weight:600;font-size:16px">${e.attendance}%</div></div>
      <div class="card-sm"><div class="metric-label">Experience</div><div style="font-weight:600;font-size:16px">${e.experience} years</div></div>
      <div class="card-sm"><div class="metric-label">Satisfaction</div><div style="font-weight:600;font-size:16px">${'&#11088;'.repeat(e.satisfaction)} ${e.satisfaction}/5</div></div>
    </div>
    <div class="alert ${risk.level==='high'?'alert-danger':risk.level==='moderate'?'alert-warn':'alert-success'}">
      <i class="ti ti-brain" style="font-size:18px;flex-shrink:0"></i>
      <div><strong>ML Prediction: ${risk.label}</strong> (Score: ${risk.score}/100)<br>
      <small>Based on Random Forest Classifier with 6 input features</small></div>
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="closeModal();navigate('attrition')">
      <i class="ti ti-brain"></i>View Full Attrition Analysis
    </button>
  `);
}

function showEditEmployee(id) {
  const e = DB.employees.find(e => e.id === id);
  if (!e) return;
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Edit Employee &mdash; ${e.name}</div>
      <button class="close-btn" onclick="closeModal()">&#10005;</button>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Full Name</label><input id="edit-name" value="${e.name}"/></div>
      <div class="form-group"><label>Email</label><input id="edit-email" value="${e.email}"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Department</label>
        <select id="edit-dept">${DB.departments.map(d=>`<option ${d===e.dept?'selected':''}>${d}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Role</label><input id="edit-role" value="${e.role}"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Salary (&#8377;)</label><input id="edit-salary" type="number" value="${e.salary}"/></div>
      <div class="form-group"><label>Satisfaction (1-5)</label><input id="edit-sat" type="number" min="1" max="5" value="${e.satisfaction}"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Attendance %</label><input id="edit-att" type="number" min="0" max="100" value="${e.attendance}"/></div>
      <div class="form-group"><label>Leave Frequency / month</label><input id="edit-leave" type="number" value="${e.leaveFreq}"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Overtime hrs / month</label><input id="edit-over" type="number" value="${e.overtime}"/></div>
      <div class="form-group"><label>Years of Experience</label><input id="edit-exp" type="number" value="${e.experience}"/></div>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:8px" onclick="saveEdit(${id})">
      <i class="ti ti-check"></i>Save Changes
    </button>
  `);
}

function saveEdit(id) {
  const e = DB.employees.find(e => e.id === id);
  if (!e) return;
  e.name        = document.getElementById('edit-name').value  || e.name;
  e.email       = document.getElementById('edit-email').value || e.email;
  e.dept        = document.getElementById('edit-dept').value;
  e.role        = document.getElementById('edit-role').value  || e.role;
  e.salary      = parseInt(document.getElementById('edit-salary').value) || e.salary;
  e.satisfaction= parseInt(document.getElementById('edit-sat').value)    || e.satisfaction;
  e.attendance  = parseInt(document.getElementById('edit-att').value)    || e.attendance;
  e.leaveFreq   = parseInt(document.getElementById('edit-leave').value)  || e.leaveFreq;
  e.overtime    = parseInt(document.getElementById('edit-over').value)   || e.overtime;
  e.experience  = parseInt(document.getElementById('edit-exp').value)    || e.experience;
  e.payroll = {
    basic: Math.floor(e.salary*0.5), hra: Math.floor(e.salary*0.2),
    allowances: Math.floor(e.salary*0.1), deductions: Math.floor(e.salary*0.15), net: Math.floor(e.salary*0.85)
  };
  closeModal();
  navigate('employees');
}
