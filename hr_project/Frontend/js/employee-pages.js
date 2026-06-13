// ====================== EMPLOYEE PAGE RENDERERS ======================

// --- EMPLOYEE DASHBOARD ---
function renderEmployeeDashboard() {
  const emp = currentEmployeeUser;
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[today.getDay()];

  // Mock attendance data for this week
  const weekAttendance = [
    { day: 'Mon', status: 'Present', time: '09:00 AM' },
    { day: 'Tue', status: 'Present', time: '09:15 AM' },
    { day: 'Wed', status: 'Present', time: '09:05 AM' },
    { day: 'Thu', status: 'Present', time: '09:30 AM' },
    { day: 'Fri', status: dayName === 'Friday' ? 'Present' : 'Absent', time: dayName === 'Friday' ? '09:10 AM' : '--' },
  ];

  return `
  <div class="topbar">
    <div>
      <div class="page-title">Welcome back, ${emp.name}</div>
      <div class="page-sub">${dayName}, ${today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
    <div class="topbar-right">
      <button class="btn btn-outline btn-sm" onclick="navigateEmployee('profile')"><i class="ti ti-user"></i>Profile</button>
      <button class="btn btn-outline btn-sm" onclick="employeeLogout()"><i class="ti ti-power"></i>Logout</button>
      <div class="avatar emp-avatar">${emp.name.split(' ').map(n => n[0]).join('')}</div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon stat-icon-blue"><i class="ti ti-calendar-check"></i></div>
      <div class="stat-content">
        <div class="stat-label">Attendance</div>
        <div class="stat-value">92%</div>
        <div class="stat-sub">This month</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-green"><i class="ti ti-calendar-off"></i></div>
      <div class="stat-content">
        <div class="stat-label">Leaves Left</div>
        <div class="stat-value">8</div>
        <div class="stat-sub">Out of 20</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-purple"><i class="ti ti-wallet"></i></div>
      <div class="stat-content">
        <div class="stat-label">Salary</div>
        <div class="stat-value">₹45,000</div>
        <div class="stat-sub">Monthly</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-orange"><i class="ti ti-briefcase"></i></div>
      <div class="stat-content">
        <div class="stat-label">Designation</div>
        <div class="stat-value">Senior</div>
        <div class="stat-sub">Developer</div>
      </div>
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Week Attendance</h3>
      </div>
      <div class="card-body">
        <div class="attendance-week">
          ${weekAttendance.map(att => `
            <div class="attendance-day">
              <div class="day-label">${att.day}</div>
              <div class="day-status ${att.status === 'Present' ? 'status-present' : 'status-absent'}">
                <i class="ti ti-${att.status === 'Present' ? 'check' : 'x'}"></i>
              </div>
              <div class="day-time">${att.time}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Quick Stats</h3>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="info-label">Employee ID</span>
          <span class="info-value">${emp.empId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Department</span>
          <span class="info-value">Engineering</span>
        </div>
        <div class="info-row">
          <span class="info-label">Joining Date</span>
          <span class="info-value">Jan 15, 2022</span>
        </div>
        <div class="info-row">
          <span class="info-label">Reporting To</span>
          <span class="info-value">James Mitchell</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Recent Announcements</h3>
    </div>
    <div class="card-body">
      <div class="announcement-item">
        <div class="ann-icon"><i class="ti ti-bell"></i></div>
        <div class="ann-content">
          <div class="ann-title">Company Holiday</div>
          <div class="ann-text">Independence Day celebration - August 15, 2024</div>
          <div class="ann-date">Posted 2 days ago</div>
        </div>
      </div>
      <div class="announcement-item">
        <div class="ann-icon"><i class="ti ti-info-circle"></i></div>
        <div class="ann-content">
          <div class="ann-title">System Maintenance</div>
          <div class="ann-text">Server maintenance scheduled for next weekend from 2 AM to 6 AM</div>
          <div class="ann-date">Posted 1 day ago</div>
        </div>
      </div>
      <div class="announcement-item">
        <div class="ann-icon"><i class="ti ti-certificate"></i></div>
        <div class="ann-content">
          <div class="ann-title">Training Program</div>
          <div class="ann-text">New professional development courses are now available on our learning portal</div>
          <div class="ann-date">Posted 3 days ago</div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// --- EMPLOYEE PROFILE ---
function renderEmployeeProfile() {
  const emp = currentEmployeeUser;

  return `
  <div class="topbar">
    <div>
      <div class="page-title">My Profile</div>
      <div class="page-sub">Manage your personal information</div>
    </div>
    <div class="topbar-right">
      <button class="btn btn-primary btn-sm" onclick="editProfile()"><i class="ti ti-pencil"></i>Edit</button>
      <button class="btn btn-outline btn-sm" onclick="navigateEmployee('dashboard')"><i class="ti ti-arrow-left"></i>Back</button>
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Personal Information</h3>
      </div>
      <div class="card-body profile-info">
        <div class="profile-header">
          <div class="profile-avatar">${emp.name.split(' ').map(n => n[0]).join('')}</div>
          <div class="profile-header-info">
            <div class="profile-name">${emp.name}</div>
            <div class="profile-role">Senior Developer</div>
          </div>
        </div>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border);">
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${emp.email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Employee ID</span>
          <span class="info-value">${emp.empId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">+91 98765 43210</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date of Birth</span>
          <span class="info-value">March 15, 1995</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Professional Details</h3>
      </div>
      <div class="card-body profile-info">
        <div class="info-row">
          <span class="info-label">Department</span>
          <span class="info-value">Engineering</span>
        </div>
        <div class="info-row">
          <span class="info-label">Designation</span>
          <span class="info-value">Senior Developer</span>
        </div>
        <div class="info-row">
          <span class="info-label">Joining Date</span>
          <span class="info-value">January 15, 2022</span>
        </div>
        <div class="info-row">
          <span class="info-label">Reports To</span>
          <span class="info-value">James Mitchell</span>
        </div>
        <div class="info-row">
          <span class="info-label">Employment Type</span>
          <span class="info-value">Full-Time</span>
        </div>
        <div class="info-row">
          <span class="info-label">Office Location</span>
          <span class="info-value">Bangalore, India</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Bank & Statutory Information</h3>
    </div>
    <div class="card-body">
      <div class="grid grid-3">
        <div class="info-box">
          <div class="info-box-label">Bank Account</div>
          <div class="info-box-value">XXXX XXXX XXXX 2345</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">PAN Number</div>
          <div class="info-box-value">ABCDE1234F</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">Aadhar Number</div>
          <div class="info-box-value">XXXX XXXX 1234</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">UAN Number</div>
          <div class="info-box-value">100XXXXX12345</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">ESIC Number</div>
          <div class="info-box-value">28XXX0123456789</div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// --- EMPLOYEE ATTENDANCE ---
function renderEmployeeAttendance() {
  return `
  <div class="topbar">
    <div>
      <div class="page-title">My Attendance</div>
      <div class="page-sub">View your attendance records and statistics</div>
    </div>
  </div>

  <div class="grid grid-4">
    <div class="stat-card">
      <div class="stat-icon stat-icon-green"><i class="ti ti-check"></i></div>
      <div class="stat-content">
        <div class="stat-label">Present</div>
        <div class="stat-value">18</div>
        <div class="stat-sub">This month</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-red"><i class="ti ti-x"></i></div>
      <div class="stat-content">
        <div class="stat-label">Absent</div>
        <div class="stat-value">1</div>
        <div class="stat-sub">This month</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-yellow"><i class="ti ti-minus"></i></div>
      <div class="stat-content">
        <div class="stat-label">Leave</div>
        <div class="stat-value">1</div>
        <div class="stat-sub">This month</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-blue"><i class="ti ti-percentage"></i></div>
      <div class="stat-content">
        <div class="stat-label">Attendance %</div>
        <div class="stat-value">90%</div>
        <div class="stat-sub">This month</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Recent Attendance</h3>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aug 12, 2024</td>
              <td>09:00 AM</td>
              <td>06:15 PM</td>
              <td><span class="badge badge-success">Present</span></td>
              <td>9h 15m</td>
            </tr>
            <tr>
              <td>Aug 11, 2024</td>
              <td>09:30 AM</td>
              <td>06:30 PM</td>
              <td><span class="badge badge-success">Present</span></td>
              <td>9h 00m</td>
            </tr>
            <tr>
              <td>Aug 10, 2024</td>
              <td>--</td>
              <td>--</td>
              <td><span class="badge badge-warning">Leave</span></td>
              <td>--</td>
            </tr>
            <tr>
              <td>Aug 09, 2024</td>
              <td>09:15 AM</td>
              <td>06:00 PM</td>
              <td><span class="badge badge-success">Present</span></td>
              <td>8h 45m</td>
            </tr>
            <tr>
              <td>Aug 08, 2024</td>
              <td>09:10 AM</td>
              <td>06:30 PM</td>
              <td><span class="badge badge-success">Present</span></td>
              <td>9h 20m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

// --- EMPLOYEE LEAVES ---
function renderEmployeeLeaves() {
  return `
  <div class="topbar">
    <div>
      <div class="page-title">My Leaves</div>
      <div class="page-sub">View and manage your leave requests</div>
    </div>
    <div class="topbar-right">
      <button class="btn btn-primary btn-sm" onclick="requestLeave()"><i class="ti ti-plus"></i>Request Leave</button>
    </div>
  </div>

  <div class="grid grid-3">
    <div class="stat-card">
      <div class="stat-icon stat-icon-blue"><i class="ti ti-calendar-event"></i></div>
      <div class="stat-content">
        <div class="stat-label">Total Leave</div>
        <div class="stat-value">20</div>
        <div class="stat-sub">Per year</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-green"><i class="ti ti-check"></i></div>
      <div class="stat-content">
        <div class="stat-label">Used</div>
        <div class="stat-value">12</div>
        <div class="stat-sub">This year</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-orange"><i class="ti ti-calendar-off"></i></div>
      <div class="stat-content">
        <div class="stat-label">Remaining</div>
        <div class="stat-value">8</div>
        <div class="stat-sub">Available</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Leave Breakdown</h3>
    </div>
    <div class="card-body">
      <div class="grid grid-2">
        <div class="leave-type">
          <div class="leave-name">Casual Leave (CL)</div>
          <div class="leave-bar">
            <div class="leave-used" style="width: 60%"></div>
          </div>
          <div class="leave-info">
            <span>6 Used</span>
            <span>4 Remaining</span>
          </div>
        </div>
        <div class="leave-type">
          <div class="leave-name">Sick Leave (SL)</div>
          <div class="leave-bar">
            <div class="leave-used" style="width: 40%"></div>
          </div>
          <div class="leave-info">
            <span>2 Used</span>
            <span>3 Remaining</span>
          </div>
        </div>
        <div class="leave-type">
          <div class="leave-name">Earned Leave (EL)</div>
          <div class="leave-bar">
            <div class="leave-used" style="width: 70%"></div>
          </div>
          <div class="leave-info">
            <span>4 Used</span>
            <span>1 Remaining</span>
          </div>
        </div>
        <div class="leave-type">
          <div class="leave-name">Optional Holiday (OH)</div>
          <div class="leave-bar">
            <div class="leave-used" style="width: 0%"></div>
          </div>
          <div class="leave-info">
            <span>0 Used</span>
            <span>0 Remaining</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Leave Requests</h3>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>From Date</th>
              <th>To Date</th>
              <th>Type</th>
              <th>Days</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aug 20, 2024</td>
              <td>Aug 22, 2024</td>
              <td>Casual Leave</td>
              <td>3</td>
              <td><span class="badge badge-success">Approved</span></td>
              <td>--</td>
            </tr>
            <tr>
              <td>Aug 10, 2024</td>
              <td>Aug 10, 2024</td>
              <td>Sick Leave</td>
              <td>1</td>
              <td><span class="badge badge-success">Approved</span></td>
              <td>--</td>
            </tr>
            <tr>
              <td>Aug 02, 2024</td>
              <td>Aug 05, 2024</td>
              <td>Casual Leave</td>
              <td>4</td>
              <td><span class="badge badge-warning">Pending</span></td>
              <td><button class="btn-link" onclick="cancelLeave()">Cancel</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

// --- EMPLOYEE SALARY ---
function renderEmployeeSalary() {
  return `
  <div class="topbar">
    <div>
      <div class="page-title">Salary & Payroll</div>
      <div class="page-sub">View your salary details and payslips</div>
    </div>
  </div>

  <div class="grid grid-3">
    <div class="stat-card">
      <div class="stat-icon stat-icon-green"><i class="ti ti-wallet"></i></div>
      <div class="stat-content">
        <div class="stat-label">Monthly Salary</div>
        <div class="stat-value">₹45,000</div>
        <div class="stat-sub">Net Amount</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-blue"><i class="ti ti-coin"></i></div>
      <div class="stat-content">
        <div class="stat-label">Annual CTC</div>
        <div class="stat-value">₹5.4L</div>
        <div class="stat-sub">Per annum</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-purple"><i class="ti ti-gift"></i></div>
      <div class="stat-content">
        <div class="stat-label">Bonus</div>
        <div class="stat-value">₹90,000</div>
        <div class="stat-sub">This year</div>
      </div>
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Salary Breakdown (Monthly)</h3>
      </div>
      <div class="card-body">
        <div class="salary-section">
          <div class="salary-title">Earnings</div>
          <div class="salary-item">
            <span>Basic Salary</span>
            <span>₹30,000</span>
          </div>
          <div class="salary-item">
            <span>House Rent Allowance (HRA)</span>
            <span>₹9,000</span>
          </div>
          <div class="salary-item">
            <span>Dearness Allowance (DA)</span>
            <span>₹4,000</span>
          </div>
          <div class="salary-item">
            <span>Medical Allowance</span>
            <span>₹1,500</span>
          </div>
          <div class="salary-item total">
            <span>Gross Salary</span>
            <span>₹44,500</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Deductions & Taxes</h3>
      </div>
      <div class="card-body">
        <div class="salary-section">
          <div class="salary-title">Deductions</div>
          <div class="salary-item">
            <span>Provident Fund (PF)</span>
            <span>-₹1,800</span>
          </div>
          <div class="salary-item">
            <span>Employee State Insurance (ESI)</span>
            <span>-₹500</span>
          </div>
          <div class="salary-item">
            <span>Income Tax</span>
            <span>-₹1,200</span>
          </div>
          <div class="salary-item total">
            <span>Total Deductions</span>
            <span>-₹3,500</span>
          </div>
          <div class="salary-item net">
            <span>Net Salary</span>
            <span>₹45,000</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Recent Payslips</h3>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Salary Date</th>
              <th>Gross Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>August 2024</td>
              <td>Aug 30, 2024</td>
              <td>₹44,500</td>
              <td>-₹3,500</td>
              <td>₹45,000</td>
              <td><button class="btn-link" onclick="downloadPayslip('Aug2024')">Download</button></td>
            </tr>
            <tr>
              <td>July 2024</td>
              <td>Jul 30, 2024</td>
              <td>₹44,500</td>
              <td>-₹3,500</td>
              <td>₹45,000</td>
              <td><button class="btn-link" onclick="downloadPayslip('Jul2024')">Download</button></td>
            </tr>
            <tr>
              <td>June 2024</td>
              <td>Jun 30, 2024</td>
              <td>₹44,500</td>
              <td>-₹3,500</td>
              <td>₹45,000</td>
              <td><button class="btn-link" onclick="downloadPayslip('Jun2024')">Download</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

// Helper functions
function editProfile() {
  showModal(`
    <div class="modal-header">
      <h2>Edit Profile</h2>
      <button class="modal-close" onclick="closeModal()"><i class="ti ti-x"></i></button>
    </div>
    <div class="modal-body">
      <p style="color: #6B7280; margin-bottom: 16px;">Update your profile information</p>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" value="${currentEmployeeUser.email}" />
      </div>
      <div class="form-group">
        <label>Phone Number</label>
        <input type="tel" placeholder="+91 98765 43210" />
      </div>
      <div class="form-group">
        <label>Current Password</label>
        <input type="password" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal()">Save Changes</button>
    </div>
  `);
}

function requestLeave() {
  showModal(`
    <div class="modal-header">
      <h2>Request Leave</h2>
      <button class="modal-close" onclick="closeModal()"><i class="ti ti-x"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Leave Type</label>
        <select>
          <option>Casual Leave (CL)</option>
          <option>Sick Leave (SL)</option>
          <option>Earned Leave (EL)</option>
        </select>
      </div>
      <div class="form-group">
        <label>From Date</label>
        <input type="date" />
      </div>
      <div class="form-group">
        <label>To Date</label>
        <input type="date" />
      </div>
      <div class="form-group">
        <label>Reason</label>
        <textarea placeholder="Enter reason for leave"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="closeModal()">Request Leave</button>
    </div>
  `);
}

function cancelLeave() {
  showModal(`
    <div class="modal-header">
      <h2>Cancel Leave Request</h2>
      <button class="modal-close" onclick="closeModal()"><i class="ti ti-x"></i></button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to cancel this leave request?</p>
      <p style="color: #6B7280; font-size: 13px; margin-top: 12px;">Aug 02 - Aug 05, 2024 (Casual Leave)</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal()">No, Keep It</button>
      <button class="btn btn-danger" onclick="closeModal()">Yes, Cancel</button>
    </div>
  `);
}

function downloadPayslip(month) {
  alert('Downloading payslip for ' + month);
}
