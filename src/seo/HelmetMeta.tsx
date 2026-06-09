import { Helmet } from "react-helmet-async";

interface HelmetMetaProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: "website" | "article";
  ogUrl?: string;
}

export default function HelmetMeta({
  title,
  description,
  canonical,
  ogImage = "/JataNegara.svg",
  ogType = "website",
  ogUrl,
}: HelmetMetaProps) {
  // Use canonical URL for og:url if not explicitly provided
  const openGraphUrl = ogUrl || canonical;

  // Ensure image URL is absolute
  const domain = import.meta.env.VITE_DOMAIN_NAME || "";
  const absoluteOgImage = ogImage?.startsWith("http")
    ? ogImage
    : `${domain}${ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* OpenGraph meta tags for social media sharing */}
      <meta property="og:url" content={openGraphUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </Helmet>
  );
}
