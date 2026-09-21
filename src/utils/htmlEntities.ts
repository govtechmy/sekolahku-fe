// Some Siaran/Takwim text (sourced from moe.gov.my) carries literal HTML
// entities (e.g. "Dato&rsquo;") baked into plain-text fields instead of the
// decoded character. Decode the common ones so they display correctly
// wherever that text is rendered as plain text or fed into a rich-text tree.
const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
};

export function decodeHtmlEntities(text: string): string {
  return text.replace(
    /&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g,
    (match, entity: string) => {
      if (entity[0] === "#") {
        const code =
          entity[1] === "x" || entity[1] === "X"
            ? parseInt(entity.slice(2), 16)
            : parseInt(entity.slice(1), 10);
        return Number.isNaN(code) ? match : String.fromCodePoint(code);
      }
      return HTML_ENTITIES[entity] ?? match;
    },
  );
}

// Recursively decodes every "text" field in a Lexical node tree (Payload's
// SerializedLexicalNode shape), so the RichText renderer doesn't print raw
// entities as literal text.
export function decodeLexicalEntities<T>(node: T): T {
  if (Array.isArray(node)) {
    return node.map(decodeLexicalEntities) as T;
  }
  if (node && typeof node === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] =
        key === "text" && typeof value === "string"
          ? decodeHtmlEntities(value)
          : decodeLexicalEntities(value);
    }
    return result as T;
  }
  return node;
}
