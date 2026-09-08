import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Inter, Space_Grotesk, Syncopate } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LiveVisitors, { VisitorPresenceProvider } from "./LiveVisitors";
import { siteDescription, siteName, siteUrl } from "./site";
import "./globals.css";

const themeBootScript = `(() => {
  try {
    const storedTheme = window.localStorage.getItem("theme");
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    document.documentElement.dataset.theme = theme;
  } catch {}
})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const syncopate = Syncopate({
  subsets: ["latin"],
  variable: "--font-syncopate",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Mar Kevin Alcantara | Data Analyst Portfolio",
    template: "%s | Mar Kevin Alcantara",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.png",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Mar Kevin Alcantara", url: siteUrl }],
  creator: "Mar Kevin Alcantara",
  publisher: "Mar Kevin Alcantara",
  category: "technology",
  keywords: [
    "Mar Kevin Alcantara",
    "data analyst portfolio",
    "data analyst Philippines",
    "SQL",
    "Python",
    "Power BI",
    "data automation",
    "ETL",
    "business intelligence",
    "data science",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: "/",
    title: "Mar Kevin Alcantara | Data Analyst Portfolio",
    description: siteDescription,
    siteName,
    locale: "en_PH",
    firstName: "Mar Kevin",
    lastName: "Alcantara",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mar Kevin Alcantara | Data Analyst Portfolio",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: siteName,
  url: siteUrl.toString(),
  description: siteDescription,
  mainEntity: {
    "@type": "Person",
    "@id": `${siteUrl.toString()}#mar-kevin-alcantara`,
    name: "Mar Kevin Alcantara",
    url: siteUrl.toString(),
    image: new URL("/assets/images/kevin-graduation-portrait-web.jpg", siteUrl).toString(),
    jobTitle: "Data Analyst",
    description:
      "Data analyst and computer engineering graduate with internship experience in e-commerce, energy, and manufacturing analytics.",
    email: "mailto:markevinalcantara40@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taguig City",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Rizal Technological University",
    },
    knowsAbout: [
      "Data analytics",
      "SQL",
      "Python",
      "Power BI",
      "Data automation",
      "ETL",
      "Business intelligence",
      "Machine learning",
    ],
    sameAs: [
      "https://www.linkedin.com/in/mar-kevin-alcantara-83562326a/",
      "https://github.com/Kevs0444",
      "https://www.facebook.com/KevinAlcantara04/",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} ${syncopate.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema).replace(/</g, "\\u003c") }}
        />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <VisitorPresenceProvider>
          {children}
          <LiveVisitors />
        </VisitorPresenceProvider>
        <Analytics />
      </body>
    </html>
  );
}
