# AI-Enhanced Employee Management System

A full-stack web application with Machine Learning (Random Forest attrition prediction) and Generative AI (LLM-powered HR insights).

---

## Project Structure

```
hr_project/
├── Frontend/
│   ├── index.html          ← Main HTML file (open this in browser)
│   ├── css/
│   │   └── style.css       ← All styles
│   └── js/
│       ├── data.js         ← Employee data store
│       ├── ml.js           ← Random Forest attrition predictor
│       ├── pages.js        ← All page renderers + AI insight functions
│       ├── charts.js       ← Chart.js chart initializers
│       └── app.js          ← Router, modal, app boot
├── Backend/
│   ├── app.py              ← Flask REST API
│   └── requirements.txt    ← Python dependencies
├── ML/
│   └── train_model.py      ← Train Random Forest model (scikit-learn)
└── README.md
```

---

## Technology Stack

| Layer           | Technology                          |
|-----------------|-------------------------------------|
| Frontend        | HTML5, CSS3, Vanilla JavaScript     |
| Charts          | Chart.js 4.x                        |
| Icons           | Tabler Icons (CDN)                  |
| Backend         | Flask (Python)                      |
| Database        | In-memory (extend to MySQL/MongoDB) |
| Machine Learning| scikit-learn (Random Forest)        |
| Generative AI   | Claude LLM API (Anthropic)         |

---

## HOW TO RUN — STEP BY STEP

### ✅ Option A: Open Frontend Directly (Fastest — No Install Needed)

1. Open VS Code
2. Open the folder: `File → Open Folder → select hr_project`
3. Install the "Live Server" extension:
   - Click the Extensions icon (left sidebar, looks like 4 squares)
   - Search: `Live Server`
   - Install the one by **Ritwick Dey**
4. Open `Frontend/index.html`
5. Right-click anywhere in the file → **"Open with Live Server"**
6. Browser opens at `http://127.0.0.1:5500/Frontend/index.html`
7. ✅ Full app runs — all pages, ML predictions, charts work immediately

---

### ✅ Option B: Run Flask Backend (For API Routes)

1. Open VS Code Terminal: `Terminal → New Terminal`
2. Navigate to Backend folder:
   ```
   cd Backend
   ```
3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Start the server:
   ```
   python app.py
   ```
5. API runs at: `http://localhost:5000`

Available API endpoints:
- `GET  /api/employees`         — List all employees
- `POST /api/employees`         — Add employee
- `PUT  /api/employees/<id>`    — Update employee
- `DELETE /api/employees/<id>`  — Delete employee
- `GET  /api/predict/<id>`      — ML attrition prediction for one employee
- `GET  /api/predict/all`       — Predictions for all employees
- `GET  /api/payroll`           — Payroll breakdown
- `GET  /api/stats`             — HR statistics summary

---

### ✅ Option C: Train the ML Model

1. Open VS Code Terminal
2. Navigate to ML folder:
   ```
   cd ML
   ```
3. Install dependencies (if not done):
   ```
   pip install scikit-learn pandas numpy matplotlib
   ```
4. Run training:
   ```
   python train_model.py
   ```
5. Output files created:
   - `attrition_model.pkl`      — Trained Random Forest model
   - `employee_dataset.csv`     — Synthetic training dataset
   - `confusion_matrix.png`     — Model evaluation chart
   - `feature_importance.png`   — Feature importance chart

---

## Features

### Employee Management (Full Stack)
- Employee Registration & Login
- Admin/HR Dashboard
- Employee Profile Management (Add, Edit, Delete, View)
- Department & Role Management
- Search and filter employees

### Attendance & Leave Tracking
- 6-month attendance history per employee
- Color-coded attendance health (green/amber/red)
- Leave frequency and overtime monitoring

### Payroll Management
- Full salary breakdown: Basic (50%), HRA (20%), Allowances (10%), Deductions (15%)
- Net annual and monthly pay
- Department-wise payroll totals

### Machine Learning Module — Attrition Prediction
- **Algorithm**: Random Forest Classifier
- **Input Features**: Attendance %, Salary Level, Overtime Hours, Years of Experience, Job Satisfaction Score, Leave Frequency
- **Output**: Low / Moderate / High Attrition Risk with numeric risk score (0–100)
- Feature importance visualization

### Generative AI Module — HR Insights
- Per-employee: Performance Summary, Attendance Analysis, Payroll Observation, HR Recommendation
- Team-level: HR Overview, Attrition Analysis, Performance Trends, Strategic Recommendations
- Powered by Claude LLM API (with rule-based fallback when offline)

### Reports & Analytics
- Department attendance and salary charts
- Attrition risk distribution
- Satisfaction vs. Attendance scatter plot
