import assert from 'node:assert/strict'
import test from 'node:test'

import reactModule from '../../dist/browser/ReactFunc.js'

const { default: ReactFunc } = reactModule

function parseQuestList(stream) {
    const parser = new ReactFunc({
        isMobile: false,
        logger: { debug() {}, error() {}, info() {}, warn() {} }
    })
    parser.concatFlightChunks = () => stream
    return parser.snapshotQuestList('fixture')
}

test('resolves deferred Flight chunks for quest title, points, and progress', () => {
    const offerId = 'seasonal_pcparent_halloween'
    const stream = [
        `/earn/quest/${offerId} {"id":"quest_${offerId}","children":["$L82","$L83"]}`,
        '82:{"title":"Halloween Quest"}',
        '83:{"points":["+","50"],"progress":"0 von 6"}'
    ].join('\n')

    assert.deepEqual(parseQuestList(stream), [
        { offerId, title: 'Halloween Quest', pointProgressMax: 50, complete: false }
    ])
})

test('keeps quest boundaries separate and recognizes completed localized cards', () => {
    const first = 'weekly_pcparent_first'
    const second = 'weekly_pcparent_second'
    const stream = [
        `/earn/quest/${first} {"title":"First","points":["","25"],"progress":"1/1"}`,
        `/earn/quest/${second} {"title":"Second","points":["+","40"],"progress":"0 of 4"}`
    ].join('\n')

    assert.deepEqual(parseQuestList(stream), [
        { offerId: first, title: 'First', pointProgressMax: 25, complete: true },
        { offerId: second, title: 'Second', pointProgressMax: 40, complete: false }
    ])
})

test('reads offer title and points from a referenced Flight chunk', () => {
    const parser = new ReactFunc({
        isMobile: false,
        logger: { debug() {}, error() {}, info() {}, warn() {} }
    })
    const title = { className: 'text-globalBody2Strong', children: 'Explore on Bing' }
    const points = { className: 'text-statusInformativeTintFg', children: '+10 points' }
    const stream = [
        '{"offerId":"exploreonbing_offer","hash":"offer-hash","children":["$L82","$L83"]}',
        `82:${JSON.stringify(title)}`,
        `83:${JSON.stringify(points)}`
    ].join('\n')

    assert.deepEqual(parser.parseOffers(stream), [
        {
            offerId: 'exploreonbing_offer',
            hash: 'offer-hash',
            title: 'Explore on Bing',
            description: '',
            points: 10,
            promotionSubtype: null,
            destination: '',
            isCompleted: false,
            isPromotional: false,
            isLocked: false,
            unlockCriteria: null,
            date: null,
            activityType: null,
            reportable: true
        }
    ])
})