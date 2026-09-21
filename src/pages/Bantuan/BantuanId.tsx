import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Coins, Globe, Library, LifeBuoy } from "lucide-react";
import { ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";
import PageContainer from "../../components/layout/PageContainer";
import BantuanActionList from "../../components/shared/BantuanActionList";
import BantuanSectionCard from "../../components/shared/BantuanSectionCard";
import { isKadarHeading } from "../../components/shared/bantuanSectionHelpers";
import { getBantuanBySlug } from "../../services/bantuan.svc";
import type { BantuanDetailItem } from "../../models/response";
import HelmetMeta from "../../seo/HelmetMeta";

export default function BantuanId() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>();
  const [item, setItem] = useState<BantuanDetailItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchItem = async (s: string) => {
      try {
        const response = await getBantuanBySlug(s);
        if (!ignore) setItem(response);
      } catch (error) {
        console.error("Error fetching bantuan by slug:", error);
        if (!ignore) setNotFound(true);
      }
    };

    if (slug) fetchItem(slug);
    return () => {
      ignore = true;
    };
  }, [slug]);

  const domain = import.meta.env.VITE_DOMAIN_NAME;

  if (notFound) {
    return (
      <PageContainer className="px-[18px] py-16 text-center md:px-6">
        <p className="font-body text-sm text-txt-black-500">
          Bantuan tidak ditemui.
        </p>
      </PageContainer>
    );
  }

  if (!item) return null;

  const kadarBantuan = item.sections.find((section) =>
    isKadarHeading(section.heading),
  )?.content[0];

  return (
    <>
      <HelmetMeta
        title={`${item.title} - SekolahKu`}
        description={item.description}
        canonical={`${domain}/${lang}/bantuan-persekolahan/${slug}`}
      />

      <section
        className="relative overflow-hidden rounded-b-[32px] pb-16 pt-32"
        style={{
          background:
            "radial-gradient(55% 65% at 10% 15%, #93C5FD 0%, #93C5FD00 70%), radial-gradient(50% 60% at 90% 10%, #BFDBFE 0%, #BFDBFE00 70%), radial-gradient(70% 65% at 50% 100%, #DCEAFE 0%, #DCEAFE00 70%), linear-gradient(180deg, #EAF2FE 0%, #F7FAFF 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 w-full"
          style={{
            height: "135%",
            background:
              "radial-gradient(115% 75% at 50% 26%, #FFFFFFB8 0%, #FFFFFF73 60%, #FFFFFF00 100%), linear-gradient(0deg, #FFFFFFFF 0%, #FFFFFFD9 8%, #FFFFFF40 20%, #FFFFFF00 48%, #FFFFFF00 100%)",
          }}
        />
        <PageContainer className="absolute left-0 right-0 top-6 z-10 px-[18px] md:px-6">
          <a
            href={`/${lang}/bantuan-persekolahan`}
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-2 font-body text-[13px] font-semibold text-[#0A1930]"
          >
            <ArrowLeft className="size-[15px] text-[#0A1930]" />
            Kembali ke Senarai Bantuan
          </a>
        </PageContainer>

        <div className="relative mx-auto flex min-h-[380px] max-w-[1280px] flex-col items-center gap-[18px] px-[18px] text-center md:px-6">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0B4FCC]">
              BANTUAN PERSEKOLAHAN
            </span>

            <h1 className="max-w-[900px] font-heading text-[38px] font-extrabold text-[#0A1930]">
              {item.title}
            </h1>
          </div>

          <p className="max-w-[640px] font-body text-base font-medium leading-normal text-[#173254]">
            {item.heroSubtitle ?? item.description}
          </p>

          <div className="flex items-center gap-4">
            {item.heroMeta && (
              <span className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-[#0A1930]">
                <Coins className="size-3.5 text-[#12294A]" />
                {item.heroMeta}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-[#0A1930]">
              <Globe className="size-3.5 text-[#12294A]" />
              Sumber: moe.gov.my
            </span>
          </div>
        </div>
      </section>

      <PageContainer className="px-[18px] py-12 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-5">
            {item.sections.map((section, index) => (
              <BantuanSectionCard key={index} section={section} index={index} />
            ))}

            <BantuanActionList actions={item.actions} />

            <div className="flex gap-[14px] rounded-2xl border border-otl-divider bg-bg-white p-[22px]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7EAF1]">
                <Library className="size-5 text-[#16284F]" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-base font-bold text-txt-black-900">
                  Rujukan
                </h2>
                <p className="font-body text-xs text-txt-black-500">
                  Kandungan halaman ini diadaptasi daripada portal rasmi
                  moe.gov.my.
                </p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-body text-xs font-bold text-[#0062FF] hover:underline"
                >
                  <ArrowOutgoingIcon className="size-3.5" />
                  {item.title} — moe.gov.my
                </a>
              </div>
            </div>
          </div>

          <aside className="flex w-full flex-col gap-4 lg:w-[360px] lg:shrink-0">
            <div className="flex flex-col gap-3 rounded-2xl bg-[#0062FF] p-[22px] text-white">
              <span className="font-body text-[11px] font-bold tracking-[1.5px] text-[#BFD8FF]">
                RINGKASAN BANTUAN
              </span>
              <h3 className="font-heading text-lg font-bold">
                {kadarBantuan ?? item.title}
              </h3>
              <p className="font-body text-[13px] leading-[1.5] text-[#DCE9FF]">
                {item.heroSubtitle ?? item.description}
              </p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-1.5 rounded-[10px] bg-white px-[18px] py-3 font-body text-sm font-bold text-[#0062FF]"
              >
                Lihat portal rasmi
                <ArrowOutgoingIcon className="size-3.5" />
              </a>
            </div>

            <div className="flex flex-col gap-2.5 rounded-2xl bg-[#F7F8FA] p-[22px]">
              <div className="flex items-center gap-2">
                <LifeBuoy className="size-[18px] text-[#14B8A6]" />
                <h3 className="font-heading text-base font-bold text-txt-black-900">
                  Perlu bantuan?
                </h3>
              </div>
              <p className="font-body text-[13px] text-[#5B6472]">
                Hubungi sekolah atau Jabatan Pendidikan Negeri (JPN) untuk
                pertanyaan lanjut mengenai {item.title}.
              </p>
            </div>
          </aside>
        </div>
      </PageContainer>
    </>
  );
}
