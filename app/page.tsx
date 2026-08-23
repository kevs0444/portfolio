"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
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
  growthPct: number;
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
  items: string[];
};

type ProjectItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  role: string;
  period: string;
  image: string;
  imageLabel: string;
  impactMetric: string;
  summary: string;
  highlights: string[];
  tools: string[];
};

type ContactItem = {
  label: string;
  value: string;
  href: string;
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
  { label: "Kevs AI", href: "#assistant" },
  { label: "Contact", href: "#contact" },
];

const identityItems = [
  "Data Analyst Intern @ LUXASIA",
  "Data Scientist Intern @ Phoenix Petroleum",
  "Data Analyst Intern @ Denso Ten",
  "XGBoost Forecasting & ML Systems",
  "SQL ETL & Automated BI Dashboards",
  "BS Computer Engineering (RTU)",
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
    value: "04",
    sub: "ML, IoT & Database systems",
    trend: "Production-tested",
    sparkline: [1, 2, 3, 4, 4],
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
    id: "bar-1",
    year: "2022 – 2023",
    period: "Aug 2022 – 2023",
    stage: "Stage 01: Foundations",
    title: "1st–2nd Year College",
    role: "Computer Engineering Student & Lead Programmer",
    organization: "Rizal Technological University / CureSecure",
    location: "Pasig City",
    growthPct: 35,
    metricBadge: "Database & Algorithm Base",
    status: "completed",
    summary:
      "Started building software and data foundations. Built CureSecure pharmacy POS and inventory management system with real-time MySQL database tracking and restock alerts.",
    highlights: [
      "Mastered structured SQL databases, schema normalization, and transaction handling.",
      "Engineered CureSecure inventory monitoring with automated alerts to prevent stockouts.",
      "Formed core algorithmic and hardware engineering problem-solving foundation.",
    ],
    tools: ["C#", "MySQL", "Relational DBs", "Data Structures", "WinForms"],
    projects: [
      {
        title: "CureSecure",
        role: "Lead Programmer",
        range: "Jan 2023 – Apr 2023",
        image: "/assets/images/projects/curesecure.jpg",
        imageLabel: "Pharmacy POS and Inventory System",
        summary: "Structured transaction records, automated MySQL inventory tracking, and stockout alerts.",
        impactMetric: "Zero Stockout Risk System",
        tools: ["C#", "MySQL", "WinForms", "Inventory Data"],
      },
    ],
  },
  {
    id: "bar-2",
    year: "2025",
    period: "Aug 2025 – Mar 2026",
    stage: "Stage 02: Applied ML & IoT",
    title: "AIoT & Machine Learning Developer",
    role: "Lead AI & Data Developer / Project Manager",
    organization: "FOVB-AIoT & IoT Research Projects",
    location: "RTU - Pasig Campus",
    growthPct: 55,
    metricBadge: "Multi-AI Risk Scoring & IoT Pipelines",
    status: "completed",
    summary:
      "Led the development of an AI-powered health monitoring kiosk and engineered a cross-validated Multi-AI Risk Score architecture.",
    highlights: [
      "Led the development of an AI-powered health monitoring kiosk by integrating Arduino-based IoT sensors, TensorFlow, and YOLO to capture, process, and analyze real-time vital signs, designed for campus-wide use.",
      "Engineered a cross-validated Multi-AI Risk Score architecture using XGBoost as the primary predictive model, validated through Gemini 2.0 Flash and Groq APIs to minimize AI hallucinations.",
      "Developed a scalable React.js and Python REST API dashboard with MySQL, enabling real-time health monitoring and flexible deployment.",
    ],
    tools: ["Python", "XGBoost", "React.js", "REST APIs", "MySQL", "Arduino", "TensorFlow", "YOLO"],
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
    id: "bar-3",
    year: "Early 2026",
    period: "Feb 2026 – Apr 2026",
    stage: "Stage 03: Enterprise Analytics",
    title: "Denso Ten Solutions Philippines",
    role: "Data Analyst Intern",
    organization: "Engineering Operations Analytics",
    location: "Ortigas Center, Pasig City",
    growthPct: 72,
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
    id: "bar-4",
    year: "Mid 2026",
    period: "Jun 2026 – Jul 2026",
    stage: "Stage 04: Predictive Modeling & ETL",
    title: "Phoenix Petroleum Philippines, Inc.",
    role: "Data Science Intern",
    organization: "Commercial Forecasting & Data Warehousing",
    location: "BGC, Taguig City",
    growthPct: 88,
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
    status: "completed",
    summary:
      "Driving e-commerce data analytics for regional brands across the Philippines and Thailand using SQL, Python, and Power BI.",
    highlights: [
      "Retrieved, validated, and analyzed Shopee and Lazada e-commerce data for regional brands across the Philippines and Thailand using SQL and Python, ensuring data accuracy.",
      "Developed an all-in-one web application that automated data extraction, file renaming, data consolidation, and data validation, streamlining ETL workflows.",
      "Developed interactive Power BI dashboards and delivered data-driven insights and performance reports to stakeholders, enabling informed business decisions.",
    ],
    tools: ["SQL", "Python", "Power BI", "E-Commerce Analytics", "ETL", "Web App Automation"],
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
];

const projectsData: ProjectItem[] = [
  {
    id: "proj-fovb",
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
    title: "Canister Product Demand Forecaster",
    subtitle: "Enterprise Demand Forecasting & ETL Automation",
    category: "Data Science & Forecasting",
    role: "Data Scientist (Phoenix Petroleum)",
    period: "Jun 2026 – Jul 2026",
    image: "/assets/images/projects/fovb-aiot.jpg",
    imageLabel: "Forecasting Pipeline & ETL",
    impactMetric: "83% Time Reduction (30m → 5m)",
    summary:
      "Engineered automated ETL workflows from enterprise SQL data warehouses and built XGBoost forecasting models for supply chain planning.",
    highlights: [
      "Trained XGBoost models predicting 1-day, 2-day, and 3-day canister demand for inventory management.",
      "Automated daily reporting using Python and Google Apps Script, slashing manual work from 30m to 5m.",
      "Created executive heatmaps for regional sales velocity and demand clusters.",
    ],
    tools: ["Python", "SQL", "ETL", "XGBoost", "Google Apps Script", "Heatmaps"],
  },
  {
    id: "proj-kilo-bot",
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
];

const skillClusters: SkillCluster[] = [
  {
    category: "Analytics & BI",
    title: "Business Intelligence & Reporting",
    summary: "Interactive dashboards, executive reporting, and automated operations monitoring.",
    proficiency: 94,
    items: ["Power BI", "Tableau", "Power Apps", "Excel VBA", "KPI Dashboards", "Data Storytelling"],
  },
  {
    category: "Data Engineering",
    title: "Pipelines, ETL & Warehousing",
    summary: "Automated extraction, data cleansing, transformation pipelines, and database optimization.",
    proficiency: 90,
    items: ["SQL", "ETL Pipelines", "Data Extraction", "Data Cleaning", "Data Normalization", "Google Apps Script"],
  },
  {
    category: "Data Science & ML",
    title: "Predictive Modeling & Applied AI",
    summary: "Machine learning workflows, demand forecasting, computer vision, and LLM integrations.",
    proficiency: 88,
    items: ["Python", "R", "XGBoost", "TensorFlow", "Deep Learning", "YOLO", "OpenCV", "Groq API"],
  },
  {
    category: "Databases & Tools",
    title: "Database Engines & Analytics Tools",
    summary: "Structured relational databases, query design, GUI analytics, and devops tooling.",
    proficiency: 92,
    items: ["MySQL", "MS SQL", "MariaDB", "SQLite", "DBeaver", "Jupyter Notebook", "Docker", "Git"],
  },
  {
    category: "Hardware & IoT",
    title: "Sensor Telemetry & Edge Computing",
    summary: "Hardware sensor integration, low-latency Python streams, and embedded data pipelines.",
    proficiency: 85,
    items: ["Arduino", "Raspberry Pi", "ESP32", "REST APIs", "Serial Data", "Hardware State Logic"],
  },
];

const contactItems: ContactItem[] = [
  {
    label: "Email",
    value: "markevinalcantara40@gmail.com",
    href: "mailto:markevinalcantara40@gmail.com",
  },
  {
    label: "Phone",
    value: "+63 952 470 2284",
    href: "tel:+639524702284",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mar-kevin-alcantara-83562326a",
    href: "https://www.linkedin.com/in/mar-kevin-alcantara-83562326a/",
  },
  {
    label: "GitHub",
    value: "github.com/Kevs0444",
    href: "https://github.com/Kevs0444",
  },
  {
    label: "Location",
    value: "Taguig City, Metro Manila, 1630",
    href: "#",
  },
];

const quickQuestions = [
  "What forecasting models has Mar Kevin built?",
  "Tell me about his 83% report automation at Phoenix Petroleum.",
  "What is his current role at LUXASIA?",
  "What are his core SQL, Power BI, and Python skills?",
  "Walk me through his rising career graph.",
  "Is he open to data analyst and data scientist roles?",
];

const revealEase = [0.16, 1, 0.3, 1] as const;
const introEase = [0.76, 0, 0.24, 1] as const;

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I am Kevs AI — Mar Kevin's portfolio intelligence agent. I have full telemetry on his data analytics projects, machine learning models (XGBoost), ETL pipelines, and internships (LUXASIA, Phoenix Petroleum, Denso Ten). Ask me anything!",
};

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [timelinePreview, setTimelinePreview] = useState<TimelineImagePreview | null>(null);

  // Active bar in the rising bar chart
  const [activeBarId, setActiveBarId] = useState<string>("bar-6");
  const [activeSkillCategory, setActiveSkillCategory] = useState<number>(0);
  const [identityIndex, setIdentityIndex] = useState(0);

  // Kevs AI Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [chatLoading, setChatLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const activeSkill = skillClusters[activeSkillCategory] ?? skillClusters[0];

  const portraitSource =
    theme === "light" ? "/assets/images/light-mode-profile-pic.jpg" : "/assets/images/dark-mode-profile-pic.jpg";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const nextTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

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
    <>
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
            <h2>Mar Kevin Alcantara</h2>
            <p>Data Analyst & Scientist</p>
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
          
          <div className="sidebar-nav-group">
            <button
              type="button"
              className="sidebar-link sidebar-theme-toggle"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              <ThemeIcon mode={theme} />
              <span style={{ marginLeft: "0.5rem" }}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
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
              <div className="brand-badge">
                <span className="brand-dot" />
                <span>KEVS.DATA_VIZ</span>
              </div>
              <span className="brand-name">Mar Kevin Alcantara</span>
              <small className="brand-sub">Data Analyst & Data Scientist</small>
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
                className="theme-toggle"
                aria-label="Toggle color theme"
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              >
                <ThemeIcon mode={theme} />
                <span>{theme === "dark" ? "Light" : "Dark"}</span>
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
                  <button
                    type="button"
                    className="theme-toggle"
                    aria-label="Toggle color theme"
                    onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                  >
                    <ThemeIcon mode={theme} />
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </button>

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
                  <span>DATA ANALYST & SCIENTIST // EXECUTIVE SUMMARY</span>
                </div>

                <div className="hero-name" aria-label="Mar Kevin Alcantara">
                  <span>Mar Kevin</span>
                  <span>Alcantara</span>
                </div>

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
                  Computer Engineering graduate specializing in <strong>Data Analytics</strong>, <strong>Data Science</strong>, and <strong>Automated BI Pipelines</strong>. Experienced in transforming raw corporate data into high-impact forecast models (XGBoost), automated ETL workflows (saving 83% reporting time), and interactive Power BI executive dashboards.
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
                  <div className="portrait-media">
                    <Image
                      src={portraitSource}
                      alt="Mar Kevin Alcantara"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 32rem"
                      className="portrait-image"
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
                    <h2>Bridging Data Engineering, Machine Learning & Business Intelligence.</h2>
                    <p>
                      Hands-on experience across 3 data internships and multiple AIoT systems. Adept at turning disparate databases into actionable executive intelligence.
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
                  <span className="pill-index">01</span>
                  <span>CAREER TRAJECTORY GRAPH // TIME-SERIES VISUALIZATION</span>
                </div>
                <h2>From 1st Year University to LUXASIA Intern.</h2>
              </div>
              <p className="section-summary">
                Interactive growth curve mapping data engineering complexity, model sophistication, and corporate impact over time. Click any milestone bar to inspect metrics and deliverables.
              </p>
            </div>

            {/* Rising Bar Chart Component */}
            <div className="graph-container">
              <div className="graph-chart-frame">
                {/* Chart Header & Axis Info */}
                <div className="graph-chart__meta">
                  <div className="graph-chart__meta-item">
                    <span className="meta-label">Y-AXIS</span>
                    <span className="meta-val">Skill Maturity & Impact (%)</span>
                  </div>
                  <div className="graph-chart__legend">
                    <span className="legend-item"><span className="legend-box completed" /> Past Roles</span>
                    <span className="legend-item"><span className="legend-box current" /> Current Peak (LUXASIA)</span>
                  </div>
                </div>

                {/* Visual Chart Canvas with Y-Grid Lines and Rising Bars */}
                <div className="graph-canvas">
                  {/* Grid Lines */}
                  <div className="graph-grid-lines" aria-hidden="true">
                    <div className="grid-line" style={{ bottom: "100%" }}><span>100% (Peak)</span></div>
                    <div className="grid-line" style={{ bottom: "75%" }}><span>75%</span></div>
                    <div className="grid-line" style={{ bottom: "50%" }}><span>50%</span></div>
                    <div className="grid-line" style={{ bottom: "25%" }}><span>25%</span></div>
                  </div>

                  {/* Rising Bars */}
                  <div className="bars-track" role="tablist" aria-label="Career Growth Bars">
                    {careerBars.map((bar) => {
                      const isSelected = activeBarId === bar.id;
                      const isCurrent = bar.status === "current";

                      return (
                        <button
                          key={bar.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          className={`graph-bar-col ${isSelected ? "is-selected" : ""} ${isCurrent ? "is-current" : ""}`}
                          onClick={() => setActiveBarId(bar.id)}
                        >
                          <div className="graph-bar-wrapper">
                            {/* Growth Value Pill on top of Bar */}
                            <div className="bar-val-tag">
                              <span>{bar.growthPct}%</span>
                              {isCurrent ? <span className="current-pulse" /> : null}
                            </div>

                            {/* The Rising Bar Pillar */}
                            <motion.div
                              className={`bar-pillar ${isCurrent ? "pillar-current" : "pillar-regular"}`}
                              style={{ height: `${bar.growthPct}%` }}
                              initial={{ scaleY: 0 }}
                              whileInView={{ scaleY: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: revealEase }}
                            >
                              <div className="pillar-pattern" />
                              <div className="pillar-glow" />
                            </motion.div>
                          </div>

                          {/* X-Axis Bar Label */}
                          <div className="bar-axis-label">
                            <strong>{bar.title}</strong>
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
                  <span className="pill-index">02</span>
                  <span>DATA SYSTEMS & CASE STUDIES // PRODUCTION DELIVERABLES</span>
                </div>
                <h2>Predictive Models, Pipelines & Dashboards.</h2>
              </div>
              <p className="section-summary">
                Selected machine learning, database, and ETL systems built for real operations, academic thesis research, and IoT pipelines.
              </p>
            </div>

            <div className="projects-grid">
              {projectsData.map((project) => (
                <motion.article key={project.id} className="panel project-card" {...reveal}>
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
                        sizes="(max-width: 768px) 100vw, 560px"
                        className="project-card-image"
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
                    <div className="project-topline">
                      <div>
                        <span className="project-period">{project.period}</span>
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-subtitle">{project.subtitle}</p>
                      </div>
                      <div className="impact-badge">
                        <span className="impact-badge__label">Impact</span>
                        <strong>{project.impactMetric}</strong>
                      </div>
                    </div>

                    <p className="project-summary">{project.summary}</p>

                    <ul className="project-highlights">
                      {project.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <div className="chip-row project-tools">
                      {project.tools.map((tool) => (
                        <span key={tool} className="chip">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* SECTION 4: DATA STACK & PROFICIENCY MATRIX */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="stack" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span className="pill-index">03</span>
                  <span>ANALYTICS & TECH MATRIX // APPLIED TOOLKIT</span>
                </div>
                <h2>Tools Verified in Production & Research.</h2>
              </div>
              <p className="section-summary">
                Categorized tool distribution across Data Analytics, Data Engineering, Machine Learning, and Relational Databases.
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
                      <span className="skill-meter-val">{cluster.proficiency}%</span>
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
                      <span>Proficiency / Application Depth</span>
                      <strong>{activeSkill.proficiency}%</strong>
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
          {/* SECTION 5: KEVS AI - DATA QUERY TERMINAL */}
          {/* ========================================================= */}
          <motion.section className="section-block" id="assistant" {...reveal}>
            <div className="section-intro">
              <div>
                <div className="dashboard-pill">
                  <span className="pill-index">04</span>
                  <span>NATURAL LANGUAGE QUERY TERMINAL // KEVS AI</span>
                </div>
                <h2>Query Kevin&apos;s Experience & Background.</h2>
              </div>
              <p className="section-summary">
                Direct AI query interface backed by live resume knowledge, project details, forecasting architectures, and internship records.
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
                  <span className="pill-index">05</span>
                  <span>CONTACT & CREDENTIALS // REACH OUT</span>
                </div>
                <h2>Open to Data Analyst & Data Scientist Opportunities.</h2>
              </div>
            </div>

            <div className="footer-grid">
              {/* Full-span Resume CTA */}
              <article className="panel footer-panel footer-panel--cta">
                <div className="footer-cta__copy">
                  <div className="data-telemetry-tag">
                    <span className="telemetry-dot" />
                    <span>CURRICULUM VITAE</span>
                  </div>
                  <h3>Verified Credentials & Resume.</h3>
                  <p>
                    Inspect complete academic background (BSCpE), internship deliverables (LUXASIA, Phoenix Petroleum, Denso Ten), and Cisco Data Analytics certification in PDF format.
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
              <article className="panel footer-panel">
                <p className="small-label">Communication Channels</p>
                <div className="footer-link-list">
                  {contactItems.map((item) => (
                    <FooterLink key={item.label} {...item} />
                  ))}
                </div>
              </article>

              {/* Direct Message Form */}
              <article className="panel footer-panel contact-form-panel">
                <div style={{ marginBottom: "1rem" }}>
                  <p className="small-label">Direct Inbox</p>
                  <h3>Send an Email.</h3>
                </div>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="contact-form-group">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="chat-input"
                    />
                  </div>
                  <div className="contact-form-group">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                      className="chat-input"
                    />
                  </div>
                  <div className="contact-form-group">
                    <textarea
                      placeholder="Your Message (context)"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      className="chat-input"
                      rows={3}
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={contactStatus === "loading"}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <span>{contactStatus === "loading" ? "Sending..." : "Send Message"}</span>
                    {!contactStatus && <ArrowIcon />}
                  </button>
                  {contactFeedback && (
                    <p className={`contact-feedback ${contactStatus === "error" ? "text-error" : "text-success"}`} style={{ marginTop: "0.5rem", fontSize: "0.85rem", textAlign: "center" }}>
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
                    <p className="small-label">Curriculum Vitae Preview</p>
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

                <iframe className="resume-frame" src="/assets/resume.pdf" title="Mar Kevin Alcantara Resume Preview" />
              </motion.div>
            </ModalShell>
          ) : null}
        </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function FooterLink({ href, label, value }: ContactItem) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className="footer-link"
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <span>{label}</span>
      <span>{value}</span>
      <ArrowIcon />
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
