import type { Credential } from '../../src/types/types'

export type Strength = 'weak' | 'fair' | 'strong'

export function getStrength(password: string): Strength {
    if (!password) return 'weak'
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 2) return 'weak'
    if (score <= 3) return 'fair'
    return 'strong'
}

export function findReusedPasswords(credentials: Credential[]): Set<string> {
    const counts = new Map<string, number>()
    for (const c of credentials) {
        counts.set(c.password, (counts.get(c.password) ?? 0) + 1)
    }
    const reused = new Set<string>()
    for (const [pass, count] of counts) {
        if (count > 1) reused.add(pass)
    }
    return reused
}

interface GenerateOptions {
    length: number
    uppercase: boolean
    numbers: boolean
    symbols: boolean
}

export function generatePassword(opts: GenerateOptions): string {
    let chars = 'abcdefghijklmnopqrstuvwxyz'
    if (opts.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (opts.numbers) chars += '0123456789'
    if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const array = new Uint8Array(opts.length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => chars[byte % chars.length]).join('')
}
