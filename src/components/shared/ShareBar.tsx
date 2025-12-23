import {
    LinkDiagonalIcon,
    EmailIcon,
    FacebookIcon,
    TwitterXIcon,
    PrinterIcon,
  } from "@govtechmy/myds-react/icon";
  
  interface ShareBarProps {
    title: string;
    url?: string;
    showPrint?: boolean;
  }
  
  export function ShareBar({
    title,
    url = window.location.href,
  }: ShareBarProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
  
    const shareActions = {
      copy: {
        icon: LinkDiagonalIcon,
        label: "Copy link",
        action: async () => {
          try {
            await navigator.clipboard.writeText(url);
          } catch {
            alert("Failed to copy link");
          }
        },
      },
      email: {
        icon: EmailIcon,
        label: "Share via email",
        action: () =>
          window.open(
            `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            "_self"
          ),
      },
      facebook: {
        icon: FacebookIcon,
        label: "Share on Facebook",
        action: () =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            "_blank",
            "noopener,noreferrer"
          ),
      },
      twitter: {
        icon: TwitterXIcon,
        label: "Share on X",
        action: () =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            "_blank",
            "noopener,noreferrer"
          ),
      },
    };
  
    return (
      <div className="flex flex-row justify-between pb-4 border-b-2 border-gray-200">
        <ul className="flex flex-row gap-4">
          {Object.entries(shareActions).map(([key, item]) => {
            const Icon = item.icon;
  
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={item.action}
                  aria-label={item.label}
                  className="hover:text-primary-500 transition"
                >
                  <Icon />
                </button>
              </li>
            );
          })}
        </ul>
  
          <button
            type="button"
            onClick={() => window.print()}
            className="py-[6px] px-[10px] flex flex-row gap-2 border border-otl-gray-200 rounded-md hover:bg-otl-gray-100 transition"
          >
            <PrinterIcon />
            <span className="text-sm font-medium">Cetak</span>
          </button>
      </div>
    );
  }
  