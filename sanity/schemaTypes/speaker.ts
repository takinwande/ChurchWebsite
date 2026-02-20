import { defineField, defineType } from 'sanity'

export const speaker = defineType({
  name: 'speaker',
  title: 'Speakers',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title / Role', type: 'string', description: 'e.g. Lead Pastor, Associate Minister' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'photo' },
  },
})
