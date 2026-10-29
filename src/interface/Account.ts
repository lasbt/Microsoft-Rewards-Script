export interface Account {
    email: string
    password: string
    totpSecret?: string
    recoveryEmail: string
    region?: string
    proxy: AccountProxy
}

export interface AccountProxy {
    proxyHttp: boolean
    url: string
    port: number
    password: string
    username: string
}

