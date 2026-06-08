import ErrorPageHero from "../components/Hero/ErrorPageHero";
import HelmetMeta from "../seo/HelmetMeta";
import { useParams } from "react-router-dom";

export default function ErrorPage() {
  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  return (
    <div>
      <HelmetMeta
        title="Halaman Tidak Dijumpai - SekolahKu"
        description="Maaf, halaman yang anda cari tidak dijumpai."
        canonical={`${domain}/${lang}/404`}
      />
      <ErrorPageHero />
    </div>
  );
}
