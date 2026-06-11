"""
ML Module: Employee Attrition Prediction
Algorithm: Random Forest Classifier (scikit-learn)
Input Features:
  - attendance     : Attendance percentage (0-100)
  - salary         : Annual salary in INR
  - overtime       : Overtime hours per month
  - experience     : Years of experience
  - satisfaction   : Job satisfaction score (1-5)
  - leaveFreq      : Leave frequency per month
Output:
  - 0 = Low Attrition Risk
  - 1 = Moderate Attrition Risk
  - 2 = High Attrition Risk
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, ConfusionMatrixDisplay)
import pickle
import os
import matplotlib.pyplot as plt

# ─────────────────────────────────────────────
# STEP 1: Generate / Load Dataset
# ─────────────────────────────────────────────
print("="*60)
print("STEP 1: Preparing Dataset")
print("="*60)

np.random.seed(42)
N = 500  # number of synthetic employees

# Simulate realistic employee data
attendance   = np.clip(np.random.normal(85, 12, N), 40, 100).astype(int)
salary       = np.random.choice([45000,55000,65000,75000,85000,95000,105000], N)
overtime     = np.clip(np.random.normal(12, 6, N), 0, 40).astype(int)
experience   = np.clip(np.random.randint(0, 15, N), 0, 20)
satisfaction = np.clip(np.random.randint(1, 6, N), 1, 5)
leave_freq   = np.clip(np.random.normal(3, 2.5, N), 0, 15).astype(int)

# Create labels using rule-based logic (mirrors ml.js)
def label_employee(att, sal, ot, exp, sat, lv):
    score = 0
    if   att < 70: score += 28
    elif att < 80: score += 20
    elif att < 88: score += 10
    elif att < 93: score += 5
    if   sat <= 1: score += 30
    elif sat <= 2: score += 22
    elif sat <= 3: score += 10
    elif sat <= 4: score += 3
    if   ot > 22:  score += 18
    elif ot > 16:  score += 12
    elif ot > 10:  score += 6
    if   lv >= 8:  score += 12
    elif lv >= 5:  score += 8
    elif lv >= 3:  score += 4
    sal_level = 1 if sal < 50000 else 2 if sal < 65000 else 3 if sal < 80000 else 4
    if sal_level == 1: score += 7
    elif sal_level == 2: score += 4
    if   exp < 2:  score += 5
    elif exp < 4:  score += 2
    score = min(100, score)
    if score >= 55: return 2  # High
    if score >= 30: return 1  # Moderate
    return 0                  # Low

labels = [label_employee(attendance[i], salary[i], overtime[i],
                          experience[i], satisfaction[i], leave_freq[i])
          for i in range(N)]

df = pd.DataFrame({
    "attendance":   attendance,
    "salary":       salary,
    "overtime":     overtime,
    "experience":   experience,
    "satisfaction": satisfaction,
    "leave_freq":   leave_freq,
    "attrition_risk": labels
})

# Save dataset
df.to_csv("employee_dataset.csv", index=False)
print(f"Dataset created: {N} employees")
print(f"Class distribution:\n{df['attrition_risk'].value_counts().rename({0:'Low',1:'Moderate',2:'High'})}")
print()

# ─────────────────────────────────────────────
# STEP 2: Preprocessing
# ─────────────────────────────────────────────
print("="*60)
print("STEP 2: Preprocessing")
print("="*60)

X = df[["attendance","salary","overtime","experience","satisfaction","leave_freq"]]
y = df["attrition_risk"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Train size: {len(X_train)} | Test size: {len(X_test)}")
print()

# ─────────────────────────────────────────────
# STEP 3: Train Random Forest Model
# ─────────────────────────────────────────────
print("="*60)
print("STEP 3: Training Random Forest Classifier")
print("="*60)

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=6,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)
print("Model trained successfully!")
print()

# ─────────────────────────────────────────────
# STEP 4: Evaluate Model Performance
# ─────────────────────────────────────────────
print("="*60)
print("STEP 4: Model Evaluation")
print("="*60)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Accuracy: {acc*100:.2f}%")
print()
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=["Low","Moderate","High"]))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(cm, display_labels=["Low","Moderate","High"])
disp.plot(colorbar=False)
plt.title("Confusion Matrix - Attrition Prediction")
plt.tight_layout()
plt.savefig("confusion_matrix.png", dpi=120)
plt.close()
print("Confusion matrix saved: confusion_matrix.png")

# Feature Importance
importances = model.feature_importances_
features = ["Attendance","Salary","Overtime","Experience","Satisfaction","Leave Freq"]
fi_df = pd.DataFrame({"Feature": features, "Importance": importances}).sort_values("Importance", ascending=True)
fi_df.plot(kind="barh", x="Feature", y="Importance", legend=False, color="#4F46E5")
plt.title("Feature Importance - Random Forest")
plt.xlabel("Importance Score")
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=120)
plt.close()
print("Feature importance chart saved: feature_importance.png")
print()

# ─────────────────────────────────────────────
# STEP 5: Save Model
# ─────────────────────────────────────────────
print("="*60)
print("STEP 5: Saving Model")
print("="*60)

with open("attrition_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("Model saved: attrition_model.pkl")
print()

# ─────────────────────────────────────────────
# STEP 6: Demo Prediction
# ─────────────────────────────────────────────
print("="*60)
print("STEP 6: Demo Prediction (3 sample employees)")
print("="*60)

samples = [
    {"name":"Low Risk Employee",      "attendance":95,"salary":85000,"overtime":6, "experience":7,"satisfaction":5,"leave_freq":1},
    {"name":"Moderate Risk Employee", "attendance":82,"salary":65000,"overtime":14,"experience":4,"satisfaction":3,"leave_freq":4},
    {"name":"High Risk Employee",     "attendance":68,"salary":48000,"overtime":24,"experience":1,"satisfaction":1,"leave_freq":9},
]

label_map = {0:"Low Attrition Risk", 1:"Moderate Attrition Risk", 2:"High Attrition Risk"}
for s in samples:
    feat = [[s["attendance"],s["salary"],s["overtime"],s["experience"],s["satisfaction"],s["leave_freq"]]]
    pred = model.predict(feat)[0]
    proba = model.predict_proba(feat)[0]
    print(f"  {s['name']}")
    print(f"    Prediction : {label_map[pred]}")
    print(f"    Confidence : {max(proba)*100:.1f}%")
    print()

print("All steps complete! Model is ready for the backend API.")
