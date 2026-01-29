type TokenPayload = {
  token: string;
  expiresAt: number;
};

const TOKEN_KEY = "auth_token_v1";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

let memoryToken: TokenPayload | null = null;

function now() {
  return Date.now();
}

function readStoredToken(): TokenPayload | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TokenPayload;
    if (!parsed.token || !parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredToken(payload: TokenPayload | null) {
  try {
    if (!payload) {
      sessionStorage.removeItem(TOKEN_KEY);
      return;
    }
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures (private mode, etc.)
  }
}

export const authStorage = {
  getToken(): string | null {
    if (memoryToken && memoryToken.expiresAt > now()) {
      return memoryToken.token;
    }

    const stored = readStoredToken();
    if (!stored) return null;

    if (stored.expiresAt <= now()) {
      writeStoredToken(null);
      return null;
    }

    memoryToken = stored;
    return stored.token;
  },

  setToken(token: string, ttlMs: number = DEFAULT_TTL_MS) {
    const payload = { token, expiresAt: now() + ttlMs };
    memoryToken = payload;
    writeStoredToken(payload);
  },

  clearToken() {
    memoryToken = null;
    writeStoredToken(null);
  },

  isExpired(): boolean {
    const stored = memoryToken ?? readStoredToken();
    if (!stored) return true;
    return stored.expiresAt <= now();
  },
};
