export interface DashboardData {
    dashboard: Dashboard
    status: Status
    catalog: unknown
    profile: Profile
}

export interface BasePromotion<TAttributes = Record<string, string>, TPromotionType = string> {
    name: string | null
    priority: number
    attributes: TAttributes
    offerId: string
    complete: boolean
    counter: number
    activityProgress: number
    activityProgressMax: number
    pointProgressMax: number
    pointProgress: number
    promotionType: TPromotionType
    promotionSubtype: string
    title: string

    description: string

    imageUrl: string

    destinationUrl: string

    hash: string
    activityType: string

    isHidden: boolean

    level: string

    exclusiveLockedFeatureStatus: string
}

export enum Category {
    Donate = 'Donate',
    Empty = '',
    Shop = 'Shop',
    Win = 'Win'
}

export interface Product {
    name: string

    sku: string

    category: Category

    attributes: null

    disabled: boolean
}

export interface UserWarning {
    name: string
}

export interface Dashboard {
    userStatus: UserStatus
    userWarnings: UserWarning[]
    promotionalItem: PromotionalItem
    promotionalItems: PromotionalItem[]
    dailySetPromotions: { [key: string]: PromotionalItem[] }

    punchCards: PunchCard[]

    morePromotions: MorePromotion[]
    morePromotionsWithoutPromotionalItems: MorePromotion[]

    componentImpressionPromotions: unknown[]

    autoRedeemItem: unknown

    userProfile: Profile
    coupons: unknown[]

    created: Date
}

export interface Attributes {
    complete: string

    hidden: string
    max: string
    offerid: string
    progress: string

    type: string

    destination: string
}

export interface Streaks {
    promotion: DashboardImpression
}

export type DashboardImpression = BasePromotion<{ [key: string]: string } | null, string>

export enum Title {
    Empty = '',
    Search = 'Search'
}

export enum URL {
    JavascriptVoid0 = 'javascript:void(0);',
    RewardsDashboard = '/rewards/dashboard',
    RewardsRedeem = '/rewards/redeem',
    WWWBingCOMFORMMA1368 = '//www.bing.com/?FORM=MA1368',
    WWWMicrosoftstoreCOM = '//www.microsoftstore.com'
}

export type PromotionalItem = BasePromotion<Record<string, string>, string>

export enum State {
    Default = 'Default'
}

export enum Type {
    Empty = '',
    Search = 'search',
    Urlreward = 'urlreward',
    UrlrewardUrlrewardUrlrewardUrlreward = 'urlreward,urlreward,urlreward,urlreward',
    UrlrewardUrlrewardUrlrewardUrlrewardUrlreward = 'urlreward,urlreward,urlreward,urlreward,urlreward'
}

export type MorePromotion = BasePromotion<{ [key: string]: string }, string>

export interface PunchCard {
    name: string
    parentPromotion: PromotionalItem
    childPromotions: PromotionalItem[]
}

export interface Profile {
    ruid: string
    attributes: ProfileAttributes
}

export interface ProfileAttributes {
    ismsaautojoined: string
    created: Date
    creative: string
    publisher: string
    program: string
    country: string
    target: string
    epuid: string
    level: string
    level_upd: Date
    iris_segmentation: string
    iris_segmentation_upd: Date
    creative_upd: Date
    publisher_upd: Date
    program_upd: Date

    waitlistattributes: string
    waitlistattributes_upd: Date
    iscashbackeligible: string
}

export interface UserStatus {
    availablePoints: number
    lifetimePoints: number
    lifetimePointsRedeemed: number

    counters: Counters

    lifetimeGivingPoints: number
    isRewardsUser: boolean
}

export interface Counters {
    pcSearch: DashboardImpression[]
    mobileSearch: DashboardImpression[]
    activityAndQuiz: ActivityAndQuiz[]
    dailyPoint: DashboardImpression[]
}

export type ActivityAndQuiz = BasePromotion<Record<string, string> | null> & {}

export interface Level {
    key: string
    active: boolean
    name: string
    tasks: unknown[]
}

export interface Status {
    userStatus: UserStatus

    tip: unknown
}
