/**
 * André Lademann — Tailwind CSS v3 theme snippet (`theme.extend.colors`).
 * For Tailwind v4, prefer importing `brand/colors.css` and mapping in `@theme`.
 */
/** @type {import('tailwindcss').Config['theme']} */
const andreLademannBrandThemeExtend = {
  colors: {
    kieks: {
      aqua: '#00FFDC',
      navy: '#1E2A45',
      fuchsia: '#FF008F',
      white: '#FFFFFF',
      'dark-gray': '#333333'
    }
  }
};

module.exports = { theme: { extend: andreLademannBrandThemeExtend } };
