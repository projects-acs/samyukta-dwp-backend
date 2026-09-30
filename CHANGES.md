# New in this version (Backend)

## Header Setting  (Content Manager → Single Types → Header Setting)
- Show Header on/off, Top bar on/off, Tagline, Phone/Email on/off
- Join button: show/hide, label, target page
- Links: add/remove/reorder items. Each item = Label + **Page (dropdown)** + Visible (on/off) + Order
- Sub pages: inside an item use "children" (dropdown menu). Hide any child with Visible = off.

## Footer Setting  (Single Types → Footer Setting)
- Show Footer on/off; toggle About, Social, Quick Links, Contact, Newsletter separately
- Quick Links: same Label / Page / Visible / Order list; custom title, about text, copyright text

Page dropdown values: home, about, governing_body, events, psychiatric_disorders, gallery,
publications, membership, life_fellow_members, associate_members, contact, custom (use "Custom path").

## Members  (Collection Type → Member)
Fields: membershipId, name, email, designation, mobile, memberType (life_fellow | associate), showContact.
- `showContact = off` hides email & mobile from the public API (server-side).
- 61 SAMPLE members are auto-created on first start. Delete them and add real members.

## Setup
1. `npm install` then `npm run develop`
2. On first start the seed creates Header/Footer settings + sample members and opens public READ permission.
   (Existing data is untouched.)

## Membership fees & FAQs (from the MOA)
- Plans: Associate Fellow ₹5,000, Life Fellow ₹10,000 (one-time). Upgrade note: ₹5,000.
- Content lives in `src/membership-content.js`. On next start, plans/FAQs that still contain the OLD placeholder
  text ("Fee to be announced" / "Sample answer") are replaced automatically. Anything you already edited is NOT touched.

## Online application + offline payment (like Delhi Psychiatric Society's "New Membership")
**Payment Setting** (Single Types → Payment Setting): Associate / Life / Upgrade fees, account name, bank, account no.,
branch, IFSC, UPI ID, UPI QR image, treasurer name, instructions. **Fill in the bank details here** – they appear on the form.

**Membership Application** now stores: personal + addresses, PG year, category, amount (set by the SERVER from Payment Setting),
proposer / seconder + signatures, documents, payment proof, transaction ID, payment date, declaration,
**applicationStatus** (pending → payment_verified → approved / rejected) and adminNotes.
- Treasurer workflow: open application → check payment proof against bank statement → set status.
- Visitors cannot set status/amount; only JPG/PNG/WEBP/PDF up to 5 MB are accepted (validated on the server).
- Files are uploaded through the application endpoint itself – public upload permission is NOT needed.
