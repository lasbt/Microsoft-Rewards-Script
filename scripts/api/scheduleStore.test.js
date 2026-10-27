import assert from 'node:assert/strict'
import test from 'node:test'

import { isValidCron, matchesCron } from './scheduleStore.js'

test('matches cron fields, ranges, lists, and steps', () => {
    const date = new Date(2024, 0, 2, 8, 15)

    assert.equal(matchesCron('15 8 * * 2', date), true)
    assert.equal(matchesCron('*/15 8-9 * * 1,2', date), true)
    assert.equal(matchesCron('15 9 * * 2', date), false)
})

test('uses cron OR semantics when both day fields are restricted', () => {
    const date = new Date(2024, 0, 2, 8, 15)

    assert.equal(matchesCron('15 8 3 * 2', date), true)
    assert.equal(matchesCron('15 8 3 * 3', date), false)
})

test('treats 7 as Sunday and rejects invalid expressions', () => {
    const sunday = new Date(2024, 0, 7, 8, 15)

    assert.equal(matchesCron('15 8 * * 7', sunday), true)
    assert.equal(isValidCron('60 * * * *'), false)
    assert.equal(matchesCron('not a cron', sunday), false)
})
