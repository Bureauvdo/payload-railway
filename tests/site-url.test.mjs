// SITE_URL-normalisatie van src/site-url.ts. Draai met `npm test`.
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { normalizeSiteUrl } from '../src/site-url.ts'

test('leeg of ontbrekend → undefined (site blijft noindex)', () => {
  assert.equal(normalizeSiteUrl(undefined), undefined)
  assert.equal(normalizeSiteUrl(''), undefined)
  assert.equal(normalizeSiteUrl('   '), undefined)
})

test('zonder protocol krijgt https:// (brak eerder de build)', () => {
  assert.equal(normalizeSiteUrl('www.ryno.nl'), 'https://www.ryno.nl')
  assert.equal(normalizeSiteUrl(' klant.nl/ '), 'https://klant.nl')
})

test('alleen de origin: slash en pad eraf, protocol blijft', () => {
  assert.equal(normalizeSiteUrl('https://www.klant.nl'), 'https://www.klant.nl')
  assert.equal(normalizeSiteUrl('https://www.klant.nl/'), 'https://www.klant.nl')
  assert.equal(normalizeSiteUrl('https://www.klant.nl/nl/'), 'https://www.klant.nl')
  assert.equal(normalizeSiteUrl('http://localhost:3000'), 'http://localhost:3000')
})

test('onbruikbare waarde → duidelijke fout met voorbeeld', () => {
  assert.throws(() => normalizeSiteUrl('www.klant .nl'), /SITE_URL "www.klant .nl" is geen geldig domein.*https:\/\/www\.klant\.nl/)
  assert.throws(() => normalizeSiteUrl('ftp://klant.nl'), /moet met https:\/\/ beginnen/)
})
