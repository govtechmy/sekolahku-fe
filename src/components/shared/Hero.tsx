export default function Hero({
  title,
  search,
  links,
  filters,
  background,
  variant = "side",
}: {
  title: string;
  search?: React.ReactNode;
  links?: React.ReactNode;
  filters?: React.ReactNode;
  background?: React.ReactNode;
  variant?: "side" | "full";
}) {
  return (
    <section className={`relative border-b border-outline-200 ${variant === "side" ? "px-[109px]" : "h-[350px]"}`}>
      { background && (
        <div className="absolute -z-10 flex shrink-0 h-full w-full justify-center overflow-x-hidden">
          {background}
        </div>
      )}
      <div className="w-full">
        <div className={`flex flex-col gap-8 py-16 ${variant === "side" ? "w-[400px]" : "justify-center items-center text-center"}`}>
          <h1 className="text-txt-black-900 font-heading font-semibold text-heading-md">
            <div className="text-[2rem]/10"> {title}</div>
          </h1>
          {search && (
            <div className={`items-center flex w-full ${variant === "side" ? "" : "justify-center"}`}>
              <div className="flex-1 max-w-[600px]">{search}</div>
            </div>
          )}
          {links && (
            <div className="items-center flex w-full">
              <div className="flex-1 max-w-[600px]">{links}</div>
            </div>
          )}
          {filters && (
            <div className="flex w-full justify-center ">
              <div className="flex justify-center ">{filters}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
