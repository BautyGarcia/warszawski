// Tipado global para el Google tag (gtag.js). Lo carga
// `components/analytics/GoogleTags.tsx` y lo consume `lib/analytics.ts`.
export {};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
