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
import ParticleText from "../components/ParticleText";

type Theme = "light" | "dark";

type Project = {
  tag: string;
  title: string;
  role: string;
  date: string;
  description: string;
  details: string[];
  stack: string[];
  github: string;
  image?: string;
  tiktokId?: string;
  tone: "emerald" | "violet" | "amber" | "blue";
  visualLabel: string;
};

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

type Snapshot = {
  label: string;
  title: string;
  meta: string;
  body: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type ClipPreview = {
  title: string;
  tiktokId: string;
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Assistant", href: "#assistant" },
  { label: "Contact", href: "#contact" },
];

const identityItems = [
  "Full-Stack Developer",
  "Lead AI Developer",
  "Systems Thinker",
  "Computer Engineering Student",
  "Problem Solver",
];

const signatureTraits = ["Problem Solver", "Detail Focused", "Fast Learner", "Team Ready"];

const particleWords = [
  "MAR KEVIN",
  "FULL STACK",
  "AI BUILDER",
  "SYSTEMS THINKER",
  ...signatureTraits.map((item) => item.toUpperCase()),
];

const statItems = [
  { value: "04", label: "featured projects" },
  { value: "BSCpE", label: "Rizal Technological University" },
  { value: "Open", label: "to internship roles" },
];

const projects: Project[] = [
  {
    tag: "AI + Healthcare",
    title: "FOVB-AIoT",
    role: "Lead AI Developer",
    date: "Aug 2025 - Mar 2026",
    description:
      "A smart health kiosk that combines Arduino IoT sensors, computer vision, and a React plus Python dashboard for live patient data visualization.",
    details: [
      "Built a multi-AI risk scoring workflow using XGBoost, validated by Gemini 2.0 Flash and Groq APIs to reduce hallucination risk.",
      "Developed a scalable web dashboard in React.js with a Python REST API and dynamic MySQL configuration.",
      "Integrated sensor capture, BMI calculation, and real-time monitoring into one connected health experience.",
    ],
    stack: ["React", "Python", "REST API", "MySQL", "TensorFlow", "YOLO", "Arduino"],
    github: "https://github.com/kevs0444/4in1-vital-sign",
    image: "/assets/images/projects/fovb-aiot.jpg",
    tiktokId: "7578127015996427540",
    tone: "emerald",
    visualLabel: "AI monitoring dashboard",
  },
  {
    tag: "Automation + Retail",
    title: "Smart AI Kilo Bot",
    role: "Web Developer",
    date: "Nov 2025 - Dec 2025",
    description:
      "An intelligent weighing and pricing system with a real-time dashboard that speeds up transactions in busy marketplace environments.",
    details: [
      "Built the live frontend interface for instant weight and pricing visualization.",
      "Connected Arduino load-cell sensors to a Python backend for low-latency hardware-to-software synchronization.",
      "Focused on accurate pricing computation and clear on-screen feedback during transactions.",
    ],
    stack: ["Python", "Arduino", "IoT", "Web Dashboard", "Realtime Data"],
    github: "https://github.com/Kevs0444",
    tone: "amber",
    visualLabel: "IoT weighing interface",
  },
  {
    tag: "Security + IoT",
    title: "Smart Locker System",
    role: "Project Manager & Software Developer",
    date: "Apr 2025 - May 2025",
    description:
      "A secure smart locker prototype delivered on a tight two-month timeline, combining hardware integration, PIN authentication, and a custom control interface.",
    details: [
      "Directed the project lifecycle from requirements and procurement to software integration.",
      "Developed a Python-based application with a custom GUI for secure PIN authentication.",
      "Programmed backend logic for Raspberry Pi powered electronic locks and workflow automation.",
    ],
    stack: ["Python", "Raspberry Pi", "GUI", "PIN Authentication", "Linux"],
    github: "https://github.com/kevs0444/locker-system-using-raspi",
    image: "/assets/images/projects/smart-locker.jpg",
    tiktokId: "7506823896822205703",
    tone: "blue",
    visualLabel: "Secure locker system",
  },
  {
    tag: "Desktop + POS",
    title: "CureSecure",
    role: "Lead Programmer",
    date: "Jan 2023 - Apr 2023",
    description:
      "A pharmacy POS and inventory system built in C# WinForms with real-time MySQL inventory tracking, automated restock alerts, and secure role-based access.",
    details: [
      "Architected the desktop application to improve transaction speed and operational accuracy.",
      "Engineered a real-time MySQL inventory system with automated restock alerts.",
      "Implemented RBAC to protect staff data and secure operational workflows.",
    ],
    stack: ["C#", "WinForms", "MySQL", "RBAC", "Desktop App"],
    github: "https://github.com/kevs0444/CureSecure-Desktop-Application",
    image: "/assets/images/projects/curesecure.jpg",
    tiktokId: "7361793785661033745",
    tone: "violet",
    visualLabel: "Pharmacy POS system",
  },
];

const experienceSnapshots: Snapshot[] = [
  {
    label: "Experience",
    title: "Software Developer Intern",
    meta: "Denso Ten Solutions Philippines / Feb 2026 - Apr 2026",
    body: "Built automation tools, local web applications, and internal dashboards that reduced manual work and accelerated engineering workflows.",
  },
  {
    label: "Education",
    title: "Bachelor of Science in Computer Engineering",
    meta: "Rizal Technological University / Aug 2022 - Present",
    body: "Currently building a stronger foundation across software engineering, embedded systems, AI workflows, and product-oriented problem solving.",
  },
  {
    label: "Location",
    title: "Taguig City, Metro Manila",
    meta: "Philippines",
    body: "Available for internship opportunities, collaboration, and product-focused software work.",
  },
];

const skillClusters: SkillCluster[] = [
  {
    title: "Frontend",
    summary: "Interfaces that stay readable, responsive, and design-aware.",
    items: ["HTML", "CSS", "JavaScript", "React.js", "Bootstrap", "Tailwind CSS"],
  },
  {
    title: "Backend",
    summary: "Application logic, APIs, automation, and connected services.",
    items: ["Flask", "PHP", "REST API", "Node.js", "Python", "Electron"],
  },
  {
    title: "AI + ML",
    summary: "Model-driven workflows built for practical use cases.",
    items: ["TensorFlow", "Deep Learning", "XGBoost", "YOLO", "OpenCV"],
  },
  {
    title: "Data + DevOps",
    summary: "Storage, tooling, deployment, and systems support.",
    items: ["MySQL", "SQL", "SQLite", "Linux", "Git", "GitHub", "Docker", "Vercel"],
  },
  {
    title: "IoT",
    summary: "Hardware-aware development tied to web and software interfaces.",
    items: ["Arduino", "Raspberry Pi", "ESP32"],
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
  "What projects has Mar Kevin built?",
  "Tell me about his internship experience.",
  "What technical skills does he have?",
  "Is he open to internship opportunities?",
];

const revealEase = [0.16, 1, 0.3, 1] as const;
const introEase = [0.76, 0, 0.24, 1] as const;
const lineEase = [0.22, 1, 0.36, 1] as const;

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I am BOP AI. I can help you get to know Mar Kevin better. Ask me about his projects, experience, skills, education, or how to reach him.",
};

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [theme, setTheme] = useState<Theme>("dark");
  const [introVisible, setIntroVisible] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [clipPreview, setClipPreview] = useState<ClipPreview | null>(null);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [identityIndex, setIdentityIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [chatLoading, setChatLoading] = useState(false);
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
  const particleShift = useTransform(smoothProgress, [0, 0.4], [0, prefersReducedMotion ? 0 : -54]);
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
    document.body.style.overflow = introVisible || resumeOpen || clipPreview !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [clipPreview, introVisible, resumeOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResumeOpen(false);
        setClipPreview(null);
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
        throw new Error(data.error || "BOP AI is unavailable right now.");
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
              : "BOP AI is unavailable right now.",
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
              <p className="intro-screen__eyebrow">Entering portfolio</p>
              <div className="intro-screen__name">
                <span>Mar Kevin</span>
                <span>Alcantara</span>
              </div>
              <p className="intro-screen__copy">Full-stack development, AI systems, and modern product interfaces.</p>
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
              <small>Design-led full-stack developer</small>
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
          </div>
        </header>

        <main className="page-content">
          <motion.section className="hero-section" id="home" style={{ y: heroShift }}>
            <div className="hero-grid">
              <motion.div className="hero-copy" {...reveal}>
                <p className="eyebrow">Software Developer / AI Builder / Computer Engineering Student</p>

                <div className="hero-name" aria-label="Mar Kevin Alcantara">
                  <span>Mar Kevin</span>
                  <span>Alcantara</span>
                </div>

                <div className="identity-band">
                  <span className="small-label">Currently moving as</span>
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
                  I build modern interfaces, connected systems, and full-stack products that balance clean visual design
                  with reliable implementation. My work spans web apps, automation, AI-assisted workflows, and IoT.
                </p>

                <div className="hero-actions">
                  <button type="button" className="button button--primary" onClick={() => setResumeOpen(true)}>
                    Preview resume
                    <ArrowIcon />
                  </button>
                  <a className="button button--ghost" href="#assistant">
                    Ask BOP AI
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
                    <p className="small-label">Current focus</p>
                    <h2>Modern product interfaces with strong backend thinking.</h2>
                    <p>
                      Open to internship opportunities and collaboration with teams that care about both product polish
                      and implementation quality.
                    </p>
                  </div>
                </article>
              </motion.div>
            </div>

            <motion.div className="particle-band" style={{ y: particleShift }} {...reveal}>
              <ParticleText words={particleWords} className="hero-particles" height="clamp(220px, 30vw, 340px)" />
            </motion.div>
          </motion.section>

          <motion.section className="section-block" id="about" {...reveal}>
            <div className="section-intro">
              <div>
                <p className="eyebrow">About</p>
                <h2>If you are getting to know me, this is the best place to start.</h2>
              </div>
              <p className="section-summary">
                You will find the kind of work I enjoy, the way I approach problems, and the experience I am building as
                I grow into full-stack and AI-focused product development.
              </p>
            </div>

            <div className="about-grid">
              <article className="panel narrative-panel">
                <p>
                  I am a <strong>Bachelor of Science in Computer Engineering</strong> student at <strong>Rizal
                  Technological University</strong>, building a career around full-stack development, automation, AI, and
                  connected systems.
                </p>
                <p>
                  My work ranges from desktop applications and local dashboards to AI-driven health monitoring and IoT
                  products. I like projects that demand both clean engineering and thoughtful user experience.
                </p>
              </article>

              <div className="snapshot-grid">
                {experienceSnapshots.map((item) => (
                  <article key={item.title} className="panel snapshot-card">
                    <p className="small-label">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p className="snapshot-meta">{item.meta}</p>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section className="section-block" id="projects" {...reveal}>
            <div className="section-intro">
              <div>
                <p className="eyebrow">Selected projects</p>
                <h2>Software and systems I have already shipped or prototyped.</h2>
              </div>
              <a className="inline-link" href="https://github.com/Kevs0444" target="_blank" rel="noreferrer">
                See more on GitHub
                <ArrowIcon />
              </a>
            </div>

            <div className="project-stack">
              {projects.map((project, index) => (
                <motion.article key={project.title} className="project-card panel" {...reveal}>
                  <div className="project-grid">
                    <div className="project-copy">
                      <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                      <p className="project-meta">
                        {project.tag} / {project.date}
                      </p>
                      <h3>{project.title}</h3>
                      <p className="project-role">{project.role}</p>
                      <p className="project-description">{project.description}</p>

                      <ul className="detail-list">
                        {project.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>

                      <div className="chip-row">
                        {project.stack.map((item) => (
                          <span key={item} className="chip">
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="project-links">
                        <a className="button button--ghost button--small" href={project.github} target="_blank" rel="noreferrer">
                          GitHub
                          <ArrowIcon />
                        </a>
                        {project.tiktokId ? (
                          <button
                            type="button"
                            className="button button--ghost button--small"
                            onClick={() =>
                              setClipPreview({
                                title: project.title,
                                tiktokId: project.tiktokId!,
                              })
                            }
                          >
                            Project clip
                            <ArrowIcon />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <a
                      className="project-visual"
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      data-tone={project.tone}
                      aria-label={`Open ${project.title} on GitHub`}
                    >
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 980px) 100vw, 52vw"
                          className="project-image"
                        />
                      ) : (
                        <div className="project-placeholder">
                          <strong>{project.title}</strong>
                          <span>{project.visualLabel}</span>
                        </div>
                      )}

                      <span className="project-visual__badge">{project.visualLabel}</span>
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section className="section-block" id="stack" {...reveal}>
            <div className="section-intro">
              <div>
                <p className="eyebrow">Stack</p>
                <h2>What are my skills? Explore them as you scroll.</h2>
              </div>
              <p className="section-summary">
                Click a category or scroll through the section. Each group opens up the tools I use across frontend,
                backend, AI, databases, deployment, and IoT.
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
                <p className="eyebrow">Ask BOP AI</p>
                <h2>Want to know more about me? Ask BOP AI.</h2>
              </div>
              <p className="section-summary">
                If you are curious about my work, background, skills, or projects, you can chat here and get quick
                answers right away.
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
                      <span className="chat-bubble__label">{message.role === "assistant" ? "BOP AI" : "You"}</span>
                      <p>{message.content}</p>
                    </div>
                  ))}

                  {chatLoading ? (
                    <div className="chat-bubble is-assistant is-loading">
                      <span className="chat-bubble__label">BOP AI</span>
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
                      placeholder="Ask about projects, internship experience, technical skills, or availability..."
                      rows={4}
                    />
                  </label>
                  <button type="submit" className="button button--primary" disabled={chatLoading}>
                    Ask BOP AI
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
                <h2>Ready for teams that value clean execution and product-minded engineering.</h2>
              </div>
              <button type="button" className="button button--primary" onClick={() => setResumeOpen(true)}>
                Preview resume
                <ArrowIcon />
              </button>
            </div>

            <div className="footer-grid">
              <article className="panel footer-panel">
                <p className="small-label">Contact</p>
                <div className="footer-link-list">
                  {contactItems.map((item) => (
                    <FooterLink key={item.label} {...item} />
                  ))}
                </div>
              </article>

              <article className="panel footer-panel">
                <p className="small-label">Navigation</p>
                <div className="footer-link-list">
                  <a className="footer-link" href="#home">
                    <span>Home</span>
                    <span>Back to top</span>
                    <ArrowIcon />
                  </a>
                  {navItems.map((item) => (
                    <a key={item.href} className="footer-link" href={item.href}>
                      <span>{item.label}</span>
                      <span>Jump to section</span>
                      <ArrowIcon />
                    </a>
                  ))}
                </div>
              </article>

              <article className="panel footer-panel footer-panel--accent">
                <p className="small-label">Resume</p>
                <h3>See my background without leaving the page.</h3>
                <p>
                  The resume preview opens inside the portfolio so visitors can stay in the experience while checking my
                  education, projects, and internship background.
                </p>
                <div className="footer-actions">
                  <button type="button" className="button button--ghost button--small" onClick={() => setResumeOpen(true)}>
                    Open preview
                    <ArrowIcon />
                  </button>
                  <a className="button button--ghost button--small" href="/assets/resume.pdf" download>
                    Download PDF
                    <ArrowIcon />
                  </a>
                </div>
              </article>
            </div>
          </motion.section>
        </main>

        <footer className="site-footer">
          <p>{new Date().getFullYear()} Mar Kevin P. Alcantara</p>
          <p>Next.js portfolio with light mode, motion, resume preview, and BOP AI assistant.</p>
        </footer>

        <AnimatePresence>
          {clipPreview ? (
            <ModalShell onClose={() => setClipPreview(null)}>
              <motion.div
                className="panel preview-modal"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.32, ease: revealEase }}
              >
                <div className="preview-modal__header">
                  <div>
                    <p className="small-label">Project clip</p>
                    <h3>{clipPreview.title}</h3>
                  </div>

                  <div className="preview-modal__actions">
                    <a
                      className="button button--ghost button--small"
                      href={`https://www.tiktok.com/@kevscode.tech/video/${clipPreview.tiktokId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in TikTok
                      <ArrowIcon />
                    </a>
                    <button type="button" className="icon-button" aria-label="Close project clip preview" onClick={() => setClipPreview(null)}>
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                <iframe
                  className="clip-frame"
                  src={`https://www.tiktok.com/embed/v2/${clipPreview.tiktokId}`}
                  title={`${clipPreview.title} project clip preview`}
                  allow="fullscreen"
                  allowFullScreen
                />
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
