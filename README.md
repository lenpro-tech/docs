# Logigra site

Source of [logigra.ru](https://logigra.ru): the authors landing, the
schools page and the author documentation (RU at `/`, EN at `/en/`),
built with [Astro Starlight](https://starlight.astro.build).

```sh
npm ci
npm run dev                  # http://localhost:4321
npm run build && npm test    # what CI runs
```

Reference pages and `llms-full.txt` are generated at build time from
the pinned `@table-games-engine/game-kit` package; bump it in
`package.json` to refresh them.

Code: Apache-2.0 (`LICENSE`). Content: CC BY 4.0 (`LICENSE-content`).
