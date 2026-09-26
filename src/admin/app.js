import favicon from '../extensions/favicon.png';
import logo from '../extensions/logo.png';
import authLogo from '../extensions/auth-logo.png';

export default {
  config: {
    head: {
      favicon: favicon,
    },
    auth: {
      logo: authLogo,
    },
    menu: {
      logo: logo,
    },
    // optional: rename "Strapi" in the tab title
    tutorials: false,
    notifications: { releases: false },
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Samyukta Admin',
      },
    },
  },
  bootstrap(app) {
    console.log(app);
  },
};