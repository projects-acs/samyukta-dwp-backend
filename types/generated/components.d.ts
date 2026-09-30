import type { Schema, Struct } from '@strapi/strapi';

export interface SharedLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_items';
  info: {
    description: 'Single link: pick a page (or custom URL) and show/hide it';
    displayName: 'Link Item';
    icon: 'link';
  };
  attributes: {
    customPath: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    page: Schema.Attribute.Enumeration<
      [
        'home',
        'about',
        'governing_body',
        'events',
        'psychiatric_disorders',
        'gallery',
        'publications',
        'membership',
        'life_fellow_members',
        'associate_members',
        'contact',
        'custom',
      ]
    > &
      Schema.Attribute.DefaultTo<'home'>;
    visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_items';
  info: {
    description: 'Menu link with optional sub pages (dropdown)';
    displayName: 'Menu Item';
    icon: 'bulletList';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.link-item', true>;
    customPath: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    page: Schema.Attribute.Enumeration<
      [
        'home',
        'about',
        'governing_body',
        'events',
        'psychiatric_disorders',
        'gallery',
        'publications',
        'membership',
        'life_fellow_members',
        'associate_members',
        'contact',
        'custom',
      ]
    > &
      Schema.Attribute.DefaultTo<'home'>;
    visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.link-item': SharedLinkItem;
      'shared.menu-item': SharedMenuItem;
    }
  }
}
