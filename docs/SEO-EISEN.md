<!-- seo-eisen v1 — beheerd door de skill nieuw-payload-project (scripts/seo_rules.mjs). Pas de eisen aan in de skill en draai het script opnieuw, niet hier met de hand. -->
# SEO- en online-marketingeisen

Wat de online marketeers zelf moeten kunnen, en wat de site vanzelf goed moet doen. Bron:
*Lijst vereisten website voor online marketing* (SEO-specialist). Waar een SEO-vuistregel
geldt, staat die erbij. De regels die bij elke bouwklus gelden staan kort in `CLAUDE.md`
(sectie *SEO & online marketing*); dit document is de volledige lijst.

Controleren hoe een site ervoor staat: `node <skill>/scripts/seo_audit.mjs --dir .` (skill
`nieuw-payload-project`). Die toetst wat automatisch te toetsen is en noemt de rest.

## Soorten

| Soort | Betekenis | Wie / waar |
|---|---|---|
| **Core** | Generieke voorziening die elke site nodig heeft | Hoort in de template `Bureauvdo/payload-railway`; sites krijgen het via cherry-pick (`docs/MAINTAINING.md`) |
| **Bouw** | Regel die geldt voor elke pagina of feature die je bouwt | Developer / agent, bij elke klus |
| **Site** | Alleen als het bij deze klant speelt (blog, vacatures, talen, vestigingen…) of bij livegang | Per site |
| **Keuze** | Botst met het field-level model van de template (devs bouwen pagina's, geen blokkenbouwer — golden rule 5) | Eerst een architectuurbeslissing; niet op eigen houtje bouwen |
| **Later** | Staat in de lijst als "voor later" | Niet nu bouwen, wel rekening mee houden |

---

## 1. Pagina's maken en beheren

- **1.1 [Keuze]** Nieuwe pagina aanmaken en het type kiezen (dienst, landingspagina, blog, case, vacature, vestiging, contact), elk met een passende standaardopbouw, of laten genereren. *Hoe:* vraagt een `pages`-collectie met paginatypes; in de template maakt een developer pagina's (`npm run new:page`).
- **1.2 [Keuze]** Bestaande pagina dupliceren als basis voor een nieuwe. *Hoe:* collecties kunnen dit standaard in Payload; globals niet.
- **1.3 [Keuze]** Bepalen onder welke pagina een pagina valt, zodat de URL de structuur volgt (`/diensten/seo/`). *Hoe:* `@payloadcms/plugin-nested-docs` op een pages-collectie. In de template: de mapstructuur onder `(frontend)/` bepaalt de URL (zie 6 en Bouw-regels).
- **1.4 [Core]** Pagina als concept opslaan, laten nakijken en daarna publiceren. *Hoe:* `versions: { drafts: true }` op de content-globals/collecties; de frontend leest de gepubliceerde versie.
- **1.5 [Core]** Publicatie inplannen op datum en tijd. *Hoe:* `versions: { drafts: { schedulePublish: true } }` + de Payload jobs-runner (`jobs.autoRun`).
- **1.6 [Core]** Pagina offline halen of archiveren zonder verwijderen. *Hoe:* status-veld of unpublish; offline = 404/410 en weg uit de sitemap.
- **1.7 [Core]** Voorbeeld bekijken op mobiel en desktop vóór publicatie. *Hoe:* `admin.livePreview` met breakpoints + Next draft mode.
- **1.8 [Core]** Voorbeeldlink delen met de klant; die link verschijnt niet in Google. *Hoe:* preview-route met token, altijd `noindex`.
- **1.9 [Core]** Eerdere versie van een pagina terugzetten. *Hoe:* versions (restore zit in de admin).
- **1.10 [Core]** Zien wie wat wanneer heeft aangepast. *Hoe:* versions + een `updatedBy`-veld via een `beforeChange`-hook.
- **1.11 [Core]** Hoofdmenu en footermenu zelf aanpassen. *Hoe:* een `navigatie`-global (array met link naar pagina/URL); header en footer lezen die.
- **1.12 [Bouw]** Wijzigingen staan na publiceren binnen een minuut live. *Hoe:* de `(frontend)`-layout rendert `force-dynamic`; voeg geen lange cache/ISR toe zonder revalidate-hook bij publiceren.
- **1.13 [Core]** Pagina automatisch offline laten gaan op een datum (actiepagina). *Hoe:* veld `offlineOp` (datum) → daarna 404/410 en uit de sitemap.
- **1.14 [Keuze]** Pagina's kopiëren naar een andere taal of klant-site.
- **1.15 [Keuze]** Klanten een eigen login die alleen hun eigen content mag aanpassen. *Hoe:* Payload access control per rol/veld.

## 2. Teksten en blokken

- **2.1 [Keuze]** Pagina opbouwen uit blokken die je kunt verslepen, verbergen, dupliceren en verwijderen. *Let op:* de template heeft bewust géén blokkenbouwer (golden rule 5). Alleen na een expliciete beslissing.
- **2.2 [Keuze]** Minimaal deze blokken: hero, tekst, tekst met afbeelding, USP's, CTA, FAQ, reviews, logo's, team, prijstabel, vergelijkingstabel, video, formulier, contact, tijdlijn, gerelateerde pagina's. *In de template:* dezelfde onderdelen als vaste secties met bewerkbare velden in de pagina-route.
- **2.3 [Bouw]** Precies één H1 per pagina, met een melding als die ontbreekt of als er twee zijn. *Hoe:* de H1 staat in de route-JSX (één keer); richText-velden mogen geen H1 bevatten.
- **2.4 [Core]** Tussenkoppen H2, H3, H4 in teksten, met een melding als een niveau wordt overgeslagen (H2 → H4). *Hoe:* `HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] })` in de Lexical-editor + een `validate` die sprongen meldt.
- **2.5 [Core]** Opsommingen, genummerde lijsten, tabellen en citaten. Tabellen zijn echte tabellen, geen afbeelding. *Hoe:* standaard Lexical-features + `EXPERIMENTAL_TableFeature()`; `<Rich>` rendert `<table>`.
- **2.6 [Core]** Interne link maken door een bestaande pagina te zoeken en te kiezen, zodat de link blijft werken als de URL verandert. *Hoe:* `LinkFeature({ enabledCollections: [...] })`; vraagt pagina's als documenten (zie 1.1).
- **2.7 [Core]** Bij een externe link kiezen voor nofollow, sponsored en openen in nieuw tabblad. *Hoe:* `LinkFeature({ fields })` met een `rel`-veld (hasMany: nofollow, sponsored) + `newTab`.
- **2.8 [Bouw]** Knoppen met eigen tekst en link. *Hoe:* een `knop`-group (tekst + link) in de content-groep.
- **2.9 [Bouw]** Een blok op meerdere pagina's hergebruiken en op één plek aanpassen (vaste CTA). *Hoe:* een eigen global (bv. `cta`) die meerdere routes lezen.
- **2.10 [Bouw]** Vragen en antwoorden in een FAQ-blok. *Hoe:* array `faq` (vraag, antwoord) + automatisch FAQPage-JSON-LD (7.4).
- **2.11 [Bouw]** Blok "gerelateerde pagina's" zelf vullen of automatisch op categorie.
- **2.12 [Bouw]** Blok "kort antwoord"/samenvatting bovenaan een pagina. Vuistregel: **40–60 woorden** (goed voor AI-antwoorden en featured snippets). *Hoe:* textarea `kortAntwoord` met woordenteller/validatie.
- **2.13 [Core]** Automatische inhoudsopgave bij lange pagina's, gemaakt uit de H2's. *Hoe:* helper die de H2's uit richText haalt + ankers.
- **2.14 [Bouw]** Per pagina een vaste knoppenbalk onderaan op mobiel aan/uit (bellen, WhatsApp, offerte). *Hoe:* checkbox in de content-groep; nummers uit de bedrijfsgegevens (7.1).

## 3. Afbeeldingen en video

- **3.1 [Core]** Mediabibliotheek met mappen en zoekfunctie. *Hoe:* `folders: true` op de media-collectie.
- **3.2 [Core]** Alt-tekst bij elke afbeelding, verplicht bij uploaden. Vuistregel: beschrijf wat er te zien is, **max. ± 125 tekens**; teller met melding als het langer is. *Hoe:* `alt` is al `required`; voeg `maxLength`/teller toe.
- **3.3 [Core]** Afbeelding als "decoratief" markeren (lege alt) voor puur sfeerbeeld. *Hoe:* checkbox `decoratief`; alt alleen verplicht als die uit staat; `<Img>` rendert dan `alt=""`.
- **3.4 [Bouw]** Alt-tekst per pagina kunnen overschrijven als dezelfde afbeelding ergens anders iets anders betekent. *Hoe:* optioneel alt-veld naast het upload-veld, doorgeven aan `<Img alt>`.
- **3.5 [Core]** Bestandsnaam aanpassen. Vuistregel: **kleine letters, koppeltekens, beschrijvend** (`led-verlichting-winkel-hedel.jpg`). *Hoe:* `beforeOperation`-hook die de filename normaliseert.
- **3.6 [Core]** Bijschrift toevoegen. *Hoe:* veld `bijschrift` → `<figcaption>`.
- **3.7 [Core]** Focuspunt kiezen, zodat de uitsnede op mobiel goed blijft. *Hoe:* `focalPoint` (standaard aan) + `imageSizes`.
- **3.8 [Core]** Afbeeldingen worden automatisch verkleind en gecomprimeerd. *Hoe:* `imageSizes` + `formatOptions` (webp/avif) en `next/image`.
- **3.9 [Bouw]** YouTube/Vimeo met titel en omschrijving; de video laadt pas na een klik. *Hoe:* facade-component (thumbnail + knop) + VideoObject-JSON-LD.
- **3.10 [Core]** Melding bij uploaden als een bestand **> ± 500 kB** of **breder dan 2500 px** is.
- **3.11 [Core]** Overzicht van alle afbeeldingen zonder alt-tekst. *Hoe:* filter/kolom in de media-lijst.
- **3.12 [Later]** AI-voorstel voor de alt-tekst dat de marketeer kan aanpassen.

## 4. SEO-instellingen per pagina

Elke pagina, elk blogartikel en elk ander item heeft een eigen tabblad **SEO**. In de template:
`seoFields` + `seoMetadata()` uit `src/content/seo.ts`.

- **4.1 [Core]** Meta title met tekenteller en melding als hij te lang is. Vuistregel: **50–60 tekens, belangrijkste zoekwoord vooraan, merknaam achteraan.** *Hoe:* `MetaTitleField` uit `@payloadcms/plugin-seo/fields` of een eigen teller-component.
- **4.2 [Core]** Meta description met tekenteller en melding als hij te lang of te kort is. Vuistregel: **120–155 tekens, met een duidelijke aanleiding om te klikken.** *Hoe:* `MetaDescriptionField`.
- **4.3 [Core]** Lege title/description → de site maakt zelf een nette versie (title = paginatitel + merknaam, description = begin van de eerste alinea). **Nooit een lege of dubbele.** *Hoe:* `seoMetadata()` valt terug op de code-defaults; elke route geeft unieke defaults mee.
- **4.4 [Keuze]** URL (slug) aanpassen in de admin, met automatische 301 van oud naar nieuw. Vuistregel: **kort, kleine letters, koppeltekens, zonder stopwoorden.** *In de template* is de URL de mapnaam; een developer die hem wijzigt zet de 301 in `redirects.json` (Bouw-regel).
- **4.5 [Core]** Canonical URL instellen; standaard verwijst een pagina naar zichzelf. *Hoe:* `seoMetadata()` zet `alternates.canonical = path`; voeg een override-veld toe.
- **4.6 [Core]** Pagina op **noindex**; de pagina verdwijnt dan ook uit de sitemap. *Hoe:* checkbox in `seoFields` → `robots: { index: false }` + filter in `sitemap.ts`.
- **4.7 [Core]** Pagina op **nofollow**.
- **4.8 [Core]** Pagina uitsluiten van de sitemap.
- **4.9 [Core]** Per pagina instellen hoe hij eruitziet bij delen (LinkedIn, Facebook, WhatsApp): eigen titel, omschrijving en afbeelding (**1200 × 630**). Leeg = meta title, description en uitgelichte afbeelding.
- **4.10 [Core]** Voorbeeld van hoe de pagina in Google verschijnt (title, URL, description). *Hoe:* `PreviewField` uit `@payloadcms/plugin-seo/fields`.
- **4.11 [Core]** Veld voor het focus-zoekwoord, met een melding als het niet in title, H1 of URL staat.
- **4.12 [Core]** Overzicht van alle pagina's met title, description en noindex-status, met export naar Excel.
- **4.13 [Core]** Veld om zelf extra structured data (JSON-LD) toe te voegen.

## 5. Blog, kennisbank en auteurs

Alleen bouwen als de klant het nodig heeft; dan wél volgens deze eisen.

- **5.1 [Site]** Blogartikelen met categorieën en tags.
- **5.2 [Site]** Auteurs met naam, functie, foto, korte bio, expertise en LinkedIn-link; elke auteur een eigen pagina (belangrijk voor **E-E-A-T**).
- **5.3 [Site]** Per artikel een auteur kiezen; naam + link naar de auteurspagina staan bij het artikel.
- **5.4 [Site]** Publicatiedatum en "laatst bijgewerkt"-datum zien en aanpassen; **beide zichtbaar op de pagina.**
- **5.5 [Site]** Overzichtspagina per categorie met eigen intro, meta title en description.
- **5.6 [Site]** Automatisch gerelateerde artikelen onder een artikel.
- **5.7 [Site]** Cases met klant, sector en resultaten, gekoppeld aan diensten.
- **5.8 [Site]** Whitepaper/e-book aanbieden na het invullen van een formulier.
- **5.9 [Site]** Evenementen- en webinarpagina's met datum en aanmelding (Event-markup).
- **5.10 [Site]** Vacatures die in **Google for Jobs** verschijnen (JobPosting-markup).

## 6. Redirects, 404's en indexering

- **6.1 [Core]** Zelf een 301-redirect toevoegen van oude naar nieuwe URL, zonder developer. *Nu:* `redirects.json` (developer). *Hoe:* `@payloadcms/plugin-redirects` + opzoeken bij een 404.
- **6.2 [Core]** Lijst redirects in één keer importeren via Excel/CSV (nodig bij de overstap vanuit Mach3).
- **6.3 [Core]** Pagina op **410 – bewust verwijderd** zetten.
- **6.4 [Core]** 404-pagina zelf vullen (tekst, zoekveld, populaire links). *Hoe:* `not-found.tsx` die een global leest.
- **6.5 [Core]** `robots.txt` aanpassen. *Hoe:* `src/app/robots.ts` + extra regels uit een global.
- **6.6 [Core]** De sitemap werkt zichzelf bij bij publiceren, aanpassen of verwijderen. *Nu:* `src/app/sitemap.ts` (vaste routes automatisch; dynamische routes via `extra` of de database — Bouw-regel).
- **6.7 [Core]** Lijst van URL's die een 404 geven, met één klik een redirect aanmaken.
- **6.8 [Core]** Hele map tegelijk doorsturen (alles onder `/oud/` naar `/nieuw/`). *Nu:* `redirects.json` met `"/oud/:path*"`.
- **6.9 [Keuze]** Melding bij het verwijderen van een pagina waar nog andere pagina's naar linken.

## 7. Bedrijfsgegevens en structured data

De marketeer vult gewone velden in; de site maakt daar zelf structured data van voor Google en AI.

- **7.1 [Core]** Bedrijfsgegevens op één plek: naam, logo, adres, telefoon, e-mail, KvK, openingstijden, links naar LinkedIn, Instagram, Facebook, TikTok en YouTube. *Hoe:* een `bedrijf`-global.
- **7.2 [Bouw]** Die gegevens verschijnen overal hetzelfde: footer, contactpagina en structured data (lokale SEO en AI). Nooit hardcoded op meerdere plekken.
- **7.3 [Bouw]** Artikelen krijgen automatisch Article-markup met auteur en datums.
- **7.4 [Bouw]** FAQ-blokken krijgen automatisch FAQPage-markup.
- **7.5 [Core]** Elke pagina automatisch een kruimelpad, **zichtbaar én als BreadcrumbList-markup**.
- **7.6 [Bouw]** Vestigingen, diensten, vacatures, evenementen, video's en producten krijgen automatisch de passende markup (LocalBusiness, Service, JobPosting, Event, VideoObject, Product).
- **7.7 [Bouw]** Alle markup komt foutloos door de [Rich Results Test](https://search.google.com/test/rich-results).

## 8. Zichtbaar in ChatGPT en andere AI

ChatGPT, Perplexity, Claude, Copilot en Google AI Overviews citeren alleen wat ze direct kunnen lezen.

- **8.1 [Core]** Per AI-bot instellen of hij de site mag lezen. **Standaard: zoekbots toegestaan** (OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Bingbot voor Copilot); **trainingsbots per klant aan/uit** (GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended). *Hoe:* regels in `src/app/robots.ts`, instelbaar via een global.
- **8.2 [Bouw]** Alle tekst in blokken, ook in FAQ's, tabs en uitklapblokken, is leesbaar zonder klikken: de inhoud staat server-side in de HTML.
- **8.3 [Bouw]** Tabellen zijn echte tabellen, geen afbeelding.
- **8.4 [Bouw]** De "laatst bijgewerkt"-datum staat zichtbaar op de pagina.
- **8.5 [Core]** Een `llms.txt` die de site zelf maakt en die de marketeer kan aanvullen. *Hoe:* `src/app/llms.txt/route.ts` (pagina's + samenvattingen) + vrij tekstveld in een global.
- **8.6 [Bouw]** Blok "kort antwoord" bovenaan pagina's (zie 2.12).

## 9. Codes en tracking

De meeste tools (GA4, Meta Pixel, LinkedIn, Hotjar, Clarity) zetten de marketeers zelf in
Google Tag Manager. De site moet vooral een paar codes kunnen bevatten en de juiste events doorgeven.

- **9.1 [Core]** GTM-code (`GTM-XXXXXXX`) invullen in de instellingen; komt op elke pagina. *Hoe:* veld in een `instellingen`-global → `GoogleTagManager` uit `@next/third-parties/google`.
- **9.2 [Core]** Code van de cookiebanner invullen (Cookiebot, CookieYes…), werkend met **Google Consent Mode v2** (consent default `denied` vóór GTM laadt).
- **9.3 [Core]** Verificatiecode van Google Search Console. *Hoe:* `metadata.verification.google`.
- **9.4 [Core]** Domeinverificatie van Meta. *Hoe:* `metadata.other['facebook-domain-verification']`.
- **9.5 [Core]** Op één pagina een extra code plaatsen (bv. alleen de bedankpagina).
- **9.6 [Core]** Site-breed extra code in head en body, voor tools die niet via GTM kunnen.
- **9.7 [Bouw]** Link in de footer waarmee bezoekers hun cookiekeuze wijzigen.
- **9.8 [Core]** **Geen tracking op test- en voorbeeldomgevingen.** *Hoe:* GTM/cookiebanner alleen renderen als de host gelijk is aan `SITE_URL` (zelfde logica als de noindex in `next.config.ts`).

Wat de site zelf naar de `dataLayer` moet sturen:

- **9.9 [Core]** Bij elke paginawissel een `page_view`, ook bij client-side navigatie. *Hoe:* client-component op `usePathname()`.
- **9.10 [Bouw]** `form_submit` met `form_name` na een succesvol verstuurd formulier.
- **9.11 [Bouw]** Event bij klik op telefoonnummer, e-mail, WhatsApp, CTA-knop of download (bv. `click_phone`, `click_email`, `click_whatsapp`, `click_cta`, `file_download`).
- **9.12 [Bouw]** Vaste naam op knoppen en blokken (`data-track="hero-cta"`), zodat metingen niet breken als het design verandert.
- **9.13 [Core]** Campagnegegevens uit de URL onthouden (UTM's, `gclid`, `gbraid`, `wbraid`, `fbclid`) en meesturen met elk formulier.
- **9.14 [Later]** Eigen adres voor GTM (server-side tagging, bv. `meten.klantnaam.nl`).
- **9.15 [Later]** Events bij scrollen, video kijken en zoeken op de site.

## 10. Formulieren en landingspagina's

- **10.1 [Core]** Zelf formulieren maken: velden toevoegen, verplicht maken, keuzelijsten, vinkjes, bestand uploaden. *Hoe:* `@payloadcms/plugin-form-builder`.
- **10.2 [Core]** Per formulier instellen wie de inzending krijgt, welke bevestigingsmail de invuller krijgt en welke bedankpagina/-melding verschijnt.
- **10.3 [Bouw]** Formulier als onderdeel op elke pagina kunnen zetten.
- **10.4 [Core]** Inzendingen terugzien in het CMS en exporteren.
- **10.5 [Core]** Formulier koppelen aan CRM/mailprogramma (HubSpot, ActiveCampaign, Mailchimp…).
- **10.6 [Core]** Spambeveiliging zonder puzzels voor de bezoeker (honeypot + tijdscheck, of onzichtbare Turnstile).
- **10.7 [Bouw]** Landingspagina voor een campagne zonder hoofdmenu, standaard niet in Google (noindex, niet in de sitemap).
- **10.8 [Later]** Formulieren in meerdere stappen.
- **10.9 [Later]** Velden die alleen verschijnen bij een bepaald antwoord.
- **10.10 [Later]** Pagina in twee varianten testen (A/B-test).
- **10.11 [Later]** Afsprakenplanner (Calendly e.d.) als onderdeel — laden na klik (12.2).
- **10.12 [Later]** Pop-up of slide-in met formulier.

## 11. Talen en vestigingen

Alleen nodig bij klanten waar dit speelt.

- **11.1 [Site]** Pagina in meerdere talen, per taal een eigen URL, meta title, description en alt-teksten. *Hoe:* Payload `localization` + taalprefix in de routes.
- **11.2 [Site]** De site koppelt taalversies zelf voor Google (**hreflang**, incl. `x-default`). *Hoe:* `alternates.languages` in de metadata.
- **11.3 [Site]** De taalknop gaat naar dezelfde pagina in de andere taal, niet naar de homepage.
- **11.4 [Site]** Vestigingen met adres, openingstijden (ook feestdagen), telefoon, foto's en route; elke vestiging een eigen pagina (LocalBusiness-markup).
- **11.5 [Site]** Bij een webshop: per filter/categorie bepalen of die in Google mag, met eigen title en tekst.

## 12. Wat de site vanzelf moet doen

De marketeer stelt hier niets voor in, maar het moet kloppen.

- **12.1 [Bouw]** Alle pagina's snel op mobiel en groen op de Core Web Vitals: **LCP < 2,5 s, INP < 200 ms, CLS < 0,1**, ook met cookiebanner en tracking aan.
- **12.2 [Bouw]** Video's, kaarten en chatwidgets laden pas als ze nodig zijn.
- **12.3 [Bouw]** De pagina verspringt niet tijdens het laden, ook niet door de cookiebanner.
- **12.4 [Bouw]** Alle tekst staat direct in de HTML (server components), zodat Google en AI-bots alles lezen.
- **12.5 [Site]** Eén adres per pagina: met/zonder www en met/zonder `/` aan het eind sturen door naar één versie. *Nu:* Next stuurt de trailing slash door; www ↔ zonder www bij livegang (`docs/SEO.md`).
- **12.6 [Bouw]** Links met UTM's of advertentie-ID's leveren geen dubbele pagina's op. *Hoe:* canonical naar het schone pad (altijd `path` meegeven aan `seoMetadata`).
- **12.7 [Core]** Test- en voorbeeldomgevingen verschijnen niet in Google. *Nu:* `X-Robots-Tag: noindex` op alles behalve `SITE_URL`.
- **12.8 [Core]** De sitemap staat op `/sitemap.xml` en is altijd actueel.
- **12.9 [Bouw]** De 404-pagina geeft echt een 404 door. *Hoe:* `notFound()` uit `next/navigation`, nooit een 200 met "niet gevonden".
- **12.10 [Core]** Bij delen zonder eigen deelafbeelding maakt de site automatisch een nette afbeelding (titel + logo). *Hoe:* `opengraph-image.tsx` met `ImageResponse` uit `next/og`.
- **12.11 [Bouw]** Elk onderdeel werkt goed op mobiel: leesbare tekst (≥ 16 px), knoppen groot genoeg om op te tikken (≥ 44 × 44 px).
