import { Button } from "@govtechmy/myds-react/button";
import {
  FacebookIcon,
  TwitterXIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkDiagonalIcon,
  EmailIcon,
  RSSIcon,
  LinkedinIcon,
  WhatsappIcon,
  TiktokIcon,
  FigmaIcon,
  TelegramIcon,
  GithubIcon,
} from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import { normalizeHref } from "../../utils/normalizeHref";

interface SocialLinkProps {
  platform: string;
  href: string;
  ariaLabel: string;
}

interface SocialLinksProps {
  links: SocialLinkProps[];
  className?: string;
  classNameButton?: string;
}

export default function SocialLinks({
  links,
  className,
  classNameButton,
}: SocialLinksProps) {
  const iconMap = {
    hyperlink: LinkDiagonalIcon,
    email: EmailIcon,
    facebook: FacebookIcon,
    twitter: TwitterXIcon,
    instagram: InstagramIcon,
    youtube: YoutubeIcon,
    rss: RSSIcon,
    linkedin: LinkedinIcon,
    whatsapp: WhatsappIcon,
    tiktok: TiktokIcon,
    figma: FigmaIcon,
    telegram: TelegramIcon,
    github: GithubIcon,
  };

  const getIconByPlatform = (platform: string) => {
    const key = Object.keys(iconMap).find((k) =>
      platform.toLowerCase().includes(k),
    );

    return key ? iconMap[key as keyof typeof iconMap] : null;
  };

  const handleClick = (platform: string, href: string) => {
    const isHyperlink = platform.toLowerCase().includes("hyperlink");
    const currentUrl = window.location.href;

    // Use the browser's Web Share API when available (navigator)
    if (
      isHyperlink &&
      // check navigator availability
      typeof navigator !== "undefined" &&
      //check share function of navigator available or not
      typeof navigator.share === "function"
    ) {
      navigator
        .share({
          url: window.location.href,
        })
        .catch((error) => {
          console.error(
            "Failed to share content using the Web Share API:",
            error,
          );
        });
      return;
    }

    if (!isHyperlink) {
      let encodedHref = href;
      if (platform === "email") {
        const separator = href.includes("?") ? "&" : "?";
        encodedHref = `${href}${separator}body=${encodeURIComponent(
          currentUrl,
        )}`;
      }
      if (platform === "facebook" || platform === "twitter") {
        encodedHref = `${href}${encodeURIComponent(currentUrl)}`;
      }

      window.open(normalizeHref(encodedHref), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={clx("flex items-center gap-3", className)}>
      {links.map(({ platform, href, ariaLabel }) => {
        const Icon = getIconByPlatform(platform);
        if (!Icon) return null;
        return (
          <Button
            key={platform}
            variant="default-ghost"
            className={classNameButton}
            aria-label={ariaLabel}
            onClick={() => handleClick(platform, href)}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
}
