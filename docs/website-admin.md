# Website forms and admin

The public forms at /contact and /bts2026 write enquiries to a dedicated libSQL database. Open /admin to sign in, filter enquiries, update their status and edit contact and summit settings.

## Production setup

Use the Vercel project that owns www.mwfuturetech.com. Connect a dedicated Turso database and set the following server-side production environment variables:

- TURSO_DATABASE_URL is the remote libSQL URL.
- TURSO_AUTH_TOKEN is a database token with read and write access to that database.
- MWFT_ADMIN_PASSWORD is a unique high-entropy password of at least 16 characters. Share it with the site administrators through your password manager.
- DEEPSEEK_API_KEY is a funded DeepSeek key. The FAQ uses DeepSeek Flash and stores per-session quotas by using the connected database. The site FAQ answers common questions if DeepSeek is unavailable.

Deploy after setting the variables. The first request initializes the database tables. Submit a test enquiry, verify it appears under /admin, and check that an incognito request to /api/admin returns 401. An unconfigured database returns a service error on form submission, so the site never reports a successful write before storage is ready.

The summit banner expires at midnight IST after 19 November 2026. The QR landing page stays available for follow-ups. Site settings include the optional WhatsApp number and company social profile URLs. An empty field hides that link.

## Local development

Copy the variable names from .env.example into .env.local. Use a file URL outside the repository for TURSO_DATABASE_URL to test against a persistent local database. Set MWFT_ADMIN_PASSWORD for the test account and run npm run dev.
