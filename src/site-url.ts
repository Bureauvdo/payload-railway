// SITE_URL (het live domein) op één plek inlezen, voor next.config.ts en src/content/seo.ts.
//
// Waarom: `new URL('www.klant.nl')` gooit "Invalid URL", en next.config.ts doet dat al bij
// het laden van de config. Een SITE_URL zonder https:// liet zo de hele build falen
// (rynobuitenleven, 24-11-2026: Railway-deploy FAILED op "Failed to load next.config.ts").
//
// - leeg/ontbreekt         → undefined (site blijft noindex, zie docs/SEO.md)
// - 'www.klant.nl'         → 'https://www.klant.nl' (protocol ontbreekt: https erbij)
// - 'https://www.klant.nl/' → 'https://www.klant.nl' (alleen de origin, zonder / of pad)
// - echt onbruikbaar       → duidelijke fout bij de build, in plaats van stil noindex op live
export function normalizeSiteUrl(raw: string | undefined): string | undefined {
  const value = raw?.trim()
  if (!value) return undefined

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`
  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error(
      `SITE_URL "${raw}" is geen geldig domein. Verwacht bijvoorbeeld SITE_URL=https://www.klant.nl (zie docs/SEO.md).`,
    )
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`SITE_URL "${raw}" moet met https:// beginnen (zie docs/SEO.md).`)
  }
  return url.origin
}

export const SITE_URL = normalizeSiteUrl(process.env.SITE_URL)
