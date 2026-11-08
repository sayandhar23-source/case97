// Single source of truth for story themes — used by the CMS (select field)
// and later by the frontend (data-theme attribute + CSS variables).
export const storyThemes = [
  { label: 'Haunted (horror)', value: 'haunted' },
  { label: 'Chronicle (history)', value: 'chronicle' },
  { label: 'Mystery', value: 'mystery' },
  { label: 'Folklore (legends)', value: 'folklore' },
  { label: 'Field Guide (informational)', value: 'fieldGuide' },
] as const

export type StoryTheme = (typeof storyThemes)[number]['value']

export const themeOptions = storyThemes.map(({ label, value }) => ({ label, value }))
