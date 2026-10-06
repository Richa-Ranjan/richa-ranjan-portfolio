# Richa Ranjan — Portfolio

React + Vite + Framer Motion. No UI framework, two runtime dependencies.

## Run
```
npm install
npm run dev        # local dev
npm run build      # production build -> dist/
npm run preview    # serve the build
```

## Deploy to Vercel
Push to GitHub, import the repo in Vercel (framework: Vite, auto-detected). `vercel.json` is included.

## Fill these in
- **Project links:** `src/config.js` → `PROJECT_LINKS` (empty = shows `[ADD GITHUB PROJECT LINK]` / `[ADD PROJECT DEMO]`).
- **Portrait: add `public/photos/richa.jpg` (hero circle). Photos (Outside the code):** `src/components/Sections.jsx` → `Beyond`; drop images in `public/photos/` and swap the placeholder for an `<img>`.
- **Domain:** replace `YOUR-DOMAIN.vercel.app` in `public/robots.txt` and `public/sitemap.xml`.
- **Social preview:** add a 1200×630 `public/og.png`.
- **Resume:** `public/Richa_Ranjan_Resume.pdf` (currently your Software Engineer CV). Replace to update.
- **Analytics:** none included. `ANALYTICS_ID` in `src/config.js` is an optional hook.

## Notes
- Demos for StudyBuddy, Crop and Video Analyzer are labelled simulations. Food Delivery and Spreadsheet run real client-side logic.
- Shortcuts: `/` or `Ctrl/⌘+K` opens the command palette. Esc skips the intro. There is one hidden easter egg.
- Reduced-motion users get the intro skipped to a direct entry and near-zero transitions.
- GitHub link uses `github.com/Richa-Ranjan`. One of your CVs says `github.com/richaranjan`; confirm which is correct.
