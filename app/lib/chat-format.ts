export type ChatContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1 ($2)")
    .replace(/\*\*|__/g, "")
    .replace(/(?<!\w)[*_]([^\n*_]+)[*_](?!\w)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<((?:https?:\/\/)[^>]+)>/g, "$1")
    .trim();
}

/**
 * Keeps provider output readable even when a model ignores the plain-text rule.
 * The result intentionally supports paragraphs and simple lists, not arbitrary HTML.
 */
export function normalizeChatResponse(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/^[ \t]*```[^\n]*\n?/gm, "")
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
    .split("\n")
    .map((line) => {
      const bullet = line.match(/^\s*(?:[-*+]\s+|\d+[.)]\s+)(.+)$/);
      return bullet ? `- ${cleanInlineMarkdown(bullet[1])}` : cleanInlineMarkdown(line);
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function chatContentBlocks(value: string): ChatContentBlock[] {
  const normalized = normalizeChatResponse(value);
  if (!normalized) return [];

  const blocks: ChatContentBlock[] = [];
  let paragraph: string[] = [];
  let items: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (items.length) blocks.push({ type: "list", items });
    items = [];
  };

  for (const line of normalized.split("\n")) {
    if (!line) {
      flushParagraph();
      flushList();
    } else if (line.startsWith("- ")) {
      flushParagraph();
      items.push(line.slice(2));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}
