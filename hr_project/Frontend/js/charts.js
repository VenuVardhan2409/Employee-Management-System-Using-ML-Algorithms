// ====================== CHART INITIALIZERS ======================
let activeCharts = {};

function destroyCharts() {
  Object.values(activeCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  activeCharts = {};
}

function initCharts(page) {
  if (page === 'dashboard')  initDashboardCharts();
  if (page === 'attrition')  initAttritionCharts();
  if (page === 'reports')    initReportCharts();
}

function initDashboardCharts() {
  const risks = { high:0, moderate:0, low:0 };
  DB.employees.forEach(e => risks[predictAttrition(e).level]++);

  const pieCvs = document.getElementById('ch-attritionPie');
  if (pieCvs) {
    activeCharts.pie = new Chart(pieCvs, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
        datasets: [{ data: [risks.low, risks.moderate, risks.high], backgroundColor: ['#059669','#D97706','#DC2626'], borderWidth: 0 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ font:{size:11}, boxWidth:12 } } } }
    });
  }

  const activeDepts = DB.departments.filter(d => DB.employees.some(e => e.dept===d));
  const deptAtt = activeDepts.map(d => {
    const emps = DB.employees.filter(e => e.dept===d);
    return Math.floor(emps.reduce((a,e)=>a+e.attendance,0)/emps.length);
  });
  const barCvs = document.getElementById('ch-deptAtt');
  if (barCvs) {
    activeCharts.deptBar = new Chart(barCvs, {
      type: 'bar',
      data: { labels: activeDepts, datasets: [{ label:'Attendance %', data: deptAtt, backgroundColor:'#4F46E5', borderRadius:4 }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}} }
    });
  }

  const satCvs = document.getElementById('ch-satisfaction');
  if (satCvs) {
    activeCharts.sat = new Chart(satCvs, {
      type: 'bar',
      data: {
        labels: DB.employees.map(e => e.name.split(' ')[0]),
        datasets: [{ label:'Satisfaction', data: DB.employees.map(e=>e.satisfaction), backgroundColor: DB.employees.map(e=>e.satisfaction>=4?'#059669':e.satisfaction>=3?'#D97706':'#DC2626'), borderRadius:4 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{min:0,max:5,ticks:{stepSize:1}}} }
    });
  }
}

function initAttritionCharts() {
  const results = DB.employees.map(e => ({...e, risk: predictAttrition(e)}));
  const risks = { high:0, moderate:0, low:0 };
  results.forEach(e => risks[e.risk.level]++);

  const distCvs = document.getElementById('ch-riskDist');
  if (distCvs) {
    activeCharts.riskDist = new Chart(distCvs, {
      type: 'doughnut',
      data: { labels:['Low','Moderate','High'], datasets:[{ data:[risks.low,risks.moderate,risks.high], backgroundColor:['#059669','#D97706','#DC2626'], borderWidth:0 }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ font:{size:11}, boxWidth:12 } } } }
    });
  }

  const sorted = [...results].sort((a,b) => b.risk.score - a.risk.score);
  const scoresCvs = document.getElementById('ch-riskScores');
  if (scoresCvs) {
    activeCharts.riskScores = new Chart(scoresCvs, {
      type: 'bar',
      data: {
        labels: sorted.map(e => e.name.split(' ')[0]),
        datasets: [{ label:'Risk Score', data: sorted.map(e=>e.risk.score), backgroundColor: sorted.map(e=>e.risk.color), borderRadius:4 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{min:0,max:100}} }
    });
  }
}

function initReportCharts() {
  const activeDepts = DB.departments.filter(d => DB.employees.some(e=>e.dept===d));
  const deptAtt = activeDepts.map(d => Math.floor(DB.employees.filter(e=>e.dept===d).reduce((a,e)=>a+e.attendance,0)/DB.employees.filter(e=>e.dept===d).length));
  const deptSal = activeDepts.map(d => Math.floor(DB.employees.filter(e=>e.dept===d).reduce((a,e)=>a+e.salary,0)/DB.employees.filter(e=>e.dept===d).length/1000));
  const risks = { high:0, moderate:0, low:0 };
  DB.employees.forEach(e => risks[predictAttrition(e).level]++);

  const attCvs = document.getElementById('ch-repAtt');
  if (attCvs) {
    activeCharts.repAtt = new Chart(attCvs, {
      type:'bar', data:{labels:activeDepts,datasets:[{label:'Attendance %',data:deptAtt,backgroundColor:'#4F46E5',borderRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}
    });
  }
  const salCvs = document.getElementById('ch-repSal');
  if (salCvs) {
    activeCharts.repSal = new Chart(salCvs, {
      type:'bar', data:{labels:activeDepts,datasets:[{label:'Salary (K)',data:deptSal,backgroundColor:'#059669',borderRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}
    });
  }
  const riskCvs = document.getElementById('ch-repRisk');
  if (riskCvs) {
    activeCharts.repRisk = new Chart(riskCvs, {
      type:'pie', data:{labels:['Low','Moderate','High'],datasets:[{data:[risks.low,risks.moderate,risks.high],backgroundColor:['#059669','#D97706','#DC2626'],borderWidth:0}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:11},boxWidth:12}}}}
    });
  }
  const scatterCvs = document.getElementById('ch-scatter');
  if (scatterCvs) {
    activeCharts.scatter = new Chart(scatterCvs, {
      type:'scatter',
      data:{ datasets:[{ label:'Employees', data: DB.employees.map(e=>({x:e.satisfaction,y:e.attendance})), backgroundColor:'#4F46E5', pointRadius:8 }] },
      options:{
        responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
        scales:{ x:{min:0,max:6,title:{display:true,text:'Satisfaction (1-5)'}}, y:{min:0,max:100,title:{display:true,text:'Attendance %'}} }
      }
    });
  }
}
