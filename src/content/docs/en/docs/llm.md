---
title: Building with an LLM
description: How to split the work with your AI so the game comes out right.
---

## Who does what

**You invent and verify, the AI writes the code.** You own the rules,
the decisions on every ambiguity, and the judgement whether the game is
fun. The AI writes the logic, the tests and the client, and runs the
checks until they pass.

## Give your agent the instructions

Every game package ships a skill file with the full contract, the rules
the checks enforce and a table of common failures:

```
node_modules/@table-games-engine/game-kit/skill/create-store-game.md
```

The scaffold's `AGENTS.md` already points at it. If your agent can read
the web, the whole documentation is also one file:
[`https://logigra.ru/llms-full.txt`](/llms-full.txt).

## A starter prompt

```text
Build the game described in rules.md as a store game.
Follow node_modules/@table-games-engine/game-kit/skill/create-store-game.md.
Locales: en, ru. Players: 2. Presets: "small" (5x5) and "classic" (8x8).
Before writing code, list every ambiguity in the rules and propose a
decision for each; wait for my answers and write them into rules.md.
You are done when `npx game-kit check` prints `check: OK`.
```

## The loop

1. `npx game-kit test` — your scripted matches and per-rule tests.
2. `npx game-kit simulate -n 200` — random matches; a failure prints the
   seed to replay it.
3. `npx game-kit check` — the full CI run.
4. `npm run preview` — you play both seats and decide what to change.

Your job in the loop: read the rules decisions the AI wrote down, play
the game, and report what feels wrong. The checks catch broken rules;
only you can catch a boring game.

## Worked example: Gridball

Gridball, a paper-football game, was built by an AI agent from a rules
description with zero human code edits. It reached a green `check` on
the second run, played 2000 simulated matches without an error and
passed a human playtest. The hardest part for the agent was the penalty
flow; the rules file now records each decision it made.
