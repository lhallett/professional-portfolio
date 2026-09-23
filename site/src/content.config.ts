import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const library = defineCollection({
  loader: glob({ pattern: '*/index.md', base: '../library', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: z.object({
    title: z.string(), description: z.string(), category: z.enum(['Mobile experiences', 'Identity and access', 'Application architecture']),
    tags: z.array(z.string()), maturity: z.enum(['Exploration', 'Working Example', 'Used in an Application', 'Archived']),
    sourceApplication: z.string(), sourceMaturity: z.string(), reviewed: z.string(), example: z.string(),
  }),
});
export const collections = { library };
