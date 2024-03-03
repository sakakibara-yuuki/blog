/*
 * rss.xml.js
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */
import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET() {
  return rss({
    title: 'Astro学習者 | ブログ',
    description: 'Astroを学ぶ旅',
    site: 'https://my-blog-site.netlify.app',
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>ja-jp</language>`,
  });
}
