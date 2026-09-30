'use strict';

// Single source of truth for membership plans & FAQs (from the MOA, Article V, VI, IX, XII).
// Used by the first-time seed AND by the one-time refresh in seed-extras.js.

const PLACEHOLDER_FEE = 'Fee to be announced';

const plans = [
  {
    name: 'Associate Fellow',
    fee: '₹5,000 (one-time)',
    description: 'For women psychiatrists with a recognised postgraduate qualification in psychiatry and up to 10 years of whole-time practice since it, including senior residents.',
    highlighted: false,
    benefits: [
      'Listing in the digital membership directory',
      'Receive the Society’s reports, statement of accounts and journal',
      'Attend scientific meetings, lectures, CMEs and General Body Meetings',
      'Peer support and mentoring network',
    ],
  },
  {
    name: 'Life Fellow',
    fee: '₹10,000 (one-time)',
    description: 'For women psychiatrists with more than 10 years of whole-time practice since their postgraduate qualification in psychiatry.',
    highlighted: true,
    benefits: [
      'Everything in Associate Fellow',
      'Voting rights – elect office-bearers and Council members',
      'Vote on amendments to the Society’s rules and bye-laws',
      'Lifelong membership with no annual subscription',
    ],
  },
];

const faqs = [
  {
    q: 'Who can become a member?',
    a: 'Female psychiatrists who hold a recognised postgraduate qualification in psychiatry and are engaged in whole-time practice. Associate Fellows have up to 10 years since their PG qualification (the three years of senior residency are included, so senior residents can join as Associates). Life Fellows have more than 10 years.',
  },
  {
    q: 'What are the membership fees?',
    a: 'Associate Fellow: ₹5,000. Life Fellow: ₹10,000. Upgrading from Associate to Life Fellow: ₹5,000. These are one-time fees – no annual subscription is payable unless the Executive Council decides otherwise in future.',
  },
  {
    q: 'How do I apply?',
    a: 'Submit the application with the applicable fee and sign the declaration to promote the Society’s aims and objects. Your name must be proposed and seconded by two existing Fellows (Associate or Life). The Executive Council then considers and elects you, and the General Secretary confirms your election by letter.',
  },
  {
    q: 'How is membership status decided?',
    a: 'The Council decides the membership status; it counts from the date the membership fee is received and updated in the Society account.',
  },
  {
    q: 'Who has voting rights?',
    a: 'Only Life Fellows can vote in the election of office-bearers and Council members, and on amendments to the rules and bye-laws. All members can attend General Body Meetings and vote on other matters.',
  },
  {
    q: 'Is there a membership directory?',
    a: 'Yes. The register of members is updated every year and the directory is accessible to members digitally.',
  },
];

module.exports = { PLACEHOLDER_FEE, plans, faqs };
