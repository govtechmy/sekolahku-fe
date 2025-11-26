export default function Hero({
  title,
  search,
  links,
  background,
  smallBody,
  small,
}: {
  title?: string;
  search?: React.ReactNode;
  links?: React.ReactNode;
  background?: React.ReactNode;
  smallBody?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <section className={`relative border-b border-outline-200 px-[109px] ${small ?? 'justify-items-center align-middle'}`}>
      <div className={`absolute -z-10 flex shrink-0 h-full justify-center overflow-x-hidden ${small? '' : ''}`}>
        {background}
      </div>
      {small ? 
        (<div className="w-full h-[408px] justify-center">
          {/* <div className=" flex flex-col gap-8 py-16 w-[400px]"></div> */}
          <div className="shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {smallBody}
          </div>
        </div>)
      :
        (<div className="w-full">
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
        </div>)
      }
    </section>
  );
}
