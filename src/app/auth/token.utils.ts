export function isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      return now > expiry;
    } catch (e) {
      return true; // If decoding fails, treat as expired
    }
  }
  