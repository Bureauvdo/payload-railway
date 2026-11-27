# Site-specific rules

<!-- This file belongs to the site, not to the template: the template never changes it after
     creating it, so `fleet sync` never conflicts here. Put this site's agent rules here
     (SEO requirements, the client's tone of voice, deviations from the template). CLAUDE.md
     imports it. -->

<!-- seo-eisen:start v1 — beheerd door de skill nieuw-payload-project; wijzig de eisen in de skill en draai scripts/seo_rules.mjs opnieuw, niet hier met de hand -->
## SEO & online marketing — eisen van de marketeers

De volledige lijst staat in [docs/SEO-EISEN.md](docs/SEO-EISEN.md): elke eis met vuistregel
en soort (**Core** = hoort in de template, **Bouw** = geldt bij elke klus, **Site** = alleen
als het speelt, **Keuze** = eerst een architectuurbeslissing). Hieronder de regels die gelden
bij **alles wat je bouwt of aanpast**. Bij twijfel: kies de oplossing waarmee de marketeer het
zelf kan beheren, zonder developer.

**Elke pagina**
- Precies één `<h1>`, in de route-JSX. Daaronder koppen zonder niveaus over te slaan
  (h2 → h3 → h4); richText-velden krijgen alleen h2–h4.
- `generateMetadata()` met `seoMetadata(c.seo, { title, description, path })` en `seoFields`
  in de content-groep. Code-defaults volgen de vuistregels: title 50–60 tekens met het
  zoekwoord vooraan (de merknaam plakt de layout erachter), description 120–155 tekens met
  een reden om te klikken. Nooit lege of dubbele titles/descriptions tussen pagina's.
- Geef altijd `path` mee: canonical naar het schone pad, zodat URL's met UTM's of gclid's
  geen dubbele pagina's worden.
- Alle tekst staat server-side in de HTML. FAQ's, tabs en uitklapblokken renderen hun inhoud
  in de DOM (bv. `<details>`), niet pas na een klik. Tabellen zijn echte `<table>`'s.
- Structured data als JSON-LD (`<script type="application/ld+json">`): FAQ → FAQPage,
  artikel → Article met auteur, `datePublished` en `dateModified`, elke pagina behalve home
  → zichtbaar kruimelpad + BreadcrumbList; vestiging/dienst/vacature/event/video → de
  passende markup. Moet foutloos door de Rich Results Test.
- Inhoudspagina's (blog, kennisbank, diensten) tonen zichtbaar de "laatst bijgewerkt"-datum
  en krijgen bij voorkeur bovenaan een veld "kort antwoord" (40–60 woorden). Lange pagina's
  krijgen een inhoudsopgave uit de h2's.
- Niet gevonden → `notFound()` (echte 404), nooit een 200 met "niet gevonden".

**URL's en indexering**
- De URL is de mapnaam onder `(frontend)/`: kort, kleine letters, koppeltekens, geen
  stopwoorden, en de hiërarchie volgend (`/diensten/seo`).
- Wijzigt of verdwijnt een bestaande URL, zet dan in dezelfde commit een 301 in
  `redirects.json` (mappen mogen: `"/oud/:path*"`). Bewust weg zonder vervanger → 410.
- Dynamische routes (`[slug]`) komen in de sitemap (`extra` in `src/app/sitemap.ts` of uit
  de database); noindex-pagina's niet.
- Campagne-landingspagina's: zonder hoofdmenu, standaard noindex en niet in de sitemap.
- Laat de noindex-op-niet-live-hosts (`next.config.ts`, `SITE_URL`) intact: test- en
  voorbeeldomgevingen mogen nooit in Google.

**Afbeeldingen en embeds**
- Elke afbeelding heeft een alt die beschrijft wat er te zien is (max. ± 125 tekens), of is
  bewust decoratief (`alt=""`). Altijd `width`/`height` of `sizes`; `priority` alleen op de
  LCP-afbeelding.
- Bestanden in `public/images/`: kleine letters, koppeltekens, beschrijvend
  (`led-verlichting-winkel-hedel.jpg`), < ± 500 kB en ≤ 2500 px breed.
- YouTube/Vimeo, kaarten, chatwidgets en afsprakenplanners laden pas na een klik (facade),
  niet bij het laden van de pagina.

**Tracking (Google Tag Manager)**
- Geen losse tracking-scripts in componenten; de marketeers regelen tools in GTM. GTM en de
  cookiebanner alleen op het live domein (`SITE_URL`), nooit op test of preview.
- Interactieve elementen krijgen een vaste naam die los staat van de styling:
  `data-track="<onderdeel>-<actie>"` (bv. `hero-cta`, `footer-telefoon`).
- Push naar `window.dataLayer`: `page_view` bij elke route-wissel (ook client-side),
  `form_submit` met `form_name` na een geslaagde verzending, en klikken op `tel:`,
  `mailto:`, WhatsApp, CTA's en downloads.
- Formulieren sturen de bewaarde UTM's en klik-ID's (`gclid`, `gbraid`, `wbraid`, `fbclid`)
  mee. Spamwering zonder puzzels (honeypot/tijdscheck of onzichtbare Turnstile).
- Cookiebanner met Google Consent Mode v2 (default `denied` vóór GTM), een link in de footer
  om de keuze te wijzigen, en de banner laat de layout niet verspringen.

**Prestaties en mobiel**
- Core Web Vitals groen, ook met cookiebanner en tracking aan: LCP < 2,5 s, INP < 200 ms,
  CLS < 0,1. Fonts via `next/font`, ruimte reserveren voor media en embeds.
- Mobiel: tekst ≥ 16 px, tikdoelen ≥ 44 × 44 px.

**Bedrijfsgegevens**
- Naam, adres, telefoon, e-mail, KvK, openingstijden en socials komen van één plek (een
  global) en worden overal daaruit gelezen: footer, contactpagina, sticky mobiele balk en
  Organization/LocalBusiness-JSON-LD. Nooit op meerdere plekken hardcoden.

**Grenzen**
- Eisen met soort **Keuze** (pagina's zelf aanmaken of dupliceren, een blokkenbouwer, slugs
  in de admin) botsen met het field-level model (golden rule 5). Bouw ze niet op eigen
  houtje; benoem het en laat de keuze aan de developer. Heeft deze site al bewust een
  pages-collectie of blokken (zie de site-specifieke sectie in dit bestand), dan gelden de
  Keuze-eisen gewoon voor die collectie.
- **Core**-eisen die nog ontbreken horen in de template `Bureauvdo/payload-railway` en komen
  via cherry-pick naar de sites (docs/MAINTAINING.md). Is iets per site toch nodig, houd het
  dan in site-specifieke bestanden en meld dat het eigenlijk in de template hoort.
<!-- seo-eisen:end -->
