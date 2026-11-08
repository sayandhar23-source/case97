import type { Block } from 'payload'

// Blocks you can drop anywhere inside a story's text.
// No `localized` flags here: the whole story body is already per-language.

export const StoryImageBlock: Block = {
  slug: 'storyImage',
  interfaceName: 'StoryImageBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'relationship', relationTo: 'media', required: true },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full page', value: 'full' },
        { label: 'Wide (edge to edge)', value: 'wide' },
        { label: 'Float left', value: 'left' },
        { label: 'Float right', value: 'right' },
        { label: 'Small inline', value: 'small' },
      ],
    },
    { name: 'caption', type: 'text' },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    { name: 'images', type: 'relationship', relationTo: 'media', hasMany: true, required: true },
    { name: 'caption', type: 'text' },
  ],
}

export const FactBoxBlock: Block = {
  slug: 'factBox',
  interfaceName: 'FactBoxBlock',
  labels: { singular: 'Fact box', plural: 'Fact boxes' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'textarea', required: true },
  ],
}

export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  interfaceName: 'PullQuoteBlock',
  labels: { singular: 'Pull quote', plural: 'Pull quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
  ],
}

// Marks a new chapter / forces a page turn in the book reader.
export const ChapterBreakBlock: Block = {
  slug: 'chapterBreak',
  interfaceName: 'ChapterBreakBlock',
  labels: { singular: 'Chapter / page break', plural: 'Chapter / page breaks' },
  fields: [{ name: 'chapterTitle', type: 'text' }],
}

// Invisible when reading — adds a dramatic silence to the AI narration.
export const NarrationPauseBlock: Block = {
  slug: 'narrationPause',
  interfaceName: 'NarrationPauseBlock',
  labels: { singular: 'Narration pause', plural: 'Narration pauses' },
  fields: [
    {
      name: 'seconds',
      type: 'number',
      defaultValue: 2,
      min: 1,
      max: 5,
      admin: { description: 'Silence in the audio version only.' },
    },
  ],
}

export const storyBlocks = [
  StoryImageBlock,
  GalleryBlock,
  FactBoxBlock,
  PullQuoteBlock,
  ChapterBreakBlock,
  NarrationPauseBlock,
]
