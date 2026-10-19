import { createRegistry } from '@hydrogencms/astro/runtime'
import Callout from './blocks/Callout.astro'
import Code from './blocks/Code.astro'
import Feature from './blocks/Feature.astro'
import Features from './blocks/Features.astro'
import Hero from './blocks/Hero.astro'
import Prose from './blocks/Prose.astro'

/** Block type -> component (cms/schema/blocks.yaml). Every component spreads `attrs` on its root. */
export const registry = createRegistry({ hero: Hero, prose: Prose, features: Features, feature: Feature, code: Code, callout: Callout })
