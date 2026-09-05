const fallbackSiteUrl = "https://mar-kevs.vercel.app";

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return new URL(fallbackSiteUrl);
  }

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export const siteUrl = resolveSiteUrl();

export const siteName = "Mar Kevin Alcantara Portfolio";

export const siteDescription =
  "Data analyst and computer engineering graduate portfolio featuring SQL, Python, Power BI, reporting automation, ETL, forecasting, and applied analytics projects.";
