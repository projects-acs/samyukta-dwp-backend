'use strict';

/**
 * membership-application service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::membership-application.membership-application');
