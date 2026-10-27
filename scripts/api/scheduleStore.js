import fs from 'node:fs'
import path from 'node:path'

const CRON_FIELD_RANGES = [
    { min: 0, max: 59 }, // minute
    { min: 0, max: 23 }, // hour
    { min: 1, max: 31 }, // day of month
    { min: 1, max: 12 }, // month
    { min: 0, max: 7 } // day of week (7 == Sunday)
]

function validateField(expr, { min, max }) {
    if (expr === '*') return true
    for (const part of expr.split(',')) {
        if (!/^(?:\*|\d+|\d+-\d+)(?:\/\d+)?$/.test(part)) return false

        const stepSplit = part.split('/')
        if (stepSplit.length > 2) return false

        const step = stepSplit.length === 2 ? Number(stepSplit[1]) : 1
        if (!Number.isInteger(step) || step < 1) return false

        const range = stepSplit[0]
        let lo
        let hi
        if (range === '*') {
            lo = min
            hi = max
        } else if (range.includes('-')) {
            const [a, b] = range.split('-')
            lo = Number(a)
            hi = Number(b)
        } else {
            lo = Number(range)
            hi = Number(range)
        }
        if (!Number.isInteger(lo) || !Number.isInteger(hi)) return false
        if (lo < min || hi > max || lo > hi) return false
    }
    return true
}

export function isValidCron(expr) {
    if (typeof expr !== 'string') return false
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) return false
    return parts.every((part, i) => validateField(part, CRON_FIELD_RANGES[i]))
}

function cronFieldValues(expression, min, max) {
    const values = new Set()
    for (const part of expression.split(',')) {
        const [range, rawStep] = part.split('/')
        const step = rawStep === undefined ? 1 : Number(rawStep)
        const [from, to] =
            range === '*'
                ? [min, max]
                : range.includes('-')
                  ? range.split('-').map(Number)
                  : [Number(range), rawStep === undefined ? Number(range) : max]
        for (let value = from; value <= to; value += step) values.add(value)
    }
    return values
}

export function matchesCron(expression, date = new Date()) {
    if (!isValidCron(expression)) return false
    const [minute, hour, day, month, weekday] = expression.trim().split(/\s+/)
    const minuteValues = cronFieldValues(minute, 0, 59)
    const hourValues = cronFieldValues(hour, 0, 23)
    const dayValues = cronFieldValues(day, 1, 31)
    const monthValues = cronFieldValues(month, 1, 12)
    const weekdayValues = cronFieldValues(weekday, 0, 7)
    const dayMatches = dayValues.has(date.getDate())
    const weekdayMatches = weekdayValues.has(date.getDay()) || (date.getDay() === 0 && weekdayValues.has(7))
    const dayOfMonthWildcard = day === '*'
    const dayOfWeekWildcard = weekday === '*'

    return (
        minuteValues.has(date.getMinutes()) &&
        hourValues.has(date.getHours()) &&
        monthValues.has(date.getMonth() + 1) &&
        (dayOfMonthWildcard || dayOfWeekWildcard ? dayMatches && weekdayMatches : dayMatches || weekdayMatches)
    )
}

export function scheduleFilePath(projectRoot) {
    return process.env.SCHEDULE_FILE || path.join(projectRoot, 'config', 'schedule.json')
}

export function readSchedule(projectRoot) {
    const file = scheduleFilePath(projectRoot)
    if (fs.existsSync(file)) {
        let saved
        try {
            saved = JSON.parse(fs.readFileSync(file, 'utf8'))
        } catch (err) {
            throw Object.assign(new Error(`schedule.json is corrupt: ${err.message}`), { code: 'CORRUPT_SCHEDULE' })
        }
        const enabled = saved.enabled === undefined ? false : saved.enabled
        const cron = saved.cron == null ? null : saved.cron
        const skipIfRunning = saved.skipIfRunning === undefined ? true : saved.skipIfRunning
        const excludedAccountIndexes = saved.excludedAccountIndexes ?? []

        if (typeof enabled !== 'boolean') {
            throw Object.assign(new Error('schedule.json has a non-boolean `enabled` value.'), {
                code: 'CORRUPT_SCHEDULE'
            })
        }
        if (cron !== null && (typeof cron !== 'string' || !isValidCron(cron))) {
            throw Object.assign(new Error('schedule.json has an invalid `cron` expression.'), {
                code: 'CORRUPT_SCHEDULE'
            })
        }
        if (typeof skipIfRunning !== 'boolean') {
            throw Object.assign(new Error('schedule.json has a non-boolean `skipIfRunning` value.'), {
                code: 'CORRUPT_SCHEDULE'
            })
        }
        if (
            !Array.isArray(excludedAccountIndexes) ||
            excludedAccountIndexes.some(index => !Number.isSafeInteger(index) || index < 1)
        ) {
            throw Object.assign(new Error('schedule.json has invalid `excludedAccountIndexes`.'), {
                code: 'CORRUPT_SCHEDULE'
            })
        }
        if (enabled && !cron) {
            throw Object.assign(new Error('schedule.json enables scheduling without a cron expression.'), {
                code: 'CORRUPT_SCHEDULE'
            })
        }

        return {
            enabled,
            cron: cron?.trim() ?? null,
            skipIfRunning,
            excludedAccountIndexes: [...new Set(excludedAccountIndexes)].sort((a, b) => a - b),
            updatedAt: saved.updatedAt || null,
            timezone: process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
            source: 'override'
        }
    }
    return {
        enabled: Boolean(process.env.CRON_SCHEDULE),
        cron: process.env.CRON_SCHEDULE || null,
        skipIfRunning: true,
        excludedAccountIndexes: [],
        updatedAt: null,
        timezone: process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
        source: 'env'
    }
}

export function writeSchedule(projectRoot, patch) {
    const current = readSchedule(projectRoot)
    const next = { ...current }

    if ('cron' in patch) {
        if (typeof patch.cron !== 'string' || !isValidCron(patch.cron)) {
            throw Object.assign(new Error('Invalid cron expression (5 fields, e.g. "0 9 * * *").'), {
                code: 'BAD_REQUEST'
            })
        }
        next.cron = patch.cron.trim()
    }
    if ('enabled' in patch) {
        if (typeof patch.enabled !== 'boolean') {
            throw Object.assign(new Error('enabled must be a boolean.'), { code: 'BAD_REQUEST' })
        }
        next.enabled = patch.enabled
    }
    if ('skipIfRunning' in patch) {
        if (typeof patch.skipIfRunning !== 'boolean') {
            throw Object.assign(new Error('skipIfRunning must be a boolean.'), { code: 'BAD_REQUEST' })
        }
        next.skipIfRunning = patch.skipIfRunning
    }
    if ('excludedAccountIndexes' in patch) {
        if (!Array.isArray(patch.excludedAccountIndexes)) {
            throw Object.assign(new Error('excludedAccountIndexes must be an array.'), { code: 'BAD_REQUEST' })
        }
        const indexes = [...new Set(patch.excludedAccountIndexes.map(Number))]
        if (indexes.some(i => !Number.isSafeInteger(i) || i < 1)) {
            throw Object.assign(new Error('excludedAccountIndexes must contain only positive integers.'), {
                code: 'BAD_REQUEST'
            })
        }
        next.excludedAccountIndexes = indexes.sort((a, b) => a - b)
    }
    if (next.enabled && !next.cron) {
        throw Object.assign(new Error('Cannot enable the schedule without a cron expression.'), { code: 'BAD_REQUEST' })
    }

    next.updatedAt = new Date().toISOString()
    next.timezone = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone
    delete next.source

    const file = scheduleFilePath(projectRoot)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const tmp = `${file}.${process.pid}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(next, null, 2))
    fs.renameSync(tmp, file)

    return { ...next, source: 'override' }
}
