/**
 * Demo content for Case97: 5 categories, 4 places, 8 illustrations and 5 stories
 * (one with French + Spanish, one fully in Bengali, one Premium-only).
 *
 *   npm run seed            add the demo content (skips if it's already there)
 *   npm run seed -- --fresh delete the demo content and add it again
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { chapter, doc, fact, h, image, p, pause, quote } from './lexical'

const DEMO_CREDIT = 'Case97 demo illustration'
const DEMO_SLUGS = ['the-fort-that-closes-at-sunset', 'the-red-building-on-dalhousie-square', 'the-brahmadaitya-of-the-old-bel-tree', 'kuldhara-the-village-that-emptied-overnight', 'visiting-dow-hill-kurseong']
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

const payload = await getPayload({ config })
const fresh = process.argv.includes('--fresh')
const log = (m: string) => payload.logger.info(`[seed] ${m}`)

const existing = await payload.count({ collection: 'stories', where: { slug: { in: DEMO_SLUGS } }, overrideAccess: true })
if (existing.totalDocs && !fresh) {
  log('Demo stories already exist. Run "npm run seed -- --fresh" to recreate them.')
  process.exit(0)
}

if (fresh) {
  log('Removing old demo content…')
  await payload.delete({ collection: 'stories', where: { slug: { in: DEMO_SLUGS } }, overrideAccess: true })
  await payload.delete({ collection: 'places', where: { slug: { in: ['bhangarh-fort', 'writers-building', 'kuldhara', 'dow-hill-kurseong'] } }, overrideAccess: true })
  await payload.delete({ collection: 'categories', where: { slug: { in: ['haunted-places', 'historical', 'legends-folklore', 'unsolved', 'field-guides'] } }, overrideAccess: true })
  await payload.delete({ collection: 'media', where: { credit: { equals: DEMO_CREDIT } }, overrideAccess: true })
}

// ---------- Categories (with translations) ----------
type Loc = 'fr' | 'es' | 'bn'
const catData = [
  { slug: 'haunted-places', theme: 'haunted', en: 'Haunted places', fr: 'Lieux hantés', es: 'Lugares embrujados', bn: 'ভৌতিক জায়গা' },
  { slug: 'historical', theme: 'chronicle', en: 'Historical', fr: 'Histoire', es: 'Historia', bn: 'ইতিহাস' },
  { slug: 'legends-folklore', theme: 'folklore', en: 'Legends & folklore', fr: 'Légendes', es: 'Leyendas', bn: 'লোককথা' },
  { slug: 'unsolved', theme: 'mystery', en: 'Unsolved', fr: 'Énigmes', es: 'Misterios', bn: 'রহস্য' },
  { slug: 'field-guides', theme: 'fieldGuide', en: 'Field guides', fr: 'Guides', es: 'Guías', bn: 'ভ্রমণ গাইড' },
] as const
const cats: Record<string, string | number> = {}
for (const c of catData) {
  const doc = await payload.create({ collection: 'categories', data: { name: c.en, slug: c.slug, defaultTheme: c.theme }, overrideAccess: true })
  for (const l of ['fr', 'es', 'bn'] as Loc[]) {
    await payload.update({ collection: 'categories', id: doc.id, locale: l, data: { name: c[l] }, overrideAccess: true })
  }
  cats[c.slug] = doc.id
}
log('Categories ready')

// ---------- Illustrations ----------
const media: Record<string, string | number> = {}
const images: [string, string, string][] = [
  ['bhangarh', 'bhangarh.jpg', 'Ruined fort walls on a hill at dusk'],
  ['gate', 'bhangarh-gate.jpg', 'Arched gateway with a notice board in the evening fog'],
  ['writers', 'writers-building.jpg', 'Red colonial building with white columns'],
  ['archive', 'archive-shelves.jpg', 'Old archive shelves lit by a single lamp'],
  ['beltree', 'bel-tree.jpg', 'A twisted bare tree under a full moon'],
  ['kuldhara', 'kuldhara.jpg', 'Roofless desert houses at sunset'],
  ['doors', 'kuldhara-doors.jpg', 'Empty doorways in a mud wall'],
  ['dowhill', 'dow-hill.jpg', 'A road disappearing into a foggy pine forest'],
]
for (const [key, file, alt] of images) {
  // Demo images ship with the site in /public/demo. Your own images will be Cloudinary links.
  const m = await payload.create({ collection: 'media', data: { url: `/demo/${file}`, alt, credit: DEMO_CREDIT }, overrideAccess: true })
  media[key] = m.id
}
log('Demo images added')

// ---------- Places (coordinates are approximate: check them in Google Maps) ----------
const place = async (data: Record<string, unknown>) => (await payload.create({ collection: 'places', data: data as never, overrideAccess: true })).id
const bhangarh = await place({
  name: 'Bhangarh Fort', slug: 'bhangarh-fort', country: 'India', region: 'Rajasthan', location: [76.2884, 27.0965],
  address: 'Bhangarh, Alwar district, Rajasthan',
  description: 'The ruins of a 16th-century town and fort at the edge of the Sariska hills.',
  visitingInfo: 'Open from sunrise to sunset. Entry after dark is not allowed.', coverImage: media.bhangarh,
})
const writers = await place({
  name: 'Writers’ Building', slug: 'writers-building', country: 'India', region: 'West Bengal', location: [88.3491, 22.5727],
  address: 'B.B.D. Bagh, Kolkata', description: 'The long red building on the north side of B.B.D. Bagh, built in the 1770s.', coverImage: media.writers,
})
const kuldhara = await place({
  name: 'Kuldhara', slug: 'kuldhara', country: 'India', region: 'Rajasthan', location: [70.7988, 26.8172],
  address: 'Kuldhara, near Jaisalmer, Rajasthan', description: 'An abandoned village of stone and mud houses in the Thar desert.', coverImage: media.kuldhara,
})
const dowhill = await place({
  name: 'Dow Hill', slug: 'dow-hill-kurseong', country: 'India', region: 'West Bengal', location: [88.2755, 26.8826],
  address: 'Dow Hill Road, Kurseong, Darjeeling district', description: 'A pine-forested ridge above Kurseong, known for its fog and its stories.',
  visitingInfo: 'Best from October to May. Fog can close in fast after 4 pm.', coverImage: media.dowhill,
})
log('Places ready')

// ---------- Stories ----------
const create = async (data: Record<string, unknown>) =>
  payload.create({ collection: 'stories', data: { _status: 'published', ...data } as never, locale: 'en', overrideAccess: true })

// 1. Kuldhara — Premium-only mystery
await create({
  title: 'Kuldhara: The Village That Emptied Overnight',
  slug: DEMO_SLUGS[3],
  excerpt: 'Eighty-odd houses, a temple, a stepwell, and not one family left. The story says they all walked out in a single night.',
  coverImage: media.kuldhara, category: cats.unsolved, place: kuldhara, theme: 'mystery', creepinessLevel: 3, premiumOnly: true,
  publishedAt: daysAgo(9),
  body: doc([
    p('Twenty kilometres west of Jaisalmer, the road passes a village with no roofs. The walls are still standing, the lanes still run straight, and the doorways still face each other across the street.'),
    p('What is missing is everyone. The story told at every tea stall nearby is that the Paliwal families who built Kuldhara left together, in a single night, and that they cursed the land as they went so no one could live there again.'),
    chapter('The night they left'),
    p('The legend gives a reason: a powerful minister wanted to marry the headman’s daughter, and the villagers chose to disappear rather than give her up. Historians tend to point at something slower: drying wells, heavy taxes and a hard climate.'),
    image(media.doors, 'full', 'Doorways that still face each other across an empty lane.'),
    p('Both versions agree on the strangest part. When the people went, they took almost nothing with them, and nobody moved into the houses they left behind.'),
    quote('A village can die slowly and still be remembered as leaving overnight.'),
    p('Today Kuldhara is a protected site with a ticket counter and a parking lot. Visitors walk through the lanes in daylight. Very few stay to watch the sun go down.'),
  ]),
})

// 2. Dow Hill — field guide
await create({
  title: 'Visiting Dow Hill, Kurseong',
  slug: DEMO_SLUGS[4],
  excerpt: 'A pine forest above a hill town, a road with a reputation, and the practical details you need before you go.',
  coverImage: media.dowhill, category: cats['field-guides'], place: dowhill, theme: 'fieldGuide',
  publishedAt: daysAgo(7),
  body: doc([
    p('Dow Hill sits on the ridge above Kurseong, a short drive from the town centre. The road climbs through tall pines, past an old boarding school, and into a forest that holds the fog longer than anywhere else nearby.'),
    fact('Before you go', 'Best time: October to May\nGetting there: by road from Kurseong town\nAllow: half a day, with time for the forest walk\nBring: a warm layer, even in summer'),
    h('The forest road'),
    p('Locals will tell you about the stretch of road through the forest. Some talk about footsteps behind them when no one is there. Others mention a boy who walks along the edge of the trees and vanishes before the next bend.'),
    image(media.dowhill, 'wide', 'The forest road on a foggy afternoon.'),
    h('Good to know'),
    p('The fog can roll in within minutes in the late afternoon, and visibility drops fast. Drive slowly, keep your headlights on, and plan to be back in town before dark.'),
  ]),
})

// 3. The Bel tree — folklore, with a full Bengali version
const bel = await create({
  title: 'The Brahmadaitya of the Old Bel Tree',
  slug: DEMO_SLUGS[2],
  excerpt: 'At the edge of the village stands a bel tree. By day it is only a tree. After dusk, nobody walks beneath it.',
  coverImage: media.beltree, category: cats['legends-folklore'], theme: 'folklore', creepinessLevel: 2,
  publishedAt: daysAgo(5),
  body: doc([
    p('My grandmother said the old bel tree had a resident: a brahmadaitya, the spirit of a Brahmin who never left the village after he died.'),
    p('He was a ghost, but not a cruel one. Many people said he was the village’s guardian, keeping watch from the branches over the fields and the pond.'),
    image(media.beltree, 'full', 'The bel tree behind the village pond.'),
    p('Still, there was one rule. After sunset, no one walked under the tree with shoes on, and no one ever told a lie while looking at it.'),
    quote('A tree that sees everything has no patience for lies.'),
    p('Nobody I asked had ever seen him. Everybody I asked still took their shoes off.'),
  ]),
})
await payload.update({
  collection: 'stories', id: bel.id, locale: 'bn', overrideAccess: true,
  data: {
    title: 'পুরোনো বেলগাছের ব্রহ্মদৈত্য',
    excerpt: 'গ্রামের শেষ প্রান্তে একটা বেলগাছ। দিনের বেলায় সেটা নিছকই একটা গাছ। সন্ধে নামলে কেউ তার তলা দিয়ে হাঁটে না।',
    body: doc([
      p('ঠাকুমা বলতেন, পুরোনো বেলগাছটায় একজন থাকেন — এক ব্রহ্মদৈত্য, এমন এক ব্রাহ্মণের আত্মা, যিনি মৃত্যুর পরেও গ্রাম ছেড়ে যাননি।'),
      p('তিনি ভূত, কিন্তু নিষ্ঠুর নন। অনেকের মতে তিনিই গ্রামের পাহারাদার, ডাল থেকে মাঠ আর পুকুরের ওপর নজর রাখেন।'),
      image(media.beltree, 'full', 'গ্রামের পুকুরের পিছনের বেলগাছ।'),
      p('তবু নিয়ম একটাই: সন্ধ্যার পর বেলগাছের নিচে জুতো পায়ে যাওয়া চলবে না, আর গাছের দিকে তাকিয়ে কেউ কখনো মিথ্যে বলবে না।'),
      quote('যে গাছ সব দেখে, তার সামনে মিথ্যে টেকে না।'),
      p('যাঁদেরই জিজ্ঞেস করেছি, কেউ তাঁকে দেখেননি। তবু সবাই জুতো খুলেই হাঁটেন।'),
    ]),
  } as never,
})

// 4. Writers' Building — history
await create({
  title: 'The Red Building on Dalhousie Square',
  slug: DEMO_SLUGS[1],
  excerpt: 'Built for the East India Company’s clerks, it went on to hold the paperwork of a province, and a few stories nobody filed.',
  coverImage: media.writers, category: cats.historical, place: writers, theme: 'chronicle', creepinessLevel: 1,
  publishedAt: daysAgo(3),
  body: doc([
    chapter('A house for writers'),
    p('In the 1770s, the East India Company needed somewhere to put its junior clerks, the young men it called “writers.” The long building that rose on the north side of the square gave them a name that outlasted the Company itself.'),
    image(media.archive, 'right', 'Archives like these filled the building for two centuries.'),
    p('Over the next two hundred years the façade changed, the people inside changed, and the files kept arriving. Almost every chapter of the city’s history passed through these corridors at least once.'),
    fact('At a glance', 'Completed: 1777\nDesigned by: Thomas Lyon\nBuilt for: East India Company clerks\nLocation: B.B.D. Bagh, Kolkata'),
    chapter('Corridors of power'),
    p('On 8 December 1930, three young revolutionaries, Benoy, Badal and Dinesh, walked into the building and shot the Inspector General of Prisons. The square outside now carries their initials: B.B.D. Bagh.'),
    quote('The files kept arriving long after the people who wrote them were gone.'),
    chapter('After hours'),
    p('Night guards have their own stories about the long corridors: footsteps on empty floors, doors that close by themselves, and a typewriter heard long after the last clerk went home.'),
  ]),
})

// 5. Bhangarh — the featured haunted story, with French and Spanish versions
const bhangarhStory = await create({
  title: 'The Fort That Closes at Sunset',
  slug: DEMO_SLUGS[0],
  excerpt: 'A ruined city in the Aravalli hills, a sign at the gate forbidding entry after dark, and four centuries of stories about why the people left.',
  coverImage: media.bhangarh, category: cats['haunted-places'], place: bhangarh, theme: 'haunted', creepinessLevel: 4, isFeatured: true,
  publishedAt: daysAgo(1),
  body: doc([
    chapter('The sign at the gate'),
    p('The road to Bhangarh narrows as the hills close in. By late afternoon the light turns the colour of old brass, and the guards at the gate begin to glance at their watches.'),
    p('There is a sign. Everyone who comes here mentions the sign. In plain official language, it tells visitors that entering the ruins before sunrise or after sunset is prohibited.'),
    image(media.gate, 'full', 'The gateway and its notice, just before closing time.'),
    p('Officially, the rule is about safety. Unofficially, nobody in the nearby villages needs it explained.'),
    pause(3),
    chapter('Three answers'),
    p('Ask three villagers why the city fell and you will hear three answers. A sorcerer who wanted a princess. An ascetic whose shadow was not to be crossed. A war that never quite ended.'),
    quote('Each version ends the same way: by nightfall, the city was empty.'),
    p('The bazaar is still laid out in two straight rows. The temples still stand. The houses have lost their roofs, and the people who lived in them have become a story.'),
    fact('Visiting Bhangarh', 'Where: Alwar district, Rajasthan\nOpen: sunrise to sunset\nProtected by: Archaeological Survey of India\nTip: arrive early; the climb to the palace takes time'),
  ]),
})
const trBhangarh: Record<'fr' | 'es', { title: string; excerpt: string; body: unknown }> = {
  fr: {
    title: 'Le fort qui ferme au coucher du soleil',
    excerpt: 'Une cité en ruine dans les collines des Aravalli, un panneau qui interdit d’entrer après la nuit tombée, et quatre siècles de récits.',
    body: doc([
      chapter('Le panneau à l’entrée'),
      p('La route de Bhangarh se resserre à mesure que les collines se rapprochent. En fin d’après-midi, la lumière prend la couleur du vieux laiton et les gardiens commencent à regarder leur montre.'),
      p('Il y a un panneau. Tous les visiteurs en parlent. En termes administratifs, il interdit d’entrer dans les ruines avant le lever et après le coucher du soleil.'),
      image(media.gate, 'full', 'La porte et son avis, juste avant la fermeture.'),
      p('Officiellement, la règle concerne la sécurité. Officieusement, personne dans les villages voisins n’a besoin d’explication.'),
      chapter('Trois réponses'),
      p('Demandez à trois villageois pourquoi la cité est tombée, vous entendrez trois réponses. Un sorcier qui voulait une princesse. Un ascète dont l’ombre ne devait pas être franchie. Une guerre qui n’a jamais vraiment pris fin.'),
      quote('Chaque version finit de la même façon : à la tombée de la nuit, la cité était vide.'),
    ]),
  },
  es: {
    title: 'El fuerte que cierra al atardecer',
    excerpt: 'Una ciudad en ruinas en las colinas Aravalli, un cartel que prohíbe entrar de noche y cuatro siglos de historias.',
    body: doc([
      chapter('El cartel de la entrada'),
      p('El camino a Bhangarh se estrecha a medida que las colinas se acercan. A media tarde la luz toma el color del latón viejo y los guardias empiezan a mirar el reloj.'),
      p('Hay un cartel. Todos los que vienen lo mencionan. Con lenguaje oficial, prohíbe entrar en las ruinas antes del amanecer y después del atardecer.'),
      image(media.gate, 'full', 'La puerta y su aviso, justo antes del cierre.'),
      p('Oficialmente, la norma es por seguridad. Extraoficialmente, nadie en los pueblos cercanos necesita que se la expliquen.'),
      chapter('Tres respuestas'),
      p('Pregunta a tres vecinos por qué cayó la ciudad y oirás tres respuestas. Un hechicero que quería a una princesa. Un asceta cuya sombra no debía cruzarse. Una guerra que nunca terminó del todo.'),
      quote('Todas las versiones terminan igual: al caer la noche, la ciudad estaba vacía.'),
    ]),
  },
}
for (const l of ['fr', 'es'] as const) {
  await payload.update({ collection: 'stories', id: bhangarhStory.id, locale: l, data: trBhangarh[l] as never, overrideAccess: true })
}
log('5 demo stories published')

// ---------- Site settings ----------
await payload.updateGlobal({
  slug: 'site-settings',
  overrideAccess: true,
  data: {
    siteName: 'Case97',
    tagline: 'Real stories of historical and haunted places.',
    featuredStories: [bhangarhStory.id],
    socialLinks: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'youtube', url: 'https://www.youtube.com/' },
      { platform: 'x', url: 'https://x.com/' },
    ],
    discordInvite: 'https://discord.com/',
    pricing: { inrMonthly: 299, usdMonthly: 4.99, eurMonthly: 4.99 },
  } as never,
})
for (const [l, tagline] of [['fr', 'Histoires vraies de lieux historiques et hantés.'], ['es', 'Historias reales de lugares históricos y embrujados.'], ['bn', 'ঐতিহাসিক ও ভৌতিক জায়গার সত্যি গল্প।']] as const) {
  await payload.updateGlobal({ slug: 'site-settings', locale: l, data: { tagline } as never, overrideAccess: true })
}
log('Site settings ready. Replace the social links and Discord invite in Admin › Site Settings.')
log('Done. Open http://localhost:3000')
process.exit(0)
