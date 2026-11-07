export const slugify = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (é → e)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type LexicalNode = { text?: string; children?: LexicalNode[] }

const collectText = (node: LexicalNode | undefined, out: string[]) => {
  if (!node) return
  if (typeof node.text === 'string') out.push(node.text)
  node.children?.forEach((child) => collectText(child, out))
}

// Pulls plain text out of a Lexical rich-text value (used for reading time,
// search excerpts and, later, text-to-speech).
export const lexicalToPlainText = (state: unknown): string => {
  const out: string[] = []
  collectText((state as { root?: LexicalNode } | null)?.root, out)
  return out.join(' ').replace(/\s+/g, ' ').trim()
}

export const estimateReadingMinutes = (text: string, wordsPerMinute = 200): number => {
  const words = text ? text.split(/\s+/).length : 0
  return Math.max(1, Math.round(words / wordsPerMinute))
}
