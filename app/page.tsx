"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

type Theme = "light" | "dark";

type SkillCluster = {
  title: string;
  summary: string;
  items: string[];
};

type ContactItem = {
  label: string;
  value: string;
  href: string;
};

type TimelineEvent = {
  month: string;
  range: string;
  title: string;
  role: string;
  organization: string;
  location?: string;
  logo: string;
  image?: string;
  imageLabel: string;
  summary: string;
  highlights: string[];
  tools: string[];
  status?: "current";
  projects?: TimelineEvent[];
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
  { label: "Experience", href: "#timeline" },
  { label: "Stack", href: "#stack" },
  { label: "Kevs AI", href: "#assistant" },
  { label: "Contact", href: "#contact" },
];

const identityItems = [
  "Aspiring Data Analyst",
  "Aspiring Data Scientist",
  "Aspiring Data Engineer",
  "LUXASIA Data Analyst Intern",
  "BI Dashboard Builder",
  "Computer Engineering Student",
];

const signatureTraits = ["SQL Practice", "Reports", "Automation", "Dashboards"];

const statItems = [
  { value: "04", label: "data-driven projects" },
  { value: "03", label: "data internships" },
  { value: "BSCpE", label: "Rizal Technological University" },
];

const timelineEvents: TimelineEvent[] = [
  {
    month: "Current",
    range: "Current",
    title: "LUXASIA",
    role: "Data Analyst Intern",
    organization: "Business data and reporting",
    logo: "LX",
    imageLabel: "LUXASIA photo slot",
    summary:
      "Current internship where I am learning more about business data, reports, and day-to-day analytics work.",
    highlights: [
      "Working with business data and reporting tasks in a real company setting.",
      "Bringing what I learned from Python, SQL, Excel, Power BI, and previous internship work.",
    ],
    tools: ["Data Analysis", "Reporting", "Business Intelligence", "Dashboards"],
    status: "current",
  },
  {
    month: "Jun 2026",
    range: "Jun 2026 - Jul 2026",
    title: "Phoenix Petroleum Philippines, Inc.",
    role: "Data Scientist (Voluntary Internship)",
    organization: "Data science and forecasting",
    location: "BGC, Taguig City",
    logo: "PP",
    imageLabel: "Phoenix Petroleum photo slot",
    summary:
      "Voluntary internship where I worked on ETL, daily reports, forecasting, and dashboard improvements.",
    highlights: [
      "Developed automated ETL workflows by extracting data from SQL data warehouses and transforming raw datasets into analysis-ready data using Python.",
      "Automated daily ad hoc reporting using Python, Google Apps Script, and Google Sheets, reducing report preparation time by 83%, from 30 minutes to 5 minutes.",
      "Developed XGBoost forecasting models to predict 1-day, 2-day, and 3-day canister product demand for inventory planning and data-driven decisions.",
      "Enhanced executive dashboards with analytical heatmaps and automated reporting views.",
    ],
    tools: ["Python", "SQL", "ETL", "XGBoost", "Google Apps Script", "Google Sheets", "Heatmaps"],
  },
  {
    month: "Feb 2026",
    range: "Feb 2026 - Apr 2026",
    title: "Denso Ten Solutions Philippines",
    role: "Data Analyst Intern",
    organization: "Engineering operations analytics",
    location: "Ortigas, Pasig City",
    logo: "DT",
    imageLabel: "Denso Ten photo slot",
    summary:
      "Internship where I helped automate reports and dashboards for engineering operations.",
    highlights: [
      "Used Python, Excel VBA, SQL databases, Power BI, and Power Apps for reporting and automation.",
      "Developed internal tools including defect gathering and stack output analysis workflows.",
    ],
    tools: ["Python", "Excel VBA", "SQL", "Power BI", "Power Apps"],
  },
  {
    month: "Aug 2022",
    range: "Aug 2022 - Aug 2026",
    title: "Bachelor of Science in Computer Engineering",
    role: "Computer Engineering Student",
    organization: "Rizal Technological University",
    location: "Pasig City",
    logo: "RT",
    imageLabel: "University photo slot",
    summary:
      "This is where I started building the technical base behind my data projects and internships.",
    highlights: [
      "Built a technical base across programming, databases, automation, IoT, and machine learning.",
      "Used school projects and thesis work to practice analytics, dashboards, databases, and machine learning.",
    ],
    tools: ["Programming", "Databases", "IoT", "Data Systems"],
    projects: [
      {
        month: "Aug 2025",
        range: "Aug 2025 - Mar 2026",
        title: "FOVB-AIoT",
        role: "Lead AI & Data Developer",
        organization: "Four-in-One Vital Sign Sensor with BMI Calculation",
        logo: "FA",
        image: "/assets/images/projects/fovb-aiot.jpg",
        imageLabel: "AI health dashboard",
        summary:
          "Led the AI and data side of a smart health kiosk that combines IoT vital-sign capture, computer vision, dashboards, and risk scoring.",
        highlights: [
          "Built the Multi-AI Risk Score workflow with XGBoost, Gemini validation, and Groq API validation.",
          "Developed a React and Python REST API dashboard for live patient monitoring.",
        ],
        tools: ["Python", "XGBoost", "React", "MySQL", "Arduino"],
      },
      {
        month: "Nov 2025",
        range: "Nov 2025 - Dec 2025",
        title: "Smart AI Kilo Bot",
        role: "IoT Data Dashboard Developer",
        organization: "Intelligent weighing and pricing system",
        logo: "KB",
        image: "/assets/images/projects/kilo-bot.png",
        imageLabel: "IoT weighing interface",
        summary:
          "Created a live weighing and pricing dashboard that turns Arduino load-cell readings into instant operational feedback.",
        highlights: [
          "Connected sensor readings to a low-latency Python data pipeline.",
          "Visualized weight, price, and transaction feedback for marketplace workflows.",
        ],
        tools: ["Python", "Arduino", "Realtime Data", "Dashboard"],
      },
      {
        month: "Apr 2025",
        range: "Apr 2025 - May 2025",
        title: "Smart Locker System",
        role: "Project Manager & Automation Developer",
        organization: "Secure locker prototype",
        logo: "SL",
        image: "/assets/images/projects/smart-locker.jpg",
        imageLabel: "Smart locker prototype",
        summary:
          "Managed and developed a Python and Raspberry Pi locker system with controlled access, hardware state logic, and authentication.",
        highlights: [
          "Directed requirements, procurement, and integration across the prototype lifecycle.",
          "Built the Python GUI and Raspberry Pi control flow for secure locker actions.",
        ],
        tools: ["Python", "Raspberry Pi", "GUI", "Automation"],
      },
      {
        month: "Jan 2023",
        range: "Jan 2023 - Apr 2023",
        title: "CureSecure",
        role: "Lead Programmer",
        organization: "Pharmacy POS and Inventory System",
        logo: "CS",
        image: "/assets/images/projects/curesecure.jpg",
        imageLabel: "Pharmacy POS system",
        summary:
          "Built a pharmacy operations system around transaction records, MySQL inventory data, and automated stock monitoring.",
        highlights: [
          "Designed transaction and inventory workflows for cleaner pharmacy operations.",
          "Implemented MySQL stock tracking, restock alerts, and role-based access control.",
        ],
        tools: ["C#", "WinForms", "MySQL", "Inventory Data"],
      },
    ],
  },
];

const skillClusters: SkillCluster[] = [
  {
    title: "Analytics + BI",
    summary: "Dashboards and reports for understanding day-to-day operations.",
    items: ["Power BI", "Power Apps", "Tableau", "Excel VBA", "Reporting Dashboards", "Business Intelligence"],
  },
  {
    title: "Data Engineering",
    summary: "Pipelines, extraction, cleaning, and database workflows for structured data.",
    items: ["SQL", "ETL Pipelines", "Data Processing", "Data Cleaning", "Data Extraction", "Database Management"],
  },
  {
    title: "Data Science + ML",
    summary: "Predictive models and computer vision workflows built around real project data.",
    items: ["Python", "TensorFlow", "Deep Learning", "XGBoost", "YOLO", "OpenCV"],
  },
  {
    title: "Databases + Tools",
    summary: "Storage, querying, and tooling for dashboards, apps, and analysis workflows.",
    items: ["MySQL", "SQLite", "MariaDB", "DBeaver", "Git", "GitHub", "Docker", "Vercel"],
  },
  {
    title: "Automation + IoT",
    summary: "Python automation and sensor systems that turn hardware events into usable data.",
    items: ["Python", "Arduino", "Raspberry Pi", "ESP32", "REST APIs", "Linux"],
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
];

const quickQuestions = [
  "What data projects has Mar Kevin built?",
  "Tell me about his data internships.",
  "Walk me through his experience timeline.",
  "What analytics and engineering skills does he have?",
  "Is he open to data opportunities?",
];

const revealEase = [0.16, 1, 0.3, 1] as const;
const introEase = [0.76, 0, 0.24, 1] as const;
const lineEase = [0.22, 1, 0.36, 1] as const;

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hey! I'm Kevs AI - I know Mar Kevin's data projects, internship experience, skills, and background. Ask me anything and I'll give you the details.",
};

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [theme, setTheme] = useState<Theme>("dark");
  const [introVisible, setIntroVisible] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [timelinePreview, setTimelinePreview] = useState<TimelineImagePreview | null>(null);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [identityIndex, setIdentityIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [chatLoading, setChatLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const skillCardRefs = useRef<Array<HTMLElement | null>>([]);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.24,
  });

  const heroShift = useTransform(smoothProgress, [0, 0.28], [0, prefersReducedMotion ? 0 : -80]);
  const heroAsideShift = useTransform(smoothProgress, [0, 0.35], [0, prefersReducedMotion ? 0 : 64]);
  const portraitSource =
    theme === "light" ? "/assets/images/light-mode-profile-pic.jpg" : "/assets/images/dark-mode-profile-pic.jpg";
  const activeSkill = skillClusters[activeSkillIndex] ?? skillClusters[0];

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
    const introTimer = window.setTimeout(() => {
      setIntroVisible(false);
    }, 1700);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIdentityIndex((current) => (current + 1) % identityItems.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = introVisible || resumeOpen || timelinePreview !== null || mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [introVisible, mobileMenuOpen, resumeOpen, timelinePreview]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResumeOpen(false);
        setTimelinePreview(null);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const chatThread = chatThreadRef.current;
    if (!chatThread) {
      return;
    }

    chatThread.scrollTo({
      top: chatThread.scrollHeight,
      behavior: chatMessages.length > 1 ? "smooth" : "auto",
    });
  }, [chatMessages, chatLoading]);

  const reveal = prefersReducedMotion
    ? {}
    : {
      initial: { opacity: 0, y: 36 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.18 },
      transition: { duration: 0.68, ease: revealEase },
    };

  async function sendChatMessage(content: string) {
    const trimmedContent = content.trim();
    if (!trimmedContent || chatLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmedContent };
    const conversation = [...chatMessages, userMessage];

    setChatMessages(conversation);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
            error instanceof Error
              ? error.message
              : "Kevs AI is unavailable right now.",
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

  function handleSkillJump(index: number) {
    setActiveSkillIndex(index);
    skillCardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderTimelineMedia(event: TimelineEvent, variant: "event" | "project" = "event") {
    const mediaClassName =
      variant === "project" ? "timeline-event__media timeline-project__media" : "timeline-event__media";

    return (
      <div className={mediaClassName}>
        {event.image ? (
          <button
            type="button"
            className="timeline-event__media-button"
            aria-label={`Enlarge ${event.title} image`}
            onClick={() =>
              setTimelinePreview({
                title: event.title,
                image: event.image!,
                label: event.imageLabel,
              })
            }
          >
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes={variant === "project" ? "(max-width: 760px) 100vw, 120px" : "(max-width: 760px) 100vw, 150px"}
              className="timeline-event__image"
            />
            <span className="timeline-event__image-label">{event.imageLabel}</span>
          </button>
        ) : (
          <>
            <div className="timeline-event__placeholder">
              <strong>{event.logo}</strong>
              <span>Image slot</span>
            </div>
            <span className="timeline-event__image-label">{event.imageLabel}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="scroll-progress-track" aria-hidden="true">
        <motion.div className="scroll-progress-bar" style={{ scaleX: smoothProgress }} />
      </div>

      <AnimatePresence>
        {introVisible ? (
          <motion.div
            className="intro-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ y: "-100%", transition: { duration: 0.85, ease: introEase } }}
          >
            <div className="intro-screen__content">
              <p className="intro-screen__eyebrow">Resume site</p>
              <div className="intro-screen__name">
                <span>Mar Kevin</span>
                <span>Alcantara</span>
              </div>
              <p className="intro-screen__copy">Data analytics, machine learning, data engineering, and BI dashboards.</p>
              <motion.div
                className="intro-screen__line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.25, ease: lineEase }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="site-shell">
        <div className="site-noise" aria-hidden="true" />

        <header className="site-header">
          <div className="site-header__bar">
            <a className="brand-mark" href="#home">
              <span>Mar Kevin Alcantara</span>
              <small>Aspiring data analyst / scientist / engineer</small>
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
                Available today
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

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              className="mobile-drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.nav
                className="mobile-drawer__panel"
                initial={prefersReducedMotion ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={prefersReducedMotion ? undefined : { x: "100%" }}
                transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Mobile navigation"
              >
                <div className="mobile-drawer__header">
                  <span className="small-label">Navigation</span>
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
                  <a href="#home" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </a>
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
                    onClick={() => {
                      setTheme((current) => (current === "dark" ? "light" : "dark"));
                    }}
                  >
                    <ThemeIcon mode={theme} />
                    <span>{theme === "dark" ? "Light" : "Dark"}</span>
                  </button>

                  <a className="availability-pill" href="#contact" onClick={() => setMobileMenuOpen(false)}>
                    <span className="status-dot" aria-hidden="true" />
                    Available today
                  </a>
                </div>
              </motion.nav>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="page-content">
          <motion.section className="hero-section" id="home" style={{ y: heroShift }}>
            <div className="hero-grid">
              <motion.div className="hero-copy" {...reveal}>
                <p className="eyebrow">Aspiring Data Analyst / Data Scientist / Data Engineer</p>

                <div className="hero-name" aria-label="Mar Kevin Alcantara">
                  <span>Mar Kevin</span>
                  <span>Alcantara</span>
                </div>

                <div className="identity-band">
                  <span className="small-label">Current focus</span>
                  <div className="identity-band__window" aria-live="polite">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={identityItems[identityIndex]}
                        className="identity-band__item"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
                        transition={{ duration: 0.35, ease: revealEase }}
                      >
                        {identityItems[identityIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <p className="hero-lead">
                  I am a Computer Engineering student building my way into data analyst, data scientist, and data
                  engineering roles. Most of my work started from school projects, internships, and trying to make
                  messy data easier to use.
                </p>

                <div className="hero-actions">
                  <button type="button" className="button button--primary" onClick={() => setResumeOpen(true)}>
                    Preview resume
                    <ArrowIcon />
                  </button>
                  <a className="button button--ghost" href="#assistant">
                    Ask Kevs AI
                    <ArrowIcon />
                  </a>
                </div>

                <div className="stats-grid">
                  {statItems.map((item) => (
                    <article key={item.label} className="stat-card">
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </article>
                  ))}
                </div>
              </motion.div>

              <motion.div className="hero-side" style={{ y: heroAsideShift }} {...reveal}>
                <article className="panel portrait-card">
                  <div className="portrait-media">
                    <Image
                      src={portraitSource}
                      alt="Mar Kevin Alcantara"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 34rem"
                      className="portrait-image"
                    />
                  </div>

                  <div className="card-copy">
                    <p className="small-label">Short version</p>
                    <h2>I like working on reports, dashboards, automation, forecasting, and databases.</h2>
                    <p>
                      I am still learning, but I have already handled internship work, thesis work, and projects that
                      needed Python, SQL, Power BI, Excel, XGBoost, and real data cleanup.
                    </p>
                  </div>
                </article>
              </motion.div>
            </div>

            <motion.div className="focus-strip" {...reveal}>
              {signatureTraits.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="section-block" id="timeline" {...reveal}>
            <div className="section-intro history-intro">
              <div>
                <p className="eyebrow">Experience</p>
                <h2>From student projects to real data work.</h2>
              </div>
              <p className="section-summary">
                I started with school systems and thesis builds, then moved into internships where the work became
                more about reports, ETL, forecasting, dashboards, and business data.
              </p>
            </div>

            <div className="experience-history">
              {timelineEvents.map((event) => (
                <motion.article
                  key={`${event.range}-${event.title}`}
                  id={`timeline-${event.month.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`timeline-event ${event.status === "current" ? "is-current" : ""}`}
                  {...reveal}
                >
                  <div className="timeline-event__rail" aria-hidden="true">
                    <span>{event.logo}</span>
                  </div>

                  <div className="timeline-event__body">
                    {renderTimelineMedia(event)}

                    <div className="timeline-event__content">
                      <div className="timeline-event__company">
                        <h3>{event.title}</h3>
                        {event.status === "current" ? <span className="timeline-event__status">Current</span> : null}
                      </div>
                      <p className="timeline-event__meta">
                        {event.organization}
                        {event.location ? ` / ${event.location}` : ""}
                      </p>

                      <div className="timeline-event__role">
                        <h4>{event.role}</h4>
                        <p>{event.range}</p>
                      </div>

                      <p className="timeline-event__summary">{event.summary}</p>

                      <ul className="detail-list">
                        {event.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>

                      <div className="chip-row">
                        {event.tools.map((tool) => (
                          <span key={tool} className="chip">
                            {tool}
                          </span>
                        ))}
                      </div>

                      {event.projects?.length ? (
                        <div className="timeline-projects">
                          <p className="small-label">University projects</p>
                          <div className="timeline-projects__list">
                            {event.projects.map((project) => (
                              <article key={`${project.range}-${project.title}`} className="timeline-project">
                                {renderTimelineMedia(project, "project")}

                                <div className="timeline-project__content">
                                  <div className="timeline-project__topline">
                                    <h5>{project.title}</h5>
                                    <span>{project.range}</span>
                                  </div>
                                  <p>{project.role}</p>
                                  <p>{project.summary}</p>
                                  <div className="chip-row">
                                    {project.tools.map((tool) => (
                                      <span key={tool} className="chip">
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section className="section-block" id="stack" {...reveal}>
            <div className="section-intro">
              <div>
                <p className="eyebrow">Data stack</p>
                <h2>Tools I have used in internships and projects.</h2>
              </div>
              <p className="section-summary">
                These are the tools I have actually touched while building reports, dashboards, ETL scripts,
                forecasting models, databases, and IoT systems.
              </p>
            </div>

            <div className="skills-showcase">
              <aside className="panel skills-aside">
                <p className="small-label">Skill navigator</p>
                <h3>{activeSkill.title}</h3>
                <p>{activeSkill.summary}</p>

                <div className="skills-nav" role="tablist" aria-label="Skill categories">
                  {skillClusters.map((cluster, index) => (
                    <button
                      key={cluster.title}
                      type="button"
                      className={`skill-nav-button ${activeSkillIndex === index ? "is-active" : ""}`}
                      onClick={() => handleSkillJump(index)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{cluster.title}</strong>
                    </button>
                  ))}
                </div>

                <div className="chip-row skills-preview-chips">
                  {activeSkill.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </aside>

              <div className="skills-timeline">
                {skillClusters.map((cluster, index) => (
                  <motion.article
                    key={cluster.title}
                    ref={(node) => {
                      skillCardRefs.current[index] = node;
                    }}
                    className={`panel stack-card skill-card ${activeSkillIndex === index ? "is-active" : ""}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.45 }}
                    transition={{ duration: 0.55, ease: revealEase }}
                    onViewportEnter={() => setActiveSkillIndex(index)}
                  >
                    <div className="skill-card__top">
                      <span className="skill-step">{String(index + 1).padStart(2, "0")}</span>
                      <p className="small-label">{cluster.title}</p>
                    </div>
                    <h3>{cluster.summary}</h3>
                    <div className="chip-row">
                      {cluster.items.map((item) => (
                        <span key={item} className="chip">
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section className="section-block" id="assistant" {...reveal}>
            <div className="section-intro">
              <div>
                <p className="eyebrow">Ask Kevs AI</p>
                <h2>Ask about my resume.</h2>
              </div>
              <p className="section-summary">
                You can ask about my internships, school projects, tools, resume, or contact details.
              </p>
            </div>

            <div className="assistant-grid">
              <article className="panel assistant-info-card">
                <p className="small-label">Try asking</p>
                <div className="assistant-chip-list">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="assistant-chip"
                      onClick={() => void sendChatMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel chat-card">
                <div ref={chatThreadRef} className="chat-thread" aria-live="polite">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`chat-bubble ${message.role === "assistant" ? "is-assistant" : "is-user"}`}
                    >
                      <span className="chat-bubble__label">{message.role === "assistant" ? "Kevs AI" : "You"}</span>
                      <p>{message.content}</p>
                    </div>
                  ))}

                  {chatLoading ? (
                    <div className="chat-bubble is-assistant is-loading">
                      <span className="chat-bubble__label">Kevs AI</span>
                      <div className="chat-thinking" aria-label="Assistant is thinking">
                        <span className="chat-thinking__text">Thinking</span>
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
                      placeholder="Ask about data projects, internship experience, analytics skills, or availability..."
                      rows={4}
                    />
                  </label>
                  <button type="submit" className="button button--primary" disabled={chatLoading}>
                    Ask Kevs AI
                    <ArrowIcon />
                  </button>
                </form>
              </article>
            </div>
          </motion.section>

          <motion.section className="section-block contact-block" id="contact" {...reveal}>
            <div className="section-intro contact-intro">
              <div>
                <p className="eyebrow">Contact</p>
                <h2>Open to entry-level data roles and internships.</h2>
              </div>
            </div>

            <div className="footer-grid">
              <article className="panel footer-panel footer-panel--cta">
                <div className="footer-cta__copy">
                  <p className="small-label">Resume</p>
                  <h3>See my background without leaving the page.</h3>
                  <p>
                    Open the resume here if you want the PDF version of my education, internships, projects, and
                    certification.
                  </p>
                </div>
                <div className="footer-cta__actions">
                  <button type="button" className="button button--primary" onClick={() => setResumeOpen(true)}>
                    Preview resume
                    <ArrowIcon />
                  </button>
                  <a className="button button--ghost button--small" href="/assets/resume.pdf" download>
                    Download PDF
                    <ArrowIcon />
                  </a>
                </div>
              </article>

              <article className="panel footer-panel">
                <p className="small-label">Get in touch</p>
                <div className="footer-link-list">
                  {contactItems.map((item) => (
                    <FooterLink key={item.label} {...item} />
                  ))}
                </div>
              </article>

              <article className="panel footer-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p className="small-label">Direct message</p>
                  <h3>Send an email.</h3>
                  <p style={{ marginTop: "1rem" }}>
                    For opportunities, questions, or feedback, email is the easiest way to reach me.
                  </p>
                </div>
                <div style={{ marginTop: "2rem" }}>
                  <a className="button button--primary" href="mailto:markevinalcantara40@gmail.com" style={{ width: "100%" }}>
                    Message directly
                    <ArrowIcon />
                  </a>
                </div>
              </article>
            </div>
          </motion.section>
        </main>

        <footer className="site-footer">
          <p>{new Date().getFullYear()} Mar Kevin P. Alcantara</p>
          <p>Resume, experience, projects, and contact details.</p>
        </footer>

        <AnimatePresence>
          {timelinePreview ? (
            <ModalShell onClose={() => setTimelinePreview(null)}>
              <motion.div
                className="panel image-preview-modal"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.32, ease: revealEase }}
              >
                <div className="image-preview-modal__header">
                  <div>
                    <p className="small-label">{timelinePreview.label}</p>
                    <h3>{timelinePreview.title}</h3>
                  </div>

                  <button type="button" className="icon-button" aria-label="Close image preview" onClick={() => setTimelinePreview(null)}>
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

          {resumeOpen ? (
            <ModalShell onClose={() => setResumeOpen(false)}>
              <motion.div
                className="panel resume-modal"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.32, ease: revealEase }}
              >
                <div className="resume-modal__header">
                  <div>
                    <p className="small-label">Resume preview</p>
                    <h3>Mar Kevin P. Alcantara</h3>
                  </div>

                  <div className="resume-modal__actions">
                    <a className="button button--ghost button--small" href="/assets/resume.pdf" target="_blank" rel="noreferrer">
                      Open in tab
                      <ArrowIcon />
                    </a>
                    <a className="button button--ghost button--small" href="/assets/resume.pdf" download>
                      Download PDF
                      <ArrowIcon />
                    </a>
                    <button type="button" className="icon-button" aria-label="Close resume preview" onClick={() => setResumeOpen(false)}>
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                <iframe className="resume-frame" src="/assets/resume.pdf" title="Mar Kevin Alcantara resume preview" />
              </motion.div>
            </ModalShell>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

function FooterLink({ href, label, value }: ContactItem) {
  const isExternal = href.startsWith("http");

  return (
    <a className="footer-link" href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
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
