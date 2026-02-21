import { defineField, defineType } from 'sanity'

export const pastorsDesk = defineType({
  name: 'pastorsDesk',
  title: "Pastor's Desk",
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: (r) => r.required() }),
    defineField({
      name: 'scripture',
      title: 'Scripture Reference',
      type: 'string',
      description: 'e.g. Jeremiah 1:4-5 (NKJV)',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
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
    defineField({ name: 'confession', title: 'Confession', type: 'text', rows: 2 }),
    defineField({ name: 'prayer', title: 'Prayer', type: 'text', rows: 2 }),
    defineField({
      name: 'furtherReading',
      title: 'Further Reading',
      type: 'string',
      description: 'e.g. Jeremiah 1:19',
    }),
  ],
  orderings: [
    { title: 'Date (newest first)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
    prepare({ title, subtitle }: { title: string; subtitle?: string }) {
      const d = subtitle
        ? new Date(subtitle).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          })
        : ''
      return { title, subtitle: d }
    },
  },
})
