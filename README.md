# The Hydrogen website

The website of [Hydrogen](https://github.com/hydrogencms/hydrogen): landing pages and the documentation. It is
itself a Hydrogen project.

- `cms/` is a Hydrogen project holding the landing pages (types and blocks in `cms/schema`, content committed in
  `cms/content` as a `hydrogen export`).
- The Astro site renders those pages at build time through the delivery API, with `@hydrogencms/astro`'s block
  components (`src/pages`, `src/components/blocks`).
- The docs are the hydrogen repository's `docs/*.md`, copied into Starlight under `/docs` by
  `scripts/sync-docs.mjs`. They are not edited here: change them in the hydrogen repository. `sidebar.mjs` orders them.

The output is static, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Run it

You need Go 1.26 and Node 22.12 or later, and a checkout of the hydrogen repository next to this one
(`../hydrogencms`), or `HYDROGEN_DOCS` set to its `docs` directory.

```sh
npm install
npm run cms          # terminal 1: builds cms/, imports cms/content into a fresh database, serves it on :8080
npm run dev          # terminal 2: http://localhost:4321
```

`npm run build` writes the static site to `dist/` (the CMS must be running).

## Edit the landing pages

1. Start the CMS with an admin user, `HYDROGEN_ADMIN_PASSWORD='a long passphrase' npm run cms`, and sign in at
   http://127.0.0.1:8080/admin/ as `admin`. Edit and publish pages; `npm run dev` shows them on reload. The
   database is rebuilt from `cms/content` on every start, so export before you stop it.
2. Write the content back with `scripts/cms.sh --export` while the CMS is running, and commit `cms/content`.

A new block type is a block in `cms/schema/blocks.yaml` (run `cms/.work/cms generate` in `cms/` for the types), a
component in `src/components/blocks/` and a line in `src/components/registry.ts`.

Links in blocks are plain strings: a path on this site (`/docs/getting-started/`) gets the site's base path, a full
URL is kept as it is. Pages can sit one level below the home page; a deeper page needs its own route file.

## Configuration

| Variable | Default | |
| --- | --- | --- |
| `SITE_URL` | `http://localhost:4321` | public origin (canonical URLs, sitemap) |
| `SITE_BASE` | (none) | the path the site lives under, such as `/website` on GitHub Pages without a custom domain |
| `SITE_HOST` | `localhost` | the host name of `SITE_URL`; the CMS channel matches URLs by it |
| `HYDROGEN_URL` | `http://127.0.0.1:8080` | the CMS |
| `HYDROGEN_DOCS` | `../hydrogencms/docs` | the docs to include |
