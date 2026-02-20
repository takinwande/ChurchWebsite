import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'startDateTime', title: 'Start Date & Time', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'endDateTime', title: 'End Date & Time (optional)', type: 'datetime' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description',
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
    defineField({ name: 'registrationUrl', title: 'Registration URL (optional)', type: 'url' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'image', title: 'Event Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'title', date: 'startDateTime', media: 'image' },
    prepare({ title, date, media }) {
      const d = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
      return { title, subtitle: d, media }
    },
  },
})
