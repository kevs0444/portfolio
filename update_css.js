const fs = require('fs');
let css = fs.readFileSync('d:\\Dev\\portfolio\\app\\globals.css', 'utf8');

css = css.replace(
  /\.kpi-sparkline \{[\s\S]*?opacity: 0\.8;\n\}/,
  `.kpi-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  opacity: 0.5;
  transition: opacity 160ms ease, color 160ms ease;
}

.kpi-card:hover .kpi-card-icon {
  opacity: 1;
  color: var(--text);
}

.kpi-card-icon svg {
  width: 1.8rem;
  height: 1.8rem;
}`
);

// Also remove .kpi-icon-svg that we added earlier
css = css.replace(/\.kpi-icon-svg \{ width: 1\.1rem; height: 1\.1rem; \}\s*\n\n/, '');

fs.writeFileSync('d:\\Dev\\portfolio\\app\\globals.css', css, 'utf8');
console.log("Updated CSS");

