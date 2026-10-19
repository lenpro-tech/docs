---
title: Quickstart
description: Create a game, play it locally and pass the same checks as the store's CI.
---

## Before you start

- Node.js 22 or newer.
- Docker, only for playing the game locally (`preview`).
- An AI coding agent that can run shell commands (we test with Claude Code).

## 1. Create a game

```sh
npx @table-games-engine/game-kit create my-game
cd my-game
```

You get a working two-player duel: logic, tests, a browser client and
`game.json`. Replace it with your game.

## 2. Build it with your AI

Give your agent the rules of your game and point it at the instructions
shipped in the package — see [Building with an LLM](/en/docs/llm/).

## 3. Play it

```sh
npm run preview
```

Opens both seats side by side in your browser, backed by a real game
server in Docker. Every move goes through the server, exactly as in the
store.

## 4. Check it

```sh
npm run check
```

Runs everything the store's CI runs: validates `game.json`, lints the
logic, typechecks, runs your tests, plays 1000 random matches per preset
and player count, and builds the client. Done when it prints
`check: OK`.

| Step | What it proves |
|---|---|
| `npm test` | the rules you wrote tests for behave as written |
| `npm run simulate` | random matches always finish, and every offered move is accepted |
| `npm run check` | the game is ready to submit |
| `npm run preview` | it is fun, and the client works in a browser |

Next: [Game anatomy](/en/docs/anatomy/) · [Publishing](/en/docs/publishing/)
