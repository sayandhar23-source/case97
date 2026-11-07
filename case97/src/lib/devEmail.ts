import type { EmailAdapter } from 'payload'

// Used when Brevo isn't configured: prints each email's recipient, subject and
// links (verification / password reset) in the terminal, so you can click them.
export const devConsoleEmail: EmailAdapter = ({ payload }) => ({
  name: 'case97-dev-console',
  defaultFromAddress: 'dev@case97.local',
  defaultFromName: 'Case97 (development)',
  sendEmail: async (message) => {
    const html = String(message.html ?? '')
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
    payload.logger.info(
      ['', '---- EMAIL (not sent: add BREVO_SMTP_KEY to .env to send) ----', `To: ${String(message.to)}`, `Subject: ${message.subject}`, ...links.map((l) => `Link: ${l}`), '------------------------------------------------------------'].join('\n'),
    )
    return { ok: true }
  },
})
