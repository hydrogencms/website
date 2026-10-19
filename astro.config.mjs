import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { groups, otherLabel } from './sidebar.mjs';
import { allPages, base } from './scripts/lib.mjs';

// SITE_URL is the public origin and SITE_BASE the path the site lives under (both set by the deploy workflow).
const site = process.env.SITE_URL || 'http://localhost:4321';

const present = new Set(allPages());
const sidebar = [...groups, { label: otherLabel, pages: [...present].filter((s) => !groups.some((g) => g.pages.includes(s))).sort() }]
  .map((g) => ({ label: g.label, items: g.pages.filter((s) => present.has(s)).map((s) => ({ slug: s === 'index' ? 'docs' : `docs/${s}` })) }))
  .filter((g) => g.items.length);

export default defineConfig({
  site,
  base: base || undefined,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: 'Hydrogen',
      description: 'A headless, composable CMS in Go.',
      logo: { light: './src/assets/mark-light.svg', dark: './src/assets/mark-dark.svg', alt: '' },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/hydrogencms/hydrogen' }],
      editLink: { baseUrl: 'https://github.com/hydrogencms/hydrogen/edit/main/docs/' },
      customCss: ['@fontsource-variable/schibsted-grotesk', '@fontsource-variable/jetbrains-mono', './src/styles/docs.css'],
      sidebar,
      plugins: [starlightLinksValidator({ errorOnInvalidHashes: true, errorOnRelativeLinks: false, errorOnLocalLinks: false })],
    }),
  ],
});
