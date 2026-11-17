import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    name: z.string().trim().min(1, 'El nombre de la categoría es obligatorio'),
    description: z.string().optional(),
    order: z.number().int().default(0),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string().trim().min(1, 'El título es obligatorio'),
    description: z.string().optional(),
    category: z.string().trim().min(1, 'La categoría es obligatoria').default('guias'),
    tags: z.array(z.string()).default([]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { docs, categories };
