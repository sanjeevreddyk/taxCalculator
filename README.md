# Indian Income Tax Regime Comparison App

Production-ready client-side React + TypeScript application to compare Old vs New income tax regimes for FY 2025-26.

## Features
- Multi-step mobile-first wizard (React Hook Form + Zod)
- Redux Toolkit centralized state
- Pure tax calculation engine (`src/lib/taxCalculator.ts`)
- Configurable slabs, deductions, rebate, surcharge, cess
- Senior/super senior support
- Comparison chart (Recharts)
- PDF download (jsPDF)
- SEO tags + FAQ schema
- Unit tests (Vitest)
- Error boundary and validation messaging

## Project Structure
```txt
src/
  app/store.ts
  features/tax/
  lib/
  constants/
  components/
  hooks/
  types/
  utils/
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm run test
   ```
4. Create production build:
   ```bash
   npm run build
   ```

## Deployment
### Vercel
1. Push repository to Git provider.
2. Import project in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`
5. Output directory: `dist`

### Netlify
1. New site from Git.
2. Build command: `npm run build`
3. Publish directory: `dist`

