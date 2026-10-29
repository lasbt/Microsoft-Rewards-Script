import type { Account } from '../interface/Account'

export interface AccountLocale {
    language: string
    country?: string
    locale: string
    acceptedLocales: string[]
    acceptLanguage: string
}

type LocaleAccount = Pick<Account, 'region'>

export function normalizeCountry(value: string | undefined): string | undefined {
    if (!value) return undefined
    const normalized = value.trim().toUpperCase()
    return /^[A-Z]{2}$/.test(normalized) ? normalized : undefined
}

export function resolveAccountLocale(account: LocaleAccount, resolvedCountry?: string): AccountLocale {
    const country = normalizeCountry(account.region) ?? normalizeCountry(resolvedCountry)
    const locale = country
        ? new Intl.Locale('und', { region: country }).maximize()
        : new Intl.Locale(Intl.DateTimeFormat().resolvedOptions().locale)
    const language = locale.language.toLowerCase()
    const localeTag = locale.toString()
    const acceptedLocales = localeTag.toLowerCase() === language ? [language] : [localeTag, language]
    const acceptLanguage = acceptedLocales
        .map((acceptedLocale, index) => (index === 0 ? acceptedLocale : `${acceptedLocale};q=${1 - index * 0.1}`))
        .join(',')

    return {
        language,
        ...(country ? { country } : {}),
        locale: localeTag,
        acceptedLocales,
        acceptLanguage
    }
}
