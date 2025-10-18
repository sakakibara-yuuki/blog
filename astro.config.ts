// @ts-check
import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs({ devtools: true }), db()]
});