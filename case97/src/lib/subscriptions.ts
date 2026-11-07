import crypto from 'crypto'
import type { Payload } from 'payload'

export type SubStatus = 'active' | 'past_due' | 'cancelled' | 'expired'

export type SubscriptionUpdate = {
  provider: 'razorpay' | 'paddle'
  providerSubscriptionId: string
  status: SubStatus
  userId?: string // passed as notes/custom_data when the checkout is created
  providerCustomerId?: string
  plan?: string
  currentPeriodEnd?: Date
}

const GRACE_DAYS = 3

export const hmacSha256Hex = (secret: string, payload: string) =>
  crypto.createHmac('sha256', secret).update(payload).digest('hex')

export const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

/**
 * Single place where premium is switched on/off. Both webhooks call this.
 * Idempotent: gateways retry webhooks, and repeating an update is harmless.
 * Returns whether this update newly activated premium (→ send welcome email).
 */
export async function applySubscriptionUpdate(payload: Payload, update: SubscriptionUpdate) {
  type Sub = Record<string, unknown> & { status?: string; currentPeriodEnd?: string | null }
  type U = { id: string | number; subscription?: Sub }

  let user: U | null = null
  if (update.userId) {
    user = (await payload.findByID({ collection: 'readers', id: update.userId }).catch(() => null)) as U | null
  }
  if (!user) {
    const res = await payload.find({
      collection: 'readers',
      where: { 'subscription.providerSubscriptionId': { equals: update.providerSubscriptionId } },
      limit: 1,
    })
    user = (res.docs[0] as unknown as U) ?? null
  }
  if (!user) {
    payload.logger.warn(`[billing] No user for ${update.provider} subscription ${update.providerSubscriptionId}`)
    return { activatedNow: false }
  }

  const existing = user.subscription ?? {}
  const existingEnd = existing.currentPeriodEnd ? new Date(existing.currentPeriodEnd) : null

  let periodEnd = update.currentPeriodEnd ?? existingEnd
  if (update.status === 'past_due') {
    const grace = new Date(Date.now() + GRACE_DAYS * 24 * 60 * 60 * 1000)
    periodEnd = existingEnd && existingEnd > grace ? existingEnd : grace
  }

  await payload.update({
    collection: 'readers',
    id: user.id,
    data: {
      subscription: {
        ...existing,
        status: update.status,
        provider: update.provider,
        providerSubscriptionId: update.providerSubscriptionId,
        ...(update.providerCustomerId && { providerCustomerId: update.providerCustomerId }),
        ...(update.plan && { plan: update.plan }),
        ...(periodEnd && { currentPeriodEnd: periodEnd.toISOString() }),
      },
    } as never,
  })

  const activatedNow = existing.status !== 'active' && update.status === 'active'
  // TODO (Phase 5): send Brevo emails here — welcome on activatedNow,
  // "payment failed" on past_due, "cancelled" on cancelled.
  return { activatedNow }
}
