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
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
}
