# Deployment Analysis

## How CartaDigital-old was deployed

Based on an analysis of the repository files, **CartaDigital-old was deployed using GitHub Pages**.

The evidence for this is clear in the `.github/workflows/deploy.yml` file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Additionally, the `README.md` file explicitly states:
> El workflow `.github/workflows/deploy.yml` construye y publica automáticamente en GitHub Pages al hacer push a `main`.

There are no configuration files for Vercel (`vercel.json`), Netlify (`netlify.toml`), or Firebase (`firebase.json`). The base URL in `vite.config.ts` (`base: '/CartaDigital/'`) is also typical for a GitHub Pages deployment on a project repository, which defaults to `https://<username>.github.io/<repository-name>/`.

## Reusability for CartaDigitalQR

**Yes, the exact same deployment strategy can be reused for CartaDigitalQR.**

Since CartaDigitalQR is also a single-page application (SPA) built with Vite, React, and TypeScript (as indicated by the similar technology stack), GitHub Pages remains an excellent, free choice for hosting the built static files.

To reuse this strategy, the following needs to be done on the new CartaDigitalQR repository:

1. **Copy the Workflow:** Copy the `.github/workflows/deploy.yml` file from the old repository to the new one.
2. **Configure Secrets:** Set up the required GitHub Actions secrets (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the new repository settings.
3. **Update Base Path (if necessary):** If the new repository name is different (e.g., `CartaDigitalQR` instead of `CartaDigital`), the `base` property in `vite.config.ts` must be updated to match the new repository name (e.g., `base: '/CartaDigitalQR/'`) to ensure assets load correctly.
4. **Enable GitHub Pages:** Ensure GitHub Pages is enabled in the repository settings and configured to use GitHub Actions as the source.
