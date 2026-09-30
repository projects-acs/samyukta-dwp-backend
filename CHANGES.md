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
