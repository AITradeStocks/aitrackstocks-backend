# AITrackStocks Backend

Clean starter backend for GitHub + Railway deployment.

## Structure

- `src/index.ts` Express entrypoint
- `src/routes/*` route placeholders
- `prisma/schema.prisma` Prisma schema
- `railway.json` Railway config

## Quick start

1. Add environment variables in Railway:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY` (optional)
   - `PORT` (Railway usually sets this automatically)

2. Deploy from GitHub.

3. Test:
   - `/health`
   - `/api/auth`
   - `/api/market`
