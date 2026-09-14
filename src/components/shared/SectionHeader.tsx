import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import {
  ArrowForwardIcon,
  JataNegaraIcon,
  ArrowOutgoingIcon,
} from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";

type SectionHeaderProps = {
  header: string;
  title?: string;
  children: React.ReactNode;
  ButtonLabel?: string;
  ButtonClickHandler?: () => void;
  isLastSection?: boolean;
  classNameHeader?: string;
  buttonLabelClassName?: string;
  arrowIconDisplay?: boolean;
  subTitle?: string;
  sourceBtn?: boolean;
  headerAction?: React.ReactNode;
  className?: string;
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
  sourceBtn = false,
  headerAction,
  subTitle,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={clx(
        "flex flex-col",
        isLastSection ? "" : "pb-16",
        "px-4 lg:px-[50px]",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <div
          className={clx(
            "text-txt-primary font-body font-bold text-body-xs tracking-[1.5px]",
            classNameHeader,
          )}
        >
          {header}
        </div>
        {title && (
          <div
            className={clx(
              "flex justify-between items-center",
              subTitle ? "pb-12" : "pb-6",
            )}
          >
            <div className="flex flex-col gap-1">
              <div className="text-txt-black-900 font-heading font-bold text-heading-sm">
                {title}
              </div>
              {subTitle && (
                <span className="text-txt-black-500 text-body-sm font-normal">
                  Data sehingga {subTitle}
                </span>
              )}
            </div>
            {sourceBtn && (
              <div className="flex flex-col items-end gap-2.5">
                <div className="flex items-center gap-1.5 rounded-full bg-bg-white px-3 py-1.5">
                  <span className="size-[7px] rounded-full bg-[#34D399]" />
                  <span className="whitespace-nowrap text-body-xs font-semibold text-txt-black-500">
                    Kemaskini Langsung
                  </span>
                </div>
                <a
                  href="https://emisonline.moe.gov.my/risalahmap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-[10px] bg-[#F7F8FA] px-2.5 py-1.5 transition-colors hover:bg-bg-gray-100 focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2"
                >
                  <JataNegaraIcon className="size-5" />
                  <div className="flex flex-col">
                    <span className="text-txt-black-500 text-[10px] font-normal leading-tight">
                      Sumber Data
                    </span>
                    <span className="text-body-sm font-bold text-txt-black-900">
                      RisalahMap
                    </span>
                  </div>
                  <ArrowOutgoingIcon className="size-3.5 text-txt-black-500" />
                </a>
              </div>
            )}
            {headerAction}
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
