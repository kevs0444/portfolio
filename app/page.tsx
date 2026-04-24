import Image from "next/image";
import ParticleText from "../components/ParticleText";

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

type Strength = {
  title: string;
  body: string;
};

type SkillCluster = {
  title: string;
  summary: string;
  items: string[];
};

type FooterLinkItem = {
  label: string;
  href: string;
  value: string;
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

const focusAreas = [
  "Responsive UI systems",
  "Backend + database logic",
  "AI and hardware integration",
  "Clean, readable product execution",
];

const statItems = [
  { value: "03", label: "featured builds" },
  { value: "React + Python", label: "favorite delivery lane" },
  { value: "Open", label: "to internship opportunities" },
];

const workingStyle = [
  "Design-aware frontend decisions",
  "Stable backend and data flow thinking",
  "Fast iteration with direct communication",
];

const strengths: Strength[] = [
  {
    title: "Full-stack mindset",
    body: "I like connecting polished interfaces with dependable backend logic so the final product feels cohesive, not stitched together.",
  },
  {
    title: "Practical systems thinking",
    body: "My computer engineering background helps me think clearly about behavior, data flow, hardware constraints, and tradeoffs before building.",
  },
  {
    title: "Product-focused execution",
    body: "I care about the small details that make software easier to use: hierarchy, flow, feedback, and maintainable implementation.",
  },
];

const projects: Project[] = [
  {
    tag: "AI & IoT",
    title: "FOVB-AIoT",
    role: "Lead Developer",
    date: "2025 - Present",
    description:
      "A real-time monitoring dashboard for vital-sign data, shaped around clearer visibility, cleaner interface decisions, and full-stack coordination.",
    details: [
      "Built a React-based monitoring interface designed for fast reading and better live data visibility.",
      "Connected backend processing for incoming sensor streams and reporting workflows.",
      "Worked across AI, hardware, and web layers to keep the product experience coherent.",
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
      "A secure locker workflow combining device control, authentication logic, and a desktop interface that stayed simple for the user.",
    details: [
      "Designed a straightforward GUI for managing locker access and user actions.",
      "Implemented Python-based logic around secure verification and hardware behavior.",
      "Balanced physical device interaction with a more accessible user-facing flow.",
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
      "A record management system focused on dependable CRUD workflows, secure handling, and a structure that supports day-to-day use.",
    details: [
      "Architected the core data flow on top of a MySQL-backed system.",
      "Implemented role-aware operations and essential management screens.",
      "Focused on stability, clarity, and maintainable record handling.",
    ],
    stack: ["C#", ".NET", "MySQL"],
    image: "/assets/images/projects/curesecure.jpg",
    github: "https://github.com/kevs0444/CureSecure-Desktop-Application",
    tiktokId: "7361793785661033745",
  },
];

const skillClusters: SkillCluster[] = [
  {
    title: "Frontend Development",
    summary: "Responsive interfaces that feel structured, clear, and modern.",
    items: ["HTML", "CSS", "JavaScript", "React.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Backend Development",
    summary: "Application logic and services that support real product behavior.",
    items: ["PHP", "Flask", "Python", "Java", "C#"],
  },
  {
    title: "Database Systems",
    summary: "Reliable persistence and clean data handling for working software.",
    items: ["MySQL", "SQL"],
  },
  {
    title: "AI, Hardware, and Tools",
    summary: "Prototyping, connected systems, and deployment-friendly tooling.",
    items: ["TensorFlow", "YOLO", "Git", "GitHub", "Arduino", "Raspberry Pi"],
  },
];

const socialLinks: FooterLinkItem[] = [
  {
    label: "Email",
    href: "mailto:markevinalcantara40@gmail.com",
    value: "markevinalcantara40@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mar-kevin-alcantara-83562326a/",
    value: "linkedin.com/in/mar-kevin-alcantara-83562326a",
  },
  {
    label: "GitHub",
    href: "https://github.com/Kevs0444",
    value: "github.com/Kevs0444",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kevscode.tech?lang=en",
    value: "@kevscode.tech",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/KevinAlcantara04/",
    value: "facebook.com/KevinAlcantara04",
  },
];

const particleWords = ["MAR KEVIN", "FULL STACK", "LET'S BUILD"];

export default function HomePage() {
  return (
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

          <a className="availability-pill" href="#contact">
            <span className="status-dot" aria-hidden="true" />
            Available today
          </a>
        </div>
      </header>

      <main className="page-content">
        <section className="hero-section" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Full-Stack Developer / Computer Engineering Student</p>
              <h1>Minimal visuals, modern interfaces, and engineering that holds up behind the scenes.</h1>
              <p className="hero-lead">
                I build responsive portfolio sites, product flows, and connected systems with a clean visual language,
                thoughtful UX, and dependable full-stack execution.
              </p>

              <div className="hero-actions">
                <a className="button button--primary" href="#work">
                  Selected work
                  <ArrowIcon />
                </a>
                <a className="button button--ghost" href="/assets/resume.pdf" target="_blank" rel="noreferrer">
                  Resume PDF
                  <ArrowIcon />
                </a>
              </div>

              <div className="hero-tags" aria-label="Focus areas">
                {focusAreas.map((item) => (
                  <span key={item} className="tag-pill">
                    {item}
                  </span>
                ))}
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
              <article className="panel info-card portrait-card">
                <div className="portrait-media">
                  <Image
                    src="/assets/images/dark-mode-profile-pic.jpg"
                    alt="Mar Kevin Alcantara"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 32rem"
                    className="portrait-image"
                  />
                </div>

                <div className="card-copy">
                  <p className="small-label">Current focus</p>
                  <h2>Clean frontend systems with real backend thinking.</h2>
                  <p>
                    Open to internship roles and collaboration-driven builds where product quality and implementation
                    discipline both matter.
                  </p>
                </div>
              </article>

              <article className="panel info-card note-card">
                <p className="small-label">How I work</p>
                <ul className="bullet-list">
                  {workingStyle.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <div className="particle-band">
            <div className="particle-band__header">
              <p className="small-label">Signature motion</p>
              <span>Interactive dot typography inspired by modern editorial portfolios.</span>
            </div>
            <ParticleText words={particleWords} className="hero-particles" height={320} />
          </div>
        </section>

        <section className="section-block" id="about">
          <div className="section-intro">
            <div>
              <p className="eyebrow">About</p>
              <h2>Built around systems thinking, product polish, and a strong full-stack base.</h2>
            </div>
            <p className="section-summary">
              I care about interfaces that feel calm, readable, and intentional, while the logic behind them stays
              maintainable as the project grows.
            </p>
          </div>

          <div className="about-grid">
            <article className="panel narrative-panel">
              <p>
                I am a <strong>Computer Engineering student</strong> focused on <strong>full-stack web development</strong>,
                product-minded interfaces, and software that feels dependable in actual use.
              </p>
              <p>
                Beyond writing code, I pay close attention to hierarchy, usability, and the visual restraint that makes a
                portfolio or product feel more premium. I like work that looks clean, but I care just as much about the
                architecture underneath.
              </p>
            </article>

            <article className="panel strengths-panel">
              <p className="small-label">Core strengths</p>
              <div className="strengths-list">
                {strengths.map((item) => (
                  <article key={item.title} className="strength-item">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section-block" id="work">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2>Projects that mix clean UI decisions with real functionality.</h2>
            </div>
            <a className="inline-link" href="https://github.com/Kevs0444" target="_blank" rel="noreferrer">
              See more on GitHub
              <ArrowIcon />
            </a>
          </div>

          <div className="project-stack">
            {projects.map((project, index) => (
              <article key={project.title} className="project-card">
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
                        <a
                          className="button button--ghost button--small"
                          href={`https://www.tiktok.com/@kevscode.tech/video/${project.tiktokId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Project clip
                          <ArrowIcon />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <a className="project-visual" href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 900px) 100vw, 55vw"
                      className="project-image"
                    />
                    <span className="project-visual__badge">{project.role}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="stack">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Toolbox</p>
              <h2>The stack I use to move from concept to working product.</h2>
            </div>
            <p className="section-summary">
              Frontend, backend, database, and hardware-aware tools that let me build more than static pages.
            </p>
          </div>

          <div className="stack-grid">
            {skillClusters.map((cluster) => (
              <article key={cluster.title} className="panel stack-card">
                <p className="small-label">{cluster.title}</p>
                <h3>{cluster.summary}</h3>
                <div className="chip-row">
                  {cluster.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block contact-block" id="contact">
          <div className="section-intro contact-intro">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Open to internships, collaborations, and modern product work.</h2>
            </div>
            <a className="button button--primary" href="mailto:markevinalcantara40@gmail.com">
              Start a conversation
              <ArrowIcon />
            </a>
          </div>

          <div className="footer-grid">
            <article className="panel footer-panel">
              <p className="small-label">Contact</p>
              <div className="footer-link-list">
                {socialLinks.map((link) => (
                  <FooterLink key={link.label} {...link} />
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
              <h3>Ready for product teams that value clean execution.</h3>
              <p>
                Need a developer who cares about both the UI and the logic behind it? I am available for internship
                opportunities and project collaborations.
              </p>
              <div className="footer-actions">
                <a className="button button--ghost button--small" href="/assets/resume.pdf" target="_blank" rel="noreferrer">
                  Open resume
                  <ArrowIcon />
                </a>
                <a className="button button--ghost button--small" href="/assets/resume.pdf" download>
                  Download PDF
                  <ArrowIcon />
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{new Date().getFullYear()} Mar Kevin Alcantara</p>
        <p>Rebuilt with Next.js in a darker editorial style.</p>
      </footer>
    </div>
  );
}

function FooterLink({ href, label, value }: FooterLinkItem) {
  const isExternal = href.startsWith("http");

  return (
    <a className="footer-link" href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
      <span>{label}</span>
      <span>{value}</span>
      <ArrowIcon />
    </a>
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
