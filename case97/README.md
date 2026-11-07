# Case97

Real stories of historical and haunted places, in English, Français, Español and বাংলা.
Next.js 16 + Payload CMS 3 + MongoDB Atlas.

## Quick start

Requires **Node.js 22.23.4+ or 24.22.1+** (`node -v`).

```bash
npm install
cp .env.example .env     # fill in DATABASE_URI and PAYLOAD_SECRET at minimum
npm run dev
```

1. Open **http://localhost:3000/admin** and create your admin account (email + password).
   This is the only admin that can ever exist. Nobody can create a second one.
2. Stop the server, then load the demo stories:
   ```bash
   npm run seed            # 5 demo stories with illustrations
   npm run seed -- --fresh # wipe the demo content and add it again
   ```
3. `npm run dev` again and open **http://localhost:3000**.

What you only need to fill in `.env` to start: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`.
Everything else is optional while developing:

| Not set yet | What happens instead |
|---|---|
| Cloudflare R2 keys | Images and audio are saved in the project's `/media` and `/audio` folders |
| Brevo SMTP key | Emails aren't sent. Their links (confirm email, reset password) are printed in the terminal, so you can click them |
| Google Maps key | A basic Google map embed is used |
| AdSense IDs | No ads. In development, a dashed box shows where ads will go |

## Accounts

- **Admin (you)**: logs in only at `/admin`. Your account sees drafts, never sees ads and has Premium access.
- **Readers**: register at `/en/register` with email confirmation. They can save stories, choose a reading
  language and (later) subscribe. Readers can never open the admin panel or change their own plan.
- To give someone free Premium: Admin › Readers › open the reader › Subscription › tick *Granted manually*.

## Writing stories (Admin › Stories)

- Write the **English** version first: the web address is made from the English title.
- Switch the language at the top of the editor to add Français, Español or বাংলা versions.
  Untranslated parts fall back to English.
- Use the **+** menu in the story text to add: Image (5 layouts), Gallery, Fact box, Pull quote,
  **Chapter / page break** (starts a new page in book mode) and Narration pause (audio only).
- *Place & theme*: pick the theme (Haunted, History, Unsolved, Legend, Field guide). It changes the colours,
  fonts and mood of the whole story page.
- Tick **Premium only** to lock a story after its opening paragraphs.
- Case numbers (Case No. 006…) are given automatically.

## Site settings (Admin › Site Settings)

Featured story, tagline, social links, Discord invite, AdSense client ID and ad unit IDs, display prices.
**Replace the demo social links and Discord invite.**

## Pages

| URL | Page |
|---|---|
| `/en` (`/fr`, `/es`, `/bn`) | Homepage |
| `/en/stories` | All stories, filter by category |
| `/en/stories/<slug>` | Story: scroll or book mode, wishlist, map, related |
| `/en/register`, `/en/login`, `/en/forgot-password` | Reader accounts (Haunted Mirror design) |
| `/en/account` | Saved stories and plan |
| `/en/premium` | Premium plans (checkout comes in the payments phase) |
| `/admin` | Your admin panel |

## Free-tier services

**MongoDB Atlas**: M0 cluster, add your IP under Network Access (`0.0.0.0/0` later for hosting).
If you see `querySrv ECONNREFUSED`, keep `DNS_SERVERS=1.1.1.1,8.8.8.8` in `.env`.

**Cloudflare R2**: two buckets. `case97-media` with public access on, `case97-audio` private.
API token with *Object Read & Write* on both.

**Brevo**: SMTP & API › SMTP key. Authenticate your sending domain (SPF + DKIM).

## Not built yet

Payments checkout (Razorpay + Paddle). The webhooks that switch Premium on and off are already in
`src/app/webhooks/`. Also still to come: AI narration generation and the explore map page.
