'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

const UID = 'api::membership-application.membership-application';
const TYPES = { 'Associate Fellow': 'associateFee', 'Life Fellow': 'lifeFee' };
const OK_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per file
const FILE_FIELDS = { proposerSignature: 1, seconderSignature: 1, paymentProof: 1, documents: 8 };

// Only these text fields are accepted from the public form (status/adminNotes/amount can never be set by the visitor).
const TEXT_FIELDS = [
  'name', 'email', 'phone', 'qualification', 'registrationNo', 'pgYear', 'professionalAddress',
  'residentialAddress', 'membershipType', 'proposedBy', 'secondedBy', 'transactionId', 'paymentDate', 'applicationDate',
];
const REQUIRED = ['name', 'email', 'phone', 'qualification', 'registrationNo', 'membershipType', 'proposedBy', 'secondedBy', 'transactionId'];

const asArray = (f) => (f ? (Array.isArray(f) ? f : [f]) : []);

module.exports = createCoreController(UID, ({ strapi }) => ({
  // Accepts multipart/form-data:  data = JSON string,  files: proposerSignature, seconderSignature, documents (multiple), paymentProof
  async create(ctx) {
    const body = ctx.request.body || {};
    let raw = body.data;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch { return ctx.badRequest('Invalid form data'); }
    }
    raw = raw || {};

    const data = {};
    for (const k of TEXT_FIELDS) if (raw[k] !== undefined && raw[k] !== null) data[k] = String(raw[k]).trim();

    for (const k of REQUIRED) if (!data[k]) return ctx.badRequest(`${k} is required`);
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return ctx.badRequest('Invalid email');
    if (!TYPES[data.membershipType]) return ctx.badRequest('Invalid membership type');
    if (raw.declaration !== true && raw.declaration !== 'true') return ctx.badRequest('Declaration must be accepted');

    const files = ctx.request.files || {};
    if (!asArray(files.paymentProof).length) return ctx.badRequest('Payment proof is required');
    if (!asArray(files.documents).length) return ctx.badRequest('Required documents must be uploaded');

    // Validate + upload files
    const ids = {};
    for (const [field, max] of Object.entries(FILE_FIELDS)) {
      const list = asArray(files[field]);
      if (list.length > max) return ctx.badRequest(`Too many files for ${field}`);
      for (const f of list) {
        if (!OK_MIME.includes(f.mimetype)) return ctx.badRequest('Only JPG, PNG, WEBP or PDF files are allowed');
        if (f.size > MAX_SIZE) return ctx.badRequest('Each file must be 5 MB or smaller');
      }
      if (!list.length) continue;
      const uploaded = await strapi.plugin('upload').service('upload').upload({
        data: { fileInfo: { alternativeText: `${field} – ${data.name}`, caption: field } },
        files: list.length === 1 ? list[0] : list,
      });
      ids[field] = max === 1 ? uploaded[0].id : uploaded.map((u) => u.id);
    }

    // Amount is decided by the server from Payment Setting (cannot be tampered with)
    const pay = await strapi.documents('api::payment-setting.payment-setting').findFirst();
    const amount = (pay && pay[TYPES[data.membershipType]]) || (data.membershipType === 'Life Fellow' ? 10000 : 5000);

    const entry = await strapi.documents(UID).create({
      data: {
        ...data, ...ids, amount, declaration: true,
        applicationDate: data.applicationDate || new Date().toISOString().slice(0, 10),
        applicationStatus: 'pending',
      },
      status: 'published',
    });
    ctx.status = 201;
    return { data: { id: entry.id, documentId: entry.documentId, amount, applicationStatus: 'pending' } };
  },
}));
