import { defineField, defineType } from 'sanity'

export const prayerRequest = defineType({
  name: 'prayerRequest',
  title: 'Prayer Request',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Shown as "Anonymous" if the submitter requested anonymity.',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Optional — for pastoral follow-up only.',
      readOnly: true,
    }),
    defineField({
      name: 'request',
      title: 'Prayer Request',
      type: 'text',
      rows: 4,
      readOnly: true,
    }),
    defineField({
      name: 'isAnonymous',
      title: 'Anonymous',
      type: 'boolean',
      description: 'If true, the submitter asked to remain anonymous.',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Praying', value: 'praying' },
          { title: 'Answered', value: 'answered' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'request',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      const badge = status === 'answered' ? ' ✓' : status === 'praying' ? ' 🙏' : ''
      return {
        title: `${title ?? 'Anonymous'}${badge}`,
        subtitle: subtitle?.slice(0, 80),
      }
    },
  },
})
