import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

export default defineConfig({
  site: 'https://logigra.ru',
  integrations: [
    starlight({
      title: 'Logigra',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Русский', lang: 'ru' },
        en: { label: 'English', lang: 'en' },
      },
      plugins: [
        starlightTypeDoc({
          entryPoints: [
            './node_modules/@table-games-engine/core/dist/index.d.ts',
            './node_modules/@table-games-engine/game-kit/dist/index.d.ts',
          ],
          tsconfig: './tsconfig.typedoc.json',
          output: 'docs/reference/api',
          typeDoc: { excludeExternals: false, entryPointStrategy: 'resolve' },
        }),
      ],
      sidebar: [
        {
          label: 'Reference',
          translations: { ru: 'Справочник' },
          items: [{ slug: 'docs/reference/game-json' }, { slug: 'docs/reference/cli' }, typeDocSidebarGroup],
        },
      ],
    }),
  ],
});
