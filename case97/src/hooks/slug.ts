import type { FieldHook } from 'payload'
import { slugify } from '../lib/text'

// Uses the typed slug if given, otherwise generates one from another field.
// Tip: save the English version first so slugs stay Latin (Bengali text
// can't be turned into a URL slug).
export const formatSlug =
  (sourceField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[sourceField] ?? originalDoc?.[sourceField]
    if (typeof source === 'string' && source.trim()) return slugify(source) || value
    return value
  }
