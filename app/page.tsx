"use client";

import Image from "next/image";
import Link from "next/link";
import { useOverlayFocus } from "./useOverlayFocus";
import { usePortfolioTheme } from "./usePortfolioTheme";
import LiveVisitors from "./LiveVisitors";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useInView,
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
  { label: "Certifications", href: "#certifications" },
  { label: "Personal", href: "/personal" },
  { label: "Bop AI", href: "#assistant" },
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
    image: "/assets/images/kevin-graduation-portrait-web-nobg.png",
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
        image: "/assets/images/projects/fovb-aiot-nobg.png",
        imageLabel: "Multi-AI Vital Sign Risk Scoring System",
        summary: "IoT vital-sign capture with XGBoost risk scoring and live monitoring dashboard.",
        impactMetric: "Multi-AI Model Pipeline",
        tools: ["Python", "XGBoost", "React", "MySQL", "Arduino"],
      },
      {
        title: "Smart AI Kilo Bot",
        role: "IoT Data Dashboard Developer",
        range: "Nov 2025 – Dec 2025",
        image: "/assets/images/projects/kilo-bot-nobg.png",
        imageLabel: "Realtime Weighing & Pricing Interface",
        summary: "Instant operational weighing feedback connected to low-latency Python pipeline.",
        impactMetric: "Sub-second Pipeline Latency",
        tools: ["Python", "Arduino", "Realtime Data", "Dashboard"],
      },
      {
        title: "Smart Locker System",
        role: "Project Manager & Automation Developer",
        range: "Apr 2025 – May 2025",
        image: "/assets/images/projects/smart-locker-nobg.png",
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
    image: "/assets/images/career/denso-analytics-nobg.png",
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
    image: "/assets/images/career/phoenix-forecasting-nobg.png",
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
    image: "/assets/images/career/luxasia-internship-nobg.png",
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
        image: "/assets/images/career/luxasia-commerce-nobg.png",
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
    image: "/assets/images/career/full-time-job-icon-3d-nobg.png",
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

const careerStory = [
  "I started with computer engineering at RTU, turning classroom ideas into working systems through projects in health monitoring, automation, and data.",
  "At Denso Ten, I brought that foundation into manufacturing—automating reports with Python and VBA and reducing a 10-minute task to 2–3 minutes.",
  "At Phoenix Petroleum, I moved deeper into data science, building demand forecasts and cutting daily report preparation from 30 minutes to 5.",
  "Now at LUXASIA, I work with regional e-commerce data, connecting SQL, Python automation, and Power BI to support clearer business reporting.",
  "Next, I’m working toward a full-time data role where I can build on these experiences, contribute to a team, and keep learning. This is my goal, not a current position.",
];

const certifications = [
  { title: "Python Essentials 1", issuer: "Cisco Networking Academy", image: "/assets/images/certifications/python-essentials-1.png", detail: "Python foundations", format: "Course badge" },
  { title: "Data Analytics Essentials", issuer: "Cisco Networking Academy", image: "/assets/images/certifications/data-analytics-essentials.png", detail: "Data analytics foundations", format: "Course badge" },
  { title: "Introduction to Excel", issuer: "DataCamp", image: "/assets/images/certifications/introduction-to-excel.jpg", detail: "4 hours · Completed Jun 27, 2026", format: "Statement of accomplishment" },
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
    image: "/assets/images/career/luxasia-commerce-nobg.png",
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
    image: "/assets/images/career/denso-analytics-nobg.png",
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
    image: "/assets/images/projects/fovb-aiot-nobg.png",
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
    image: "/assets/images/career/phoenix-forecasting-nobg.png",
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
    image: "/assets/images/projects/kilo-bot-nobg.png",
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
    image: "/assets/images/projects/curesecure-nobg.png",
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

const topicPresets = [
  { id: "job", label: "Job Opportunity", subject: "Opportunity: Data Analyst / Science Role" },
  { id: "project", label: "Data Project", subject: "Project Inquiry: Analytics & Dashboarding" },
  { id: "collab", label: "Collaboration", subject: "Collaboration: Engineering & Research" },
  { id: "chat", label: "Quick Chat", subject: "Inquiry: Quick question / Networking" },
];

const quickQuestions = [
  "What can Mar Kevin offer a data team?",
  "How has he automated repetitive reporting work?",
  "What is his current role at LUXASIA?",
  "What are his strongest SQL, Power BI, and Python skills?",
  "Which work and college projects should I review?",
  "Why is the portfolio assistant called Bop AI?",
];

const revealEase = [0.16, 1, 0.3, 1] as const;
const introEase = [0.76, 0, 0.24, 1] as const;

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Bop AI, Mar Kevin's portfolio assistant. I can walk you through his projects, experience, or what he could bring to your team. What would you like to know?",
};

export default function HomePage() {
  const [theme, setTheme] = usePortfolioTheme();
  const shouldReduceMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [timelinePreview, setTimelinePreview] = useState<TimelineImagePreview | null>(null);

  // Active bar in the rising bar chart
  const [activeBarId, setActiveBarId] = useState<string>("college");
  const careerSectionRef = useRef<HTMLElement>(null);
  const careerInView = useInView(careerSectionRef, { amount: 0.2 });
  const [careerStoryPlaying, setCareerStoryPlaying] = useState(true);
  const careerStoryIndex = careerBars.findIndex((bar) => bar.id === activeBarId);

  useEffect(() => {
    if (!careerInView || !careerStoryPlaying || shouldReduceMotion) return;
    const timer = window.setTimeout(() => {
      if (careerStoryIndex >= careerBars.length - 1) {
        setCareerStoryPlaying(false);
      } else {
        setActiveBarId(careerBars[careerStoryIndex + 1].id);
      }
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [careerInView, careerStoryPlaying, careerStoryIndex, shouldReduceMotion]);
  const [activeSkillCategory, setActiveSkillCategory] = useState<number>(0);
  const [activeProjectScope, setActiveProjectScope] = useState<"work" | "college" | "personal">("work");
  const [identityIndex, setIdentityIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Bop AI Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [chatLoading, setChatLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const assistantVideoRef = useRef<HTMLVideoElement | null>(null);

  function toggleVideoPreview() {
    const video = assistantVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useOverlayFocus(mobileMenuOpen, ".mobile-drawer__panel", () => setMobileMenuOpen(false));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    if (!contactEmail.trim() || !contactSubject.trim() || !contactMessage.trim() || contactStatus === "loading") return;
    
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

  const portraitSource = "/assets/images/kevin-graduation-portrait-web-nobg.png";

  useEffect(() => {

    const storedSound = window.localStorage.getItem("portfolio-ui-sound");
    if (storedSound === "muted") {
      setSoundEnabled(false);
    }
  }, []);


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
      const assistant = document.getElementById("assistant")?.getBoundingClientRect();
      const assistantVisible = assistant && assistant.top < window.innerHeight && assistant.bottom > 0;
      setPetVisible(window.scrollY > revealPoint && !assistantVisible);
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
      behavior: chatMessages.length > 1 && !shouldReduceMotion ? "smooth" : "auto",
    });
  }, [chatMessages, chatLoading, shouldReduceMotion]);

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
        throw new Error(data.error || "Bop AI is unavailable right now.");
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
            error instanceof Error ? error.message : "Bop AI is unavailable right now.",
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
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
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

      <div className={`site-shell${sidebarCollapsed ? " sidebar-is-collapsed" : ""}`}>
        {/* Background Grid Accent */}
        <div className="dashboard-grid-bg" aria-hidden="true" />

        {/* Left Sidebar (Desktop Only) */}
          <button
            type="button"
            className="sidebar-collapse-toggle"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            aria-expanded={!sidebarCollapsed}
            aria-controls="desktop-sidebar"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={sidebarCollapsed ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
            </svg>
          </button>
        <aside className="site-sidebar" id="desktop-sidebar">
          <div className="sidebar-header">
            <a href="#overview" aria-label="Mar Kevin Alcantara portfolio home">
              <Image
                className="portfolio-logo portfolio-logo--sidebar"
                src={logoSource}
                alt="MKA"
                width={292}
                height={92}
                priority
              />
            </a>
            <p>Data Analyst</p>
          </div>

          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="#overview" title="Overview">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </span>
<span className="sidebar-link__label">Overview</span></a>
            <a className="sidebar-link" href="#career-graph" title="Career Graph">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </span>
<span className="sidebar-link__label">Career Graph</span></a>
            <a className="sidebar-link" href="#projects" title="Projects">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              </span>
<span className="sidebar-link__label">Projects</span></a>
            <a className="sidebar-link" href="#stack" title="Data Stack">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </span>
<span className="sidebar-link__label">Data Stack</span></a>
            <a className="sidebar-link" href="#certifications" title="Certifications">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5" /><path d="m8.5 12-1 9 4.5-3 4.5 3-1-9" /></svg>
              </span>
<span className="sidebar-link__label">Certifications</span></a>
          </div>

          <div className="sidebar-divider" />

          <p className="sidebar-section-label">Personal Space</p>
          <div className="sidebar-nav-group">
            <Link className="sidebar-link" href="/personal" title="Personal Home">
<span className="sidebar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20v-8a8 8 0 0 1 16 0v8" /><path d="M8 20v-4h8v4M9 8h.01M15 8h.01" /></svg>
              </span>
<span className="sidebar-link__label">Personal Home</span></Link>
            <Link className="sidebar-link" href="/personal#learning" title="Practice Lab">
<span className="sidebar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M7 9v5c3 2 7 2 10 0V9M21 7v6" /></svg>
              </span>
<span className="sidebar-link__label">Practice Lab</span></Link>
            <Link className="sidebar-link" href="/personal#gear" title="Gear Showcase">
<span className="sidebar-icon">
                <GearDeviceIcon type="keyboard" />
              </span>
<span className="sidebar-link__label">Gear Showcase</span></Link>
            <Link className="sidebar-link" href="/personal#content" title="Content">
<span className="sidebar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3V9Z" /></svg>
              </span>
<span className="sidebar-link__label">Content</span></Link>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="#assistant" title="Bop AI">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
              </span>
<span className="sidebar-link__label">Bop AI</span></a>
            <a className="sidebar-link" href="#contact" title="Contact">
<span className="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
<span className="sidebar-link__label">Contact</span></a>
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

          <LiveVisitors sidebar />

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
                width={292}
                height={92}
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
                aria-controls="mobile-navigation"
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
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.nav
                className="mobile-drawer__panel" id="mobile-navigation"
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

        <main id="main-content" tabIndex={-1} className="page-content">
          {/* ========================================================= */}
          {/* SECTION 1: HERO / EXECUTIVE KPI DASHBOARD */}
          {/* ========================================================= */}
          <motion.section className="hero-section" id="overview" style={{ y: shouldReduceMotion ? 0 : heroShift }}>
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
                    <span>Query Bop AI</span>
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
                      <span><TechIcon name="Python" /> Python</span>
                      <span><TechIcon name="SQL" /> SQL</span>
                      <span><TechIcon name="Power BI" /> Power BI</span>
                      <span><TechIcon name="XGBoost" /> XGBoost</span>
                      <span><TechIcon name="ETL Pipelines" /> ETL Pipelines</span>
                      <span><TechIcon name="Excel VBA" /> Excel VBA</span>
                    </div>
                  </div>
                </article>
              </motion.div>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 2: RISING BAR GRAPH CAREER TRAJECTORY */}
          {/* ========================================================= */}
          <motion.section ref={careerSectionRef} className="section-block" id="career-graph" {...reveal}>
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

            <div className="panel career-story">
              <div className="career-story__copy">
                <span className="small-label">My journey · Chapter {careerStoryIndex + 1} of {careerBars.length} · {activeBar.stage}</span>
                <p>{careerStory[careerStoryIndex]}</p>
              </div>
              <div className="career-story__controls">
                {<button type="button" className="button button--ghost button--small career-motion-control" onClick={() => {
                  if (!careerStoryPlaying && careerStoryIndex === careerBars.length - 1) setActiveBarId(careerBars[0].id);
                  setCareerStoryPlaying((playing) => !playing);
                }}>{careerStoryPlaying ? "Pause story" : careerStoryIndex === careerBars.length - 1 ? "Replay story" : "Play story"}</button>}
                <button type="button" className="button button--ghost button--small" disabled={careerStoryIndex === 0} onClick={() => { setCareerStoryPlaying(false); setActiveBarId(careerBars[careerStoryIndex - 1].id); }}>Previous</button>
                <button type="button" className="button button--ghost button--small" disabled={careerStoryIndex === careerBars.length - 1} onClick={() => { setCareerStoryPlaying(false); setActiveBarId(careerBars[careerStoryIndex + 1].id); }}>Next</button>
              </div>
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

                <div className="graph-canvas" tabIndex={0} role="region" aria-label="Career timeline chart, scroll horizontally on small screens">
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
                          onClick={() => { setCareerStoryPlaying(false); setActiveBarId(bar.id); }}
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
                                  sizes="160px"
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
                  tabIndex={0}
                  role="region"
                  aria-label={`${activeBar.stage} career details`}
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
                        <span className="tech-matrix-icon-wrap" aria-hidden="true">
                          <TechIcon name={item} />
                        </span>
                        <strong>{item}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* CERTIFICATIONS */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="certifications" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill"><span>CERTIFICATIONS // CONTINUOUS LEARNING</span></div>
                <h2>Building skills. Continuing to grow.</h2>
              </div>
              <p className="section-summary">Three credentials so far, with more learning ahead. I’m continuing to upskill in analytics, Python, and the tools that turn data into useful insights.</p>
            </div>
            <div className="certifications-grid">
              {certifications.map((certificate) => (
                <article className="panel certification-card" key={certificate.title}>
                  <button
                    type="button"
                    className="certification-preview"
                    aria-label={`View ${certificate.title} credential`}
                    onClick={() => setTimelinePreview({ title: certificate.title, label: certificate.issuer, image: certificate.image })}
                  >
                    <Image src={certificate.image} alt={`${certificate.issuer} — ${certificate.title}`} fill sizes="(max-width: 880px) 90vw, 380px" />
                    <span className="certification-preview__hint">View credential <ArrowIcon /></span>
                  </button>
                  <div className="certification-card__copy">
                    <p className="small-label">{certificate.issuer}</p>
                    <h3>{certificate.title}</h3>
                    <p>{certificate.detail}</p>
                    <span className="chip">{certificate.format}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="panel certifications-learning">
              <span className="data-tag">Learning continues</span>
              <p>Every course is a starting point. I keep building on what I learn through hands-on projects and regular practice.</p>
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 5: BOP AI - PORTFOLIO ASSISTANT */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="assistant" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span>BOP AI // PORTFOLIO ASSISTANT</span>
                </div>
                <h2>A conversation about what I do.</h2>
              </div>
              <p className="section-summary">
                Explore my experience, projects, and the way I work. Ask Bop AI a question, or choose a starting point below.
              </p>
            </div>

            <div className="assistant-grid">
              {/* Left Column: Bop AI Video Spotlight */}
              <article className="panel assistant-info-card">
                <div className="terminal-top">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                  <span className="terminal-title">Bop AI / Portfolio guide</span>
                  <div className="data-telemetry-tag" style={{ marginLeft: "auto" }}>
                    <span className="telemetry-dot" />
                    <span>{chatLoading ? "THINKING" : "READY"}</span>
                  </div>
                </div>

                {/* Continuous, muted desk video */}
                <div className="assistant-video-screen">
                  <video
                    autoPlay
                    ref={assistantVideoRef}
                    src="/assets/video/bop-ai-typing.mp4"
                    poster="/assets/images/kevs-ai-character.png"
                    playsInline
                    muted
                    loop
                    preload="none"
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    className="assistant-video-screen__video"
                    aria-label="Mar Kevin animated cartoon character working at desk"
                  />
                  <div className="assistant-video-screen__hud">
                    <div className="assistant-video-screen__identity">
                      <strong>Bop AI</strong>
                      <span>Business Optimization &amp; Precision</span>
                      <p>“Bop” is the nickname my family has always called me. Here, it also reflects how I work with data: improving business processes with care and accuracy.</p>
                    </div>
                    <button
                      type="button"
                      className="assistant-video-screen__btn"
                      onClick={toggleVideoPreview}
                      aria-label={isVideoPlaying ? "Pause motion preview" : "Play motion preview"}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{isVideoPlaying ? <path d="M9 5v14M15 5v14" /> : <path d="m9 5 10 7-10 7V5Z" />}</svg><span>{isVideoPlaying ? "Pause" : "Play"}</span>
                    </button>
                  </div>
                </div>

                <div className="terminal-telemetry-note">
                  <span className="telemetry-dot" />
                  <span>Experience / Projects / Skills</span>
                </div>
              </article>

              {/* Right Column: Interactive Chat Terminal */}
              <article className="panel chat-card">
                <div className="terminal-top">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                  <span className="terminal-title">Chat with Bop AI</span>
                  <div className="data-telemetry-tag" style={{ marginLeft: "auto" }}>
                    <span className="telemetry-dot" />
                    <span>{chatLoading ? "WORKING" : "ASK ME"}</span>
                  </div>
                </div>

                <div ref={chatThreadRef} className="chat-thread" aria-live="polite">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`chat-bubble ${message.role === "assistant" ? "is-assistant" : "is-user"}`}
                    >
                      <div className="bubble-header">
                        <span className="chat-bubble__label">{message.role === "assistant" ? "Bop AI" : "You"}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  ))}

                  {chatLoading ? (
                    <div className="chat-bubble is-assistant is-loading chat-bubble--typing">
                      <div className="chat-typing-body">
                        <span className="chat-bubble__label">Bop AI</span>
                        <div className="chat-thinking" aria-label="Assistant is thinking">
                          <span className="chat-thinking__text">Thinking of an answer...</span>
                          <span className="chat-thinking__dots" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="chat-suggestions">
                <div className="assistant-suggested-header">
                  <span className="small-label">Suggested Questions</span>
                  <button
                    type="button"
                    className="suggestions-toggle"
                    aria-expanded={suggestionsOpen}
                    aria-controls="chat-suggested-topics"
                    aria-label={suggestionsOpen ? "Minimize suggested questions" : "Expand suggested questions"}
                    onClick={() => setSuggestionsOpen((open) => !open)}
                  >
                    <span>{suggestionsOpen ? "Minimize" : "Expand"}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M5 12h14" />
                      {!suggestionsOpen && <path d="M12 5v14" />}
                    </svg>
                  </button>
                </div>

                <div id="chat-suggested-topics" className="assistant-chip-list" role="group" aria-label="Suggested questions" hidden={!suggestionsOpen}>
                  {quickQuestions.map((question, index) => (
                    <button
                      key={question}
                      type="button"
                      className="assistant-chip" disabled={chatLoading}
                      title={question}
                      aria-label={question}
                      onClick={() => void sendChatMessage(question)}
                    >
                      <svg className="chip-prompt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
                      <span>{["Team value", "Automation", "Current role", "Core skills", "Projects", "Bop AI origin"][index]}</span>
                    </button>
                  ))}
                </div>

                </div>

                <form className="chat-form" onSubmit={handleSubmit}>
                  <label className="chat-field">
                    <span className="sr-only">Ask a portfolio question</span>
                    <textarea
                      name="message"
                      maxLength={1500}
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={handleChatKeyDown}
                      placeholder="Ask about my work, skills, or experience…"
                      rows={2}
                    />
                  </label>
                  <div className="chat-form-footer">
                    <span className="keyboard-hint">Press Enter to send</span>
                    <button type="submit" className="button button--primary" disabled={chatLoading || !chatInput.trim()}>
                      <span>Send</span>
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
                      maxLength={254}
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
                      maxLength={120}
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
                      maxLength={5000}
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
          {petVisible && !mobileMenuOpen && !resumeOpen && timelinePreview === null ? (
            <motion.a
              key="bop-ai-launcher"
              className="bop-launcher"
              href="#assistant"
              aria-label="Ask Bop AI about Mar Kevin"
              initial={{ opacity: 0, scale: 0.82, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              <span className="bop-launcher__label">
                <strong>Ask Bop AI</strong>
                <small>Portfolio assistant</small>
              </span>
              <span className="bop-launcher__avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-6 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m7 9 3 3-3 3m6 0h4" /></svg>
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
      <div className="footer-link__channel">
        <span className="footer-link__icon" aria-hidden="true">
          <ContactChannelIcon type={icon} />
        </span>
        <span className="footer-link__label">{label}</span>
      </div>
      <span className="footer-link__value">{value}</span>
      <span className="footer-link__arrow" aria-hidden="true">
        <ArrowIcon />
      </span>
    </a>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useOverlayFocus(true, ".modal-shell", onClose);
  return (
    <motion.div
      className="modal-shell"
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio preview"
      tabIndex={-1}
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
  if (type === "email")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    );
  if (type === "phone")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5.5A2.5 2.5 0 0 0 3 5.5C3 14.1 9.9 21 18.5 21a2.5 2.5 0 0 0 2.5-2.5V16l-4-1-1.2 2.3a13.2 13.2 0 0 1-9.1-9.1L9 7 8 3Z" />
      </svg>
    );
  if (type === "linkedin")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9v10M6 5.5v.1M10.5 19v-5.5a4 4 0 0 1 8 0V19M10.5 9v10" />
      </svg>
    );
  if (type === "github")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-4 .8-4-2-5-2.5M15 21v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.7-1.4 5.7-6.2A4.8 4.8 0 0 0 19 6c.1-.4.6-1.7-.1-3-1 0-3.1 1.2-3.1 1.2a10.8 10.8 0 0 0-5.6 0S8.1 3 7.1 3C6.4 4.3 6.9 5.6 7 6a4.8 4.8 0 0 0-1.3 3.3c0 4.8 3 5.9 5.8 6.2-.5.4-.6 1.1-.6 2V21" />
      </svg>
    );
  if (type === "facebook")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 21v-8h3l.5-3H14V8.2c0-.9.3-1.7 1.8-1.7H18V3.8c-.6-.1-1.5-.2-2.6-.2-2.7 0-4.4 1.6-4.4 4.6V10H8v3h3v8" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TopicPresetIcon({ type }: { type: string }) {
  if (type === "job") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
      </svg>
    );
  }
  if (type === "project") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18M7 16v-4M12 16V8M17 16v-6" />
      </svg>
    );
  }
  if (type === "collab") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="m8.5 7.5 7 7M15.5 7.5l-7 7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TechIcon({ name }: { name: string }) {
  const norm = name.toLowerCase().trim();

  // Python
  if (norm.includes("python")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="M12 2C8.5 2 6.5 3.2 6.5 5.5V8h5.5v1.8H4.5C2.5 9.8 1 11.2 1 14.2s1.5 4.3 3.5 4.3H6v-2.2c0-1.8 1.4-3.2 3.2-3.2h5.6c1.5 0 2.7-1.2 2.7-2.7V5.5C17.5 3.2 15.5 2 12 2Zm-2.2 2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
        <path d="M12 22c3.5 0 5.5-1.2 5.5-3.5V16h-5.5v-1.8h7.5c2 0 3.5-1.4 3.5-4.4s-1.5-4.3-3.5-4.3H18v2.2c0 1.8-1.4 3.2-3.2 3.2H9.2c-1.5 0-2.7 1.2-2.7 2.7v4.9c0 2.3 2 3.5 5.5 3.5Zm2.2-2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" />
      </svg>
    );
  }

  // SQL / Databases (MySQL, MS SQL, MariaDB, SQLite, DBeaver)
  if (norm.includes("sql") || norm.includes("mariadb") || norm.includes("sqlite") || norm.includes("dbeaver")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }

  // Power BI / KPI Dashboards / Business Intelligence / Power Apps
  if (norm.includes("power bi") || norm.includes("kpi") || norm.includes("power apps")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <rect x="3.5" y="13" width="4" height="7" rx="1" />
        <rect x="10" y="8" width="4" height="12" rx="1" />
        <rect x="16.5" y="4" width="4" height="16" rx="1" />
      </svg>
    );
  }

  // Tableau
  if (norm.includes("tableau")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="M12 2v20M2 12h20M6.5 6.5l11 11M17.5 6.5l-11 11" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  // Excel / VBA
  if (norm.includes("excel") || norm.includes("vba")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M3 10h18M9 4v16M15 4v16" />
      </svg>
    );
  }

  // Pipelines / ETL / Data Extraction / Data Cleaning / Normalization
  if (norm.includes("etl") || norm.includes("pipeline") || norm.includes("extraction") || norm.includes("cleaning") || norm.includes("normalization")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="M4 6h4l4 6h8" />
        <circle cx="4" cy="6" r="2" />
        <circle cx="20" cy="12" r="2" />
        <path d="M4 18h4l3-4.5" />
        <circle cx="4" cy="18" r="2" />
      </svg>
    );
  }

  // R programming
  if (norm === "r") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="M6 4h7.5a4.5 4.5 0 0 1 0 9H6V4Z" />
        <path d="M12 13l6 7M6 13h5.5" />
      </svg>
    );
  }

  // XGBoost / Machine Learning / Forecasting
  if (norm.includes("xgboost") || norm.includes("ml") || norm.includes("predictive")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <rect x="3" y="15" width="5" height="4" rx="1" />
        <rect x="10" y="15" width="5" height="4" rx="1" />
        <rect x="17" y="15" width="5" height="4" rx="1" />
        <path d="M12 7v4M5.5 15v-2a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2M12.5 11v4" />
      </svg>
    );
  }

  // TensorFlow / Deep Learning
  if (norm.includes("tensorflow") || norm.includes("deep learning")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="m7.6 7.6 3 3M16.4 7.6l-3 3M7.6 16.4l3-3M16.4 16.4l-3-3" />
      </svg>
    );
  }

  // Computer Vision / YOLO / OpenCV
  if (norm.includes("yolo") || norm.includes("opencv") || norm.includes("vision")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    );
  }

  // Docker
  if (norm.includes("docker")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <rect x="4" y="8" width="3.5" height="3" rx="0.5" />
        <rect x="8.5" y="8" width="3.5" height="3" rx="0.5" />
        <rect x="13" y="8" width="3.5" height="3" rx="0.5" />
        <rect x="8.5" y="4" width="3.5" height="3" rx="0.5" />
        <path d="M2 13h19.5c-0.5 4.5-4.5 7-9.5 7-5.5 0-9-3-10-7Z" />
      </svg>
    );
  }

  // Git / GitHub
  if (norm.includes("git")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="10" r="2.5" />
        <path d="M6 8.5v7M6 14a6 6 0 0 0 6-6h3.5" />
      </svg>
    );
  }

  // React
  if (norm.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    );
  }

  // Next.js
  if (norm.includes("next")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8.5 16.5V7.5l9 10.5M16 7.5v4" />
      </svg>
    );
  }

  // JavaScript / HTML / CSS / Code
  if (norm.includes("javascript") || norm.includes("html") || norm.includes("css") || norm.includes("script")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }

  // REST APIs
  if (norm.includes("api")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <rect x="3" y="5" width="18" height="6" rx="2" />
        <rect x="3" y="13" width="18" height="6" rx="2" />
        <circle cx="7" cy="8" r="1" />
        <circle cx="7" cy="16" r="1" />
        <path d="M14 8h3M14 16h3" />
      </svg>
    );
  }

  // AI Tools (ChatGPT, Claude, Gemini, Groq, AI-Assisted)
  if (norm.includes("chatgpt") || norm.includes("claude") || norm.includes("gemini") || norm.includes("ai")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="m12 3 2.2 5.5L20 11l-5.8 2.5L12 19l-2.2-5.5L4 11l5.8-2.5L12 3Z" />
      </svg>
    );
  }

  // Jupyter / Notebooks / Data Storytelling / Prompt Design
  if (norm.includes("jupyter") || norm.includes("storytelling") || norm.includes("prompt")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 7H20v13H6.5A2.5 2.5 0 0 1 4 17.5v-13Z" />
      </svg>
    );
  }

  // Default fallback: sleek data-chip / node
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tech-matrix-icon">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.5" />
      <circle cx="15" cy="15" r="1.5" />
      <path d="m9 9 6 6" />
    </svg>
  );
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
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 12.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 17Zm7.25-5.75a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5Zm-13 0a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5ZM17.13 6.87a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm-11.32 0a.75.75 0 0 1 1.06 1.06L5.81 8.99a.75.75 0 1 1-1.06-1.06l1.06-1.06Zm12.38 10.26a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06Zm-12.38 0 1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 1.06-1.06ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
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
