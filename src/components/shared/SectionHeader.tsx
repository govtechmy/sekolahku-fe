import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { ArrowForwardIcon } from "@govtechmy/myds-react/icon";

type SectionHeaderProps = {
  header: string;
  title?: string;
  children: React.ReactNode;
  ButtonLabel?: string;
};

export default function SectionHeader({
  header,
  title,
  children,
  ButtonLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col pb-16 px-5 lg:px-[50px]">
      <div className="flex flex-col gap-4">
        <div className="text-txt-primary font-body font-semibold text-sm tracking-[2.8px]">
          {header}
        </div>
        {title && (
          <div className="text-txt-black-900 font-heading font-semibold text-heading-sm pb-12">
            {title}
          </div>
        )}
      </div>
      {children}
      <div className="pt-12">
        {ButtonLabel && (
          <Button variant={"default-outline"}>
            {ButtonLabel}
            <ButtonIcon>
              <ArrowForwardIcon />
            </ButtonIcon>
          </Button>
        )}
      </div>
    </div>
  );
}
