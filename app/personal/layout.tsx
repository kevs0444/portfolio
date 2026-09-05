import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Personal Projects, Practice Lab & Gear",
  description:
    "Explore Mar Kevin Alcantara's SQL, Python, and Excel practice, interactive typing-speed project, everyday technology, and personal updates.",
  alternates: {
    canonical: "/personal",
  },
  openGraph: {
    type: "website",
    url: "/personal",
    title: "Personal Projects, Practice Lab & Gear | Mar Kevin Alcantara",
    description:
      "SQL, Python, and Excel practice, an interactive typing-speed project, technology setup, and personal updates from Mar Kevin Alcantara.",
  },
};

export default function PersonalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
