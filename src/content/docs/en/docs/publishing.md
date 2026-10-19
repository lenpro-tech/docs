---
title: Publishing
description: How a game gets from your machine into the store.
---

## Get access

The catalog repository is private while the store is in preview. Leave
your GitHub login in the [waitlist form](/en/#the-store-opens-soon); you
get read access, which is enough to fork it and open pull requests.

## Steps

1. Fork `lenpro-tech/games` and clone your fork.
2. Run `npm ci` at the repo root (Node 22).
3. Create a game: `cd games && npx game-kit create <slug> --no-install && cd ..`.
   Set every `@table-games-engine/*` dependency in
   `games/<slug>/package.json` to the exact version in the root
   `package.json`, then run `npm install` at the root. Do not commit a
   lockfile inside `games/<slug>/`.
4. Build the game with your AI — see [Building with an LLM](/en/docs/llm/).
5. `npm run check -w games/<slug>` must pass; play it with
   `npm run preview -w games/<slug>` (needs Docker).
6. Open a pull request from your fork. A maintainer approves the CI
   run, plays the game and reviews it against the checklist.

A person plays and reviews every game before it is listed. Approved
games ship with the next weekly release.

## Rules

- `slug` equals the folder name; `plugin.id` equals `slug`;
  `plugin.version` equals `version`.
- Any change outside `tests/` needs a higher `version`.
- A listed game is never deleted or renamed — set `"listed": false`
  instead.
- `client.entry` must be inside `client/dist/`.
