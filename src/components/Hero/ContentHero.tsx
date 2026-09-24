type ContentHeroProps = {
  search: React.ReactNode;
  /** Optional filter controls rendered under the search bar. */
  filters?: React.ReactNode;
};

// Light illustration hero shared by the content pages (Berita, Takwim) — same
// background/headline/card treatment as HomeHero, matches design.pen (node
// xZeQV): a white search card holding the search bar plus an optional filter row.
export default function ContentHero({ search, filters }: ContentHeroProps) {
  return (
    <section className="relative flex min-h-[480px] items-center justify-center">
      {/* overflow-hidden lives on the bg wrapper so the rounded corners clip the
          image without clipping the search/filter dropdowns. */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[32px] bg-[#F7F8FA]">
        <div className="absolute inset-0 bg-[url('/utama/hero-portal-sekolahku.png')] bg-cover bg-bottom bg-no-repeat" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFFC4 0%, #FFFFFF4D 50%, #FFFFFFF7 90%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center gap-5 px-5 py-16 text-center">
        <h1 className="m-0 flex flex-col items-center gap-0.5">
          <span
            className="font-body text-sm font-bold leading-tight tracking-[1.5px] md:text-base"
            style={{ color: "#0B4FCC" }}
          >
            SELAMAT DATANG KE
          </span>
          <span
            className="font-heading text-4xl font-extrabold leading-tight md:text-[38px]"
            style={{ color: "#0A1930" }}
          >
            PORTAL SEKOLAHKU
          </span>
        </h1>

        {/* Search card */}
        <div className="relative z-20 flex w-full max-w-[760px] flex-col gap-3.5 rounded-[20px] border border-[#DCE6F5] bg-white p-5 shadow-xl">
          {search}
          {filters && (
            <div className="flex flex-col gap-2 sm:flex-row">{filters}</div>
          )}
        </div>
      </div>
    </section>
  );
}
