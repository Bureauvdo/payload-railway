# Teksten aanpassen via Claude Code (MCP)

Elke site heeft een MCP-endpoint op `https://<site>/api/mcp` (plugin `@payloadcms/plugin-mcp`).
Daarmee kan een collega in Claude Code vragen: *"pas de intro op de homepage aan naar …"*.
De wijziging staat direct live: geen deploy, geen Git- of Railway-toegang nodig.

## Wat een key mag

Elke geldige key mag **alle content-pagina's (globals) lezen en bijwerken**. Een nieuwe pagina
(`npm run new:page`) komt er vanzelf bij.

**Collections** (bv. losse projecten of producten) staan standaard dicht. Per site zet je ze
open in `src/content/mcp.ts`:

```ts
export const mcpCollections = {
  projects: { find: true, create: true, update: true },
  reviews: { find: true, update: true },
}
```

Verwijderen kan nooit via MCP. Zet nooit persoonsgegevens open (formulierinzendingen,
gebruikers).

**Een collection openzetten vraagt wél een migratie.** Elke collection in `mcpCollections`
krijgt automatisch versiegeschiedenis (zie `withHistory` in `payload.config.ts`), dus een
nieuwe tabel `_<slug>_v`. Na het aanpassen van `mcp.ts`: `npm run generate:types` →
`npm run migrate:create -- mcp_<slug>` → `npm run migrate`, zoals bij elk ander veld.

**Let op bij oudere datamigraties.** Schrijft een eerdere migratie via de Payload-API in die
collection (bv. `payload.create({ collection: 'media', … })` om foto's te importeren), dan
faalt die op een lege database (CI) met `relation "_<slug>_v" does not exist`: de API schrijft
met de huidige config, dus ook een versie, terwijl de versietabel pas in de nieuwere migratie
komt. Productie merkt er niets van (die migratie draaide daar al), maar de CI van de site
blijft rood en Dependabot merget niets meer. Oplossing: maak de versietabel idempotent
(`CREATE TABLE IF NOT EXISTS`, indexen `IF NOT EXISTS`, foreign key in een `DO $$ … EXCEPTION
WHEN duplicate_object …`) en roep die aan het begin van de oudere datamigratie aan én in de
nieuwe migratie. Productie heeft beide migraties al gedraaid, dus het aanpassen verandert daar
niets.

Bewust alles-of-niets per key: vinkjes per pagina of collection zouden per site andere
databasekolommen geven, dus een migratie per site. Zie `payload.config.ts`.

## Een collega toegang geven

1. Maak in `/admin` → **Users** een account voor de collega (eigen e-mail).
2. De collega logt in en maakt onder **MCP → API Keys** een key: label = eigen naam,
   **Enable API Key** aan, en kopieert de key.
   (Een key hoort altijd bij de gebruiker die hem maakt. Zo zie je wie wat deed.)
3. De collega koppelt de site eenmalig in Claude Code:

   ```bash
   claude mcp add --transport http <klantnaam> https://<site>/api/mcp --header "Authorization: Bearer <api-key>"
   ```

**Intrekken:** verwijder de key (of zet *Enable API Key* uit) onder MCP → API Keys.

## Een wijziging terugdraaien

Elke pagina, en elke collection die via MCP open staat, bewaart zijn laatste 50 versies.
Open de pagina in `/admin` → tab **Versions** → kies een versie → **Restore**. Dat werkt voor
wijzigingen van Claude en van mensen.

## Goed om te weten

- Keys horen bij één omgeving (staging of productie) en reizen niet mee met `npm run promote`.
- Een key verloopt niet. Trek hem in als iemand vertrekt of de key gelekt kan zijn.
- Tekst die in de code staat (niet in de admin), wijzig je via GitHub en een PR, niet via MCP.
