import { defineField, defineType } from 'sanity'

export const sermonSeries = defineType({
  name: 'sermonSeries',
  title: 'Sermon Series',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage' },
  },
})
