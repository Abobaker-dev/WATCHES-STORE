# AURELIS — luxury watch site + secure backend

Requires Node 18+. No npm install needed (zero dependencies).

    cp .env.example .env     # fill in values (see below)
    npm start                # http://localhost:3000

Open the site through the server (not by double-clicking index.html) so accounts, wishlist and payments work.

## What you must configure (all in .env, never in frontend code)
- SESSION_SECRET — long random string.
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET — payments. Create a webhook to BASE_URL/api/stripe-webhook for checkout.session.completed.
  Orders are marked paid ONLY after Stripe's signed webhook. Locally: `stripe listen --forward-to localhost:3000/api/stripe-webhook`.
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET — redirect URI BASE_URL/auth/google/callback.
- FACEBOOK_APP_ID / FACEBOOK_APP_SECRET — redirect URI BASE_URL/auth/facebook/callback.
- RESEND_API_KEY + MAIL_FROM — optional, for verification / reset / confirmation emails (otherwise links print in the server console).
- BASE_URL — your public https URL in production.

Prices are charged from catalog.json on the server (never trusted from the browser). Card data never touches this server (Stripe-hosted Checkout).
Data is stored in data/db.json (fine for development; use a real database in production).

## Admin dashboard (/admin)
1. Generate a password hash: `node scripts/hash-password.js "a-long-password"`
2. In `.env` set `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (paste the output). Never put the plain password in the frontend.
3. `npm start`, then open http://localhost:3000/admin and sign in.

You can add, edit, publish/unpublish, archive, delete products, change price and stock, and upload images (resized in the browser to 1600 px JPEG).
Changes appear on the public site immediately. Products live in `data/products.json`; uploads in `public/uploads/`.
Hosting note: use a host with a persistent disk (or move products/images to a database + object storage) so data survives redeploys.
Admin login is rate-limited (5 failures → 15-minute lock), uses an HttpOnly SameSite=Strict cookie, and is separate from customer accounts. Use HTTPS in production (set BASE_URL to https://…).
