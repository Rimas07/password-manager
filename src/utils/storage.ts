import { encrypt, decrypt } from './crypto'

export function generateSalt(): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(16)) // sozdabie 16 sluchaynich bitov pri zapuske appky
}

export function saveSalt(salt: Uint8Array<ArrayBuffer>): void {
  localStorage.setItem('salt', btoa(String.fromCharCode(...salt)))
}

export function getSalt(): Uint8Array<ArrayBuffer> | null {
  const raw = localStorage.getItem('salt')
  if (!raw) return null
  return Uint8Array.from(atob(raw), c => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>
}

export async function saveVault(key: CryptoKey, data: unknown): Promise<void> {
  const encrypted = await encrypt(key, data)
  localStorage.setItem('vault', encrypted)
}

export async function loadVault(key: CryptoKey): Promise<unknown> {
  const raw = localStorage.getItem('vault')
  if (!raw) return []
  try {
    return await decrypt(key, raw)
  } catch {
    return null
  }
}
