import { Helmet } from "react-helmet-async";

export default function HelmetMeta({ title, description, canonical, image }: any) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* OpenGraph */}
      {/* <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />} */}

      {/* FB */}
      {/* <meta name="facebook:title" content={title} />
      <meta name="facebook:description" content={description} />
      {image && <meta name="facebook:image" content={image} />} */}

      {/* Twitter */}
      {/* <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />} */}
    </Helmet>
  );
}
