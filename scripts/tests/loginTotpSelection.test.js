import assert from 'node:assert/strict'
import test from 'node:test'

import loginModule from '../../dist/browser/auth/Login.js'

const { Login } = loginModule

function makeLogin(options) {
    const selected = []
    const login = Object.create(Login.prototype)
    login.bot = {
        isMobile: false,
        logger: { debug() {}, error() {}, info() {}, warn() {} },
        browser: { utils: { ghostClick: async () => true } }
    }
    login.selectors = {
        passwordlessOptionOld: 'old-authenticator',
        passwordlessCheck: 'challenge-check',
        passwordlessNumber: 'challenge-number',
        primaryButton: 'primary-button'
    }
    login.signInMethodsLogged = false
    login.passwordlessMethodSelected = false
    login.getSignInMethodOptions = async () => options
    login.logAvailableSignInMethods = () => {}
    login.clickSignInMethodOption = async (_page, option) => {
        selected.push(option)
        return true
    }
    login.waitForIdle = async () => {}
    login.checkSelector = async () => false
    return { login, selected }
}

const options = {
    password: { index: 0, selector: 'password', label: 'Password', signature: 'm11.78 10.22a.75' },
    totp: { index: 1, selector: 'totp', label: 'Authenticator code', signature: 'm8.25 9c.97 0 1.75.78' },
    authenticator: {
        index: 2,
        selector: 'authenticator',
        label: 'Approve request',
        signature: 'm15.75 2c16.99 2 18 3'
    }
}

test('classifies the current authenticator-code icon as TOTP', () => {
    const { login } = makeLogin([])

    assert.equal(login.classifySignInMethod(options.totp), 'TOTP')
})

test('selects TOTP before push approval when a secret is configured', async () => {
    const { login, selected } = makeLogin([options.authenticator, options.totp])

    await login.handleState('SIGN_IN_METHOD_PICKER', {}, { password: '', totpSecret: 'secret' })

    assert.deepEqual(selected, [options.totp])
})

test('keeps password preference and does not select TOTP without its secret', async () => {
    const withPassword = makeLogin([options.totp, options.password])
    await withPassword.login.handleState('SIGN_IN_METHOD_PICKER', {}, { password: 'configured', totpSecret: 'secret' })
    assert.deepEqual(withPassword.selected, [options.password])

    const withoutSecret = makeLogin([options.totp, options.authenticator])
    await withoutSecret.login.handleState('SIGN_IN_METHOD_PICKER', {}, { password: '' })
    assert.deepEqual(withoutSecret.selected, [options.authenticator])
})