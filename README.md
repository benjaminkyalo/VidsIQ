# VidsIQ

VidsIQ (vidsiq.com) is a free, browser-based workspace for YouTube creators: channel research,
metadata utilities, calculators, and permitted asset downloads.

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Structure

- `src/routes/` — public pages: homepage, tool pages, blog articles, information pages.
- `src/components/toolkit/` — shared shell, forms, player, media, and result panels.
- `src/lib/` — tool catalog, search content, calculators, parsing, and server helpers.
- `public/` — icons, `robots.txt`, sitemap, and site manifest.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
