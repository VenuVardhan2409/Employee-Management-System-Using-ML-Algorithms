// ====================== ML: RANDOM FOREST ATTRITION PREDICTOR ======================
// Simulates a Random Forest Classifier trained on employee data.
// Input Features: Attendance %, Salary Level, Overtime Hours,
//                 Years of Experience, Job Satisfaction Score, Leave Frequency
// Output: Low / Moderate / High Attrition Risk with score 0-100

function predictAttrition(emp) {
  let score = 0;

  // Feature 1: Attendance % (weight: 28%)
  if      (emp.attendance < 70) score += 28;
  else if (emp.attendance < 80) score += 20;
  else if (emp.attendance < 88) score += 10;
  else if (emp.attendance < 93) score += 5;

  // Feature 2: Job Satisfaction Score (weight: 30%)
  if      (emp.satisfaction <= 1) score += 30;
  else if (emp.satisfaction <= 2) score += 22;
  else if (emp.satisfaction <= 3) score += 10;
  else if (emp.satisfaction <= 4) score += 3;

  // Feature 3: Overtime Hours per month (weight: 18%)
  if      (emp.overtime > 22) score += 18;
  else if (emp.overtime > 16) score += 12;
  else if (emp.overtime > 10) score += 6;

  // Feature 4: Leave Frequency per month (weight: 12%)
  if      (emp.leaveFreq >= 8) score += 12;
  else if (emp.leaveFreq >= 5) score += 8;
  else if (emp.leaveFreq >= 3) score += 4;

  // Feature 5: Salary Level (weight: 7%)
  const salaryLevel = emp.salary < 50000 ? 1 : emp.salary < 65000 ? 2 : emp.salary < 80000 ? 3 : 4;
  if      (salaryLevel === 1) score += 7;
  else if (salaryLevel === 2) score += 4;
  else if (salaryLevel === 3) score += 1;

  // Feature 6: Years of Experience (weight: 5%)
  if (emp.experience < 2) score += 5;
  else if (emp.experience < 4) score += 2;

  score = Math.min(100, score);

  if (score >= 55) return { label: "High Attrition Risk",     level: "high",     score, color: "#DC2626" };
  if (score >= 30) return { label: "Moderate Attrition Risk", level: "moderate", score, color: "#D97706" };
  return               { label: "Low Attrition Risk",        level: "low",      score, color: "#059669" };
}

// Feature importance values (as % weight in model)
const FEATURE_IMPORTANCE = [
  { label: "Job Satisfaction",  value: 30, color: "#7C3AED" },
  { label: "Attendance %",      value: 28, color: "#DC2626" },
  { label: "Leave Frequency",   value: 12, color: "#D97706" },
  { label: "Overtime Hours",    value: 18, color: "#4F46E5" },
  { label: "Salary Level",      value: 7,  color: "#059669" },
  { label: "Experience",        value: 5,  color: "#6B7280" },
];
