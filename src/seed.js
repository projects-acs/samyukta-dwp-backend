'use strict';

const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const ASSETS = path.join(__dirname, '..', 'seed-assets');

async function uploadFile(strapi, relPath, alt) {
  const filePath = path.join(ASSETS, relPath);
  if (!fs.existsSync(filePath)) return null;
  const stats = fs.statSync(filePath);
  const name = path.basename(relPath);
  const type = mime.lookup(filePath) || 'application/octet-stream';

  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { alternativeText: alt || name, caption: alt || name } },
    files: { filepath: filePath, originalFilename: name, mimetype: type, size: stats.size },
  });
  return uploaded;
}

function toBlocks(paragraphs) {
  return paragraphs.map((p) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: p }],
  }));
}

async function setPublicPermissions(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const readTypes = [
    'hero-slide', 'focus-area', 'intro-tile', 'stat', 'objective', 'method',
    'team-member', 'event', 'post', 'membership-plan', 'faq', 'testimonial',
    'gallery-event', 'site-setting', 'president-message',
    'header-setting', 'footer-setting', 'member',
  ];
  const writeOnlyTypes = ['contact-submission', 'membership-application', 'newsletter-subscriber'];

  const permissionsToEnsure = [];
  for (const t of readTypes) {
    permissionsToEnsure.push(`api::${t}.${t}.find`);
    permissionsToEnsure.push(`api::${t}.${t}.findOne`);
  }
  for (const t of writeOnlyTypes) {
    permissionsToEnsure.push(`api::${t}.${t}.create`);
  }

  for (const action of permissionsToEnsure) {
    const existing = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    } else if (!existing.enabled && existing.enabled !== undefined) {
      // some Strapi versions use `enabled` flag; ensure true
      await strapi.query('plugin::users-permissions.permission').update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }
  strapi.log.info('[seed] Public role permissions ensured.');
}

async function seed(strapi) {
  const existing = await strapi.documents('api::hero-slide.hero-slide').findMany({ limit: 1 });
  if (existing && existing.length > 0) {
    strapi.log.info('[seed] Data already present, skipping seed.');
    return;
  }

  strapi.log.info('[seed] Seeding content...');

  // ---------- Media ----------
  const img1 = await uploadFile(strapi, 'image1.png', 'Championing Women\'s Mental Health');
  const img2 = await uploadFile(strapi, 'image2.png', 'Conferences, CMEs and Scientific Meetings');
  const img3 = await uploadFile(strapi, 'image3.png', 'Supportive network for women psychiatrists');
  const logo = await uploadFile(strapi, 'logo.jpg', 'Samyukta logo');
  const presidentImg = await uploadFile(strapi, 'president.webp', 'Dr. Sugandha Gupta');
  const event1 = await uploadFile(strapi, 'events/events1.jpeg', 'Annual Conference');
  const event2 = await uploadFile(strapi, 'events/events2.png', 'Perinatal Psychiatry CME');
  const event3 = await uploadFile(strapi, 'events/events3.png', 'Community Awareness Workshop');
  const article1 = await uploadFile(strapi, 'events/article1.png', 'Why Women\'s Mental Health Matters');
  const article2 = await uploadFile(strapi, 'events/article2.png', 'Peer Support for Clinicians');
  const article3 = await uploadFile(strapi, 'events/article3.png', 'Evidence Based Practice Updates');
  const placeholder = await uploadFile(strapi, 'doctors/placeholderimage.jpg', 'Gallery placeholder');
  const drSugandhaGupta = await uploadFile(strapi, 'doctors/drsugandhagupta.jpg', 'Dr. Sugandha Gupta');
  const drPrernaKukreti = await uploadFile(strapi, 'doctors/drprernakukreti.jpeg', 'Dr. Prerna Kukreti');
  const drJyotiKapoor = await uploadFile(strapi, 'doctors/drjyotikapoor.jpeg', 'Dr. Jyoti Kapoor');
  const drSnehaSharma = await uploadFile(strapi, 'doctors/drsnehasharma.jpeg', 'Dr. Sneha Sharma');
  const drPannaSharma = await uploadFile(strapi, 'doctors/drpannasharma.jpeg', 'Dr. Panna Sharma');
  const drHarsha = await uploadFile(strapi, 'doctors/drharsha.jpeg', 'Dr. Harsha');
  const drBhavneetKaur = await uploadFile(strapi, 'doctors/drbhavneetkaur.jpeg', 'Dr. Bhavneet Kaur');

  // ---------- Site Setting (single type) ----------
  await strapi.documents('api::site-setting.site-setting').create({ data: {
      name: 'Samyukta',
      fullName: 'Samyukta – Delhi Women Psychiatry Society',
      tagline: "Advancing Women's Mental Health",
      address: '3/12, First Floor, East Patel Nagar, New Delhi – 110008',
      areaOfOperation: 'National Capital Territory of Delhi',
      email: 'info@samyukta.org',
      phone: '+91 00000 00000',
      mapQuery: 'East Patel Nagar, New Delhi 110008',
      social: [
        { label: 'Website', href: '#', icon: 'Globe' },
        { label: 'Email', href: 'mailto:info@samyukta.org', icon: 'Mail' },
        { label: 'WhatsApp', href: '#', icon: 'MessageCircle' },
        { label: 'Share', href: '#', icon: 'Share2' },
      ],
      publishedAt: new Date(),
    }, status: 'published' });

  // ---------- President Message (single type) ----------
  await strapi.documents('api::president-message.president-message').create({ data: {
      name: 'Dr. Sugandha Gupta',
      designation: 'President, Samyukta – Delhi Women Psychiatry Society',
      image: presidentImg ? presidentImg.id : undefined,
      heading: 'President\u2019s Message',
      message: [
        'It is a privilege to serve as the President of Samyukta – Delhi Women Psychiatry Society at a time when the conversation around women\u2019s mental health is growing stronger.',
        'Our Society was founded to bring women psychiatrists together for education, research, awareness and mutual support. Our focus will be on strengthening academic activity, encouraging collaboration across disciplines and mentoring the next generation of psychiatrists.',
        'Together, we will work to advance women\u2019s mental health as a clinical discipline, a scientific pursuit and a public health priority.',
      ],
      closing: 'Warm regards,',
      publishedAt: new Date(),
    }, status: 'published' });

  // ---------- Hero Slides ----------
  const slides = [
    { order: 1, tone: 'plum', icon: 'Brain', image: img1, eyebrow: 'Delhi Women Psychiatry Society', title: "Championing Women's", highlight: 'Mental Health', description: 'A collective of women psychiatrists promoting education, research, awareness and compassionate care for women across Delhi and beyond.', primaryLabel: 'Become a Member', primaryLink: '/membership', secondaryLabel: 'About Samyukta', secondaryLink: '/about', badges: ['Education', 'Research', 'Advocacy'] },
    { order: 2, tone: 'teal', icon: 'GraduationCap', image: img2, eyebrow: 'Learn • Share • Grow', title: 'Conferences, CMEs &', highlight: 'Scientific Meetings', description: 'Stay updated with the latest developments in psychiatry through seminars, workshops, training programs and symposiums.', primaryLabel: 'View Events', primaryLink: '/events', secondaryLabel: 'Publications', secondaryLink: '/publications', badges: ['CME', 'Workshops', 'Symposiums'] },
    { order: 3, tone: 'night', icon: 'HeartHandshake', image: img3, eyebrow: 'Stronger Together', title: 'A Supportive Network for', highlight: 'Women Psychiatrists', description: 'Peer support, mentoring and guidance that nurture emotional, psychological and professional well-being of our members.', primaryLabel: 'Join the Network', primaryLink: '/membership', secondaryLabel: 'Contact Us', secondaryLink: '/contact', badges: ['Peer Support', 'Mentoring', 'Community'] },
  ];
  for (const s of slides) {
    await strapi.documents('api::hero-slide.hero-slide').create({ data: { ...s, image: s.image ? s.image.id : undefined, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Focus Areas ----------
  const focusAreas = [
    { icon: 'GraduationCap', title: 'Education & CME', description: 'Continuing professional development focused on women\u2019s mental health.' },
    { icon: 'Microscope', title: 'Research', description: 'Promoting and pursuing research in women\u2019s mental health and allied fields.' },
    { icon: 'Megaphone', title: 'Public Awareness', description: 'Seminars, workshops and campaigns that break stigma and inform communities.' },
    { icon: 'HeartHandshake', title: 'Peer Support', description: 'A structured support network for emotional and professional well-being.' },
    { icon: 'Newspaper', title: 'Publications', description: 'Journals, newsletters, reports and educational material.' },
    { icon: 'Users', title: 'Conferences', description: 'Periodical scientific meetings and psychiatric conferences.' },
    { icon: 'Handshake', title: 'Collaboration', description: 'Working with institutions, universities and professional bodies.' },
    { icon: 'ShieldCheck', title: 'Advocacy', description: 'Championing women\u2019s mental health within the medical fraternity.' },
  ];
  for (let i = 0; i < focusAreas.length; i++) {
    await strapi.documents('api::focus-area.focus-area').create({ data: { ...focusAreas[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Intro Tiles ----------
  const introTiles = [
    { icon: 'Users', title: 'Member Network', text: 'Connect with women psychiatrists across Delhi NCR and beyond.' },
    { icon: 'BookOpen', title: 'Knowledge Sharing', text: 'Exchange clinical insights, research findings and experiences.' },
    { icon: 'Calendar', title: 'Meetings & CMEs', text: 'Regular scientific meetings, workshops and training programs.' },
    { icon: 'Award', title: 'Professional Growth', text: 'Build competence and evidence-based practice together.' },
  ];
  for (let i = 0; i < introTiles.length; i++) {
    await strapi.documents('api::intro-tile.intro-tile').create({ data: { ...introTiles[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Stats ----------
  const stats = [
    { value: '8', label: 'Founding Governing Body Members' },
    { value: '10', label: 'Aims & Objects' },
    { value: '2', label: 'Membership Classes' },
    { value: 'Delhi', label: 'Area of Operation (NCT)' },
  ];
  for (let i = 0; i < stats.length; i++) {
    await strapi.documents('api::stat.stat').create({ data: { ...stats[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Objectives ----------
  const objectives = [
    'Promote self-education, research and continuous professional development in women\u2019s mental health and allied disciplines.',
    'Create and disseminate public awareness on women\u2019s mental health through seminars, workshops, campaigns and publications.',
    'Advocate women\u2019s mental health among medical professionals and institutions, encouraging interdisciplinary approaches.',
    'Establish a support network for members – peer support, guidance and structured interactions.',
    'Stay updated on research, policy and innovation in psychiatry nationally and internationally.',
    'Facilitate exchange of clinical knowledge, academic insights and real-world professional experience.',
    'Organise conferences, seminars, workshops, training programs, CME sessions and symposiums.',
    'Collaborate with government authorities, medical institutions, research bodies, universities and professional associations.',
    'Publish and circulate journals, newsletters, research papers, reports and educational material.',
    'Undertake any lawful activity conducive to the attainment of the above objects.',
  ];
  for (let i = 0; i < objectives.length; i++) {
    await strapi.documents('api::objective.objective').create({ data: { text: objectives[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Methods ----------
  const methods = [
    'Hold psychiatric conferences and periodical scientific meetings.',
    'Print, publish, translate and distribute journals, books, monographs, treatises or pamphlets.',
    'Publish annual reports and special bulletins.',
    'Co-operate with professional bodies and join national or international societies.',
    'Acquire property necessary or convenient for the purpose of the Society.',
    'Collect subscriptions and donations and disburse funds for the Society\u2019s objects.',
    'Invest funds not immediately required, as decided by the Society.',
    'Do all incidental or subsidiary things conducive to the objects.',
  ];
  for (let i = 0; i < methods.length; i++) {
    await strapi.documents('api::method.method').create({ data: { text: methods[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Team Members ----------
  const team = [
    { name: 'Dr. Sugandha Gupta', designation: 'President', group: 'Office Bearers', photo: drSugandhaGupta },
    { name: 'Dr. Prerna Kukreti', designation: 'Vice President', group: 'Office Bearers', photo: drPrernaKukreti },
    { name: 'Dr. Vekata Subba Lakshmi Kota', designation: 'Secretary', group: 'Office Bearers', photo: null },
    { name: 'Dr. Jyoti Kapoor', designation: 'Joint Secretary', group: 'Office Bearers', photo: drJyotiKapoor },
    { name: 'Dr. Sneha Sharma', designation: 'Treasurer', group: 'Office Bearers', photo: drSnehaSharma },
    { name: 'Dr. Panna Sharma', designation: 'Executive Member', group: 'Executive Members', photo: drPannaSharma },
    { name: 'Dr. Harsha', designation: 'Executive Member', group: 'Executive Members', photo: drHarsha },
    { name: 'Dr. Bhavneet Kaur', designation: 'Executive Member', group: 'Executive Members', photo: drBhavneetKaur },
  ];
  for (let i = 0; i < team.length; i++) {
    const t = team[i];
    await strapi.documents('api::team-member.team-member').create({ data: { name: t.name, designation: t.designation, group: t.group, photo: t.photo ? t.photo.id : undefined, order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Events ----------
  const events = [
    { slug: 'annual-conference', title: 'Annual Conference on Women\u2019s Mental Health', date: '2026-11-14T09:00:00', venue: 'New Delhi (venue to be announced)', category: 'Conference', summary: 'A full-day scientific programme with keynote sessions, panel discussions and paper presentations.', image: event1 },
    { slug: 'perinatal-psychiatry-cme', title: 'CME: Perinatal Psychiatry Update', date: '2026-10-25T10:00:00', venue: 'Online (Zoom)', category: 'CME', summary: 'An interactive CME on recognition and management of perinatal mood and anxiety disorders.', image: event2 },
    { slug: 'awareness-workshop', title: 'Community Awareness Workshop', date: '2026-12-06T11:00:00', venue: 'Delhi NCR', category: 'Workshop', summary: 'Public awareness session on breaking stigma around women\u2019s mental health.', image: event3 },
    { slug: 'inaugural-meet', title: 'Society Inaugural Meet', date: '2026-08-15T10:00:00', venue: 'New Delhi', category: 'Meeting', summary: 'First get-together of founding members and invitees.', image: event3 },
  ];
  for (const e of events) {
    await strapi.documents('api::event.event').create({ data: { title: e.title, slug: e.slug, date: e.date, venue: e.venue, category: e.category, summary: e.summary, image: e.image ? e.image.id : undefined, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Posts ----------
  const posts = [
    { slug: 'why-womens-mental-health-matters', title: 'Why Women\u2019s Mental Health Deserves Its Own Focus', category: 'Awareness', author: 'Samyukta Editorial', excerpt: 'Hormonal transitions, caregiving roles and social pressures shape mental health differently across a woman\u2019s life.', content: ['Sample article content. Replace this with your own article text or connect Strapi rich text.', 'Women\u2019s mental health needs approaches that consider biological, psychological and social factors together.'], cover: article1, date: '2026-09-05' },
    { slug: 'peer-support-for-clinicians', title: 'The Power of Peer Support Among Clinicians', category: 'Community', author: 'Samyukta Editorial', excerpt: 'How structured peer networks improve well-being and clinical confidence for practising psychiatrists.', content: ['Sample article content.', 'Peer support builds resilience and encourages knowledge exchange.'], cover: article2, date: '2026-08-20' },
    { slug: 'evidence-based-practice-updates', title: 'Evidence-Based Practice: What\u2019s New in Psychiatry', category: 'Research', author: 'Samyukta Editorial', excerpt: 'A quick look at recent developments relevant to women\u2019s mental health clinics.', content: ['Sample article content.', 'Add your summaries of recent research here.'], cover: article3, date: '2026-08-02' },
  ];
  for (const p of posts) {
    await strapi.documents('api::post.post').create({ data: {
        title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category, author: p.author,
        content: toBlocks(p.content), cover: p.cover ? p.cover.id : undefined,
        publishedAt: new Date(p.date),
      }, status: 'published' });
  }

  // ---------- Membership Plans ----------
  const plans = [
    { name: 'Associate Fellow', fee: 'Fee to be announced', description: 'For psychiatrists who wish to be part of Samyukta\u2019s academic and support network.', highlighted: false, benefits: ['Listing in the digital membership directory', 'Invitations to scientific meetings & CMEs', 'Access to publications and newsletters', 'Peer support network'] },
    { name: 'Life Fellow', fee: 'Fee to be announced', description: 'A lifelong association with the Society with full participation in its activities.', highlighted: true, benefits: ['Everything in Associate Fellow', 'Lifelong membership status', 'Eligibility to participate in Society governance as per rules', 'Priority for conferences and workshops'] },
  ];
  for (let i = 0; i < plans.length; i++) {
    await strapi.documents('api::membership-plan.membership-plan').create({ data: { ...plans[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- FAQs ----------
  const faqs = [
    { q: 'Who can become a member?', a: 'Sample answer – update as per Society rules and eligibility criteria.' },
    { q: 'How is membership status decided?', a: 'The Council decides the membership status; it counts from the date the membership fee is received and updated in the Society account.' },
    { q: 'Is there a membership directory?', a: 'Yes. The register of members is updated every year and the directory is accessible to members digitally.' },
  ];
  for (let i = 0; i < faqs.length; i++) {
    await strapi.documents('api::faq.faq').create({ data: { ...faqs[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Testimonials ----------
  const voices = [
    { name: 'Member Name', role: 'Consultant Psychiatrist, Delhi', text: 'A wonderful platform to learn from peers and contribute to women\u2019s mental health.' },
    { name: 'Member Name', role: 'Senior Resident, Delhi NCR', text: 'The scientific meetings and mentoring have been truly valuable for my practice.' },
    { name: 'Member Name', role: 'Psychiatrist', text: 'Samyukta gives us a safe and supportive space to grow professionally.' },
  ];
  for (let i = 0; i < voices.length; i++) {
    await strapi.documents('api::testimonial.testimonial').create({ data: { ...voices[i], order: i + 1, publishedAt: new Date() }, status: 'published' });
  }

  // ---------- Gallery Events ----------
  const galleryEvents = [
    { slug: 'dps-midterm-cme-2024-roseate-house-aerocity', title: 'Dps Midterm CME 2024 at Roseate House, Aerocity', description: 'Dps Midterm CME 2024 at Roseate House, Aerocity', count: 12 },
    { slug: 'exploring-new-paradigm-management-of-mdd', title: 'Exploring the New Paradigm in Management of MDD', description: 'DPS CME on "Exploring the New Paradigm in Management of MDD" 21/7/2024, at Radisson Blu Plaza', count: 6 },
  ];
  for (const g of galleryEvents) {
    await strapi.documents('api::gallery-event.gallery-event').create({ data: {
        title: g.title,
        slug: g.slug,
        description: g.description,
        cover: placeholder ? placeholder.id : undefined,
        images: placeholder ? Array(g.count).fill(placeholder.id) : [],
        publishedAt: new Date(),
      }, status: 'published' });
  }

  strapi.log.info('[seed] Seeding complete.');
}

module.exports = { seed, setPublicPermissions };
