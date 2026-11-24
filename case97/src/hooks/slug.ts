import type { FieldHook } from 'payload'
import { slugify } from '../lib/text'

// Uses the typed slug if given, otherwise generates one from another field.
// If that field has no Latin letters (for example a Bengali title), the web
// address falls back to a short unique one like "story-m3k9x2", so a story can
// be started in any language. You can still type your own slug in the sidebar.
export const formatSlug =
  (sourceField: string, prefix = 'item'): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value) || value.trim()
    const source = data?.[sourceField] ?? originalDoc?.[sourceField]
    const generated = typeof source === 'string' ? slugify(source) : ''
    if (generated) return generated
    if (typeof originalDoc?.slug === 'string' && originalDoc.slug) return originalDoc.slug
    return source ? `${prefix}-${Date.now().toString(36)}` : value
  }
