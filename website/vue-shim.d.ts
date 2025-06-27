/* eslint-disable ts/consistent-type-imports */
declare module '*.vue' {
  const component: import('vue').Component
  export default component
}

declare const FMHY_HOMEPAGE_ITEMS: typeof import('./constants').wikiSidebar
