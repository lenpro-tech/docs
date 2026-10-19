// Operator-provided values. scripts/check-live.mjs blocks deploy while any REPLACE_ME remains.
export const FORMS = {
  schools: 'https://forms.yandex.ru/u/REPLACE_ME_SCHOOLS/?iframe=1',
  waitlist: 'https://forms.yandex.ru/u/REPLACE_ME_WAITLIST/?iframe=1',
} as const;

export const PD_OPERATOR = {
  name: 'REPLACE_ME_OPERATOR_NAME',
  inn: 'REPLACE_ME_INN',
  email: 'REPLACE_ME_EMAIL',
  revision: '2026-10-19',
} as const;
