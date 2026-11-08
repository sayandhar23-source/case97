import type { CollectionBeforeChangeHook } from 'payload'
import { estimateReadingMinutes, lexicalToPlainText } from '../lib/text'

// Runs per locale: reading time is calculated for whichever language is being saved.
export const setReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.body) {
    data.readingTimeMinutes = estimateReadingMinutes(lexicalToPlainText(data.body))
  }
  return data
}

export const setPublishedAt: CollectionBeforeChangeHook = ({ data }) => {
  if (data?._status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  return data
}

// Gives every new story the next case number (Case No. 001, 002, …).
export const setCaseNumber: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation === 'create' && data && !data.caseNumber) {
    const last = await req.payload.find({
      collection: 'stories',
      sort: '-caseNumber',
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
      req,
    })
    const top = (last.docs[0] as { caseNumber?: number } | undefined)?.caseNumber ?? 0
    data.caseNumber = top + 1
  }
  return data
}
