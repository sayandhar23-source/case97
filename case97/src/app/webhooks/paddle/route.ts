import { getPayload } from 'payload'
import config from '@payload-config'
import { applySubscriptionUpdate, hmacSha256Hex, safeEqual, type SubStatus } from '@/lib/subscriptions'

export const runtime = 'nodejs'

// Paddle subscription status → our status. When a user cancels, Paddle keeps
// the subscription "active" until the period ends, then sends "canceled".
const statusByPaddle: Record<string, SubStatus> = {
  active: 'active',
  trialing: 'active',
  past_due: 'past_due',
  paused: 'expired',
  canceled: 'expired',
}

const MAX_AGE_SECONDS = 300 // reject replayed webhooks older than 5 minutes

export async function POST(req: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook not configured', { status: 500 })

  const raw = await req.text()
  const header = req.headers.get('paddle-signature') ?? '' // "ts=...;h1=..."
  const parts = Object.fromEntries(header.split(';').map((p) => p.split('=') as [string, string]))
  const ts = parts.ts
  const h1 = parts.h1

  if (!ts || !h1 || Math.abs(Date.now() / 1000 - Number(ts)) > MAX_AGE_SECONDS) {
    return new Response('Invalid signature', { status: 401 })
  }
  if (!safeEqual(h1, hmacSha256Hex(secret, `${ts}:${raw}`))) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(raw)
  if (!String(event?.event_type).startsWith('subscription.')) {
    return Response.json({ ok: true, ignored: event?.event_type })
  }

  const sub = event.data
  const status = statusByPaddle[sub?.status]
  if (!status || !sub?.id) return Response.json({ ok: true, ignored: sub?.status })

  const payload = await getPayload({ config })
  await applySubscriptionUpdate(payload, {
    provider: 'paddle',
    providerSubscriptionId: sub.id,
    status,
    userId: sub.custom_data?.userId,
    plan: sub.custom_data?.plan,
    providerCustomerId: sub.customer_id ?? undefined,
    currentPeriodEnd: sub.current_billing_period?.ends_at
      ? new Date(sub.current_billing_period.ends_at)
      : undefined,
  })

  return Response.json({ ok: true })
}
