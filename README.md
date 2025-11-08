# RoofNinjaCRM — Day 1 (Production‑Ready)

This is a production‑ready foundation (Next.js 16 + Supabase + Stripe) with safe secret handling.

## Security & Secrets (important)
- **Never commit real secrets**. `.gitignore` blocks `.env*` by default. Keep only `.env.example` in GitHub.
- **Client-exposed vars** must begin with `NEXT_PUBLIC_` (e.g., Supabase URL & anon key). These are safe by design.
- **Server-only secrets** (Stripe secret key, Supabase service_role, webhook secret) go in **Vercel → Project → Settings → Environment Variables**.
- The **service_role key is only used inside the Stripe webhook route** (server context). It is never sent to the browser.

## One-time Setup (no command line required)
1) **Create Supabase project**  
   - Note `Project URL`, `anon key`, `service_role` (Settings → API).  
   - SQL Editor → run the three files in `/supabase` in order:
     1. `migrations.sql`
     2. `policies.sql`
     3. `edge_functions.sql`
   - In Supabase **Authentication → Providers**, keep **Email** enabled.
   - In **Authentication → URL configuration**, set **Site URL** = `https://YOUR_DOMAIN` (your Vercel domain now; change later when you move domains). Add redirect: `https://YOUR_DOMAIN/*`.

2) **Create Stripe product (test mode)**  
   - Products → Add product → recurring monthly price → copy the **Price ID**.  
   - Developers → API keys → copy **Secret key** (starts with `sk_test_...`).  
   - Developers → Webhooks → Add endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`  
     - Events to send: `customer.subscription.created`, `customer.subscription.updated`.  
     - Copy the **Webhook signing secret** (`whsec_...`).

3) **Put code on GitHub**  
   - Upload everything in this folder to a new public or private repo.  
   - `.gitignore` already prevents env files from being uploaded.

4) **Deploy on Vercel**  
   - Add New → Project → select your GitHub repo.  
   - After import, go to **Settings → Environment Variables** and add:
     - `NEXT_PUBLIC_APP_URL` = `https://YOUR_DOMAIN`
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
     - `SUPABASE_SERVICE_ROLE` = your Supabase service_role key (server only)
     - `STRIPE_SECRET_KEY` = your Stripe secret key
     - `STRIPE_PRICE_ID` = your Stripe price id
     - `STRIPE_WEBHOOK_SECRET` = your Stripe webhook secret
   - Redeploy.

5) **Optional: Attach your domain (jobsitepics.com)**  
   - Vercel → Project → Domains → Add.  
   - Add the DNS record it shows (usually CNAME).  
   - Update `NEXT_PUBLIC_APP_URL` to your domain and redeploy.

## Try it
- Visit `/login` → create account → email confirm (or temporarily disable confirm during testing).  
- Go to `/app` → create organization.  
- `/app/billing` → Start Subscription → complete Stripe Checkout using test card `4242 4242 4242 4242` (any future expiry + any CVC).  
- Open Customer Portal to verify subscription status.

## What’s included
- Multi-tenant orgs with RBAC (owner, manager, tech) via Postgres RLS
- Auth via Supabase (email/password)
- Stripe Billing (Checkout + Billing Portal) with a secure webhook
- Audit log table for key actions
- Security headers via `next.config.mjs`
- Domain-agnostic configuration (change only `NEXT_PUBLIC_APP_URL` later)

## Production tips
- In Supabase Auth, configure email sender/domain (or use your own SMTP).  
- In Stripe, switch to **live mode** when you’re ready; update `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` in Vercel.  
- Consider adding error monitoring (e.g., Sentry) and daily DB backups (Supabase has managed backups).

---

**Brand:** RoofNinjaCRM (red `#bb312e`, black, white).  
Want your Roof Ninjas wordmark in the header? Tell me and I’ll ship a ready-to-paste update.
