'use strict';

// Idempotent seed for Header/Footer settings + sample Members.
// Safe to run on every start: each block only runs when its data is missing.

const content = require('./membership-content');

const headerDefaults = {
  showHeader: true,
  showTopBar: true,
  tagline: "Advancing Women's Mental Health",
  showPhone: true,
  showEmail: true,
  showJoinButton: true,
  joinLabel: 'Join Now',
  joinPage: 'membership',
  links: [
    { label: 'Home', page: 'home', visible: true, order: 1 },
    { label: 'About Us', page: 'about', visible: true, order: 2 },
    { label: 'Governing Body', page: 'governing_body', visible: true, order: 3 },
    {
      label: 'Events & Information', page: 'events', visible: true, order: 4,
      children: [
        { label: 'Psychiatric Disorders', page: 'psychiatric_disorders', visible: true, order: 1 },
        { label: 'Gallery', page: 'gallery', visible: true, order: 2 },
      ],
    },
    { label: 'Publications', page: 'publications', visible: true, order: 5 },
    {
      label: 'Membership', page: 'membership', visible: true, order: 6,
      children: [
        { label: 'Life Fellow Members', page: 'life_fellow_members', visible: true, order: 1 },
        { label: 'Associate Members', page: 'associate_members', visible: true, order: 2 },
      ],
    },
    { label: 'Contact', page: 'contact', visible: true, order: 7 },
  ],
};

const footerDefaults = {
  showFooter: true,
  showAbout: true,
  aboutText: 'A society of women psychiatrists working for education, research, awareness and support in women’s mental health.',
  showSocial: true,
  showQuickLinks: true,
  quickLinksTitle: 'Quick Links',
  quickLinks: [
    { label: 'Home', page: 'home', visible: true, order: 1 },
    { label: 'About Us', page: 'about', visible: true, order: 2 },
    { label: 'Governing Body', page: 'governing_body', visible: true, order: 3 },
    { label: 'Events & Information', page: 'events', visible: true, order: 4 },
    { label: 'Publications', page: 'publications', visible: true, order: 5 },
    { label: 'Membership', page: 'membership', visible: true, order: 6 },
    { label: 'Life Fellow Members', page: 'life_fellow_members', visible: true, order: 7 },
    { label: 'Associate Members', page: 'associate_members', visible: true, order: 8 },
    { label: 'Contact', page: 'contact', visible: true, order: 9 },
  ],
  showContact: true,
  showNewsletter: true,
  newsletterText: 'Get updates on events, CMEs and publications.',
  copyrightText: '',
};

async function seedExtras(strapi) {
  // ---- Header ----
  const header = await strapi.documents('api::header-setting.header-setting').findFirst();
  if (!header) {
    await strapi.documents('api::header-setting.header-setting').create({ data: headerDefaults, status: 'published' });
    strapi.log.info('[seed-extras] Header setting created.');
  }

  // ---- Footer ----
  const footer = await strapi.documents('api::footer-setting.footer-setting').findFirst();
  if (!footer) {
    await strapi.documents('api::footer-setting.footer-setting').create({ data: footerDefaults, status: 'published' });
    strapi.log.info('[seed-extras] Footer setting created.');
  }

  // ---- Payment setting (admin fills the bank details) ----
  const pay = await strapi.documents('api::payment-setting.payment-setting').findFirst();
  if (!pay) {
    await strapi.documents('api::payment-setting.payment-setting').create({
      data: {
        showPaymentDetails: true, associateFee: 5000, lifeFee: 10000, upgradeFee: 5000,
        accountName: 'Samyukta – Delhi Women Psychiatry Society',
        treasurerName: 'Dr. Sneha Sharma',
        instructions: 'Pay by NEFT / IMPS / UPI / cheque to the Society account and upload the payment screenshot or receipt with your application.',
      },
      status: 'published',
    });
    strapi.log.info('[seed-extras] Payment setting created (add bank details in admin).');
  }

  // ---- Sample members (delete these from the admin panel and add real ones) ----
  const any = await strapi.documents('api::member.member').findMany({ limit: 1 });
  if (!any || any.length === 0) {
    const designations = [
      'Consultant Psychiatrist (sample)', 'Professor, Department of Psychiatry (sample)',
      'Senior Consultant (sample)', 'Assistant Professor (sample)', 'Psychiatrist, Private Practice (sample)',
    ];
    const rows = [];
    for (let i = 1; i <= 24; i++) {
      const n = String(i).padStart(2, '0');
      rows.push({
        membershipId: `SAM/LF/${1000 + i}`, name: `Dr. Sample Fellow ${n}`, email: `fellow${n}@example.com`,
        designation: designations[i % designations.length], mobile: `90000000${n}`, memberType: 'life_fellow', showContact: true,
      });
    }
    for (let i = 1; i <= 37; i++) {
      const n = String(i).padStart(2, '0');
      rows.push({
        membershipId: `SAM/AM/${2000 + i}`, name: `Dr. Sample Associate ${n}`, email: `associate${n}@example.com`,
        designation: ['PG Resident (sample)', 'Senior Resident (sample)', '3rd Year PG (sample)'][i % 3],
        mobile: `80000000${n}`, memberType: 'associate', showContact: true,
      });
    }
    for (const data of rows) {
      await strapi.documents('api::member.member').create({ data, status: 'published' });
    }
    strapi.log.info(`[seed-extras] ${rows.length} sample members created.`);
  }
}

// One-time refresh of the OLD placeholder plans/FAQs (only when they still look like the original sample text).
// Anything the admin has already edited is left alone.
async function refreshMembershipContent(strapi) {
  const planApi = strapi.documents('api::membership-plan.membership-plan');
  const faqApi = strapi.documents('api::faq.faq');

  const plans = await planApi.findMany({ limit: 50 });
  for (const def of content.plans) {
    const cur = plans.find((p) => p.name === def.name);
    if (cur && cur.fee === content.PLACEHOLDER_FEE) {
      await planApi.update({ documentId: cur.documentId, data: def, status: 'published' });
      strapi.log.info(`[seed-extras] Updated plan "${def.name}".`);
    }
  }

  const faqs = await faqApi.findMany({ limit: 100 });
  if (faqs.length && faqs.some((f) => (f.a || '').startsWith('Sample answer'))) {
    for (const f of faqs) await faqApi.delete({ documentId: f.documentId });
    for (let i = 0; i < content.faqs.length; i++) {
      await faqApi.create({ data: { ...content.faqs[i], order: i + 1 }, status: 'published' });
    }
    strapi.log.info('[seed-extras] FAQs refreshed.');
  }
}

module.exports = { seedExtras, refreshMembershipContent };
