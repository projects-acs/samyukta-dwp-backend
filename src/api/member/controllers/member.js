'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

// Privacy: if admin switches "showContact" off, email & mobile never leave the server.
const mask = (m) => (m && m.showContact === false ? { ...m, email: null, mobile: null } : m);

module.exports = createCoreController('api::member.member', () => ({
  async find(ctx) {
    const res = await super.find(ctx);
    return { ...res, data: res.data.map(mask) };
  },
  async findOne(ctx) {
    const res = await super.findOne(ctx);
    return { ...res, data: mask(res.data) };
  },
}));
