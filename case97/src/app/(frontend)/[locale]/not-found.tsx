import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="wrap page" style={{ textAlign: 'center' }}>
      <p className="case-tag">Case not found</p>
      <h1>This file is missing from the archive.</h1>
      <p className="intro" style={{ marginInline: 'auto' }}>It may have been moved, or it never existed at all.</p>
      <Link className="btn btn-solid" href="/en/stories">Browse every story</Link>
    </section>
  )
}
