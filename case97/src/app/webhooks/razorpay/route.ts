import { getPayload } from 'payload'
import config from '@payload-config'
import { applySubscriptionUpdate, hmacSha256Hex, safeEqual, type SubStatus } from '@/lib/subscriptions'

export const runtime = 'nodejs'

// Razorpay subscription events → our status.
const statusByEvent: Record<string, SubStatus> = {
  'subscription.activated': 'active',
  'subscription.charged': 'active', // monthly renewal succeeded
  'subscription.resumed': 'active',
  'subscription.pending': 'past_due', // renewal failed, Razorpay is retrying
  'subscription.halted': 'expired', // all retries failed
  'subscription.cancelled': 'cancelled', // keeps access until current_end
  'subscription.completed': 'expired',
  'subscription.paused': 'expired',
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook not configured', { status: 500 })

  const raw = await req.text() // must verify the RAW body, before JSON.parse
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  if (!safeEqual(signature, hmacSha256Hex(secret, raw))) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(raw)
  const status = statusByEvent[event?.event]
  const sub = event?.payload?.subscription?.entity
  if (!status || !sub?.id) return Response.json({ ok: true, ignored: event?.event })

  const payload = await getPayload({ config })
  await applySubscriptionUpdate(payload, {
    provider: 'razorpay',
    providerSubscriptionId: sub.id,
    status,
    userId: sub.notes?.userId,
    plan: sub.notes?.plan,
    providerCustomerId: sub.customer_id ?? undefined,
    currentPeriodEnd: sub.current_end ? new Date(sub.current_end * 1000) : undefined,
  })

  return Response.json({ ok: true })
}
