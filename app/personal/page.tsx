"use client";

import Image from "next/image";
import Link from "next/link";
import { useOverlayFocus } from "../useOverlayFocus";
import { usePortfolioTheme } from "../usePortfolioTheme";
import { useEffect, useMemo, useRef, useState } from "react";

type Theme = "light" | "dark";

const practiceText =
  "Clean data creates clear decisions. Accuracy comes first, then speed, automation, and useful insight.";

const learningTracks = [
  {
    index: "01",
    name: "SQL",
    title: "Query practice",
    summary: "Working through joins, CTEs, window functions, aggregations, and validation checks using business-style questions.",
    topics: ["Joins", "CTEs", "Window functions", "Validation"],
  },
  {
    index: "02",
    name: "Python",
    title: "Data workflow practice",
    summary: "Strengthening data cleaning, transformation, small automations, and readable analysis with repeatable exercises.",
    topics: ["Pandas", "Cleaning", "Automation", "Jupyter"],
  },
  {
    index: "03",
    name: "Excel",
    title: "Reporting practice",
    summary: "Reinforcing formulas, lookups, pivots, error checks, and concise KPI reporting for day-to-day analytics work.",
    topics: ["XLOOKUP", "Pivot tables", "Formulas", "KPI reports"],
  },
];

const gear = [
  {
    category: "Primary workstation",
    name: "ASUS TUF Gaming A15",
    model: "FA5061C",
    variant: "Graphite Black",
    image: "/assets/images/gear/asus-tuf-a15-fa506ic.jpg",
    imageAlt: "ASUS TUF Gaming A15 FA5061C laptop in graphite black",
    purpose: "My main machine for Python, SQL, Power BI, automation development, and portfolio work.",
  },
  {
    category: "Daily keyboard",
    name: "AULA F75",
    model: "75% tri-mode mechanical keyboard",
    variant: "Yellow accent variant",
    image: "/assets/images/gear/aula-f75-yellow.png",
    imageAlt: "AULA F75 mechanical keyboard with black case and yellow accent keycaps",
    purpose: "A compact typing setup for analysis, coding, documentation, and the speed test below.",
  },
  {
    category: "Main display",
    name: "AOC 27B36XE",
    model: "27-inch FHD · 144 Hz",
    variant: "Black",
    image: "/assets/images/gear/aoc-27b36xe.jpg",
    imageAlt: "AOC 27B36XE 27-inch monitor",
    purpose: "Used for dashboard review, multi-window analysis, documentation, and responsive visual QA.",
  },
  {
    category: "Mobile",
    name: "iPhone 17 Pro Max",
    model: "6.9-inch Pro model",
    variant: "Silver / white",
    image: "/assets/images/gear/iphone-17-pro-max-silver.png",
    imageAlt: "Apple iPhone 17 Pro Max in the light silver finish",
    purpose: "For communication, quick report checks, mobile testing, content capture, and coordination.",
  },
];

export default function PersonalPage() {
  const [theme, setTheme] = usePortfolioTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useOverlayFocus(mobileMenuOpen, ".mobile-drawer__panel", () => setMobileMenuOpen(false));
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [testActive, setTestActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const typingInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSoundEnabled(window.localStorage.getItem("portfolio-ui-sound") !== "muted");
  }, []);


  useEffect(() => {
    window.localStorage.setItem("portfolio-ui-sound", soundEnabled ? "enabled" : "muted");

    if (!soundEnabled) {
      void audioContextRef.current?.suspend();
      return;
    }

    const playClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (!target) return;

      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;
      const play = () => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(250, now);
        oscillator.frequency.exponentialRampToValueAtTime(190, now + 0.055);
        gain.gain.setValueAtTime(0.026, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.085);
      };

      if (context.state === "suspended") {
        void context.resume().then(play).catch(() => undefined);
      } else {
        play();
      }
    };

    document.addEventListener("click", playClick);
    return () => document.removeEventListener("click", playClick);
  }, [soundEnabled]);

  useEffect(() => {
    if (!testActive) return;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setTestActive(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [testActive]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const correctCharacters = useMemo(
    () => typed.split("").filter((character, index) => character === practiceText[index]).length,
    [typed],
  );
  const elapsedSeconds = Math.max(0, 60 - timeLeft);
  const wordsPerMinute = elapsedSeconds
    ? Math.round(correctCharacters / 5 / (elapsedSeconds / 60))
    : 0;
  const accuracy = typed.length ? Math.round((correctCharacters / typed.length) * 100) : 100;

  function startTest() {
    setTyped("");
    setTimeLeft(60);
    setTestActive(true);
    window.setTimeout(() => typingInputRef.current?.focus(), 0);
  }

  function handleTyping(value: string) {
    const nextValue = value.slice(0, practiceText.length);
    setTyped(nextValue);
    if (nextValue.length === practiceText.length) {
      setTestActive(false);
    }
  }

  const logoSource =
    theme === "light"
      ? "/assets/images/mka-logo-minimal-light.svg"
      : "/assets/images/mka-logo-minimal-dark.svg";

  return (
    <div className="site-shell personal-shell">
      <div className="dashboard-grid-bg" aria-hidden="true" />

      <aside className="site-sidebar personal-sidebar">
        <div className="sidebar-header">
          <Link href="/" aria-label="Back to Mar Kevin Alcantara portfolio">
            <Image
              className="portfolio-logo portfolio-logo--sidebar"
              src={logoSource}
              alt="MKA"
              width={184}
              height={52}
              priority
            />
          </Link>
          <p>Personal Space</p>
        </div>

        <p className="sidebar-section-label">Portfolio</p>
        <div className="sidebar-nav-group">
          <Link className="sidebar-link" href="/">
            <span className="sidebar-icon"><HomeIcon /></span>
            Main portfolio
          </Link>
          <Link className="sidebar-link" href="/#projects">
            <span className="sidebar-icon"><FolderIcon /></span>
            All projects
          </Link>
        </div>

        <div className="sidebar-divider" />

        <p className="sidebar-section-label">Personal Space</p>
        <div className="sidebar-nav-group">
          <a className="sidebar-link" href="#learning">
            <span className="sidebar-icon"><LearningIcon /></span>
            Practice lab
          </a>
          <a className="sidebar-link" href="#speed-test">
            <span className="sidebar-icon"><KeyboardIcon /></span>
            Speed test
          </a>
          <a className="sidebar-link" href="#gear">
            <span className="sidebar-icon"><MonitorIcon /></span>
            Gear showcase
          </a>
          <a className="sidebar-link" href="#content">
            <span className="sidebar-icon"><PlayIcon /></span>
            Content
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
          <p className="sidebar-footer-title">Professional profile</p>
          <Link className="sidebar-email" href="/">Return to main portfolio</Link>
        </div>
      </aside>

      <div className="main-area">
        <header className="site-header personal-mobile-header">
          <div className="site-header__bar">
            <Link className="brand-mark" href="/">
              <Image
                className="portfolio-logo portfolio-logo--header"
                src={logoSource}
                alt="MKA — Mar Kevin Alcantara"
                width={184}
                height={52}
                priority
              />
            </Link>
            <div className="personal-mobile-controls">
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
                title={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
                onClick={() => setSoundEnabled((current) => !current)}
              >
                <SoundIcon enabled={soundEnabled} />
              </button>
              <button
                type="button"
                className={`burger-toggle ${mobileMenuOpen ? "is-open" : ""}`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </header>

        {mobileMenuOpen ? (
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Personal page navigation" onClick={() => setMobileMenuOpen(false)}>
            <nav className="mobile-drawer__panel" id="mobile-navigation" aria-label="Personal page navigation" onClick={(event) => event.stopPropagation()}>
              <div className="mobile-drawer__header">
                <span className="small-label">Personal Space</span>
                <button className="icon-button" type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="mobile-drawer__links">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>Main portfolio</Link>
                <a href="#learning" onClick={() => setMobileMenuOpen(false)}>Practice lab</a>
                <a href="#speed-test" onClick={() => setMobileMenuOpen(false)}>Speed test</a>
                <a href="#gear" onClick={() => setMobileMenuOpen(false)}>Gear showcase</a>
                <a href="#content" onClick={() => setMobileMenuOpen(false)}>Content</a>
              </div>
            </nav>
          </div>
        ) : null}

        <main id="main-content" tabIndex={-1} className="page-content personal-page-content">
          <section className="personal-hero" id="personal-top">
            <div className="personal-hero__copy">
              <div className="dashboard-pill">
                <span className="status-indicator live" />
                <span>PERSONAL SPACE // BUILDING IN PUBLIC</span>
              </div>
              <h1>Off the clock,<br />still building.</h1>
              <p>
                A separate corner for the tools I use, the skills I am actively practicing, quick typing sessions, and the content I share outside the professional case studies.
              </p>
              <div className="personal-hero__actions">
                <a className="primary-button" href="#learning">See what I&apos;m practicing <ArrowIcon /></a>
                <Link className="secondary-button" href="/">Back to portfolio</Link>
              </div>
            </div>
            <div className="personal-signal-grid" aria-label="Personal space summary">
              <div className="personal-signal-card"><span>Practice tracks</span><strong>03</strong><small>SQL · Python · Excel</small></div>
              <div className="personal-signal-card"><span>Typing challenge</span><strong>60s</strong><small>WPM + accuracy</small></div>
              <div className="personal-signal-card personal-signal-card--wide"><span>Mindset</span><strong>Practice → Build → Share</strong><small>Small, consistent improvements outside formal work.</small></div>
            </div>
          </section>

          <section className="personal-section" id="learning">
            <div className="section-intro">
              <div>
                <div className="dashboard-pill"><span>LEARNING // ACTIVE PRACTICE</span></div>
                <h2>Keeping the fundamentals sharp.</h2>
              </div>
              <p className="section-summary">These are active practice areas—not finished credentials or inflated progress bars. The focus is consistent, practical repetition.</p>
            </div>
            <div className="learning-track-grid">
              {learningTracks.map((track) => (
                <article className="panel learning-track-card" key={track.name}>
                  <div className="learning-track-card__top">
                    <span>{track.index}</span>
                    <span className="learning-status"><i /> Practicing</span>
                  </div>
                  <p className="small-label">{track.name}</p>
                  <h3>{track.title}</h3>
                  <p>{track.summary}</p>
                  <div className="chip-row">
                    {track.topics.map((topic) => <span className="chip" key={topic}>{topic}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="personal-section" id="speed-test">
            <div className="section-intro">
              <div>
                <div className="dashboard-pill"><span>PRACTICE // KEYBOARD SPEED TEST</span></div>
                <h2>One minute. Accuracy first.</h2>
              </div>
              <p className="section-summary">A small personal build for measuring typing rhythm on the AULA F75. Start the timer, copy the text, and try again.</p>
            </div>
            <div className="typing-test panel">
              <div className="typing-stats" aria-live="polite">
                <div><span>Time</span><strong>{timeLeft}<small>s</small></strong></div>
                <div><span>Speed</span><strong>{wordsPerMinute}<small>wpm</small></strong></div>
                <div><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div>
              </div>
              <div className="typing-copy" aria-label={practiceText}>
                {practiceText.split("").map((character, index) => {
                  const state = index >= typed.length ? "" : typed[index] === character ? "is-correct" : "is-wrong";
                  return <span className={state} key={`${character}-${index}`}>{character}</span>;
                })}
              </div>
              <label className="typing-input-label" htmlFor="typing-input">Type the text here</label>
              <textarea
                id="typing-input"
                ref={typingInputRef}
                value={typed}
                rows={3}
                disabled={!testActive}
                placeholder={testActive ? "Start typing…" : "Press start when you are ready."}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                onPaste={(event) => event.preventDefault()}
                onChange={(event) => handleTyping(event.target.value)}
              />
              <div className="typing-actions">
                <button type="button" className="primary-button" onClick={startTest}>
                  {typed || timeLeft < 60 ? "Restart test" : "Start test"} <ArrowIcon />
                </button>
                <span>{typed.length}/{practiceText.length} characters</span>
              </div>
            </div>
          </section>

          <section className="personal-section" id="gear">
            <div className="section-intro">
              <div>
                <div className="dashboard-pill"><span>GEAR // DAILY SETUP</span></div>
                <h2>The tools behind the work.</h2>
              </div>
              <p className="section-summary">Kept off the main portfolio and shown here with product imagery, including my yellow-accent AULA F75 and light silver iPhone.</p>
            </div>
            <div className="gear-showcase-grid">
              {gear.map((item) => (
                <article className="panel gear-showcase-card" key={item.name}>
                  <div className="gear-showcase-card__media">
                    <Image className="gear-product-image" src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 440px" />
                  </div>
                  <div className="gear-showcase-card__copy">
                    <div className="gear-showcase-card__meta"><span>{item.category}</span><span>{item.variant}</span></div>
                    <h3>{item.name}</h3>
                    <strong>{item.model}</strong>
                    <p>{item.purpose}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="personal-section" id="content">
            <div className="section-intro">
              <div>
                <div className="dashboard-pill"><span>CONTENT // SOCIAL</span></div>
                <h2>Projects, progress, and everyday updates.</h2>
              </div>
              <p className="section-summary">A small content shelf for demos and personal updates, separate from recruiter-focused contact links.</p>
            </div>
            <div className="content-link-grid">
              <a className="panel content-link-card" href="https://lnkd.in/gfP-CVvw" target="_blank" rel="noreferrer">
                <span className="content-platform-icon"><TikTokIcon /></span>
                <div><span className="small-label">TikTok</span><h3>Project demos</h3><p>Watch the FOVB-AIoT project demo and short-form build content.</p></div>
                <ArrowIcon />
              </a>
              <a className="panel content-link-card" href="https://www.facebook.com/KevinAlcantara04/" target="_blank" rel="noreferrer">
                <span className="content-platform-icon"><FacebookIcon /></span>
                <div><span className="small-label">Facebook</span><h3>Personal updates</h3><p>Follow personal posts, milestones, and updates outside the portfolio.</p></div>
                <ArrowIcon />
              </a>
            </div>
          </section>

          <footer className="personal-footer">
            <span>© 2026 Mar Kevin Alcantara</span>
            <Link href="/">Professional portfolio <ArrowIcon /></Link>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10H5V10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

function FolderIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h7l2 2h9v11H3V6Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function LearningIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 7 9-4 9 4-9 4-9-4Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><path d="M7 9v5c3 2 7 2 10 0V9" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

function KeyboardIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M5 10h.01M9 10h.01M13 10h.01M17 10h2M5 14h2M9 14h6M17 14h2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>;
}

function MonitorIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 21h8M12 17v4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m10 9 5 3-5 3V9Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v10.2a4.2 4.2 0 1 1-3.2-4.1M14 4c.6 2.7 2.1 4.1 5 4.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-3H14V8.2c0-.9.3-1.7 1.8-1.7H18V3.8c-.6-.1-1.5-.2-2.6-.2-2.7 0-4.4 1.6-4.4 4.6V10H8v3h3v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function SoundIcon({ enabled }: { enabled: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />{enabled ? <path d="M17 9c1.3 1.4 1.3 4.6 0 6m2-8c2.4 2.6 2.4 7.4 0 10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /> : <path d="m17 9 4 6m0-6-4 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />}</svg>;
}

function ThemeIcon({ mode }: { mode: Theme }) {
  if (mode === "dark") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 15.2A8 8 0 0 1 8.8 4.5 8 8 0 1 0 19.5 15.2Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
}
