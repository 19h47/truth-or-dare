# Truth or dare

A truth or dare game, in [English](https://19h47.github.io/truth-or-dare/) and [French](https://19h47.github.io/truth-or-dare/fr/).

## History

- **January 2019**: the project starts as _Send a wish_, a small app to draw and send New Year’s wishes, built with Vue 2 and webpack.
- **March 2020**: it becomes _Truth or dare_ during the first COVID-19 lockdown in France. That is why some tasks still mention lockdown, masks or staying at home. The game is in French, built with Vue CLI and deployed over FTP.
- **November 2026**: the project is modernized. It moves to Vite, Vue 3, TypeScript, Pinia and pnpm, gains an English version, a light theme, sharing through the Web Share API and end-to-end tests, and is deployed to GitHub Pages.

## Development

Install the dependencies:

```
pnpm install
```

Start the development server:

```
pnpm dev
```

Build for production, then preview the build:

```
pnpm build
pnpm preview
```

Check types and formatting:

```
pnpm type-check
pnpm lint
```

Build and run the end-to-end tests:

```
pnpm exec playwright install
pnpm test
```

Pushing to `master` builds, tests and deploys the site to GitHub Pages.

## Acknowledgments

- Thanks to [Thierry Michel](https://github.com/thierrymichel/dwa-movie-wishlist)
