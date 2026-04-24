"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import ParticleText from "../components/ParticleText";

type Theme = "light" | "dark";
type TabKey = "projects" | "stack";

type SocialLink = {
  label: string;
  href: string;
  icon: "linkedin" | "github" | "facebook" | "tiktok" | "mail";
};

type Project = {
  tag: string;
  title: string;
  role: string;
  date: string;
  description: string;
  details: string[];
  stack: string[];
  image: string;
  github: string;
  tiktokId?: string;
};

type TechCategory = {
  title: string;
  summary: string;
  items: string[];
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Highlights", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mar-kevin-alcantara-83562326a/",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/Kevs0444",
    icon: "github",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/KevinAlcantara04/",
    icon: "facebook",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kevscode.tech?lang=en",
    icon: "tiktok",
  },
];

const statItems = [
  { value: "3", label: "featured builds" },
  { value: "React + Python", label: "favorite stack lane" },
  { value: "Open", label: "for internship work" },
];

const strengths = [
  {
    title: "Full-stack mindset",
    body: "I enjoy connecting polished interfaces with reliable backend logic so the product feels complete, not pieced together.",
  },
  {
    title: "Practical problem solving",
    body: "My computer engineering background helps me think clearly about data flow, system behavior, and tradeoffs before I start building.",
  },
  {
    title: "Fast learner in teams",
    body: "I adapt quickly, ask direct questions, and like working with feedback loops that make products better over time.",
  },
];

const projects: Project[] = [
  {
    tag: "AI & IoT",
    title: "FOVB-AIoT",
    role: "Lead Developer",
    date: "2025 - Present",
    description:
      "Built a responsive dashboard experience for real-time vital-sign monitoring with a strong focus on usability, live data visibility, and full-stack integration.",
    details: [
      "Developed a React-based interface for monitoring sensor data in a cleaner, clinician-friendly layout.",
      "Connected backend processing for incoming health data streams and visual reporting.",
      "Worked across AI, hardware, and web layers to keep the monitoring workflow coherent.",
    ],
    stack: ["React", "Python", "MySQL", "Arduino", "C++", "TensorFlow"],
    image: "/assets/images/projects/fovb-aiot.jpg",
    github: "https://github.com/kevs0444/4in1-vital-sign",
    tiktokId: "7578127015996427540",
  },
  {
    tag: "IoT & Python",
    title: "Smart Locker System",
    role: "Full Stack Developer",
    date: "2023",
    description:
      "Engineered a secure locker workflow with attention to authentication, device coordination, and a GUI that felt straightforward for end users.",
    details: [
      "Designed the interface and flow for a Python-driven locker management system.",
      "Implemented backend logic around secure access and user verification.",
      "Balanced hardware interaction with a more accessible user experience.",
    ],
    stack: ["Python", "Raspberry Pi", "Linux"],
    image: "/assets/images/projects/smart-locker.jpg",
    github: "https://github.com/kevs0444/locker-system-using-raspi",
    tiktokId: "7506823896822205703",
  },
  {
    tag: "C# & WinForms",
    title: "CureSecure",
    role: "Full Stack Developer",
    date: "2023",
    description:
      "Created a management system centered on secure records, structured CRUD operations, and dependable database-backed workflows.",
    details: [
      "Architected the data handling flow on top of a MySQL-backed system.",
      "Implemented role-aware operations and core management screens.",
      "Focused on stability and maintainable record management for daily use.",
    ],
    stack: ["C#", ".NET", "MySQL"],
    image: "/assets/images/projects/curesecure.jpg",
    github: "https://github.com/kevs0444/CureSecure-Desktop-Application",
    tiktokId: "7361793785661033745",
  },
];

const techCategories: TechCategory[] = [
  {
    title: "Frontend Development",
    summary: "Interfaces that are responsive, structured, and pleasant to use.",
    items: ["HTML", "CSS", "JavaScript", "React.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Backend Development",
    summary: "Application logic, APIs, and services that support real product behavior.",
    items: ["PHP", "Flask", "Python", "Java", "C#"],
  },
  {
    title: "Database",
    summary: "Data models and queries for systems that need reliable persistence.",
    items: ["MySQL", "SQL"],
  },
  {
    title: "AI, ML, and Tools",
    summary: "Broader technical tools used for prototyping, experiments, and deployment-ready work.",
    items: ["TensorFlow", "YOLO", "Git", "GitHub", "Arduino", "Raspberry Pi"],
  },
];

const marqueeItems = [
  "FULL-STACK DEVELOPMENT",
  "AI & ML WORKFLOWS",
  "DATABASE ARCHITECTURE",
  "RESPONSIVE UI",
  "SYSTEMS THINKING",
  "REACT & PYTHON",
  "HARDWARE INTEGRATION",
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");
  const [themeReady, setThemeReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Initial check
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const preferredTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(preferredTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme, themeReady]);

  useEffect(() => {
    document.body.style.overflow =
      mobileMenuOpen || selectedProject !== null || resumeOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, selectedProject, resumeOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSelectedProject(null);
        setResumeOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const portraitSource =
    theme === "dark"
      ? "/assets/images/dark-mode-profile-pic.jpg"
      : "/assets/images/light-mode-profile-pic.jpg";

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="page-shell">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              className="loading-text"
              initial={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
              animate={{ opacity: 1, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            >
              Mar Kevin Alcantara
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="frame header-frame">
          <a className="brand minimal-brand" href="#home">
            <strong>MAR KEVIN ALCANTARA</strong>
            <span>Web Developer</span>
          </a>

          <nav className={`site-nav ${mobileMenuOpen ? "is-open" : ""}`}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-tools">
            <button
              type="button"
              className="theme-pill-button"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <SunIcon />
                  <span>LIGHT</span>
                </>
              ) : (
                <>
                  <MoonIcon />
                  <span>DARK</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="icon-button menu-button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <aside className="social-rail" aria-label="Social links">
        {socialLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
            <SocialIcon type={link.icon} />
          </a>
        ))}
      </aside>

      <main className="content-stack">
        <motion.section className="section hero-section" id="home" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          <motion.div className="frame hero-frame" variants={fadeUp}>
            <span className="frame-badge">Available for web development internships</span>

            <div className="hero-layout">
              <div className="hero-copy">
                <p className="section-kicker">Full-Stack Developer & Computer Engineering Student</p>
                <h1>Architecting scalable systems. Writing maintainable code. Engineered for performance.</h1>
                <p className="lead-copy">
                  I build modern, responsive, and user-centered web experiences while continuing to grow across frontend,
                  backend, and data-driven systems.
                </p>

                <div className="hero-actions">
                  <button type="button" className="primary-button" onClick={() => setResumeOpen(true)}>
                    View Resume
                    <EyeIcon />
                  </button>
                  <a className="secondary-button" href="#projects">
                    Explore Highlights
                    <ArrowUpRightIcon />
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
              </div>

              <div className="hero-side">
                <div className="frame portrait-panel">
                  <div className="portrait-wrap">
                    <Image
                      src={portraitSource}
                      alt="Mar Kevin Alcantara"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="portrait-image"
                    />
                  </div>

                  <div className="signal-card">
                    <span className="signal-dot" />
                    Currently focused on React, Python, SQL, and product-ready frontend work.
                  </div>

                  <div className="chip-row">
                    <span className="chip">Responsive UI</span>
                    <span className="chip">Full-stack logic</span>
                    <span className="chip">React workflows</span>
                    <span className="chip">Intern-ready</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div key={index} className="marquee-item">
                <span className="marquee-star">✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.section className="section" id="about" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          <motion.div className="section-header" variants={fadeUp}>
            <div>
              <p className="section-kicker">About me</p>
              <h2 className="section-title">A developer profile built around systems thinking and clean execution.</h2>
            </div>
            <p className="section-summary">
              I translate technical problem solving into interfaces and product flows that feel more usable, stable, and
              intentional.
            </p>
          </motion.div>

          <div className="section-grid two-column-grid">
            <motion.article className="frame panel-card copy-panel" variants={fadeUp}>
              <p>
                I am a <strong>Computer Engineering student</strong> with a clear focus on <strong>full-stack web development</strong>.
                My background gives me a strong foundation in logic, structured thinking, and the kind of debugging discipline
                that helps software feel dependable.
              </p>
              <p>
                Beyond writing code, I care about <strong>user experience</strong>, maintainable structure, and the small design decisions
                that make products feel more complete. I am actively looking for opportunities where I can contribute, learn from
                experienced developers, and keep improving in real-world team environments.
              </p>
            </motion.article>

            <motion.article className="frame panel-card strengths-panel" variants={fadeUp}>
              <p className="mini-label">Core strengths</p>
              <ul className="feature-list">
                {strengths.map((item) => (
                  <li key={item.title} className="feature-item">
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            </motion.article>
          </div>
        </motion.section>

        <motion.section className="section" id="projects" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          <motion.div className="section-header" variants={fadeUp}>
            <div>
              <p className="section-kicker">Portfolio showcase</p>
              <h2 className="section-title">Selected projects and the stack behind them.</h2>
            </div>
            <p className="section-summary">
              The work below shows how I approach product interfaces, secure workflows, and integrations that go beyond static pages.
            </p>
          </motion.div>

          <motion.div className="frame panel-card tab-panel" variants={fadeUp}>
            <div className="tab-row" role="tablist" aria-label="Project tabs">
              <button
                type="button"
                className={`tab-button ${activeTab === "projects" ? "is-active" : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                Projects
              </button>
              <button
                type="button"
                className={`tab-button ${activeTab === "stack" ? "is-active" : ""}`}
                onClick={() => setActiveTab("stack")}
              >
                Tech Stack
              </button>
            </div>

            {activeTab === "projects" ? (
              <div className="projects-grid">
                {projects.map((project) => (
                  <article key={project.title} className="project-card">
                    <div className="project-media">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="project-image"
                      />
                    </div>

                    <div className="project-body">
                      <div className="meta-row">
                        <span className="project-tag">{project.tag}</span>
                        <span>{project.date}</span>
                      </div>

                      <div>
                        <h3>{project.title}</h3>
                        <p className="role-line">{project.role}</p>
                      </div>

                      <p className="project-copy">{project.description}</p>

                      <div className="chip-row project-chips">
                        {project.stack.map((item) => (
                          <span key={item} className="chip small-chip">
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="card-actions">
                        <button type="button" className="secondary-button card-button" onClick={() => setSelectedProject(project)}>
                          View Details
                        </button>
                        <a className="ghost-button card-button" href={project.github} target="_blank" rel="noreferrer">
                          GitHub
                          <ArrowUpRightIcon />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="tech-grid-layout">
                {techCategories.map((category) => (
                  <article key={category.title} className="frame tech-card">
                    <p className="mini-label">{category.title}</p>
                    <h3>{category.summary}</h3>
                    <div className="chip-row">
                      {category.items.map((item) => (
                        <span key={item} className="chip">
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        </motion.section>

        <motion.section className="section" id="contact" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          <motion.div className="section-header" variants={fadeUp}>
            <div>
              <p className="section-kicker">Get in touch</p>
              <h2 className="section-title">Open to internships, collaborations, and product-focused work.</h2>
            </div>
            <p className="section-summary">
              If you have a project, an internship opportunity, or just want to connect, I would be glad to hear from you.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <ParticleText />
          </motion.div>

          <div className="section-grid contact-grid">
            <motion.aside className="frame panel-card contact-card" variants={fadeUp}>
              <p className="mini-label">Contact channels</p>
              <h3>Let&apos;s build something useful.</h3>
              <p>
                I like projects that value clear communication, strong fundamentals, and thoughtful UI decisions.
              </p>

              <div className="contact-links">
                <a className="contact-link" href="mailto:markevinalcantara40@gmail.com">
                  <MailIcon />
                  <span>markevinalcantara40@gmail.com</span>
                </a>
                <a className="contact-link" href="https://github.com/Kevs0444" target="_blank" rel="noreferrer">
                  <SocialIcon type="github" />
                  <span>github.com/Kevs0444</span>
                </a>
                <a
                  className="contact-link"
                  href="https://www.linkedin.com/in/mar-kevin-alcantara-83562326a/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon type="linkedin" />
                  <span>linkedin.com/in/mar-kevin-alcantara-83562326a</span>
                </a>
              </div>

              <div className="hero-actions compact-actions">
                <button type="button" className="secondary-button" onClick={() => setResumeOpen(true)}>
                  Open Resume
                </button>
                <a className="ghost-button" href="/assets/resume.pdf" download>
                  Download PDF
                </a>
              </div>
            </motion.aside>

            <motion.form action="https://formspree.io/f/mnnjklqp" method="POST" className="frame panel-card contact-form" variants={fadeUp}>
              <div className="field-grid">
                <label className="field">
                  <span>Name</span>
                  <input type="text" name="name" placeholder="Your Name" required />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input type="email" name="email" placeholder="your@email.com" required />
                </label>
              </div>

              <label className="field">
                <span>Message</span>
                <textarea name="message" placeholder="How can I help you?" rows={7} required />
              </label>

              <button type="submit" className="primary-button submit-button">
                Send Message
              </button>
            </motion.form>
          </div>
        </motion.section>
      </main>

      <footer className="site-footer">
        <p>{new Date().getFullYear()} Mar Kevin Alcantara. Rebuilt with Next.js.</p>
        <p>Modern framed UI, responsive layout, and cleaner project presentation.</p>
      </footer>

      {selectedProject ? (
        <ModalShell onClose={() => setSelectedProject(null)}>
          <div className="frame modal-card project-modal-card">
            <button type="button" className="modal-close" aria-label="Close project details" onClick={() => setSelectedProject(null)}>
              <CloseIcon />
            </button>

            <div className="project-modal-layout">
              <div className="modal-media">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="project-image"
                />
              </div>

              <div className="modal-copy">
                <span className="project-tag">{selectedProject.tag}</span>
                <h3>{selectedProject.title}</h3>
                <div className="modal-meta">
                  <span>{selectedProject.role}</span>
                  <span>{selectedProject.date}</span>
                </div>

                <p className="project-copy">{selectedProject.description}</p>

                <ul className="feature-list modal-list">
                  {selectedProject.details.map((detail) => (
                    <li key={detail} className="feature-item compact-feature-item">
                      <p>{detail}</p>
                    </li>
                  ))}
                </ul>

                <div className="chip-row project-chips">
                  {selectedProject.stack.map((item) => (
                    <span key={item} className="chip small-chip">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="card-actions modal-actions">
                  <a className="secondary-button" href={selectedProject.github} target="_blank" rel="noreferrer">
                    View on GitHub
                    <ArrowUpRightIcon />
                  </a>
                  {selectedProject.tiktokId ? (
                    <a
                      className="ghost-button"
                      href={`https://www.tiktok.com/@kevscode.tech/video/${selectedProject.tiktokId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch Project Clip
                      <ArrowUpRightIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {resumeOpen ? (
        <ModalShell onClose={() => setResumeOpen(false)}>
          <div className="frame modal-card resume-modal-card">
            <button type="button" className="modal-close" aria-label="Close resume" onClick={() => setResumeOpen(false)}>
              <CloseIcon />
            </button>

            <div className="resume-header">
              <div>
                <p className="section-kicker">Resume</p>
                <h3>Quick in-page preview</h3>
              </div>

              <div className="resume-actions">
                <a className="secondary-button" href="/assets/resume.pdf" target="_blank" rel="noreferrer">
                  Open in New Tab
                  <ArrowUpRightIcon />
                </a>
                <a className="ghost-button" href="/assets/resume.pdf" download>
                  Download PDF
                </a>
              </div>
            </div>

            <iframe className="resume-frame" src="/assets/resume.pdf" title="Mar Kevin Alcantara Resume" />
            <p className="resume-note">If your browser blocks the preview, use the open or download action above.</p>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-shell" onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
}

function SocialIcon({ type }: { type: SocialLink["icon"] }) {
  switch (type) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.94 8.5V19H3.5V8.5h3.44ZM5.22 3A2 2 0 1 1 5.2 7a2 2 0 0 1 .02-4ZM20.5 12.48V19h-3.42v-6.04c0-1.52-.54-2.55-1.9-2.55-1.03 0-1.64.7-1.9 1.37-.1.24-.12.58-.12.92V19H9.74s.04-9.62 0-10.5h3.42v1.49l-.02.03h.02v-.03c.45-.68 1.25-1.65 3.05-1.65 2.23 0 3.89 1.46 3.89 4.6Z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.47 2 2 6.6 2 12.28c0 4.54 2.87 8.4 6.84 9.76.5.1.66-.22.66-.5v-1.74c-2.78.62-3.36-1.22-3.36-1.22-.42-1.12-1.08-1.42-1.08-1.42-.92-.64.08-.62.08-.62 1 .08 1.54 1.06 1.54 1.06.92 1.62 2.41 1.14 2.99.88.08-.68.34-1.14.66-1.4-2.23-.26-4.58-1.14-4.58-5.14 0-1.14.4-2.06 1.04-2.78-.1-.26-.46-1.32.1-2.74 0 0 .84-.28 2.76 1.06A9.3 9.3 0 0 1 12 6.78c.84 0 1.68.12 2.48.36 1.92-1.34 2.76-1.06 2.76-1.06.56 1.42.2 2.48.1 2.74.64.72 1.04 1.64 1.04 2.78 0 4.02-2.36 4.86-4.62 5.12.36.32.7.94.7 1.92v2.84c0 .28.18.62.68.5A10.34 10.34 0 0 0 22 12.28C22 6.6 17.52 2 12 2Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 21v-7h2.37l.35-2.73H13.5V9.53c0-.79.22-1.33 1.35-1.33h1.45V5.78c-.25-.03-1.1-.1-2.09-.1-2.06 0-3.47 1.28-3.47 3.64v1.95H8.4V14h2.34v7h2.76Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.89 2c.2 1.7 1.16 3.3 2.66 4.26A7.4 7.4 0 0 0 22 7v3.05a10.35 10.35 0 0 1-4.85-1.2v6.2c0 3.45-2.7 6.24-6.05 6.24S5.05 18.5 5.05 15.05c0-3.31 2.5-6 5.67-6.22v3.16a3.02 3.02 0 0 0-2.61 3.06c0 1.7 1.33 3.08 2.98 3.08s2.99-1.38 2.99-3.08V2h2.81Z" />
        </svg>
      );
    case "mail":
      return <MailIcon />;
    default:
      return null;
  }
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5h1v3h-1V2Zm0 17h1v3h-1v-3ZM2 11h3v1H2v-1Zm17 0h3v1h-3v-1ZM4.93 4.22l.7-.7 2.12 2.12-.7.7L4.93 4.22Zm12.02 12.02.7-.7 2.12 2.12-.7.7-2.12-2.12ZM18.36 4.22l-2.12 2.12-.7-.7 2.12-2.12.7.7ZM7.05 16.24l-2.12 2.12-.7-.7 2.12-2.12.7.7Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.6 2.6a1 1 0 0 1 .12 1.1 8.03 8.03 0 0 0-.96 3.82A8.48 8.48 0 0 0 22 15.9a1 1 0 0 1 .7 1.7A10.84 10.84 0 0 1 14.8 21C8.86 21 4 16.08 4 10.02c0-3.26 1.4-6.2 3.64-8.2a1 1 0 0 1 1.6.96 8.85 8.85 0 0 0-.16 1.62c0 4.82 3.78 8.72 8.44 8.72.72 0 1.42-.1 2.1-.28a1 1 0 0 1 .9 1.72A8.48 8.48 0 0 1 13.76 17c-4.1 0-7.44-3.38-7.44-7.54 0-.42.04-.84.1-1.24A8.72 8.72 0 0 0 14.8 19c1.77 0 3.42-.52 4.8-1.4a10.5 10.5 0 0 1-7.84-10.08c0-1.66.38-3.2 1.06-4.56a1 1 0 0 1 1.78-.36Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5c5.5 0 9.5 4.68 10.8 6.45a.95.95 0 0 1 0 1.1C21.5 14.32 17.5 19 12 19S2.5 14.32 1.2 12.55a.95.95 0 0 1 0-1.1C2.5 9.68 6.5 5 12 5Zm0 2C8.15 7 5 10 3.3 12 5 14 8.15 17 12 17s7-3 8.7-5C19 10 15.85 7 12 7Zm0 2.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2Z" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm1.8.16 6.67 5.2a.9.9 0 0 0 1.06 0l6.67-5.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
