import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'mission', title: 'Mission Statement', type: 'text', rows: 3 }),
    defineField({ name: 'vision', title: 'Vision Statement', type: 'text', rows: 3 }),
    defineField({
      name: 'beliefs',
      title: 'Our Beliefs (rich text)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'leadership',
      title: 'Leadership Team',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Name' }),
            defineField({ name: 'title', type: 'string', title: 'Title / Role' }),
            defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } }),
            defineField({ name: 'bio', type: 'text', title: 'Short Bio', rows: 3 }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'title', media: 'photo' },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
