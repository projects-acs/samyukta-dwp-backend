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
    // Admin panel colors (matches the website's purple)
    theme: {
      light: {
        colors: {
          primary100: '#f3e8ff',
          primary200: '#e4d0fb',
          primary500: '#9b53d9',
          primary600: '#8035bd', // main button / link color
          primary700: '#66299a',
          buttonPrimary500: '#9b53d9',
          buttonPrimary600: '#8035bd',
        },
      },
      dark: {
        colors: {
          primary100: '#33154f',
          primary200: '#4f2178',
          primary500: '#9b53d9',
          primary600: '#b47eea',
          primary700: '#ffffff',
          buttonPrimary500: '#9b53d9',
          buttonPrimary600: '#8035bd',
        },
      },
    },
  },
  bootstrap(app) {
    console.log(app);
  },
};