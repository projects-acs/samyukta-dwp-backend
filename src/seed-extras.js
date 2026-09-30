'use strict';

// Idempotent seed for Header/Footer settings + sample Members.
// Safe to run on every start: each block only runs when its data is missing.

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

module.exports = { seedExtras };
