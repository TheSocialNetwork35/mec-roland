declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    FILES: R2Bucket;
    ADMIN_PASSWORD_HASH: string;
    ADMIN_SESSION_SECRET: string;
  }
}
