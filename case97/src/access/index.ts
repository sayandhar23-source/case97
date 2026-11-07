import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type AppUser =
  | {
      id: string | number
      collection?: string
      subscription?: {
        status?: string | null
        currentPeriodEnd?: string | null
        grantedManually?: boolean | null
      } | null
    }
  | null
  | undefined

const userOf = (req: PayloadRequest) => req.user as unknown as AppUser

// The site owner logs in through the separate `admins` collection.
export const isAdminUser = (user: AppUser) => user?.collection === 'admins'
export const isReaderUser = (user: AppUser) => user?.collection === 'readers'

export const isAdmin: Access = ({ req }) => isAdminUser(userOf(req))
export const isAdminField: FieldAccess = ({ req }) => isAdminUser(userOf(req))

// Admin sees every reader; a reader only sees/edits their own account.
export const adminOrSelfReader: Access = ({ req }) => {
  const user = userOf(req)
  if (isAdminUser(user)) return true
  if (isReaderUser(user)) return { id: { equals: user!.id } }
  return false
}

// Public sees published stories only; the admin sees drafts too.
export const publishedOrAdmin: Access = ({ req }) => {
  if (isAdminUser(userOf(req))) return true
  return { _status: { equals: 'published' } }
}

// Premium = active (or cancelled / past-due but still inside the paid period),
// or granted manually. The admin always has access.
export const hasPremium = (user: AppUser): boolean => {
  if (!user) return false
  if (isAdminUser(user)) return true
  if (!isReaderUser(user)) return false
  const sub = user.subscription
  if (!sub) return false
  if (sub.grantedManually) return true
  const stillPaid = ['active', 'past_due', 'cancelled'].includes(sub.status ?? '')
  return stillPaid && !!sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) > new Date()
}

export const premiumOrAdmin: Access = ({ req }) => hasPremium(userOf(req))
