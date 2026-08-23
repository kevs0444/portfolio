const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. careerBars fix
let oldBar5 = \  {
    id: "bar-5",
    year: "Current",
    period: "Jul 2026 – Present",
    stage: "Stage 05: E-Commerce Business Intelligence",
    title: "Luxasia Pte. Ltd & Leap Commerce",
    role: "Data Analyst Intern",
    organization: "Regional Brand E-Commerce Analytics",
    location: "BGC, Taguig City",
    growthPct: 100,
    metricBadge: "Active Role: Commercial Data & BI",
    status: "current",\;

let newBar5 = \  {
    id: "bar-5",
    year: "Mid 2026",
    period: "Jul 2026 – Present",
    stage: "Stage 05: E-Commerce Business Intelligence",
    title: "Luxasia Pte. Ltd & Leap Commerce",
    role: "Data Analyst Intern",
    organization: "Regional Brand E-Commerce Analytics",
    location: "BGC, Taguig City",
    growthPct: 80,
    metricBadge: "Active Role: Commercial Data & BI",
    status: "completed",\;

code = code.replace(oldBar5, newBar5);

// Add bar-6 and bar-7
let oldTools = \	ools: ["SQL", "Python", "Power BI", "E-Commerce Analytics", "ETL", "Web App Automation"],
  },
];\;

let newTools = \	ools: ["SQL", "Python", "Power BI", "E-Commerce Analytics", "ETL", "Web App Automation"],
  },
  {
    id: "bar-6",
    year: "Current",
    period: "Ongoing",
    stage: "Stage 06: Hungry to Learn & Upskill",
    title: "Intensive Upskilling Phase",
    role: "Aspiring Data Analyst / Data Scientist",
    organization: "Continuous Learning",
    location: "Metro Manila",
    growthPct: 92,
    metricBadge: "Bridging the Gap to Full-Time",
    status: "current",
    summary:
      "Actively upskilling in advanced machine learning, modern ETL architectures, and full-stack analytics to transition from a 3x Intern into a high-impact full-time data professional.",
    highlights: [
      "Refining predictive modeling capabilities with advanced Python (XGBoost, TensorFlow) and R workflows.",
      "Mastering enterprise-level data warehousing and automated ETL architectures.",
      "Building scalable full-stack data dashboards with Next.js, React, and REST APIs.",
    ],
    tools: ["Python", "Machine Learning", "Full-Stack Dev", "Cloud ETL", "Continuous Learning"],
  },
  {
    id: "bar-7",
    year: "Target",
    period: "Future",
    stage: "Stage 07: The Peak",
    title: "Full-Time Data Professional",
    role: "Data Analyst / Data Scientist",
    organization: "Future Employer",
    location: "Open to Opportunities",
    growthPct: 100,
    metricBadge: "The Ultimate Goal",
    status: "completed",
    summary:
      "My ultimate target is to secure a full-time role where I can drive immediate business value, architect robust data pipelines, and continuously deliver high-impact predictive models.",
    highlights: [
      "Ready to leverage 12,500+ hours of academic training and hands-on internship experience.",
      "Dedicated to transforming raw corporate data into automated intelligence and actionable insights.",
      "Seeking a data-driven environment that values innovation, continuous learning, and scalable system architecture.",
    ],
    tools: ["Business Value", "Scalable Pipelines", "Actionable Insights", "Innovation"],
  },
];\;

code = code.replace(oldTools, newTools);

// 2. activeBarId
code = code.replace('useState<string>("bar-5");', 'useState<string>("bar-6");');

// 4. Apple spring reveal
code = code.replace(
  'transition: { duration: 0.65, ease: revealEase }',
  'transition: { type: "spring", stiffness: 80, damping: 20, mass: 1 }'
);
code = code.replace(
  'initial: { opacity: 0, y: 32 }',
  'initial: { opacity: 0, scale: 0.98, y: 30 }'
);
code = code.replace(
  'whileInView: { opacity: 1, y: 0 }',
  'whileInView: { opacity: 1, scale: 1, y: 0 }'
);

// 5. Loop Marquee for Tech Stack
const marqueeHtml = \
          {/* Futuristic Loop Marquee */}
          <div className="loop-marquee-container">
            <div className="loop-marquee-track">
              {[...skillClusters, ...skillClusters, ...skillClusters, ...skillClusters, ...skillClusters].flatMap(c => c.items).map((item, idx) => (
                <span key={idx} className="loop-item">/ {item}</span>
              ))}
            </div>
          </div>
\;
code = code.replace('{/* CAREER GRAPH SECTION */}', marqueeHtml + '\\n          {/* CAREER GRAPH SECTION */}');

fs.writeFileSync('app/page.tsx', code);
console.log('done');
