export interface AppDashboardData {
    code: number
    response: {
        promotions: Promotion[]
    }
}

export interface Promotion {
    name: string
    attributes: Record<string, string>
}
