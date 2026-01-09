export const normalizeHref = (href: string) => {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  return `https://${href}`;
};
