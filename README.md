# Samyukta – Strapi Backend

This is a ready-to-run **Strapi v5** backend built specifically for the `samyukta-dwp` React app.
All content types match the field names your React code already expects (see `src/services/api.js`
and `src/data/*.js` in the React project — they were written with these exact Strapi collection
names in mind).

Real content from the React project's static data has already been seeded in, including images
(hero slides, team photos, event images, the President's photo, article covers, etc).

## 1. Install & run

```bash
cd samyukta-strapi
npm install
npm run develop
```

Open `http://localhost:1337/admin` and create your first admin account (this only happens once).

The database is SQLite (`.tmp/data.db`) — nothing else to install or configure.

On first boot, a bootstrap script (`src/index.js` -> `src/seed.js`) automatically:
- Uploads all images from `seed-assets/`
- Creates every entry (hero slides, focus areas, team members, events, posts, membership plans,
  FAQs, testimonials, gallery events, objectives, methods, the Site Settings single type, and the
  President's Message single type)
- Publishes everything (so it's visible over the public API immediately)
- Sets Public role permissions: `find`/`findOne` on all read-only content types, and `create` on
  `contact-submissions`, `membership-applications`, `newsletter-subscribers` (so your forms work
  without needing an API token)

If you ever wipe `.tmp/data.db` and restart, it will re-seed automatically. If data already
exists, seeding is skipped (safe to restart any time).

## 2. Content types created

**Collection types** (public read access):
`hero-slide`, `focus-area`, `intro-tile`, `stat`, `objective`, `method`, `team-member`, `event`,
`post`, `membership-plan`, `faq`, `testimonial`, `gallery-event`

**Collection types** (public create access only — for forms):
`contact-submission`, `membership-application`, `newsletter-subscriber`

**Single types** (public read access):
`site-setting`, `president-message`

## 3. Connect the React app

In your React project (`samyukta-dwp`), create a `.env` file:

```
VITE_USE_STRAPI=true
VITE_STRAPI_URL=http://localhost:1337
```

That's it. `src/services/api.js` in the React app already switches from `/src/data` static files
to live Strapi calls when `VITE_USE_STRAPI=true` — no component code needs to change.

## 4. Notes / things you may want to update later

- `Dr. Vekata Subba Lakshmi Kota` (Secretary) has no photo in the original project, so that field
  is empty — upload one from the admin panel under **Content Manager -> Team Member** whenever
  you have it.
- Membership fees are placeholders ("Fee to be announced") — edit under **Membership Plan**.
- Testimonials use placeholder names ("Member Name") — replace with real member feedback under
  **Testimonial**.
- Gallery events currently reuse a single placeholder image for every photo — upload real event
  photos under **Content Manager -> Gallery Event** and replace the `images` field.
- Phone number in Site Settings is a placeholder (`+91 00000 00000`) — update under
  **Content Manager -> Site Setting**.

## 5. Deploying

For production, swap SQLite for Postgres/MySQL (update `config/database.js` and `.env`), set
`NODE_ENV=production`, run `npm run build`, then `npm run start`. Any standard Strapi hosting
(Railway, Render, Strapi Cloud, a VPS, etc.) works — this project uses no custom infrastructure.
