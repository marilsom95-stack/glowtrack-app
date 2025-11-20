# GlowTrack Frontend

Next.js 14 app router frontend for GlowTrack. Use the scripts below for local development and linting.

## Setup
1. Install Node.js 20+.
2. Install dependencies:
   ```bash
   npm install
   ```

## Scripts
- `npm run dev` – start Next.js in development mode on `http://localhost:3000`.
- `npm run build` – create a production build.
- `npm run lint` – run ESLint with the Next.js rule set.

## Environment variables
Create `.env.local` in this folder to configure the API base URL and other client-safe settings:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Values prefixed with `NEXT_PUBLIC_` are exposed to the browser and can be read via `process.env.NEXT_PUBLIC_API_URL`.
