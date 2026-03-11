import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { ArrowForwardIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";

type SectionHeaderProps = {
  header: string;
  title?: string;
  children: React.ReactNode;
  ButtonLabel?: string;
  ButtonClickHandler?: () => void;
  isLastSection?: boolean;
  classNameHeader?: string;
  buttonLabelClassName?:string
  arrowIconDisplay?:boolean
};

export default function SectionHeader({
  header,
  title,
  children,
  ButtonLabel,
  ButtonClickHandler,
  isLastSection,
  classNameHeader,
  buttonLabelClassName,
  arrowIconDisplay = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col ${isLastSection ? "" : "pb-16"} px-4 lg:px-[50px]`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={clx(
            "text-txt-primary font-body font-semibold text-sm tracking-[2.8px]",
            classNameHeader,
          )}
        >
          {header}
        </div>
        {title && (
          <div className="text-txt-black-900 font-heading font-semibold text-heading-sm pb-12">
            {title}
          </div>
        )}
      </div>
      {children}
      {ButtonLabel && (
        <div className={clx("pt-12", buttonLabelClassName)}>
          <Button variant={"default-outline"} onClick={ButtonClickHandler}>
            {ButtonLabel}
            {arrowIconDisplay && (
              <ButtonIcon>
                <ArrowForwardIcon />
              </ButtonIcon>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
