# Launch checklist for logigra.ru

The site is built and tested, but not deployed yet: `deploy.yml` stops at
`scripts/check-live.mjs` while `src/site-config.ts` still contains
`REPLACE_ME_*` placeholders. Steps for the operator, in order.

## 1. Yandex Forms (forms.yandex.ru)

Create two forms. Each must have a **required** checkbox «Согласен на
обработку персональных данных», with a link to
`https://logigra.ru/consent/`.

- **Школы — пилот:** Школа, Город, Имя, Роль (учитель / администрация /
  другое), Классы, Email или телефон, Комментарий.
- **Лист ожидания / доступ автора:** Email, GitHub login (необязательно),
  «Хочу публиковать игры» (флажок).

For each form, copy its embed link, `https://forms.yandex.ru/u/<id>/?iframe=1`.

## 2. Personal-data operator details

You need:
- ФИО ИП or the legal entity's name;
- ИНН;
- postal address;
- contact email.

Read the draft texts on `/privacy/` and `/consent/` (`src/pages/privacy.astro`,
`src/pages/consent.astro`). Ideally a lawyer reviews them too.

Also file the Roskomnadzor notification about personal-data processing
(ст. 22 152-ФЗ, pd.rkn.gov.ru).

## 3. Fill in the values

Put everything into `src/site-config.ts`: `FORMS.schools`,
`FORMS.waitlist`, and `PD_OPERATOR.name`, `inn`, `address` and `email`.
Then run:

```sh
node scripts/check-live.mjs   # must print "operator values set"
npm run build && npm test
```

Commit through a PR to `main`. The merge starts `deploy.yml`.

## 4. GitHub Pages

```sh
gh api -X POST repos/lenpro-tech/docs/pages -f build_type=workflow
gh api -X PUT repos/lenpro-tech/docs/pages -f cname=logigra.ru
gh workflow run deploy --repo lenpro-tech/docs
```

## 5. DNS for logigra.ru (reg.ru)

Remove the parking record `A 5.9.52.200`, then add:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | www | lenpro-tech.github.io |

Do not create `play` and `games` yet: they come with the store (P4/P5).

Check with `dig +short logigra.ru A`; it should return the four GitHub
IPs. Once GitHub has issued the certificate:

```sh
gh api -X PUT repos/lenpro-tech/docs/pages -F https_enforced=true
```

## 6. Verify the live site

```sh
curl -sI https://logigra.ru/ | head -1                                   # 200
curl -s https://logigra.ru/llms.txt | head -1                            # # Logigra
curl -s -o /dev/null -w '%{http_code}\n' https://logigra.ru/schools/     # 200
curl -s -o /dev/null -w '%{http_code}\n' https://logigra.ru/en/schools/  # 404
```

Manual checks:
- Both landing pages at 360 px width: no horizontal scroll, and the forms
  are usable.
- Send a test entry to each form and confirm it shows up in Yandex Forms.
- In an empty folder, give an AI agent `https://logigra.ru/llms-full.txt`
  and a short rules text (for example tic-tac-toe on a 4×4 board, three
  in a row). It should get to a green `npx game-kit check`.

## 7. After launch

- In `lenpro-tech/platform`, `docs/superpowers/specs/README.md`, set the Site
  row to `implemented (logigra.ru)`.
