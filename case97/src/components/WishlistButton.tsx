'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { toggleWishlist } from '@/app/actions'
import { IconBookmark } from './Icons'

export function WishlistButton({ storyId, initialSaved, signedIn, loginHref, labels }: {
  storyId: string | number
  initialSaved: boolean
  signedIn: boolean
  loginHref: string
  labels: { save: string; saved: string; signInToSave: string }
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [pending, start] = useTransition()

  if (!signedIn) {
    return (
      <Link className="tool" href={loginHref} title={labels.signInToSave}>
        <IconBookmark /> {labels.save}
      </Link>
    )
  }
  return (
    <button
      type="button"
      className="tool"
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setSaved((s) => !s)
          const res = await toggleWishlist(storyId)
          if (!res.ok) setSaved((s) => !s)
          else if (typeof res.saved === 'boolean') setSaved(res.saved)
        })
      }
    >
      <IconBookmark filled={saved} /> {saved ? labels.saved : labels.save}
    </button>
  )
}
