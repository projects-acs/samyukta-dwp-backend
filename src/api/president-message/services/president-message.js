'use strict';

/**
 * president-message service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::president-message.president-message');
