// The content of the landing pages, read from the website's CMS (cms/) through the delivery API at build time.
import { createClient, type Item, type TreeNode } from '@hydrogencms/client'
import type { HydrogenTypes, Landing, Page, SiteSettings } from '../../cms/gen/types'

const client = createClient<HydrogenTypes>({ baseUrl: process.env.HYDROGEN_URL ?? 'http://127.0.0.1:8080', channel: 'web' })
// The channel matches URLs by host (cms/config/channels.yaml); paths are the CMS's, without the site's base path.
const host = process.env.SITE_HOST ?? 'localhost'

const base = import.meta.env.BASE_URL.replace(/\/+$/, '')

/** A link of the content: a path on this site gets the base path (and pages a trailing slash); anything else is kept. */
export function href(h: string | undefined): string | undefined {
  if (!h) return undefined
  if (!h.startsWith('/') || h.startsWith('//')) return h
  const [path, rest = ''] = h.split(/(?=[?#])/)
  const file = /\.[a-z0-9]+$/i.test(path!)
  return base + (file || path!.endsWith('/') ? path : path + '/') + rest
}

/** The paths of the pages below the home page. Deeper pages need their own route file, so they fail the build. */
export async function pagePaths(): Promise<string[]> {
  const nodes = (await client.tree({ depth: 2 })).data
  const deep = nodes.flatMap((n) => n.nodes ?? []).filter((n) => n.kind === 'page')
  if (deep.length) throw new Error(`cms: nested pages need a route in src/pages: ${deep.map((n) => n.path).join(', ')}`)
  return nodes.filter((n: TreeNode) => n.kind === 'page' && n.path).map((n) => n.path!)
}

/** The navigation: the pages below the home page, in tree order. */
export async function nav(): Promise<{ name: string; href: string }[]> {
  const nodes = (await client.tree({ depth: 1 })).data
  return nodes.filter((n) => n.kind === 'page' && n.path).map((n) => ({ name: n.name, href: href(n.path)! }))
}

export type PageItem = Item<Landing | Page>

/** The published page at a path, with its links (item id -> path on this site). */
export async function load(path: string): Promise<{ item: PageItem; links: Record<string, string> }> {
  const r = (await client.route(`http://${host}${path}`)).data
  if (r.located.kind !== 'page' || !r.item) throw new Error(`cms: no page at ${path} (${r.located.kind})`)
  const item = r.item as PageItem
  const links = Object.fromEntries(Object.entries(item.links ?? {}).map(([id, u]) => [id, href(new URL(u).pathname)!]))
  return { item, links }
}

export async function settings(): Promise<SiteSettings> {
  return (await client.singleton('siteSettings')).data.fields
}
