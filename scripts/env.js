export function envStrFrom(sourceEnv, key) {
    const value = sourceEnv[key]
    if (value === undefined) return undefined

    const trimmed = String(value).trim()
    return trimmed.length ? trimmed : undefined
}

export function envStr(key, sourceEnv = process.env) {
    return envStrFrom(sourceEnv, key)
}

export function envBool(key, fallback, sourceEnv = process.env) {
    const value = envStr(key, sourceEnv)
    if (value === undefined) return fallback
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

export function envInt(key, fallback, sourceEnv = process.env) {
    const value = envStr(key, sourceEnv)
    if (value === undefined) return fallback

    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

export function parseAccountsJson(sourceEnv = process.env) {
    const raw = envStrFrom(sourceEnv, 'ACCOUNTS_JSON')
    if (!raw) return []

    let accounts
    try {
        accounts = JSON.parse(raw)
    } catch (error) {
        throw new Error(`ACCOUNTS_JSON must contain valid JSON: ${error.message}`)
    }

    if (!Array.isArray(accounts)) throw new Error('ACCOUNTS_JSON must be a JSON array.')
    for (const [index, account] of accounts.entries()) {
        if (!account || typeof account !== 'object' || Array.isArray(account) || typeof account.email !== 'string') {
            throw new Error(`ACCOUNTS_JSON[${index}].email must be a string.`)
        }
    }
    return accounts
}
