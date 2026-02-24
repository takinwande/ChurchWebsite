import { defineField, defineType } from 'sanity'

export const programFlier = defineType({
  name: 'programFlier',
  title: 'Program Fliers',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description:
        'Used only inside Sanity for identification (e.g. "Easter 2026 – Rev. Adeyemi"). Not displayed on the website.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Flier Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expiration Date & Time',
      type: 'datetime',
      description:
        'The flier will automatically stop appearing on the homepage after this date and time.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Use whole numbers (1, 2, 3).',
      initialValue: 1,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Expiration, Soonest First',
      name: 'expiresAtAsc',
      by: [{ field: 'expiresAt', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      expiresAt: 'expiresAt',
    },
    prepare({ title, media, expiresAt }) {
      const expiry = expiresAt
        ? new Date(expiresAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No expiry set'
      return {
        title: title ?? 'Untitled Flier',
        subtitle: `Expires: ${expiry}`,
        media,
      }
    },
  },
})
