// Splits a story's rich text into book pages.
// A "Chapter / page break" block always starts a new page; otherwise pages
// fill up to a reading budget, with images and boxes counting as space.

type Node = { type?: string; text?: string; children?: Node[]; fields?: { blockType?: string; layout?: string } }
export type LexicalState = { root: { children: Node[]; [k: string]: unknown }; [k: string]: unknown }

const textLength = (n: Node): number =>
  (typeof n.text === 'string' ? n.text.length : 0) + (n.children ?? []).reduce((s, c) => s + textLength(c), 0)

const weight = (n: Node): number => {
  if (n.type === 'block') {
    const b = n.fields?.blockType
    if (b === 'storyImage') return ['left', 'right', 'small'].includes(n.fields?.layout ?? '') ? 300 : 460
    if (b === 'gallery') return 560
    if (b === 'factBox') return 380
    if (b === 'pullQuote') return 220
    if (b === 'narrationPause') return 0
    return 200
  }
  if (n.type === 'heading') return 160 + textLength(n)
  return Math.max(60, textLength(n))
}

export function paginate(state: LexicalState | null | undefined, budget = 1050): LexicalState[] {
  if (!state?.root?.children?.length) return []
  const pages: Node[][] = []
  let current: Node[] = []
  let used = 0
  for (const node of state.root.children) {
    const isBreak = node.type === 'block' && node.fields?.blockType === 'chapterBreak'
    const w = weight(node)
    if ((isBreak && current.length) || (used + w > budget && current.length)) {
      pages.push(current)
      current = []
      used = 0
    }
    current.push(node)
    used += w
  }
  if (current.length) pages.push(current)
  return pages.map((children) => ({ ...state, root: { ...state.root, children } }))
}

// Free readers of a premium story see only the opening.
export function preview(state: LexicalState, nodes = 3): LexicalState {
  return { ...state, root: { ...state.root, children: state.root.children.slice(0, nodes) } }
}
