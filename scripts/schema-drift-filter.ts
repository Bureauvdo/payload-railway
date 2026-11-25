// Welke SQL uit de drizzle-diff van scripts/schema-drift.ts is géén echte drift?
// Los bestand zodat het zonder database te testen is (tests/schema-drift.test.mjs).

// Kolom-defaults tellen niet: Payload vult defaultValue zelf in, en een tekstwijziging in een
// defaultValue (tekst-in-code) zou anders elke keer een migratie eisen.
const isDefault = (s: string) => /^ALTER TABLE .+ ALTER COLUMN .+ (SET|DROP) DEFAULT\b/i.test(s)

const dropName = (s: string) =>
  s.match(/^(?:ALTER TABLE "[^"]+" DROP CONSTRAINT|DROP INDEX) "([^"]+)"/i)?.[1]
const addName = (s: string) =>
  s.match(/^(?:ALTER TABLE "[^"]+" ADD CONSTRAINT|CREATE (?:UNIQUE )?INDEX) "([^"]+)"/i)?.[1]
const tableOf = (s: string) => s.match(/^ALTER TABLE "([^"]+)"/i)?.[1]
// Payload ≥ 3.94 kort een te lange FK-naam zelf in: <begin van de naam>_<8 hex>_fk.
const hashedPrefix = (name: string) => name.match(/^(.+)_[0-9a-f]{8}_fk$/)?.[1]

// Postgres kapt namen af op 63 tekens. Een database die met zo'n afgekapte naam is gemaakt,
// geeft in de diff een DROP van die naam + een ADD/CREATE van dezelfde constraint of index
// onder een andere naam. Dat is alleen een naamverschil, geen schemaverschil. Twee vormen:
// - de volledige naam (begint met de afgekapte naam);
// - sinds Payload 3.94 een ingekorte naam met hash, op dezelfde tabel (vandenoeverlekkerwonen,
//   25-11-2026: lange slugs als _elektrische_raamdecoratie_v).
function renamePairs(stmts: string[]) {
  const pairs = new Set<string>()
  for (const a of stmts) {
    const d = dropName(a)
    if (d?.length !== 63) continue
    const twin = stmts.find((b) => {
      if (pairs.has(b)) return false
      const n = addName(b)
      if (!n) return false
      if (n.startsWith(d)) return true
      const p = hashedPrefix(n)
      return !!p && d.startsWith(p) && !!tableOf(a) && tableOf(a) === tableOf(b)
    })
    if (twin) { pairs.add(a); pairs.add(twin) }
  }
  return pairs
}

// Geeft de statements die wél een migratie vragen, plus hoeveel er genegeerd zijn.
export function realDrift(statements: string[]) {
  const stmts = statements.map((s) => s.trim())
  const pairs = renamePairs(stmts)
  const missing = stmts.filter((s) => !isDefault(s) && !pairs.has(s))
  return { missing, ignored: stmts.length - missing.length }
}
