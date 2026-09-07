"use client";

import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

type Theme = "light" | "dark";

type CareerBar = {
  id: string;
  year: string;
  period: string;
  stage: string;
  title: string;
  role: string;
  organization: string;
  location?: string;
  pillarHeight: number;
  image: string;
  imageLabel: string;
  imagePosition?: string;
  metricBadge: string;
  status?: "current" | "completed";
  summary: string;
  highlights: string[];
  tools: string[];
  projects?: Array<{
    title: string;
    role: string;
    range: string;
    image: string;
    imageLabel: string;
    imagePosition?: string;
    summary: string;
    impactMetric: string;
    tools: string[];
  }>;
};

type SkillCluster = {
  category: string;
  title: string;
  summary: string;
  proficiency: number;
  evidence: string;
  items: string[];
};

type ProjectItem = {
  id: string;
  scope: "work" | "college" | "personal";
  title: string;
  subtitle: string;
  category: string;
  role: string;
  period: string;
  image: string;
  imageLabel: string;
  imagePosition?: string;
  impactMetric: string;
  summary: string;
  highlights: string[];
  tools: string[];
  href?: string;
};

type GearItem = {
  category: string;
  name: string;
  model: string;
  purpose: string;
  icon: "laptop" | "keyboard" | "monitor" | "phone";
};

type ContactItem = {
  label: string;
  value: string;
  href: string;
  icon: "email" | "phone" | "linkedin" | "github" | "facebook" | "location";
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type TimelineImagePreview = {
  title: string;
  image: string;
  label: string;
};

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Career Graph", href: "#career-graph" },
  { label: "Projects", href: "#projects" },
  { label: "Data Stack", href: "#stack" },
  { label: "Personal", href: "/personal" },
  { label: "Kevs AI", href: "#assistant" },
  { label: "Contact", href: "#contact" },
];

const identityItems = [
  "Current Data Analyst Intern @ LUXASIA",
  "Automating Repetitive Reporting Work",
  "Cleaning & Validating Business Data",
  "Building Dashboards Stakeholders Can Use",
  "SQL, Python & Power BI in Real Workflows",
  "Curious, Adaptable & Eager to Learn",
];

const kpiMetrics = [
  {
    label: "Report Automation",
    value: "83%",
    sub: "Prep time cut: 30m → 5m",
    trend: "+83% efficiency",
    sparkline: [30, 25, 18, 12, 5],
  },
  {
    label: "Data Internships",
    value: "03",
    sub: "LUXASIA, Phoenix, Denso Ten",
    trend: "Continuous growth",
    sparkline: [0, 1, 2, 3, 3],
  },
  {
    label: "Core Data Projects",
    value: "06",
    sub: "Work & college case studies",
    trend: "Applied practice",
    sparkline: [1, 2, 3, 4, 5, 6],
  },
  {
    label: "Academic Discipline",
    value: "BSCpE",
    sub: "Rizal Technological Univ.",
    trend: "2022 – 2026 (Graduated)",
    sparkline: [20, 40, 65, 85, 100],
  },
];

const careerBars: CareerBar[] = [
  {
    id: "college",
    year: "College",
    period: "Aug 2022 – Jul 2026",
    stage: "BS Computer Engineering Graduate",
    title: "Rizal Technological University",
    role: "BS Computer Engineering Graduate",
    organization: "Data, AIoT & Software Foundations",
    location: "Pasig City",
    pillarHeight: 38,
    image: "/assets/images/kevin-graduation-portrait-web.jpg",
    imageLabel: "Kevin in graduation attire",
    metricBadge: "Engineering + Analytics Foundation",
    status: "completed",
    summary:
      "Built a strong base in software engineering, structured databases, machine learning, and real-time IoT analytics while completing a BS in Computer Engineering.",
    highlights: [
      "Led the data and AI development of FOVB-AIoT, a real-time health monitoring and risk-scoring kiosk.",
      "Built CureSecure with structured MySQL transaction records, inventory tracking, and automated restock alerts.",
      "Combined Python, SQL, algorithms, electronics, and dashboard development into practical systems.",
    ],
    tools: ["Python", "MySQL", "XGBoost", "React", "Arduino", "Data Structures"],
    projects: [
      {
        title: "FOVB-AIoT",
        role: "Lead AI & Data Developer",
        range: "Aug 2025 – Mar 2026",
        image: "/assets/images/projects/fovb-aiot.jpg",
        imageLabel: "Multi-AI Vital Sign Risk Scoring System",
        summary: "IoT vital-sign capture with XGBoost risk scoring and live monitoring dashboard.",
        impactMetric: "Multi-AI Model Pipeline",
        tools: ["Python", "XGBoost", "React", "MySQL", "Arduino"],
      },
      {
        title: "Smart AI Kilo Bot",
        role: "IoT Data Dashboard Developer",
        range: "Nov 2025 – Dec 2025",
        image: "/assets/images/projects/kilo-bot.png",
        imageLabel: "Realtime Weighing & Pricing Interface",
        summary: "Instant operational weighing feedback connected to low-latency Python pipeline.",
        impactMetric: "Sub-second Pipeline Latency",
        tools: ["Python", "Arduino", "Realtime Data", "Dashboard"],
      },
      {
        title: "Smart Locker System",
        role: "Project Manager & Automation Developer",
        range: "Apr 2025 – May 2025",
        image: "/assets/images/projects/smart-locker.jpg",
        imageLabel: "Smart Locker Prototype",
        summary: "Python & Raspberry Pi locker control with automated authentication.",
        impactMetric: "Hardware State Automation",
        tools: ["Python", "Raspberry Pi", "GUI", "Automation"],
      },
    ],
  },
  {
    id: "denso",
    year: "Denso Ten",
    period: "Feb 2026 – Apr 2026",
    stage: "Data Analyst Intern",
    title: "Denso Ten Solutions Philippines",
    role: "Data Analyst Intern",
    organization: "Engineering Operations Analytics",
    location: "Ortigas Center, Pasig City",
    pillarHeight: 54,
    image: "/assets/images/career/denso-analytics.png",
    imageLabel: "Kevin at Denso Ten Solutions Philippines",
    metricBadge: "75%-80% Reporting Time Reduction",
    status: "completed",
    summary:
      "Modernized engineering operations through Python/VBA automation, MySQL defect tracking, and interactive Power BI solutions.",
    highlights: [
      "Developed automated data extraction and processing workflows using Python and Excel VBA, reducing manual reporting effort by 75%-80% (from 10 min to 2-3 min) while improving reporting accuracy and operational efficiency.",
      "Engineered the Internal Defects Gathering Tool and Stack Output Analysis System using MySQL Database, automating the tracking and analysis of thousands of production issues.",
      "Designed interactive dashboards and business intelligence solutions using Microsoft Power BI and Power Apps, including a Skills Dashboard for a 10-member engineering team.",
    ],
    tools: ["Python", "MySQL", "Power BI", "Power Apps", "Excel VBA", "Data Processing"],
  },
  {
    id: "phoenix",
    year: "Phoenix",
    period: "Jun 2026 – Jul 2026",
    stage: "Data Science Intern",
    title: "Phoenix Petroleum Philippines, Inc.",
    role: "Data Science Intern",
    organization: "Commercial Forecasting & Data Warehousing",
    location: "BGC, Taguig City",
    pillarHeight: 68,
    image: "/assets/images/career/phoenix-forecasting.png",
    imageLabel: "Kevin at Phoenix Petroleum Philippines",
    metricBadge: "83% Report Time Cut & XGBoost",
    status: "completed",
    summary:
      "Engineered automated ETL workflows from SQL data warehouses, built canister demand forecast models with XGBoost, and cut daily ad-hoc report generation time by 83%.",
    highlights: [
      "Developed automated ETL workflows by extracting data from SQL data warehouses and transforming raw datasets into analysis-ready data using Python.",
      "Automated daily ad hoc reporting using Python, Google Apps Script, and Google Sheets, reducing report preparation time by 83% (from 30 min to 5 min).",
      "Developed XGBoost forecasting models to predict 1-day, 2-day, and 3-day canister product demand, supporting inventory planning and data-driven business decisions.",
      "Enhanced executive dashboards with analytical heatmaps, automated daily data refreshes, and web-based monitoring tools using Google Apps Script.",
    ],
    tools: ["Python", "SQL Data Warehouse", "ETL", "XGBoost", "Google Apps Script", "Heatmaps"],
  },
  {
    id: "luxasia",
    year: "LUXASIA",
    period: "Jul 2026 – Present",
    stage: "Data Analyst Intern",
    title: "Luxasia Pte. Ltd & Leap Commerce",
    role: "Data Analyst Intern",
    organization: "Regional Brand E-Commerce Analytics",
    location: "BGC, Taguig City",
    pillarHeight: 82,
    image: "/assets/images/career/luxasia-internship.jpg",
    imageLabel: "Kevin at LUXASIA & LEAP Commerce office",
    imagePosition: "center 30%",
    metricBadge: "Active Role: Commercial Data & BI",
    status: "current",
    summary:
      "Driving e-commerce data analytics for regional brands across the Philippines and Thailand using SQL, Python, and Power BI.",
    highlights: [
      "Retrieved, validated, and analyzed Shopee and Lazada e-commerce data for regional brands across the Philippines and Thailand using SQL and Python, ensuring data accuracy and supporting reliable business reporting.",
      "Developed an all-in-one web application that automated data extraction, file renaming, data consolidation, and data validation, streamlining ETL workflows and significantly reducing manual processing.",
      "Developed interactive Power BI dashboards and delivered data-driven insights and performance reports to stakeholders, enabling informed business decisions through e-commerce analytics and trend analysis.",
    ],
    tools: ["SQL", "Python", "Power BI", "E-Commerce Analytics", "ETL", "Web App Automation"],
    projects: [
      {
        title: "Workstation & Regional Data Environment",
        role: "Data Analyst Intern",
        range: "Jul 2026 – Present",
        image: "/assets/images/career/luxasia-commerce.png",
        imageLabel: "LUXASIA ThinkPad workstation, employee badge, and regional brand operations setup",
        imagePosition: "center center",
        summary: "Daily analytics workstation driving automated extraction and BI reporting for Shopee and Lazada brand stores.",
        impactMetric: "Multi-Market ETL Operations",
        tools: ["SQL", "Python", "Power BI", "Automation"],
      },
    ],
  },
  {
    id: "full-time-target",
    year: "Full-Time Target",
    period: "Future",
    stage: "Full-Time Data Role",
    title: "Full-Time Data Professional",
    role: "Data Analyst / Data Scientist",
    organization: "Future Employer",
    location: "Open to Opportunities",
    pillarHeight: 96,
    image: "/assets/images/career/full-time-job-icon-3d.png",
    imageLabel: "3D briefcase and analytics job icon",
    metricBadge: "Ready to Contribute & Grow",
    summary:
      "My next goal is a full-time data role where I can contribute reliable analysis and automation, learn from an experienced team, and steadily take on larger business problems.",
    highlights: [
      "Ready to apply hands-on experience from three data internships and practical college projects.",
      "Can support data preparation, recurring reporting, workflow automation, dashboards, and clear stakeholder updates.",
      "Looking for a team that values accuracy, curiosity, continuous learning, and useful business outcomes.",
    ],
    tools: ["Business Value", "Scalable Pipelines", "Actionable Insights", "Innovation"],
  },
];

const projectsData: ProjectItem[] = [
  {
    id: "proj-luxasia-automation",
    scope: "work",
    title: "Regional E-Commerce Data Automation",
    subtitle: "Extraction, Validation, Consolidation & BI Reporting",
    category: "Analytics Automation",
    role: "Data Analyst Intern at LUXASIA",
    period: "Jul 2026 – Present",
    image: "/assets/images/career/luxasia-commerce.png",
    imageLabel: "LUXASIA work setup and employee ID",
    impactMetric: "Automated Multi-Step ETL",
    summary:
      "Streamlined regional marketplace reporting by combining data extraction, file preparation, consolidation, validation, and dashboard-ready outputs in one workflow.",
    highlights: [
      "Validated Shopee and Lazada datasets for brands across the Philippines and Thailand.",
      "Built an all-in-one automation workflow that reduced repetitive manual processing.",
      "Translated commercial data into Power BI reports and actionable stakeholder insights.",
    ],
    tools: ["SQL", "Python", "Power BI", "ETL", "E-Commerce Data"],
  },
  {
    id: "proj-denso-reporting",
    scope: "work",
    title: "Engineering Reporting Automation",
    subtitle: "Defect Tracking, Processing & Operational Dashboards",
    category: "Reporting Automation",
    role: "Data Analyst Intern at Denso Ten",
    period: "Feb 2026 – Apr 2026",
    image: "/assets/images/career/denso-analytics.png",
    imageLabel: "Kevin at Denso Ten Solutions Philippines",
    impactMetric: "75–80% Less Reporting Time",
    summary:
      "Improved engineering reporting through automated extraction, structured defect data, and interactive dashboards for operational monitoring.",
    highlights: [
      "Reduced recurring reporting work from ten minutes to approximately two to three minutes.",
      "Centralized thousands of production issues in MySQL-based defect tracking tools.",
      "Created Power BI and Power Apps views for engineering skills and product progress.",
    ],
    tools: ["Python", "Excel VBA", "MySQL", "Power BI", "Power Apps"],
  },
  {
    id: "proj-fovb",
    scope: "college",
    title: "FOVB-AIoT Health Kiosk",
    subtitle: "Four-in-One Vital Sign Sensor & Health Risk Scoring",
    category: "Data Science & IoT",
    role: "Lead AI & Data Developer",
    period: "Aug 2025 – Mar 2026",
    image: "/assets/images/projects/fovb-aiot.jpg",
    imageLabel: "FOVB-AIoT Dashboard & Sensor Array",
    impactMetric: "Multi-AI Model Validation",
    summary:
      "Integrated IoT vital-sign sensors with machine learning to evaluate patient cardiovascular and health risks in real time.",
    highlights: [
      "Led the development of an AI-powered health monitoring kiosk by integrating Arduino-based IoT sensors, TensorFlow, and YOLO.",
      "Engineered the Multi-AI Risk Score pipeline using XGBoost as the primary predictor, verified against Gemini 2.0 Flash and Groq APIs.",
      "Built a full-stack React.js and Python REST API dashboard with MySQL for live telemetry and flexible deployment.",
    ],
    tools: ["Python", "XGBoost", "React.js", "MySQL", "Arduino", "REST APIs"],
  },
  {
    id: "proj-forecasting",
    scope: "work",
    title: "Canister Product Demand Forecaster",
    subtitle: "Demand Forecasting, ETL & Reporting Automation",
    category: "Data Science & Forecasting",
    role: "Data Scientist (Phoenix Petroleum)",
    period: "Jun 2026 – Jul 2026",
    image: "/assets/images/career/phoenix-forecasting.png",
    imageLabel: "Kevin at Phoenix Petroleum Philippines",
    impactMetric: "83% Time Reduction (30m → 5m)",
    summary:
      "Built automated ETL workflows from SQL warehouse data and XGBoost forecasts to support inventory planning and recurring reporting.",
    highlights: [
      "Trained XGBoost models predicting 1-day, 2-day, and 3-day canister demand for inventory management.",
      "Automated daily reporting using Python and Google Apps Script, slashing manual work from 30m to 5m.",
      "Created executive heatmaps for regional sales velocity and demand clusters.",
    ],
    tools: ["Python", "SQL", "ETL", "XGBoost", "Google Apps Script", "Heatmaps"],
  },
  {
    id: "proj-kilo-bot",
    scope: "college",
    title: "Smart AI Kilo Bot",
    subtitle: "Intelligent IoT Weighing & Live Pricing Pipeline",
    category: "Data Engineering & IoT",
    role: "IoT Data Dashboard Developer",
    period: "Nov 2025 – Dec 2025",
    image: "/assets/images/projects/kilo-bot.png",
    imageLabel: "Realtime Weighing & Pricing Interface",
    impactMetric: "Low-Latency Data Stream",
    summary:
      "Created a real-time operational dashboard turning raw load-cell sensor signals into immediate pricing and weight calculations.",
    highlights: [
      "Bridged Arduino hardware to a Python stream pipeline with sub-second feedback latency.",
      "Designed visual transaction logs and marketplace price calculation views.",
      "Implemented auto-calibration logic for sensor drift and tare offset compensation.",
    ],
    tools: ["Python", "Arduino", "Realtime Data", "Dashboard", "Sensors"],
  },
  {
    id: "proj-curesecure",
    scope: "college",
    title: "CureSecure Pharmacy POS",
    subtitle: "Real-Time Inventory & Transaction Management",
    category: "Database & Backend",
    role: "Lead Programmer",
    period: "Jan 2023 – Apr 2023",
    image: "/assets/images/projects/curesecure.jpg",
    imageLabel: "Pharmacy POS and Inventory System",
    impactMetric: "Automated Stockout Alerts",
    summary:
      "Engineered a pharmacy operations system around high-integrity transactional databases and automated stockout prevention.",
    highlights: [
      "Designed normalized MySQL schemas handling inventory counts, batch expirations, and sales logs.",
      "Built automated restock alert thresholds and role-based operational permissions.",
      "Delivered robust transaction rollback handling to maintain ledger accuracy.",
    ],
    tools: ["C#", "WinForms", "MySQL", "Inventory Data", "RBAC"],
  },
  {
    id: "proj-sql-practice",
    scope: "personal",
    title: "SQL Practice Lab",
    subtitle: "Queries, Joins, CTEs & Data Validation",
    category: "Active Practice",
    role: "Independent Learning",
    period: "Ongoing",
    image: "/assets/images/projects/sql-practice-lab.svg",
    imageLabel: "SQL query practice workspace",
    impactMetric: "Strengthening Query Fluency",
    summary:
      "A focused practice space for solving realistic data questions with joins, aggregations, CTEs, window functions, and validation checks.",
    highlights: [
      "Practice business-focused query patterns.",
      "Review results for completeness and accuracy.",
      "Document reusable approaches and lessons learned.",
    ],
    tools: ["SQL", "MySQL", "Data Validation", "CTEs", "Window Functions"],
    href: "/personal#learning",
  },
  {
    id: "proj-python-practice",
    scope: "personal",
    title: "Python Data Practice",
    subtitle: "Cleaning, Analysis & Small Automations",
    category: "Active Practice",
    role: "Independent Learning",
    period: "Ongoing",
    image: "/assets/images/projects/python-practice-lab.svg",
    imageLabel: "Python data practice workspace",
    impactMetric: "Building Repeatable Workflows",
    summary:
      "Short exercises that turn raw files into clean, analysis-ready data while reinforcing readable Python and practical automation habits.",
    highlights: [
      "Clean and reshape tabular datasets.",
      "Automate repeatable file-based tasks.",
      "Build clear summaries and visual checks.",
    ],
    tools: ["Python", "Pandas", "Automation", "Data Cleaning", "Jupyter"],
    href: "/personal#learning",
  },
  {
    id: "proj-excel-practice",
    scope: "personal",
    title: "Excel Analytics Practice",
    subtitle: "Formulas, Lookups, Pivots & Reporting",
    category: "Active Practice",
    role: "Independent Learning",
    period: "Ongoing",
    image: "/assets/images/projects/excel-practice-lab.svg",
    imageLabel: "Excel analytics practice workspace",
    impactMetric: "Sharpening Reporting Fundamentals",
    summary:
      "Hands-on spreadsheet exercises for faster analysis, reliable checks, concise reporting, and stronger day-to-day Excel fluency.",
    highlights: [
      "Practice formulas, lookups, and pivot tables.",
      "Create readable KPI summaries.",
      "Add checks that reduce reporting errors.",
    ],
    tools: ["Excel", "Pivot Tables", "XLOOKUP", "Data Cleaning", "Reporting"],
    href: "/personal#learning",
  },
  {
    id: "proj-keyboard-speed-test",
    scope: "personal",
    title: "Keyboard Speed Test",
    subtitle: "A Lightweight WPM & Accuracy Challenge",
    category: "Interactive Build",
    role: "Personal Web Project",
    period: "2026",
    image: "/assets/images/projects/keyboard-speed-test.svg",
    imageLabel: "Keyboard speed test interface",
    impactMetric: "Live WPM + Accuracy",
    summary:
      "An interactive one-minute typing challenge that tracks words per minute and accuracy while making daily keyboard practice more measurable.",
    highlights: [
      "Calculates live typing speed.",
      "Tracks character-level accuracy.",
      "Supports quick restart-and-improve sessions.",
    ],
    tools: ["Next.js", "React", "TypeScript", "UI State", "Accessibility"],
    href: "/personal#speed-test",
  },
];

const gearItems: GearItem[] = [
  {
    category: "Primary Workstation",
    name: "ASUS TUF Gaming A15",
    model: "FA5061C",
    purpose: "Python, SQL, Power BI, automation development, and data project work.",
    icon: "laptop",
  },
  {
    category: "Keyboard",
    name: "AULA F75",
    model: "75% Mechanical Keyboard",
    purpose: "A compact daily input setup for analysis, coding, documentation, and reporting.",
    icon: "keyboard",
  },
  {
    category: "Display",
    name: "AOC 27B36XE",
    model: "27-inch FHD · 144 Hz",
    purpose: "Dashboard review, multi-window analysis, documentation, and responsive visual QA.",
    icon: "monitor",
  },
  {
    category: "Mobile",
    name: "iPhone 17 Pro Max",
    model: "Mobile Productivity",
    purpose: "Communication, quick report checks, mobile testing, and work coordination.",
    icon: "phone",
  },
];

const skillClusters: SkillCluster[] = [
  {
    category: "Analytics & BI",
    title: "Business Intelligence & Reporting",
    summary: "Interactive dashboards, executive reporting, and automated operations monitoring.",
    proficiency: 94,
    evidence: "3 internships",
    items: ["Power BI", "Tableau", "Power Apps", "Excel VBA", "KPI Dashboards", "Data Storytelling"],
  },
  {
    category: "Data Engineering",
    title: "Pipelines, ETL & Warehousing",
    summary: "Automated extraction, data cleansing, transformation pipelines, and database optimization.",
    proficiency: 90,
    evidence: "3 internships",
    items: ["SQL", "ETL Pipelines", "Data Extraction", "Data Cleaning", "Data Normalization", "Google Apps Script"],
  },
  {
    category: "Data Science & ML",
    title: "Predictive Modeling & Applied AI",
    summary: "Machine learning workflows, demand forecasting, computer vision, and LLM integrations.",
    proficiency: 88,
    evidence: "Work + thesis",
    items: ["Python", "R", "XGBoost", "TensorFlow", "Deep Learning", "YOLO", "OpenCV", "Groq API"],
  },
  {
    category: "Databases & Tools",
    title: "Database Engines & Analytics Tools",
    summary: "Structured relational databases, query design, GUI analytics, and devops tooling.",
    proficiency: 92,
    evidence: "Work + college",
    items: ["MySQL", "MS SQL", "MariaDB", "SQLite", "DBeaver", "Jupyter Notebook", "Docker", "Git"],
  },
  {
    category: "Web Development",
    title: "Data-Focused Web Applications",
    summary: "Responsive interfaces and lightweight applications that turn data workflows into usable tools.",
    proficiency: 84,
    evidence: "Portfolio + projects",
    items: ["React.js", "Next.js", "JavaScript", "HTML", "CSS", "REST APIs"],
  },
  {
    category: "AI Tools",
    title: "AI-Assisted Analysis & Development",
    summary: "Using modern AI assistants to research, validate ideas, accelerate development, and improve documentation.",
    proficiency: 86,
    evidence: "Daily workflow",
    items: ["ChatGPT", "Claude", "Gemini", "Groq API", "Prompt Design", "AI-Assisted Coding"],
  },
];

const contactItems: ContactItem[] = [
  {
    label: "Email",
    value: "markevinalcantara40@gmail.com",
    href: "mailto:markevinalcantara40@gmail.com",
    icon: "email",
  },
  {
    label: "Globe",
    value: "+63 952 470 2284",
    href: "tel:+639524702284",
    icon: "phone",
  },
  {
    label: "DITO",
    value: "+63 992 003 0148",
    href: "tel:+639920030148",
    icon: "phone",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mar-kevin-alcantara-83562326a",
    href: "https://www.linkedin.com/in/mar-kevin-alcantara-83562326a/",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    value: "github.com/Kevs0444",
    href: "https://github.com/Kevs0444",
    icon: "github",
  },
  {
    label: "Facebook",
    value: "facebook.com/KevinAlcantara04",
    href: "https://www.facebook.com/KevinAlcantara04/",
    icon: "facebook",
  },
  {
    label: "Location",
    value: "Taguig City, Metro Manila, 1630",
    href: "https://www.google.com/maps/search/?api=1&query=Taguig%20City%2C%20Metro%20Manila%201630",
    icon: "location",
  },
];

const quickQuestions = [
  "What can Mar Kevin offer a data team?",
  "How has he automated repetitive reporting work?",
  "What is his current role at LUXASIA?",
  "What are his strongest SQL, Power BI, and Python skills?",
  "Which work and college projects should I review?",
  "How does he approach learning new tools and workflows?",
];

const revealEase = [0.16, 1, 0.3, 1] as const;
const introEase = [0.76, 0, 0.24, 1] as const;

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I am Kevs AI, Mar Kevin's portfolio assistant. Ask what he can offer a data team, how he improved reporting across three internships, which projects show his skills, or what he is learning next.",
};

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const shouldReduceMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [timelinePreview, setTimelinePreview] = useState<TimelineImagePreview | null>(null);

  // Active bar in the rising bar chart
  const [activeBarId, setActiveBarId] = useState<string>("luxasia");
  const [activeSkillCategory, setActiveSkillCategory] = useState<number>(0);
  const [activeProjectScope, setActiveProjectScope] = useState<"work" | "college" | "personal">("work");
  const [identityIndex, setIdentityIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Kevs AI Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [chatLoading, setChatLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [petVisible, setPetVisible] = useState(false);
  const chatThreadRef = useRef<HTMLDivElement>(null);

  // Contact Form State
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactFeedback, setContactFeedback] = useState("");

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!contactEmail || !contactSubject || !contactMessage) return;
    
    setContactStatus("loading");
    setContactFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setContactStatus("success");
      setContactFeedback("Message sent successfully!");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    } catch (error) {
      setContactStatus("error");
      setContactFeedback(error instanceof Error ? error.message : "An error occurred.");
    }
  }

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.2,
  });

  const heroShift = useTransform(smoothProgress, [0, 0.25], [0, -60]);
  const activeBar = careerBars.find((b) => b.id === activeBarId) ?? careerBars[careerBars.length - 1];
  const logoSource = theme === "light"
    ? "/assets/images/mka-logo-minimal-light.svg"
    : "/assets/images/mka-logo-minimal-dark.svg";
  const activeSkill = skillClusters[activeSkillCategory] ?? skillClusters[0];
  const workProjectOrder = ["proj-luxasia-automation", "proj-forecasting", "proj-denso-reporting"];
  const filteredProjects = projectsData
    .filter((project) => project.scope === activeProjectScope)
    .sort((first, second) => {
      if (activeProjectScope !== "work") return 0;
      return workProjectOrder.indexOf(first.id) - workProjectOrder.indexOf(second.id);
    });

  const portraitSource = "/assets/images/kevin-graduation-portrait-web.jpg";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const nextTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    setTheme(nextTheme);

    const storedSound = window.localStorage.getItem("portfolio-ui-sound");
    if (storedSound === "muted") {
      setSoundEnabled(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("portfolio-ui-sound", soundEnabled ? "enabled" : "muted");

    if (!soundEnabled) {
      void audioContextRef.current?.suspend();
      return;
    }

    const playTone = (kind: "hover" | "click") => {
      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;

      const startTone = () => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;

        oscillator.type = kind === "click" ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(kind === "click" ? 250 : 430, now);
        oscillator.frequency.exponentialRampToValueAtTime(kind === "click" ? 190 : 520, now + 0.055);
        gain.gain.setValueAtTime(kind === "click" ? 0.032 : 0.018, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "click" ? 0.085 : 0.06));

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + (kind === "click" ? 0.09 : 0.065));
      };

      if (context.state === "suspended") {
        void context.resume().then(startTone).catch(() => undefined);
      } else {
        startTone();
      }
    };

    let lastHoverAt = 0;
    const interactiveSelector = "a, button, [role='tab']";

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null;
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return;

      const now = performance.now();
      if (now - lastHoverAt < 70) return;
      lastHoverAt = now;
      playTone("hover");
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null;
      if (target) playTone("click");
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
    };
  }, [soundEnabled]);

  useEffect(() => {
    const updatePetVisibility = () => {
      const revealPoint = Math.min(520, window.innerHeight * 0.62);
      setPetVisible(window.scrollY > revealPoint);
    };

    updatePetVisibility();
    window.addEventListener("scroll", updatePetVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updatePetVisibility);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIdentityIndex((current) => (current + 1) % identityItems.length);
    }, 2400);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      resumeOpen || timelinePreview !== null || mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, resumeOpen, timelinePreview]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResumeOpen(false);
        setTimelinePreview(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const chatThread = chatThreadRef.current;
    if (!chatThread) return;
    chatThread.scrollTo({
      top: chatThread.scrollHeight,
      behavior: chatMessages.length > 1 ? "smooth" : "auto",
    });
  }, [chatMessages, chatLoading]);

  const reveal = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: "some" as const },
    transition: { duration: 0.65, ease: revealEase },
  };

  async function sendChatMessage(content: string) {
    const trimmedContent = content.trim();
    if (!trimmedContent || chatLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmedContent };
    const conversation = [...chatMessages, userMessage];

    setChatMessages(conversation);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kevs AI is unavailable right now.");
      }

      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.message || "I couldn't generate a reply right now.",
        },
      ]);
    } catch (error) {
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error ? error.message : "Kevs AI is unavailable right now.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendChatMessage(chatInput);
  }

  function handleChatKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendChatMessage(chatInput);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-track" aria-hidden="true">
        <motion.div className="scroll-progress-bar" style={{ scaleX: smoothProgress }} />
      </div>

      <div className="site-shell">
        {/* Background Grid Accent */}
        <div className="dashboard-grid-bg" aria-hidden="true" />

        {/* Left Sidebar (Desktop Only) */}
        <aside className="site-sidebar">
          <div className="sidebar-header">
            <a href="#overview" aria-label="Mar Kevin Alcantara portfolio home">
              <Image
                className="portfolio-logo portfolio-logo--sidebar"
                src={logoSource}
                alt="MKA"
                width={184}
                height={52}
                priority
              />
            </a>
            <p>Data Analyst</p>
          </div>

          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="#overview">
              <span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </span>
              Overview
            </a>
            <a className="sidebar-link" href="#career-graph">
              <span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </span>
              Career Graph
            </a>
            <a className="sidebar-link" href="#projects">
              <span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              </span>
              Projects
            </a>
            <a className="sidebar-link" href="#stack">
              <span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </span>
              Data Stack
            </a>
          </div>

          <div className="sidebar-divider" />

          <p className="sidebar-section-label">Personal Space</p>
          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="/personal">
              <span className="sidebar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20v-8a8 8 0 0 1 16 0v8" /><path d="M8 20v-4h8v4M9 8h.01M15 8h.01" /></svg>
              </span>
              Personal Home
            </a>
            <a className="sidebar-link" href="/personal#learning">
              <span className="sidebar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M7 9v5c3 2 7 2 10 0V9M21 7v6" /></svg>
              </span>
              Practice Lab
            </a>
            <a className="sidebar-link" href="/personal#gear">
              <span className="sidebar-icon">
                <GearDeviceIcon type="keyboard" />
              </span>
              Gear Showcase
            </a>
            <a className="sidebar-link" href="/personal#content">
              <span className="sidebar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3V9Z" /></svg>
              </span>
              Content
            </a>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="#assistant">
              <span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
              </span>
              Kevs AI
            </a>
            <a className="sidebar-link" href="#contact">
              <span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              Contact
            </a>
          </div>

          <div className="sidebar-divider" />
          
          <div className="sidebar-control-row" aria-label="Portfolio preferences">
            <button
              type="button"
              className="sidebar-control"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              <ThemeIcon mode={theme} />
            </button>
            <button
              type="button"
              className={`sidebar-control ${soundEnabled ? "is-active" : ""}`}
              aria-label={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
              aria-pressed={soundEnabled}
              title={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
              onClick={() => setSoundEnabled((current) => !current)}
            >
              <SoundIcon enabled={soundEnabled} />
            </button>
          </div>

          <div className="sidebar-footer">
            <p className="sidebar-footer-title">Reach me at</p>
            <a href="mailto:markevinalcantara40@gmail.com" className="sidebar-email">
              markevinalcantara40@gmail.com
            </a>
          </div>
        </aside>

        <div className="main-area">
          {/* Site Header / Navigation (Mobile Only) */}
          <header className="site-header">
          <div className="site-header__bar">
            <a className="brand-mark" href="#overview">
              <Image
                className="portfolio-logo portfolio-logo--header"
                src={logoSource}
                alt="MKA — Mar Kevin Alcantara"
                width={184}
                height={52}
                priority
              />
            </a>

            <nav className="site-nav" aria-label="Primary">
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="header-actions">
              <button
                type="button"
                className="theme-toggle theme-toggle--icon"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              >
                <ThemeIcon mode={theme} />
              </button>

              <a className="availability-pill" href="#contact">
                <span className="status-dot" aria-hidden="true" />
                <span>Available for Roles</span>
              </a>
            </div>

            <button
              type="button"
              className={`burger-toggle ${mobileMenuOpen ? "is-open" : ""}`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              key="mobile-drawer-backdrop"
              className="mobile-drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.nav
                className="mobile-drawer__panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Mobile navigation"
              >
                <div className="mobile-drawer__header">
                  <div className="data-telemetry-tag">
                    <span className="telemetry-dot" />
                    <span>NAVIGATION</span>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="mobile-drawer__links">
                  {navItems.map((item) => (
                    <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </a>
                  ))}
                </div>

                <div className="mobile-drawer__actions">
                  <div className="mobile-preference-row">
                    <button
                      type="button"
                      className="theme-toggle theme-toggle--icon"
                      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                    >
                      <ThemeIcon mode={theme} />
                    </button>
                    <button
                      type="button"
                      className="theme-toggle theme-toggle--icon"
                      aria-label={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
                      aria-pressed={soundEnabled}
                      title={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
                      onClick={() => setSoundEnabled((current) => !current)}
                    >
                      <SoundIcon enabled={soundEnabled} />
                    </button>
                  </div>

                  <a className="availability-pill" href="#contact" onClick={() => setMobileMenuOpen(false)}>
                    <span className="status-dot" aria-hidden="true" />
                    <span>Available for Roles</span>
                  </a>
                </div>
              </motion.nav>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="page-content">
          {/* ========================================================= */}
          {/* SECTION 1: HERO / EXECUTIVE KPI DASHBOARD */}
          {/* ========================================================= */}
          <motion.section className="hero-section" id="overview" style={{ y: heroShift }}>
            <div className="hero-grid">
              <motion.div className="hero-copy" {...reveal}>
                <div className="dashboard-pill">
                  <span className="status-indicator live" />
                  <span>DATA ANALYST // EXECUTIVE SUMMARY</span>
                </div>

                <h1 className="hero-name">
                  <span>Mar Kevin</span>
                  <span>Alcantara</span>
                </h1>

                {/* Rotating Focus Stream */}
                <div className="identity-band">
                  <span className="small-label">Active Focus</span>
                  <div className="identity-band__window" aria-live="polite">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={identityItems[identityIndex]}
                        className="identity-band__item"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.32, ease: revealEase }}
                      >
                        {identityItems[identityIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <p className="hero-lead">
                  Data Analyst and Computer Engineering graduate with hands-on experience improving reporting across <strong>e-commerce, energy, and manufacturing</strong>. I use <strong>SQL, Python, Power BI, and automation</strong> to clean and validate data, reduce repetitive work, build useful dashboards, and help teams make clearer decisions. I bring a practical foundation, an adaptable mindset, and a strong drive to keep learning.
                </p>

                <div className="hero-actions">
                  <a className="button button--primary" href="#career-graph">
                    <span>View Career Graph</span>
                    <ChartBarIcon />
                  </a>
                  <button type="button" className="button button--ghost" onClick={() => setResumeOpen(true)}>
                    <span>Preview Resume</span>
                    <ArrowIcon />
                  </button>
                  <a className="button button--ghost" href="#assistant">
                    <span>Query Kevs AI</span>
                    <TerminalIcon />
                  </a>
                </div>

                {/* Quantitative KPI Metrics with Sparkline Mini-Charts */}
                <div className="kpi-board">
                  {kpiMetrics.map((kpi) => (
                    <article key={kpi.label} className="kpi-card">
                      <div className="kpi-card__header">
                        <span className="kpi-label">{kpi.label}</span>
                        <span className="kpi-trend">{kpi.trend}</span>
                      </div>
                      <div className="kpi-card__body">
                        <strong className="kpi-value">{kpi.value}</strong>
                        <div className="kpi-sparkline" aria-hidden="true">
                          <svg viewBox="0 0 60 20" preserveAspectRatio="none">
                            <polyline
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              points={kpi.sparkline
                                .map((val, i) => `${(i / (kpi.sparkline.length - 1)) * 56 + 2},${20 - (val / 100) * 16 - 2}`)
                                .join(" ")}
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="kpi-sub">{kpi.sub}</span>
                    </article>
                  ))}
                </div>
              </motion.div>

              {/* Hero Side Profile & Telemetry Card */}
              <motion.div className="hero-side" {...reveal}>
                <article className="panel portrait-card">
                  <div className="portrait-media portrait-media--real">
                    <Image
                      src={portraitSource}
                      alt="Mar Kevin Alcantara in his 2026 graduation portrait"
                      fill
                      priority
                      sizes="(max-width: 1100px) 100vw, 32rem"
                      className="portrait-image portrait-image--real"
                    />
                    <div className="portrait-badge">
                      <span className="status-dot" />
                      <span>Current: LUXASIA Data Analyst Intern</span>
                    </div>
                  </div>

                  <div className="card-copy">
                    <div className="card-top-tag">
                      <span className="small-label">Professional Profile</span>
                      <span className="data-tag">BSCpE // 2026</span>
                    </div>
                    <h2>Improving reporting, data quality, and business decisions.</h2>
                    <p>
                      Across three data internships, I have supported teams by organizing business data, automating manual processes, building dashboards, and communicating insights stakeholders can act on.
                    </p>
                    <div className="tech-chip-grid">
                      <span>Python</span>
                      <span>SQL</span>
                      <span>Power BI</span>
                      <span>XGBoost</span>
                      <span>ETL Pipelines</span>
                      <span>Excel VBA</span>
                    </div>
                  </div>
                </article>
              </motion.div>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 2: RISING BAR GRAPH CAREER TRAJECTORY */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="career-graph" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span>CAREER PATH // INTERACTIVE MILESTONES</span>
                </div>
                <h2>From engineering foundations to data-driven impact.</h2>
              </div>
              <p className="section-summary">
                Follow the image-topped milestones from academic foundations to real-world analytics work. Select a pillar to inspect the experience, impact, and tools behind it.
              </p>
            </div>

            {/* Rising Bar Chart Component */}
            <div className="graph-container">
              <div className="graph-chart-frame">
                <div className="graph-chart__meta">
                  <div className="graph-chart__meta-item">
                    <span className="meta-label">PATH</span>
                    <span className="meta-val">College → Internships → Full-Time</span>
                  </div>
                  <div className="graph-chart__legend">
                    <span className="legend-item"><span className="legend-box completed" /> Completed</span>
                    <span className="legend-item"><span className="legend-box current" /> Current</span>
                    <span className="legend-item"><span className="legend-box target" /> Target</span>
                  </div>
                </div>

                <div className="graph-canvas">
                  <div className="graph-grid-lines" aria-hidden="true">
                    <div className="grid-line" />
                    <div className="grid-line" />
                    <div className="grid-line" />
                    <div className="grid-line" />
                  </div>

                  <div className="bars-track" role="tablist" aria-label="Career milestones">
                    {careerBars.map((bar) => {
                      const isSelected = activeBarId === bar.id;
                      const isCurrent = bar.status === "current";
                      const isTarget = bar.id === "full-time-target";

                      return (
                        <button
                          key={bar.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          aria-label={`${bar.stage}: ${bar.role}`}
                          className={`graph-bar-col ${isSelected ? "is-selected" : ""} ${isCurrent ? "is-current" : ""} ${isTarget ? "is-target" : ""}`}
                          onClick={() => setActiveBarId(bar.id)}
                        >
                          <div className="graph-bar-wrapper">
                            <div
                              className="bar-stage-stack"
                              style={{ height: `${bar.pillarHeight}%` }}
                            >
                              <motion.div
                                className="career-stage-image"
                                initial={{ opacity: 0, y: 14, rotate: -2 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: 0.35, ease: revealEase }}
                              >
                                <Image
                                  src={bar.image}
                                  alt={bar.imageLabel}
                                  fill
                                  sizes="(max-width: 880px) 88px, 7vw"
                                  style={bar.imagePosition ? { objectPosition: bar.imagePosition } : undefined}
                                />
                              </motion.div>

                              <motion.div
                                className={`bar-pillar ${isCurrent ? "pillar-current" : "pillar-regular"} ${isTarget ? "pillar-target" : ""}`}
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: revealEase }}
                              >
                                <span className="pillar-front" />
                                <span className="pillar-side" />
                                <span className="pillar-top" />
                                <span className="pillar-pattern" />
                              </motion.div>
                            </div>
                          </div>

                          <div className="bar-axis-label">
                            <strong>{bar.stage}</strong>
                            <span>{bar.year}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Data Inspector Panel (Detail View for Selected Milestone) */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeBar.id}
                  className="panel graph-inspector"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: revealEase }}
                >
                  <div className="inspector-header">
                    <div>
                      <div className="inspector-stage-tag">
                        <span>{activeBar.stage}</span>
                        <span className="period-badge">{activeBar.period}</span>
                      </div>
                      <h3 className="inspector-title">{activeBar.role}</h3>
                      <p className="inspector-org">
                        <strong>{activeBar.title}</strong> — {activeBar.organization}
                        {activeBar.location ? ` (${activeBar.location})` : ""}
                      </p>
                    </div>

                    <div className="inspector-metric-box">
                      <span className="metric-box__label">Core Focus Metric</span>
                      <strong className="metric-box__value">{activeBar.metricBadge}</strong>
                    </div>
                  </div>

                  <p className="inspector-summary">{activeBar.summary}</p>

                  <div className="inspector-highlights">
                    <span className="small-label">Key Analytical Deliverables</span>
                    <ul className="bullet-list">
                      {activeBar.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="inspector-tools">
                    <span className="small-label">Applied Technologies</span>
                    <div className="chip-row">
                      {activeBar.tools.map((tool) => (
                        <span key={tool} className="chip">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Attached Projects if any */}
                  {activeBar.projects?.length ? (
                    <div className="inspector-projects">
                      <span className="small-label">Featured Artifacts & Deliverables</span>
                      <div className="inspector-project-grid">
                        {activeBar.projects.map((proj) => (
                          <article key={proj.title} className="attached-proj-card">
                            <button
                              type="button"
                              className="attached-proj-media"
                              onClick={() =>
                                setTimelinePreview({
                                  title: proj.title,
                                  image: proj.image,
                                  label: proj.imageLabel,
                                })
                              }
                            >
                              <Image
                                src={proj.image}
                                alt={proj.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 220px"
                                className="attached-proj-img"
                                style={proj.imagePosition ? { objectPosition: proj.imagePosition } : undefined}
                              />
                              <span className="preview-indicator">Inspect Visual</span>
                            </button>
                            <div className="attached-proj-copy">
                              <div className="attached-proj-top">
                                <h4>{proj.title}</h4>
                                <span className="impact-pill">{proj.impactMetric}</span>
                              </div>
                              <p>{proj.summary}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 3: FEATURED PROJECTS & SYSTEMS */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="projects" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span>PROJECTS // WORK, COLLEGE & PERSONAL</span>
                </div>
                <h2>Projects built to make data work easier.</h2>
              </div>
              <p className="section-summary">
                Browse professional case studies from newest to oldest, college systems, and personal practice builds covering analytics, automation, databases, and applied data work.
              </p>
            </div>

            <div className="projects-toolbar">
              <div className="project-scope-tabs" role="tablist" aria-label="Project type">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeProjectScope === "work"}
                  className={activeProjectScope === "work" ? "is-active" : ""}
                  onClick={() => setActiveProjectScope("work")}
                >
                  Work Projects
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeProjectScope === "college"}
                  className={activeProjectScope === "college" ? "is-active" : ""}
                  onClick={() => setActiveProjectScope("college")}
                >
                  College Projects
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeProjectScope === "personal"}
                  className={activeProjectScope === "personal" ? "is-active" : ""}
                  onClick={() => setActiveProjectScope("personal")}
                >
                  Personal Projects
                </button>
              </div>
              <span className="projects-count">
                {filteredProjects.length} selected case studies{activeProjectScope === "work" ? " · newest to oldest" : ""}
              </span>
            </div>

            {filteredProjects.length ? <div className={`projects-grid projects-grid--compact ${activeProjectScope === "personal" ? "projects-grid--personal" : ""}`}>
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  className="panel project-card project-card--compact"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: revealEase }}
                >
                  <div className="project-media-wrapper">
                    <button
                      type="button"
                      className="project-media-btn"
                      onClick={() =>
                        setTimelinePreview({
                          title: project.title,
                          image: project.image,
                          label: project.imageLabel,
                        })
                      }
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 680px) 100vw, (max-width: 1180px) 50vw, 360px"
                        className="project-card-image"
                        style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                      />
                      <div className="media-overlay">
                        <span className="preview-btn-tag">
                          <EyeIcon /> Enlarge Visual
                        </span>
                      </div>
                    </button>
                    <span className="category-badge">{project.category}</span>
                  </div>

                  <div className="project-content">
                    <div className="project-card__meta">
                      <span className="project-period">{project.period}</span>
                      <span className="project-scope-label">
                        {project.scope === "work" ? "Work Project" : project.scope === "college" ? "College Project" : "Personal Project"}
                      </span>
                    </div>

                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-subtitle">{project.subtitle}</p>

                    <div className="impact-badge impact-badge--compact">
                      <span className="impact-badge__label">Outcome</span>
                      <strong>{project.impactMetric}</strong>
                    </div>

                    <p className="project-summary">{project.summary}</p>

                    <div className="chip-row project-tools">
                      {project.tools.slice(0, 5).map((tool) => (
                        <span key={tool} className="chip">
                          {tool}
                        </span>
                      ))}
                    </div>

                    {project.href ? (
                      <a className="project-card-link" href={project.href}>
                        Open personal lab <ArrowIcon />
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              ))}
            </div> : (
              <div className="panel projects-empty-state">
                <span className="projects-empty-state__icon"><TerminalIcon /></span>
                <div>
                  <p className="small-label">Personal Project Slot</p>
                  <h3>New analytics and automation builds will appear here.</h3>
                  <p>I am reserving this space for independent SQL, Python, dashboard, and workflow-automation projects as they are completed.</p>
                </div>
              </div>
            )}
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 4: DATA STACK & PROFICIENCY MATRIX */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="stack" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span>SKILLS // APPLIED ANALYTICS TOOLKIT</span>
                </div>
                <h2>Skills I use to solve reporting and data problems.</h2>
              </div>
              <p className="section-summary">
                A clear view of the tools I have applied across internships and college projects—and the areas I am actively strengthening next.
              </p>
            </div>

            <div className="skills-showcase">
              <aside className="panel skills-aside">
                <div className="skills-aside__header">
                  <span className="small-label">Competency Clusters</span>
                  <span className="data-tag">5 Domains</span>
                </div>

                <div className="skills-nav" role="tablist" aria-label="Skill categories">
                  {skillClusters.map((cluster, index) => (
                    <button
                      key={cluster.title}
                      type="button"
                      className={`skill-nav-button ${activeSkillCategory === index ? "is-active" : ""}`}
                      onClick={() => setActiveSkillCategory(index)}
                    >
                      <div className="skill-nav-left">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <strong>{cluster.category}</strong>
                          <small>{cluster.title}</small>
                        </div>
                      </div>
                      <span className="skill-meter-val">{cluster.evidence}</span>
                    </button>
                  ))}
                </div>
              </aside>

              <div className="panel skill-card is-active">
                <div className="skill-card__header">
                  <div>
                    <span className="small-label">{activeSkill.category}</span>
                    <h3>{activeSkill.title}</h3>
                  </div>
                  <div className="skill-bar-meter">
                    <div className="meter-label">
                      <span>Current Application</span>
                      <strong>{activeSkill.evidence}</strong>
                    </div>
                    <div className="meter-track">
                      <motion.div
                        className="meter-fill"
                        style={{ width: `${activeSkill.proficiency}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${activeSkill.proficiency}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>

                <p className="skill-card-summary">{activeSkill.summary}</p>

                <div className="skill-items-container">
                  <span className="small-label">Core Technologies & Tools</span>
                  <div className="tech-matrix-grid">
                    {activeSkill.items.map((item) => (
                      <div key={item} className="tech-matrix-item">
                        <span className="tech-matrix-dot" />
                        <strong>{item}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* KEVS AI - DATA QUERY TERMINAL */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="assistant" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span>KEVS AI // PORTFOLIO ASSISTANT</span>
                </div>
                <h2>Ask about my experience, skills, and value.</h2>
              </div>
              <p className="section-summary">
                A simple way for recruiters and collaborators to explore my resume, internship contributions, project outcomes, tools, and availability.
              </p>
            </div>

            <div className="assistant-grid">
              <article className="panel assistant-info-card">
                <div className="terminal-top">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                  <span className="terminal-title">kevs_knowledge_db.sql</span>
                </div>

                <p className="small-label" style={{ marginTop: "1rem" }}>Preset Query Filters</p>
                <div className="assistant-chip-list">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="assistant-chip"
                      onClick={() => void sendChatMessage(question)}
                    >
                      <span className="chip-prompt-icon">›</span>
                      <span>{question}</span>
                    </button>
                  ))}
                </div>

                <div className="terminal-telemetry-note">
                  <span className="status-indicator live" />
                  <span>Model: Llama 3.3 70B // Knowledge Base: Verified</span>
                </div>
              </article>

              <article className="panel chat-card">
                <div ref={chatThreadRef} className="chat-thread" aria-live="polite">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`chat-bubble ${message.role === "assistant" ? "is-assistant" : "is-user"}`}
                    >
                      <div className="bubble-header">
                        <span className="chat-bubble__label">{message.role === "assistant" ? "Kevs AI // Query Output" : "User Query"}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  ))}

                  {chatLoading ? (
                    <div className="chat-bubble is-assistant is-loading">
                      <span className="chat-bubble__label">Kevs AI // Executing Query</span>
                      <div className="chat-thinking" aria-label="Assistant is thinking">
                        <span className="chat-thinking__text">Scanning portfolio knowledge base</span>
                        <span className="chat-thinking__dots" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <form className="chat-form" onSubmit={handleSubmit}>
                  <label className="chat-field">
                    <span className="sr-only">Ask a portfolio question</span>
                    <textarea
                      name="message"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={handleChatKeyDown}
                      placeholder="Ask about data projects, XGBoost models, LUXASIA internship, SQL pipelines, or availability..."
                      rows={3}
                    />
                  </label>
                  <div className="chat-form-footer">
                    <span className="keyboard-hint">Press Enter to query</span>
                    <button type="submit" className="button button--primary" disabled={chatLoading}>
                      <span>Execute Query</span>
                      <ArrowIcon />
                    </button>
                  </div>
                </form>
              </article>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 6: CONTACT & CREDENTIALS */}
          {/* ========================================================= */}
          <motion.section className="section-block contact-block" id="contact" {...reveal}>
            <div className="section-intro contact-intro">
              <div>
                <div className="dashboard-pill">
                  <span>CONTACT // START A CONVERSATION</span>
                </div>
                <h2>Let&apos;s build something useful with data.</h2>
              </div>
              <p className="section-summary">
                I&apos;m open to data-focused roles, collaborative projects, and conversations about turning complex information into clear business decisions.
              </p>
            </div>

            <div className="footer-grid">
              {/* Full-span Resume CTA */}
              <article className="panel footer-panel footer-panel--cta">
                <div className="footer-cta__copy">
                  <div className="footer-cta__eyebrow">
                    <div className="data-telemetry-tag">
                      <span className="telemetry-dot" />
                      <span>AVAILABLE FOR OPPORTUNITIES</span>
                    </div>
                    <span className="resume-format">RESUME · PDF</span>
                  </div>
                  <h3>Experience, projects, and credentials—together in one place.</h3>
                  <p>
                    Review my complete background, analytics internships, selected project outcomes, technical stack, and professional certifications.
                  </p>
                </div>
                <div className="footer-cta__actions">
                  <button type="button" className="button button--primary" onClick={() => setResumeOpen(true)}>
                    <span>Preview Resume</span>
                    <ArrowIcon />
                  </button>
                  <a className="button button--ghost button--small" href="/assets/resume.pdf" download>
                    <span>Download PDF</span>
                    <ArrowIcon />
                  </a>
                </div>
              </article>

              {/* Direct Communication Channels */}
              <article className="panel footer-panel contact-channels-panel">
                <div className="contact-panel__header">
                  <div>
                    <p className="small-label">Direct Channels</p>
                    <h3>Reach me where you prefer.</h3>
                  </div>
                  <span className="contact-response-status">
                    <span className="status-dot" aria-hidden="true" />
                    Manila · GMT+8
                  </span>
                </div>
                <div className="footer-link-list">
                  {contactItems.map((item) => (
                    <FooterLink key={item.label} {...item} />
                  ))}
                </div>
              </article>

              {/* Direct Message Form */}
              <article className="panel footer-panel contact-form-panel">
                <div className="contact-panel__header contact-panel__header--form">
                  <div>
                    <p className="small-label">Direct Inbox</p>
                    <h3>Send a message.</h3>
                    <p>Share the role, project, or question you have in mind.</p>
                  </div>
                  <span className="contact-response-status">Usually replies within two business days</span>
                </div>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="contact-form-row">
                    <label className="contact-form-group">
                      <span>Your email</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="contact-input"
                    />
                    </label>
                    <label className="contact-form-group">
                      <span>Subject</span>
                    <input
                      type="text"
                      name="subject"
                      autoComplete="off"
                      placeholder="Role or project inquiry"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                      className="contact-input"
                    />
                    </label>
                  </div>
                  <label className="contact-form-group">
                    <span>Message</span>
                    <textarea
                      name="message"
                      placeholder="A little context helps me respond thoughtfully..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      className="contact-input contact-textarea"
                      rows={5}
                    />
                  </label>
                  <div className="contact-form__footer">
                    <span className="contact-form__note">Your details are only used to reply to this message.</span>
                    <button
                      type="submit"
                      className="button button--primary contact-submit"
                      disabled={contactStatus === "loading"}
                    >
                      <span>{contactStatus === "loading" ? "Sending..." : "Send Message"}</span>
                      {contactStatus !== "loading" ? <ArrowIcon /> : null}
                    </button>
                  </div>
                  {contactFeedback && (
                    <p
                      className={`contact-feedback ${contactStatus === "error" ? "text-error" : "text-success"}`}
                      role={contactStatus === "error" ? "alert" : "status"}
                    >
                      {contactFeedback}
                    </p>
                  )}
                </form>
              </article>
            </div>
          </motion.section>
        </main>

        {/* Site Footer */}
        <footer className="site-footer">
          <div className="footer-telemetry">
            <span className="status-dot" />
            <span>MAR KEVIN ALCANTARA // DATA ANALYTICS & SCIENCE PORTFOLIO</span>
          </div>
          <p>© {new Date().getFullYear()} Mar Kevin P. Alcantara. Built with Next.js & TypeScript.</p>
        </footer>

        <AnimatePresence>
          {petVisible ? (
            <motion.a
              key="kevs-ai-pet"
              className="kevs-pet"
              href="#assistant"
              aria-label="Ask Kevs AI about Mar Kevin"
              initial={{ opacity: 0, scale: 0.82, y: 18 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 1, scale: 1, y: [0, -8, 0], rotate: [0, 1, -1, 0] }
              }
              exit={{ opacity: 0, scale: 0.82, y: 18 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.25 }
                  : {
                      opacity: { duration: 0.35 },
                      scale: { duration: 0.35 },
                      duration: 4.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
              }
              whileHover={shouldReduceMotion ? undefined : { scale: 1.06, rotate: 0 }}
            >
              <span className="kevs-pet__label">
                <strong>Ask Kevs AI</strong>
                <small>Portfolio companion</small>
              </span>
              <span className="kevs-pet__avatar">
                <Image
                  src="/assets/images/kevs-ai-chibi-open.png"
                  alt="Chibi Kevs AI companion"
                  fill
                  sizes="112px"
                  className="kevs-pet__image kevs-pet__image--open"
                />
                {!shouldReduceMotion ? (
                  <Image
                    src="/assets/images/kevs-ai-chibi-blink.png"
                    alt=""
                    fill
                    sizes="112px"
                    aria-hidden="true"
                    className="kevs-pet__image kevs-pet__image--blink"
                  />
                ) : null}
                <span className="kevs-pet__status" aria-hidden="true" />
              </span>
            </motion.a>
          ) : null}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* MODALS */}
        {/* ========================================================= */}
        <AnimatePresence>
          {/* Image Preview Modal */}
          {timelinePreview ? (
            <ModalShell key="image-preview-modal-shell" onClose={() => setTimelinePreview(null)}>
              <motion.div
                className="panel image-preview-modal"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: revealEase }}
              >
                <div className="image-preview-modal__header">
                  <div>
                    <p className="small-label">{timelinePreview.label}</p>
                    <h3>{timelinePreview.title}</h3>
                  </div>

                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Close image preview"
                    onClick={() => setTimelinePreview(null)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="image-preview-modal__media">
                  <Image
                    src={timelinePreview.image}
                    alt={timelinePreview.title}
                    fill
                    sizes="(max-width: 980px) 94vw, 920px"
                    className="image-preview-modal__image"
                  />
                </div>
              </motion.div>
            </ModalShell>
          ) : null}

          {/* Resume Modal */}
          {resumeOpen ? (
            <ModalShell key="resume-modal-shell" onClose={() => setResumeOpen(false)}>
              <motion.div
                className="panel resume-modal"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: revealEase }}
              >
                <div className="resume-modal__header">
                  <div>
                    <p className="small-label">One-Page Resume Preview</p>
                    <h3>Mar Kevin P. Alcantara</h3>
                  </div>

                  <div className="resume-modal__actions">
                    <a className="button button--ghost button--small" href="/assets/resume.pdf" target="_blank" rel="noreferrer">
                      <span>Open in Tab</span>
                      <ArrowIcon />
                    </a>
                    <a className="button button--ghost button--small" href="/assets/resume.pdf" download>
                      <span>Download PDF</span>
                      <ArrowIcon />
                    </a>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Close resume preview"
                      onClick={() => setResumeOpen(false)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                <div className="resume-preview-scroll" aria-label="Mar Kevin Alcantara one-page resume preview">
                  <Image
                    src="/assets/images/resume-preview.png"
                    alt="Mar Kevin Alcantara one-page resume"
                    width={1489}
                    height={2106}
                    sizes="(max-width: 900px) 96vw, 980px"
                    className="resume-preview-page"
                    priority
                  />
                </div>
              </motion.div>
            </ModalShell>
          ) : null}
        </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

function FooterLink({ href, label, value, icon }: ContactItem) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className="footer-link"
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <span className="footer-link__icon" aria-hidden="true"><ContactChannelIcon type={icon} /></span>
      <span className="footer-link__label">{label}</span>
      <span className="footer-link__value">{value}</span>
      <span className="footer-link__arrow"><ArrowIcon /></span>
    </a>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="modal-shell"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </motion.div>
  );
}

function ContactChannelIcon({ type }: { type: ContactItem["icon"] }) {
  if (type === "email") return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m5 8 7 5 7-5" /></svg>;
  if (type === "phone") return <svg viewBox="0 0 24 24"><path d="M8 3H5.5A2.5 2.5 0 0 0 3 5.5C3 14.1 9.9 21 18.5 21a2.5 2.5 0 0 0 2.5-2.5V16l-4-1-1.2 2.3a13.2 13.2 0 0 1-9.1-9.1L9 7 8 3Z" /></svg>;
  if (type === "linkedin") return <svg viewBox="0 0 24 24"><path d="M6 9v10M6 5.5v.1M10.5 19v-5.5a4 4 0 0 1 8 0V19M10.5 9v10" /></svg>;
  if (type === "github") return <svg viewBox="0 0 24 24"><path d="M9 19c-4 .8-4-2-5-2.5M15 21v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.7-1.4 5.7-6.2A4.8 4.8 0 0 0 19 6c.1-.4.6-1.7-.1-3-1 0-3.1 1.2-3.1 1.2a10.8 10.8 0 0 0-5.6 0S8.1 3 7.1 3C6.4 4.3 6.9 5.6 7 6a4.8 4.8 0 0 0-1.3 3.3c0 4.8 3 5.9 5.8 6.2-.5.4-.6 1.1-.6 2V21" /></svg>;
  if (type === "facebook") return <svg viewBox="0 0 24 24"><path d="M14 21v-8h3l.5-3H14V8.2c0-.9.3-1.7 1.8-1.7H18V3.8c-.6-.1-1.5-.2-2.6-.2-2.7 0-4.4 1.6-4.4 4.6V10H8v3h3v8" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function GearDeviceIcon({ type }: { type: GearItem["icon"] }) {
  if (type === "keyboard") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="3" y="8" width="26" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 12h2m3 0h2m3 0h2m3 0h3M7 16h2m3 0h2m3 0h2m3 0h3M8 20h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === "monitor") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="5" width="24" height="17" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 27h8m-4-5v5M8 17l5-5 4 3 7-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="9" y="3" width="14" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 6h4M15 25h2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="5" width="22" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 24h27l-2 3h-23l-2-3ZM10 15l4-4 3 2 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function SoundIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9v6h4l5 4V5L9 9H5Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      {enabled ? (
        <path d="M17 9c1.3 1.4 1.3 4.6 0 6m2-8c2.4 2.6 2.4 7.4 0 10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      ) : (
        <path d="m17 9 4 6m0-6-4 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      )}
    </svg>
  );
}

function ThemeIcon({ mode }: { mode: Theme }) {
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 12.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 17Zm7.25-5.75a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5Zm-13 0a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5ZM17.13 6.87a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm-11.32 0a.75.75 0 0 1 1.06 1.06L5.81 8.99a.75.75 0 1 1-1.06-1.06l1.06-1.06Zm12.38 10.26a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06Zm-12.38 0 1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 1.06-1.06ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.56 2.58a.75.75 0 0 1 .9.92A8.1 8.1 0 0 0 15.22 5c0 4.54 3.69 8.22 8.23 8.22.51 0 1.02-.05 1.51-.14a.75.75 0 0 1 .73 1.18A10.48 10.48 0 1 1 14.56 2.58Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6 18 18M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChartBarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20h16M7 16v-4M12 16V8M17 16V4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 17l6-5-6-5M12 19h8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
