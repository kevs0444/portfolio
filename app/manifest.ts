import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mar Kevin Alcantara Portfolio",
    short_name: "MKA Portfolio",
    description:
      "Data analytics, automation, business intelligence, and applied data project portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
