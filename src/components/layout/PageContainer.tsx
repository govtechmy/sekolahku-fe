import { clx } from "@govtechmy/myds-react/utils";

export default function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clx(
        "mx-auto flex-1 px-0 md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1280px] flex flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
}
