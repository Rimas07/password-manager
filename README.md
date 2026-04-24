PassVault

Team password manager — encrypted locally, no backend required.

About

PassVault solves a common problem in small teams: passwords shared in Telegram, reused across platforms, or stored in spreadsheets. It provides a single encrypted vault with department categories, a security audit dashboard, and passwords checked against the HIBP breach database — all running entirely in the browser.

All data is stored in localStorage as AES-256-GCM ciphertext. No server, no account, no data leaves your device. Assumes a trusted client environment (no XSS protection layer implemented yet).

Supports three interface languages — English, Russian, and Uzbek — with an onboarding flow that lets new users pick their language before the guide starts.

Features

AES-256-GCM encryption via WebCrypto API, master password never stored
Security Dashboard with health score (0–100), weak / reused / outdated password detection
HIBP breach check with k-anonymity — no plaintext leaves the device
CSV and JSON import / export for backup and migration from other managers
Department categories, full-text search, sort by date / name / strength
Password age indicator (90+ days), reuse warnings, creation date on each card
Auto-lock on inactivity (5 / 15 / 30 min)
Three-language UI: English, Russian, Uzbek — persisted across sessions
Keyboard shortcuts: N new entry · L lock · / focus search
Setup

npm install
npm run dev

Deployed

https://password-manager-production-0f88.up.railway.app/

How encryption works

The master password is never stored. It derives an encryption key via PBKDF2 (100,000 iterations, SHA-256). All credentials are encrypted with AES-256-GCM using a unique IV per save, via the browser's native WebCrypto API. If the wrong password is entered, decryption fails and access is denied — there is no server-side check to bypass.

Bonus feature — Security Dashboard + HIBP

Security Dashboard shows a password health score from 0 to 100, factoring in weak, reused, and outdated passwords. Each password is checked against the Have I Been Pwned database using k-anonymity: only the first 5 characters of the SHA-1 hash are sent to the API, comparison happens locally. No plaintext password is transmitted.

Chose this feature because employees often don't know their passwords already appear in known breach databases.

What I would add next

Cloud sync without a dedicated backend — encrypted JSON export to Google Drive or Dropbox, keeping the same client-side encryption model. A TOTP generator for storing 2FA secrets alongside credentials. Role-based sharing within a team so individual credentials can be shared without exposing the full vault. And if a backend became necessary, I would apply the multi-tenant isolation model I built in my thesis: per-team namespaces, JWT auth, audit logging — with encryption remaining on the client side.

Stack: React · TypeScript · Vite · Tailwind CSS · Framer Motion · WebCrypto API · i18n (EN / RU / UZ)

