// Controleert of het databaseschema na `payload migrate` precies past bij de config.
// Draai op een verse database ná `npm run migrate`:  npm run schema:check
// Exit 1 + de SQL die nog ontbreekt als een migratie mist: een veldwijziging zonder
// `migrate:create`, of een Payload-update die een schemawijziging vraagt (Dependabot).
// Zelfde diff als Payload's dev-push (drizzle-kit pushSchema), maar zonder iets toe te passen.
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { realDrift } from './schema-drift-filter'

const payload = await getPayload({ config: await config })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = payload.db as any
const { pushSchema } = db.requireDrizzleKit()
const { statementsToExecute, warnings } = await pushSchema(
  db.schema,
  db.drizzle,
  db.schemaName ? [db.schemaName] : undefined,
  db.tablesFilter,
  undefined,
)

const { missing, ignored: defaults } = realDrift(statementsToExecute as string[])

if (!missing.length) {
  console.log(`schema-drift: migraties en config komen overeen ✓${defaults ? ` (${defaults} verschil(len) in defaults of afgekapte namen genegeerd)` : ''}`)
  process.exit(0)
}
console.error(
  `schema-drift: de migraties maken niet het schema dat de config verwacht.\n` +
    `Ontbrekend (${missing.length}):\n\n${missing.join('\n')}\n` +
    (warnings.length ? `\nWaarschuwingen:\n${warnings.join('\n')}\n` : '') +
    `\nOplossing: npm run migrate:create -- <naam> tegen een lokale database, committen.`,
)
process.exit(1)
