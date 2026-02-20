import { defineField, defineType } from 'sanity'

export const sermon = defineType({
  name: 'sermon',
  title: 'Sermons',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'reference',
      to: [{ type: 'speaker' }],
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'sermonSeries' }],
    }),
    defineField({ name: 'youtubeUrl', title: 'YouTube URL', type: 'url' }),
    defineField({ name: 'audioUrl', title: 'Audio URL (MP3)', type: 'url' }),
    defineField({
      name: 'summary',
      title: 'Summary / Notes',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
            { title: 'Subheading', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [{ title: 'URL', name: 'href', type: 'url' }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'scriptureRefs',
      title: 'Scripture References',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. John 3:16, Romans 8:28',
    }),
    defineField({
      name: 'resources',
      title: 'Downloadable Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Resource Title' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
        },
      ],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'speaker.name',
      date: 'date',
    },
    prepare({ title, subtitle, date }) {
      const d = date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
      return { title, subtitle: `${subtitle ?? 'Unknown'} · ${d}` }
    },
  },
})
