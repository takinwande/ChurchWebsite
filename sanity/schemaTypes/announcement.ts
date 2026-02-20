import { defineField, defineType } from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show Banner',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to show or hide the announcement banner across the site.',
    }),
    defineField({ name: 'text', title: 'Announcement Text', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'link', title: 'Link URL (optional)', type: 'url' }),
    defineField({ name: 'linkText', title: 'Link Label (optional)', type: 'string' }),
  ],
  preview: { select: { title: 'text', subtitle: 'enabled' } },
})
