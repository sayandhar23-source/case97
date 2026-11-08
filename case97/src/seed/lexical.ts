// Tiny helpers to write Lexical rich text in code (used by the demo seed).
import crypto from 'crypto'

const text = (t: string, format = 0) => ({ type: 'text', version: 1, text: t, format, detail: 0, mode: 'normal', style: '' })

export const p = (t: string) => ({
  type: 'paragraph', version: 1, children: [text(t)], direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '',
})
export const h = (t: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading', tag, version: 1, children: [text(t)], direction: 'ltr', format: '', indent: 0,
})
export const block = (blockType: string, fields: Record<string, unknown>) => ({
  type: 'block', version: 2, format: '',
  fields: { id: crypto.randomBytes(12).toString('hex'), blockName: '', blockType, ...fields },
})
export const chapter = (chapterTitle: string) => block('chapterBreak', { chapterTitle })
export const image = (img: string | number, layout: string, caption?: string) => block('storyImage', { image: img, layout, caption })
export const fact = (title: string, content: string) => block('factBox', { title, content })
export const quote = (q: string, attribution?: string) => block('pullQuote', { quote: q, attribution })
export const pause = (seconds = 2) => block('narrationPause', { seconds })

export const doc = (children: unknown[]) => ({
  root: { type: 'root', version: 1, children, direction: 'ltr', format: '', indent: 0 },
})
