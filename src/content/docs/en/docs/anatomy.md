---
title: Game anatomy
description: What is inside a game package and the rules the platform enforces.
---

## Files

```
game.json          metadata: slug, name, players, locales, presets, rules, client entry
rules.md           rules text (rules.<locale>.md for more locales)
logic/index.ts     server-side logic: default-exports a GamePlugin
client/            browser client (vite app) shown to each player
tests/             vitest tests
```

See the [`game.json` reference](/docs/reference/game-json/) and the
[API reference](/docs/reference/api/readme/).

## The server decides

Game state changes only in `logic/`, and `logic/` runs only on the
server. A client sends an input — one of the moves the server offered —
and the server applies it or rejects it. A modified client cannot cheat.

`legalMoves(state, playerId)` lists every move a player may make now.
The client builds its UI from that list, and `simulate` plays random
moves from it, so the list must be complete and exact.

## Same seed, same match

Logic is deterministic and pure: no `Math.random`, no clock, no
network, no module-level mutable state. Randomness comes from the
engine's seeded helpers (`ctx.random*`). Replaying a seed and the same
inputs gives an identical match; `simulate` checks this.

## The client is sandboxed

The client runs in a sandboxed iframe on a separate origin with **no
network access**: no fetch, no CDN, no remote fonts — bundle everything.
It sees only its own player's view and talks to the store through the
bridge (`@table-games-engine/game-kit/bridge`). It must work on a
360 px wide phone screen.

## Presets

A preset is a named match configuration (board size, variant flags),
listed in `game.json`. Its `config` object is passed to `setup`; the
first preset is the default. `simulate` and `check` cover every preset.
