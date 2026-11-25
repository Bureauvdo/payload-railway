// Filter van scripts/schema-drift.ts: wat is géén echte drift? Draai met `npm test`.
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { realDrift } from '../scripts/schema-drift-filter.ts'

test('defaults tellen niet', () => {
  const r = realDrift(['ALTER TABLE "home" ALTER COLUMN "title" SET DEFAULT \'Nieuw\';'])
  assert.deepEqual(r, { missing: [], ignored: 1 })
})

test('afgekapte naam (63) + volledige naam = geen drift', () => {
  const kort = 'x'.repeat(63)
  const r = realDrift([
    `DROP INDEX "${kort}";`,
    `CREATE INDEX "${kort}_extra_idx" ON "t" USING btree ("a");`,
  ])
  assert.equal(r.missing.length, 0)
})

// Uit de CI van vandenoeverlekkerwonen na Payload 3.94.1 (25-11-2026).
const payload394 = [
  'ALTER TABLE "_elektrische_raamdecoratie_v" DROP CONSTRAINT "_elektrische_raamdecoratie_v_version_advies_image_id_media_id_f";',
  'ALTER TABLE "_elektrische_raamdecoratie_v_version_inspiratie" DROP CONSTRAINT "_elektrische_raamdecoratie_v_version_inspiratie_image_id_media_";',
  'ALTER TABLE "_de_binnenhuisadviseurs_v_version_inspiratie" DROP CONSTRAINT "_de_binnenhuisadviseurs_v_version_inspiratie_image_id_media_id_";',
  'ALTER TABLE "_elektrische_raamdecoratie_v" ADD CONSTRAINT "_elektrische_raamdecoratie_v_version_advies_image_i_b1d26fb7_fk" FOREIGN KEY ("version_advies_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;',
  'ALTER TABLE "_elektrische_raamdecoratie_v_version_inspiratie" ADD CONSTRAINT "_elektrische_raamdecoratie_v_version_inspiratie_ima_1790a1cf_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;',
  'ALTER TABLE "_de_binnenhuisadviseurs_v_version_inspiratie" ADD CONSTRAINT "_de_binnenhuisadviseurs_v_version_inspiratie_image__a3d0dd23_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;',
]

test('Payload 3.94: afgekapte FK-naam → ingekorte naam met hash = geen drift', () => {
  assert.deepEqual(realDrift(payload394), { missing: [], ignored: 6 })
})

test('hash-naam op een andere tabel is wél drift', () => {
  const r = realDrift([payload394[0], payload394[3].replace('"_elektrische_raamdecoratie_v"', '"andere_tabel"')])
  assert.equal(r.missing.length, 2)
})

// Uit de CI van verandazeeland na Payload 3.94.1 (25-11-2026).
const index394 = [
  'DROP INDEX "_zonwering_knikarmschermen_v_version_intro_bullets_parent_id_id";',
  'CREATE INDEX "_zonwering_knikarmschermen_v_version_intro_bullets_21256de0_idx" ON "_zonwering_knikarmschermen_v_version_intro_bullets" USING btree ("_parent_id");',
]

test('Payload 3.94: afgekapte indexnaam → ingekorte naam met hash = geen drift', () => {
  assert.deepEqual(realDrift(index394), { missing: [], ignored: 2 })
})

test('hash-index op een tabel die niet bij de naam past is wél drift', () => {
  const r = realDrift([index394[0], index394[1].replace('ON "_zonwering_knikarmschermen_v_version_intro_bullets"', 'ON "andere_tabel"')])
  assert.equal(r.missing.length, 2)
})

test('echte wijzigingen blijven staan', () => {
  const echt = 'ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;'
  assert.deepEqual(realDrift([echt, ...payload394]).missing, [echt])
})
