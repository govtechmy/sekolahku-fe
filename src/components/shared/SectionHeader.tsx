import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import {
  ArrowForwardIcon,
  JataNegaraIcon,
  ArrowOutgoingIcon,
} from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import { formatEventDateDDMMYY } from "../../utils/date";

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
  subTitle,
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
          <>
            <div className="flex justify-between text-txt-black-900 font-heading font-semibold text-heading-sm">
              {title}
              {sourceBtn && (
                <a
                  href="https://emisonline.moe.gov.my/risalahmap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 border border-otl-gray-200 rounded-full px-4 py-1 hover:bg-bg-gray-50 hover:border-otl-gray-300 transition-colors focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2"
                >
                  <JataNegaraIcon className="size-8" />
                  <div className="flex flex-col">
                    <span className="text-txt-black-500 text-body-xs font-medium">
                      Sumber Data
                    </span>
                    <span className="text-body-sm font-medium">RisalahMap</span>
                  </div>
                  <ArrowOutgoingIcon className="size-6 hidden group-hover:block" />
                </a>
              )}
            </div>
            {subTitle && (
              <span className="text-txt-black-500 text-body-sm font-normal pb-12">
                Data setakat {formatEventDateDDMMYY(subTitle)}
              </span>
            )}
          </>
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
