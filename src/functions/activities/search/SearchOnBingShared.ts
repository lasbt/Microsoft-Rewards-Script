import { URLs } from '../../../constants/urls'
import type { BasePromotion, Dashboard } from '../../../interface/DashboardData'
import type { MicrosoftRewardsBot } from '../../../index'

interface ActivityQueries {
    title: string
    queries: string[]
}

export async function activateSearchOnBing(bot: MicrosoftRewardsBot, promotion: BasePromotion): Promise<boolean> {
    const offerId = promotion.offerId
    const actionId = bot.nextActions.reportActivity

    if (!actionId) {
        bot.logger.warn(
            bot.isMobile,
            'SEARCH-ON-BING-ACTIVATE',
            `Skipping ${offerId}: "reportActivity" not discovered in bundle`
        )
        return false
    }

    const live = await bot.browser.func.ensureOffer(offerId)
    const hash = live?.hash ?? promotion.hash ?? null
    if (!hash) {
        bot.logger.warn(
            bot.isMobile,
            'SEARCH-ON-BING-ACTIVATE',
            `Skipping ${offerId}: no live hash for the activation offer`
        )
        return false
    }

    try {
        const { status, acknowledged } = await bot.browser.func.reportServerAction(actionId, [
            hash,
            11,
            {
                offerid: offerId,
                isPromotional: '$undefined',
                timezoneOffset: bot.userData.timezoneOffset
            }
        ])

        bot.logger.info(
            bot.isMobile,
            'SEARCH-ON-BING-ACTIVATE',
            `Activated activity | offerId=${offerId} | status=${status} | acknowledged=${acknowledged}`
        )
        return acknowledged
    } catch (error) {
        bot.logger.error(
            bot.isMobile,
            'SEARCH-ON-BING-ACTIVATE',
            `Activation failed | offerId=${offerId} | message=${error instanceof Error ? error.message : String(error)}`
        )
        return false
    }
}

export function findSearchOnBingOffer(dashboard: Dashboard, offerId: string): BasePromotion | undefined {
    const offers = [
        ...Object.values(dashboard.dailySetPromotions ?? {}).flat(),
        ...(dashboard.morePromotions ?? []),
        ...(dashboard.promotionalItems ?? []),
        ...(dashboard.promotionalItem ? [dashboard.promotionalItem] : [])
    ]
    return offers.find(offer => offer.offerId === offerId)
}

export async function getSearchOnBingQueries(bot: MicrosoftRewardsBot, promotion: BasePromotion): Promise<string[]> {
    try {
        const activities = (
            await bot.http.request<ActivityQueries[]>({
                method: 'GET',
                url: URLs.github.searchOnBingQueries
            })
        ).data

        const match = activities.find(
            activity => bot.utils.normalizeString(activity.title) === bot.utils.normalizeString(promotion.title)
        )
        if (!match?.queries.length) {
            bot.logger.warn(
                bot.isMobile,
                'SEARCH-ON-BING-QUERY',
                `No remote queries found for "${promotion.title}"; skipping this activity`
            )
            return []
        }

        bot.logger.info(
            bot.isMobile,
            'SEARCH-ON-BING-QUERY',
            `Found ${match.queries.length} remote queries for "${promotion.title}"`
        )
        return bot.utils.shuffleArray(match.queries)
    } catch (error) {
        bot.logger.error(
            bot.isMobile,
            'SEARCH-ON-BING-QUERY',
            `Remote query source failed | title="${promotion.title}" | message=${error instanceof Error ? error.message : String(error)}`
        )
        return []
    }
}
