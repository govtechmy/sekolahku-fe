import { ChevronDownFillIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

const select_trigger_cva = cva(
  [
    "group inline-flex select-none items-center gap-1.5 outline-none rounded-md w-full text-txt-black-900",
    "focus:ring focus:ring-fr-primary",
    "disabled:bg-bg-white-disabled disabled:text-txt-black-disabled disabled:border-transparent disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        outline: [
          "bg-bg-white border border-otl-gray-200 shadow-button",
          "hover:bg-bg-white-hover hover:border-otl-gray-300",
        ],
        ghost: [
          "bg-transparent border border-transparent",
          "hover:bg-bg-white-hover",
        ],
      },
      size: {
        small: "py-1.5 px-2.5 text-body-sm",
        medium: "py-2 px-3 text-body-md",
        large: "py-2.5 px-4 text-body-lg",
      },
    },
    defaultVariants: { variant: "outline", size: "small" },
  },
);

const select_content_cva = cva(
  [
    "absolute z-[700] w-full mt-1 bg-bg-dialog rounded-md border border-otl-gray-200 shadow-context-menu overflow-hidden py-1",
  ],
  {
    variants: {
      size: {
        small: "max-h-64",
        medium: "max-h-72",
        large: "max-h-80",
      },
    },
    defaultVariants: { size: "small" },
  },
);

const select_item_cva = cva(
  [
    "flex items-center w-full cursor-default select-none py-1.5 gap-2 font-medium outline-none text-txt-black-700 rounded-xs mx-1",
    "data-[highlighted]:bg-bg-washed",
  ],
  {
    variants: {
      size: {
        small: "text-body-xs",
        medium: "text-body-sm",
        large: "text-body-md",
      },
      selected: {
        true: "bg-bg-washed",
        false: "",
      },
    },
    defaultVariants: { size: "small", selected: false },
  },
);

interface SimpleSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "outline" | "ghost";
  size?: "small" | "medium" | "large";
  className?: string;
  children: React.ReactNode;
}

interface SimpleSelectItemProps {
  value: string;
  children: React.ReactNode;
}

type SimpleSelectContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
  size?: "small" | "medium" | "large";
  closeDropdown: () => void;
};

const SimpleSelectContext = React.createContext<SimpleSelectContextType>({
  value: undefined,
  onValueChange: undefined,
  size: "small",
  closeDropdown: () => {},
});

export function SimpleSelect({
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  variant = "outline",
  size = "small",
  className,
  children,
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Extract label from children based on value
  React.useEffect(() => {
    if (!value) {
      setSelectedLabel(null);
      return;
    }

    const findLabel = (children: React.ReactNode): string | null => {
      let label: string | null = null;
      React.Children.forEach(children, (child) => {
        if (
          React.isValidElement<SimpleSelectItemProps>(child) &&
          child.props.value === value
        ) {
          label =
            typeof child.props.children === "string"
              ? child.props.children
              : value;
        }
      });
      return label;
    };

    setSelectedLabel(findLabel(children));
  }, [value, children]);

  const closeDropdown = () => setIsOpen(false);

  return (
    <SimpleSelectContext.Provider
      value={{ value, onValueChange, size, closeDropdown }}
    >
      <div ref={containerRef} className={clx("relative", className)}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={select_trigger_cva({ variant, size })}
        >
          <span className="flex-1 min-w-0 truncate text-left">
            {selectedLabel || placeholder}
          </span>
          <ChevronDownFillIcon
            className={clx(
              "text-txt-black-900 shrink-0 transition-transform",
              size === "small" ? "size-4" : size === "medium" ? "size-5" : "size-5",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className={select_content_cva({ size })}>
            <div className="overflow-y-scroll show-scrollbar max-h-inherit">
              {children}
            </div>
          </div>
        )}
      </div>
    </SimpleSelectContext.Provider>
  );
}

export function SimpleSelectItem({ value, children }: SimpleSelectItemProps) {
  const {
    value: selectedValue,
    onValueChange,
    size,
    closeDropdown,
  } = React.useContext(SimpleSelectContext);
  const [isHighlighted, setIsHighlighted] = React.useState(false);

  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange?.(value);
    closeDropdown();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      data-highlighted={isHighlighted ? "" : undefined}
      className={select_item_cva({ size, selected: isSelected })}
    >
      {children}
    </div>
  );
}
