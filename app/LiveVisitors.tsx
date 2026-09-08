"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Presence = { count: number; visitors: { name: string; you: boolean }[] };

const PresenceContext = createContext<{ presence: Presence | null; unavailable: boolean }>({ presence: null, unavailable: false });

export function VisitorPresenceProvider({ children }: { children: ReactNode }) {
  const [presence, setPresence] = useState<Presence | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let stopped = false;
    let busy = false;
    const controller = new AbortController();
    async function update() {
      if (document.hidden || busy || stopped) return;
      busy = true;
      try {
        const response = await fetch("/api/presence", { method: "POST", signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Unavailable");
        const data: Presence = await response.json();
        if (!stopped) { setPresence(data); setUnavailable(false); }
      } catch {
        if (!stopped) { setPresence(null); setUnavailable(true); }
      } finally { busy = false; }
    }
    function visibility() {
      if (!document.hidden) void update();
    }
    void update();
    const timer = window.setInterval(update, 20000);
    document.addEventListener("visibilitychange", visibility);
    return () => { stopped = true; controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  return <PresenceContext.Provider value={{ presence, unavailable }}>{children}</PresenceContext.Provider>;
}

export default function LiveVisitors({ sidebar = false }: { sidebar?: boolean }) {
  const { presence, unavailable } = useContext(PresenceContext);
  const pathname = usePathname();
  const label = presence ? `${presence.count} online` : unavailable ? "Status unavailable" : "Connecting…";
  return (
    <details className={`live-visitors${sidebar ? " live-visitors--sidebar" : pathname === "/" ? " live-visitors--home-floating" : ""}`}>
      <summary aria-label={label} title={label}><span className={`live-visitors__dot${presence ? " is-connected" : ""}`} aria-hidden="true" /><span className="live-visitors__compact" aria-hidden="true">{presence ? presence.count : "—"}</span><span className="live-visitors__label">{label}</span></summary>
      <div className="live-visitors__body">
        <p>Active in the last minute · includes you.</p>
        {presence ? <ul>{presence.visitors.map((visitor) => <li key={visitor.name}>{visitor.name}{visitor.you ? " (you)" : ""}</li>)}</ul> : <p>Live visitor information is currently unavailable.</p>}
        {presence && presence.count > presence.visitors.length && <p>And {presence.count - presence.visitors.length} more.</p>}
        <small>Random nicknames, not real identities.</small>
      </div>
    </details>
  );
}
