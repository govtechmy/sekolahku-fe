type ContentHeroProps = {
  /** White first line of the headline. */
  title: string;
  /** Gold second line of the headline. */
  highlight: string;
  search: React.ReactNode;
  /** Optional filter controls rendered under the search bar. */
  filters?: React.ReactNode;
};

// Dark-gradient illustration hero shared by the content pages (Berita, Takwim).
// White headline over /utama/hero.jpg with a navy wash, and a white search card
// holding the search bar plus an optional filter row. Matches the home hero spec.
export default function ContentHero({
  title,
  highlight,
  search,
  filters,
}: ContentHeroProps) {
  return (
    <section className="relative flex min-h-[440px] items-center justify-center">
      {/* overflow-hidden lives on the bg wrapper so the rounded corners clip the
          image without clipping the search/filter dropdowns. */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[32px]">
        <div className="absolute inset-0 scale-105 bg-[url('/utama/hero.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/[.91] from-0% to-[#0B1220]/[.08] to-70%" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center gap-5 px-5 py-14 text-center">
        <h1 className="m-0 flex flex-col items-center gap-0.5">
          <span className="font-heading text-[22px] font-bold leading-tight text-white">
            {title}
          </span>
          <span className="font-heading text-4xl font-extrabold leading-tight text-[#F0B429] md:text-[38px]">
            {highlight}
          </span>
        </h1>

        {/* Search card */}
        <div className="relative z-20 flex w-full max-w-[760px] flex-col gap-3.5 rounded-[20px] bg-bg-white p-5 shadow-xl">
          {search}
          {filters && (
            <div className="flex flex-col gap-2 sm:flex-row">{filters}</div>
          )}
        </div>
      </div>
    </section>
  );
}
