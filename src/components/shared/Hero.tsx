export default function Hero({
  title,
  search,
  links,
  background,
}: {
  title: string;
  subtitle?: string;
  search?: React.ReactNode;
  splaskPrivacyPolicy?: boolean;
  links?: React.ReactNode;
  background?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-outline-200 px-[109px]">
      <div className="absolute -z-10 flex shrink-0 h-full w-full justify-center overflow-x-hidden">
        {background}
      </div>
      <div className="w-full">
        <div className=" flex flex-col gap-8 py-16 w-[400px]">
          <h1 className="text-txt-black-900 font-heading font-semibold text-heading-md">
            <div className="text-[2rem]/10"> {title}</div>
          </h1>
          <div className="items-center flex w-full">
            <div className="flex-1 max-w-[600px]">{search}</div>
          </div>
          <div className="items-center flex w-full">
            <div className="flex-1 max-w-[600px]">{links}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
