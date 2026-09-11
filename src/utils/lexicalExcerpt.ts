import type { SiaranContent, SiaranContentNode } from "../models/response";

// Siaran content is Lexical rich text with no stored plain-text excerpt.
// Walk the node tree, collect text, collapse whitespace, and truncate at a
// word boundary so cards can show a short summary derived from the article.
export function getLexicalExcerpt(
  content: SiaranContent | undefined,
  max = 140,
): string {
  const root = (content as unknown as { root?: SiaranContentNode } | undefined)
    ?.root;
  if (!root) return "";

  const parts: string[] = [];
  const walk = (node?: SiaranContentNode) => {
    if (!node) return;
    if (node.text) parts.push(node.text);
    node.children?.forEach(walk);
  };
  walk(root);

  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (
    (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…"
  );
}
