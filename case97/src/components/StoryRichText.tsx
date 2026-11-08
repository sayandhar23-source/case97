import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Media } from '@/payload-types'
import { imageUrl } from '@/lib/payload'

type Fields = Record<string, unknown>

const media = (m: unknown): Media | null => (m && typeof m === 'object' ? (m as Media) : null)

function StoryImage({ fields }: { fields: Fields }) {
  const m = media(fields.image)
  const layout = (fields.layout as string) || 'full'
  const src = imageUrl(m, layout === 'wide' ? 'hero' : layout === 'full' ? 'page' : 'card')
  if (!src) return null
  const caption = (fields.caption as string) || m?.caption
  return (
    <figure className={`fig fig-${layout}`}>
      <img src={src} alt={m?.alt ?? ''} loading="lazy" />
      {caption && <figcaption>{caption}{m?.credit ? ` — ${m.credit}` : ''}</figcaption>}
    </figure>
  )
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    storyImage: ({ node }: { node: { fields: Fields } }) => <StoryImage fields={node.fields} />,
    gallery: ({ node }: { node: { fields: Fields } }) => {
      const imgs = ((node.fields.images as unknown[]) ?? []).map(media).filter(Boolean) as Media[]
      return (
        <figure className="fig">
          <div className="gallery">
            {imgs.map((m) => <img key={m.id} src={imageUrl(m, 'card') ?? ''} alt={m.alt ?? ''} loading="lazy" />)}
          </div>
          {node.fields.caption ? <figcaption>{node.fields.caption as string}</figcaption> : null}
        </figure>
      )
    },
    factBox: ({ node }: { node: { fields: Fields } }) => (
      <aside className="factbox">
        <strong>{node.fields.title as string}</strong>
        <p>{node.fields.content as string}</p>
      </aside>
    ),
    pullQuote: ({ node }: { node: { fields: Fields } }) => (
      <blockquote>
        “{node.fields.quote as string}”
        {node.fields.attribution ? <footer style={{ fontSize: '.55em', marginTop: 8 }}>— {node.fields.attribution as string}</footer> : null}
      </blockquote>
    ),
    chapterBreak: ({ node }: { node: { fields: Fields } }) =>
      node.fields.chapterTitle ? (
        <div className="chapter"><h2>{node.fields.chapterTitle as string}</h2></div>
      ) : (
        <div className="chapter" aria-hidden="true"><span>✦</span></div>
      ),
    narrationPause: () => null,
  },
})

export function StoryRichText({ data }: { data: unknown }) {
  return <RichText data={data as SerializedEditorState} converters={converters} />
}
