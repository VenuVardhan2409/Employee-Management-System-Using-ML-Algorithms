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

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

# ─────────────────────────────────────────────
# In-memory employee store (replace with MySQL/MongoDB in production)
# ─────────────────────────────────────────────
employees = [
    {"id":1,"name":"Priya Sharma",  "dept":"Engineering","role":"Senior Developer",  "salary":85000,"attendance":92,"overtime":12,"experience":6,"satisfaction":4,"leaveFreq":2},
    {"id":2,"name":"Rahul Gupta",   "dept":"Sales",      "role":"Sales Manager",      "salary":72000,"attendance":78,"overtime":18,"experience":4,"satisfaction":2,"leaveFreq":5},
    {"id":3,"name":"Ananya Patel",  "dept":"HR",         "role":"HR Specialist",      "salary":58000,"attendance":96,"overtime":5, "experience":8,"satisfaction":5,"leaveFreq":1},
    {"id":4,"name":"Vikram Nair",   "dept":"Finance",    "role":"Financial Analyst",  "salary":78000,"attendance":85,"overtime":14,"experience":5,"satisfaction":3,"leaveFreq":3},
    {"id":5,"name":"Deepika Rao",   "dept":"Marketing",  "role":"Marketing Lead",     "salary":68000,"attendance":71,"overtime":22,"experience":3,"satisfaction":2,"leaveFreq":7},
    {"id":6,"name":"Arjun Mehta",   "dept":"Engineering","role":"DevOps Engineer",    "salary":90000,"attendance":94,"overtime":8, "experience":7,"satisfaction":4,"leaveFreq":1},
    {"id":7,"name":"Sneha Joshi",   "dept":"Operations", "role":"Operations Manager", "salary":65000,"attendance":88,"overtime":10,"experience":5,"satisfaction":3,"leaveFreq":3},
    {"id":8,"name":"Kiran Kumar",   "dept":"Engineering","role":"Junior Developer",   "salary":48000,"attendance":67,"overtime":25,"experience":1,"satisfaction":1,"leaveFreq":9},
]
next_id = 9

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
    return jsonify({"message": "HR Management API is running", "status": "ok"})

# GET all employees
@app.route("/api/employees", methods=["GET"])
def get_employees():
    return jsonify(employees)

# GET single employee
@app.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    emp = next((e for e in employees if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(emp)

# POST add employee
@app.route("/api/employees", methods=["POST"])
def add_employee():
    global next_id
    data = request.get_json()
    if not data.get("name") or not data.get("email"):
        return jsonify({"error": "Name and email are required"}), 400
    new_emp = {
        "id":           next_id,
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
        "status":       "active",
        "joined":       data.get("joined", ""),
        "phone":        data.get("phone", ""),
    }
    employees.append(new_emp)
    next_id += 1
    return jsonify(new_emp), 201

# PUT update employee
@app.route("/api/employees/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    emp = next((e for e in employees if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    data = request.get_json()
    emp.update({k: v for k, v in data.items() if k != "id"})
    return jsonify(emp)

# DELETE employee
@app.route("/api/employees/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    global employees
    orig_len = len(employees)
    employees = [e for e in employees if e["id"] != emp_id]
    if len(employees) == orig_len:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify({"message": "Employee deleted", "id": emp_id})

# ML: Predict attrition for one employee
@app.route("/api/predict/<int:emp_id>", methods=["GET"])
def predict_attrition(emp_id):
    emp = next((e for e in employees if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404

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
    results = []
    for emp in employees:
        prediction = rule_based_predict(emp)
        results.append({**emp, "attrition_prediction": prediction})
    results.sort(key=lambda x: x["attrition_prediction"]["score"], reverse=True)
    return jsonify(results)

# Payroll breakdown
@app.route("/api/payroll", methods=["GET"])
def get_payroll():
    payroll_data = []
    for emp in employees:
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
    total = len(employees)
    risks = {"high":0,"moderate":0,"low":0}
    for e in employees:
        risks[rule_based_predict(e)["level"]] += 1
    return jsonify({
        "total_employees":  total,
        "avg_attendance":   round(sum(e["attendance"] for e in employees)/total, 1) if total else 0,
        "avg_satisfaction": round(sum(e["satisfaction"] for e in employees)/total, 1) if total else 0,
        "attrition_risk":   risks,
        "total_annual_payroll": sum(int(e["salary"]*0.85) for e in employees),
    })

if __name__ == "__main__":
    print("Starting HR Management API on http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
