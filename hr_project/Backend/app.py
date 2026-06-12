"""
AI-Enhanced Employee Management System
Backend: Flask REST API
Author: Your Name
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import json
import sqlite3

FRONTEND_FOLDER = os.path.join(os.path.dirname(__file__), "../Frontend")
app = Flask(__name__, static_folder=FRONTEND_FOLDER, static_url_path="")
CORS(app)  # Allow frontend to call backend

DB_PATH = os.path.join(os.path.dirname(__file__), "hr.db")

initial_employees = [
    {"id":1,"name":"Priya Sharma",  "dept":"Engineering","role":"Senior Developer",  "salary":85000,"attendance":92,"overtime":12,"experience":6,"satisfaction":4,"leaveFreq":2,"email":"priya@company.com","status":"active","joined":"2019-03-15","phone":"9876543210"},
    {"id":2,"name":"Rahul Gupta",   "dept":"Sales",      "role":"Sales Manager",      "salary":72000,"attendance":78,"overtime":18,"experience":4,"satisfaction":2,"leaveFreq":5,"email":"rahul@company.com","status":"active","joined":"2020-07-22","phone":"9812345678"},
    {"id":3,"name":"Ananya Patel",  "dept":"HR",         "role":"HR Specialist",      "salary":58000,"attendance":96,"overtime":5, "experience":8,"satisfaction":5,"leaveFreq":1,"email":"ananya@company.com","status":"active","joined":"2017-11-02","phone":"9901234567"},
    {"id":4,"name":"Vikram Nair",   "dept":"Finance",    "role":"Financial Analyst",  "salary":78000,"attendance":85,"overtime":14,"experience":5,"satisfaction":3,"leaveFreq":3,"email":"vikram@company.com","status":"active","joined":"2021-02-17","phone":"9765432109"},
    {"id":5,"name":"Deepika Rao",   "dept":"Marketing",  "role":"Marketing Lead",     "salary":68000,"attendance":71,"overtime":22,"experience":3,"satisfaction":2,"leaveFreq":7,"email":"deepika@company.com","status":"active","joined":"2018-06-05","phone":"9654321098"},
    {"id":6,"name":"Arjun Mehta",   "dept":"Engineering","role":"DevOps Engineer",    "salary":90000,"attendance":94,"overtime":8, "experience":7,"satisfaction":4,"leaveFreq":1,"email":"arjun@company.com","status":"active","joined":"2018-11-23","phone":"9321098765"},
    {"id":7,"name":"Sneha Joshi",   "dept":"Operations", "role":"Operations Manager", "salary":65000,"attendance":88,"overtime":10,"experience":5,"satisfaction":3,"leaveFreq":3,"email":"sneha@company.com","status":"active","joined":"2020-09-10","phone":"9873216540"},
    {"id":8,"name":"Kiran Kumar",   "dept":"Engineering","role":"Junior Developer",   "salary":48000,"attendance":67,"overtime":25,"experience":1,"satisfaction":1,"leaveFreq":9,"email":"kiran@company.com","status":"active","joined":"2024-01-10","phone":"9109876543"},
]

# ─────────────────────────────────────────────
# SQLite database helpers
# ─────────────────────────────────────────────

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def row_to_dict(row):
    return {k: row[k] for k in row.keys()}


def remove_db_file(path):
    for suffix in ["", "-journal", "-wal", "-shm"]:
        candidate = path + suffix
        if os.path.exists(candidate):
            try:
                os.remove(candidate)
                print(f"Removed database file: {candidate}")
            except OSError as remove_error:
                print(f"Failed to remove database file {candidate}: {remove_error}")


def init_db():
    def create_tables_and_seed(conn):
        conn.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                dept TEXT NOT NULL,
                role TEXT NOT NULL,
                salary INTEGER NOT NULL,
                attendance INTEGER NOT NULL,
                overtime INTEGER NOT NULL,
                experience INTEGER NOT NULL,
                satisfaction INTEGER NOT NULL,
                leaveFreq INTEGER NOT NULL,
                status TEXT NOT NULL,
                joined TEXT,
                phone TEXT
            )
        """)
        count = conn.execute("SELECT COUNT(*) FROM employees").fetchone()[0]
        if count == 0:
            conn.executemany(
                """
                INSERT INTO employees (id, name, email, dept, role, salary, attendance, overtime, experience, satisfaction, leaveFreq, status, joined, phone)
                VALUES (:id, :name, :email, :dept, :role, :salary, :attendance, :overtime, :experience, :satisfaction, :leaveFreq, :status, :joined, :phone)
                """,
                initial_employees
            )

    if os.path.exists(DB_PATH):
        integrity_ok = False
        try:
            with sqlite3.connect(DB_PATH) as conn:
                cur = conn.cursor()
                cur.execute("PRAGMA integrity_check;")
                result = cur.fetchone()
                integrity_ok = bool(result and result[0] == "ok")
            if integrity_ok:
                print(f"Database integrity check passed for {DB_PATH}")
            else:
                raise sqlite3.DatabaseError(f"Integrity check failed: {result}")
        except sqlite3.DatabaseError as exc:
            print(f"Database corrupted or unreadable: {exc}")
            remove_db_file(DB_PATH)
            if os.path.exists(DB_PATH):
                raise RuntimeError(
                    f"Could not remove corrupted database file {DB_PATH}. Close any programs using the file and try again."
                )

    if not os.path.exists(DB_PATH):
        with sqlite3.connect(DB_PATH) as conn:
            create_tables_and_seed(conn)
        print(f"Initialized database at {DB_PATH}")
    else:
        print(f"Using existing database at {DB_PATH}")

# ─────────────────────────────────────────────
# ML: Load Random Forest model (trained in ML/notebook.ipynb)
# ─────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ML/attrition_model.pkl")

def load_ml_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    return None

ml_model = load_ml_model()

def rule_based_predict(emp):
    """Fallback rule-based predictor (mirrors js/ml.js logic)."""
    score = 0
    if   emp["attendance"] < 70: score += 28
    elif emp["attendance"] < 80: score += 20
    elif emp["attendance"] < 88: score += 10
    elif emp["attendance"] < 93: score += 5

    if   emp["satisfaction"] <= 1: score += 30
    elif emp["satisfaction"] <= 2: score += 22
    elif emp["satisfaction"] <= 3: score += 10
    elif emp["satisfaction"] <= 4: score += 3

    if   emp["overtime"] > 22: score += 18
    elif emp["overtime"] > 16: score += 12
    elif emp["overtime"] > 10: score += 6

    if   emp["leaveFreq"] >= 8: score += 12
    elif emp["leaveFreq"] >= 5: score += 8
    elif emp["leaveFreq"] >= 3: score += 4

    sal = emp["salary"]
    sal_level = 1 if sal < 50000 else 2 if sal < 65000 else 3 if sal < 80000 else 4
    if sal_level == 1: score += 7
    elif sal_level == 2: score += 4

    if   emp["experience"] < 2: score += 5
    elif emp["experience"] < 4: score += 2

    score = min(100, score)
    if score >= 55: return {"level": "high",     "label": "High Attrition Risk",     "score": score}
    if score >= 30: return {"level": "moderate",  "label": "Moderate Attrition Risk", "score": score}
    return               {"level": "low",        "label": "Low Attrition Risk",      "score": score}

# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@app.route("/")
def home():
    return app.send_static_file("html/login.html")

# GET all employees
@app.route("/api/employees", methods=["GET"])
def get_employees():
    with get_db_connection() as conn:
        rows = conn.execute("SELECT * FROM employees ORDER BY id").fetchall()
    return jsonify([row_to_dict(row) for row in rows])

# GET single employee
@app.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    with get_db_connection() as conn:
        row = conn.execute("SELECT * FROM employees WHERE id = ?", (emp_id,)).fetchone()
    if row is None:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(row_to_dict(row))

# POST add employee
@app.route("/api/employees", methods=["POST"])
def add_employee():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("email"):
        return jsonify({"error": "Name and email are required"}), 400
    employee = {
        "name":         data.get("name"),
        "email":        data.get("email"),
        "dept":         data.get("dept", "Engineering"),
        "role":         data.get("role", "Employee"),
        "salary":       int(data.get("salary", 50000)),
        "attendance":   int(data.get("attendance", 90)),
        "overtime":     int(data.get("overtime", 8)),
        "experience":   int(data.get("experience", 0)),
        "satisfaction": int(data.get("satisfaction", 3)),
        "leaveFreq":    int(data.get("leaveFreq", 2)),
        "status":       data.get("status", "active"),
        "joined":       data.get("joined", ""),
        "phone":        data.get("phone", ""),
    }
    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO employees (name, email, dept, role, salary, attendance, overtime, experience, satisfaction, leaveFreq, status, joined, phone)
            VALUES (:name, :email, :dept, :role, :salary, :attendance, :overtime, :experience, :satisfaction, :leaveFreq, :status, :joined, :phone)
            """,
            employee
        )
        emp_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM employees WHERE id = ?", (emp_id,)).fetchone()
    return jsonify(row_to_dict(row)), 201

# PUT update employee
@app.route("/api/employees/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    data = request.get_json() or {}
    with get_db_connection() as conn:
        row = conn.execute("SELECT * FROM employees WHERE id = ?", (emp_id,)).fetchone()
        if row is None:
            return jsonify({"error": "Employee not found"}), 404

        fields = {k: data[k] for k in data.keys() if k in ["name", "email", "dept", "role", "salary", "attendance", "overtime", "experience", "satisfaction", "leaveFreq", "status", "joined", "phone"]}
        if fields:
            assignments = ", ".join([f"{k} = :{k}" for k in fields.keys()])
            fields["id"] = emp_id
            conn.execute(f"UPDATE employees SET {assignments} WHERE id = :id", fields)
        updated_row = conn.execute("SELECT * FROM employees WHERE id = ?", (emp_id,)).fetchone()
    return jsonify(row_to_dict(updated_row))

# DELETE employee
@app.route("/api/employees/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    with get_db_connection() as conn:
        cursor = conn.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Employee not found"}), 404
    return jsonify({"message": "Employee deleted", "id": emp_id})

# ML: Predict attrition for one employee
@app.route("/api/predict/<int:emp_id>", methods=["GET"])
def predict_attrition(emp_id):
    with get_db_connection() as conn:
        row = conn.execute("SELECT * FROM employees WHERE id = ?", (emp_id,)).fetchone()
    if row is None:
        return jsonify({"error": "Employee not found"}), 404
    emp = row_to_dict(row)

    if ml_model:
        # Use trained scikit-learn model
        features = [[
            emp["attendance"], emp["salary"], emp["overtime"],
            emp["experience"], emp["satisfaction"], emp["leaveFreq"]
        ]]
        prediction = ml_model.predict(features)[0]
        proba = ml_model.predict_proba(features)[0]
        score = int(max(proba) * 100)
        labels = {0: "Low Attrition Risk", 1: "Moderate Attrition Risk", 2: "High Attrition Risk"}
        levels = {0: "low", 1: "moderate", 2: "high"}
        result = {"level": levels[prediction], "label": labels[prediction], "score": score, "source": "ml_model"}
    else:
        result = rule_based_predict(emp)
        result["source"] = "rule_based"

    return jsonify({**emp, "attrition_prediction": result})

# ML: Predict attrition for ALL employees
@app.route("/api/predict/all", methods=["GET"])
def predict_all():
    with get_db_connection() as conn:
        rows = conn.execute("SELECT * FROM employees").fetchall()
    results = []
    for row in rows:
        emp = row_to_dict(row)
        prediction = rule_based_predict(emp)
        results.append({**emp, "attrition_prediction": prediction})
    results.sort(key=lambda x: x["attrition_prediction"]["score"], reverse=True)
    return jsonify(results)

# Payroll breakdown
@app.route("/api/payroll", methods=["GET"])
def get_payroll():
    payroll_data = []
    with get_db_connection() as conn:
        rows = conn.execute("SELECT * FROM employees").fetchall()
    for row in rows:
        emp = row_to_dict(row)
        sal = emp["salary"]
        payroll_data.append({
            "id":          emp["id"],
            "name":        emp["name"],
            "dept":        emp["dept"],
            "annual_ctc":  sal,
            "basic":       int(sal * 0.50),
            "hra":         int(sal * 0.20),
            "allowances":  int(sal * 0.10),
            "deductions":  int(sal * 0.15),
            "net_annual":  int(sal * 0.85),
            "net_monthly": int(sal * 0.85 / 12),
        })
    return jsonify(payroll_data)

# HR stats summary
@app.route("/api/stats", methods=["GET"])
def get_stats():
    with get_db_connection() as conn:
        rows = conn.execute("SELECT * FROM employees").fetchall()
    total = len(rows)
    risks = {"high":0,"moderate":0,"low":0}
    for row in rows:
        emp = row_to_dict(row)
        risks[rule_based_predict(emp)["level"]] += 1
    return jsonify({
        "total_employees":  total,
        "avg_attendance":   round(sum(row["attendance"] for row in rows)/total, 1) if total else 0,
        "avg_satisfaction": round(sum(row["satisfaction"] for row in rows)/total, 1) if total else 0,
        "attrition_risk":   risks,
        "total_annual_payroll": sum(int(row["salary"]*0.85) for row in rows),
    })

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting HR Management API on http://0.0.0.0:{port}")
    app.run(debug=True, host="0.0.0.0", port=port)
