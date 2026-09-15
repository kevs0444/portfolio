const fs = require('fs');
let content = fs.readFileSync('d:\\Dev\\portfolio\\app\\page.tsx', 'utf8');

const regex = /<article key=\{kpi\.label\} className="kpi-card">[\s\S]*?<div className="kpi-card__header">[\s\S]*?<div style=\{\{ display: 'flex', alignItems: 'center', gap: '0\.45rem' \}\}>[\s\S]*?<span style=\{\{ color: 'var\(--muted\)', display: 'flex', alignItems: 'center' \}\}><KpiIcon type=\{kpi\.icon\} \/><\/span>[\s\S]*?<span className="kpi-label">\{kpi\.label\}<\/span>[\s\S]*?<\/div>[\s\S]*?<span className="kpi-trend">\{kpi\.trend\}<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="kpi-card__body">[\s\S]*?<strong className="kpi-value">\{kpi\.value\}<\/strong>[\s\S]*?<div className="kpi-sparkline" aria-hidden="true">[\s\S]*?<svg viewBox="0 0 60 20" preserveAspectRatio="none">[\s\S]*?<polyline[\s\S]*?\/>[\s\S]*?<\/svg>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newHTML = `<article key={kpi.label} className="kpi-card">
                      <div className="kpi-card__header">
                        <span className="kpi-label">{kpi.label}</span>
                        <span className="kpi-trend">{kpi.trend}</span>
                      </div>
                      <div className="kpi-card__body">
                        <strong className="kpi-value">{kpi.value}</strong>
                        <div className="kpi-card-icon" aria-hidden="true">
                          <KpiIcon type={kpi.icon} />
                        </div>
                      </div>`;

content = content.replace(regex, newHTML);
fs.writeFileSync('d:\\Dev\\portfolio\\app\\page.tsx', content, 'utf8');
console.log("Updated HTML");

