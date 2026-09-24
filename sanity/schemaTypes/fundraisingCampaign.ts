import { defineField, defineType } from 'sanity'

export const fundraisingCampaign = defineType({
  name: 'fundraisingCampaign',
  title: 'Fundraising Campaign CTA',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle off to hide the callout without deleting the content — useful once a campaign wraps up.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      description: 'Small label above the heading, e.g. "Phase 2 Campaign".',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 4,
      description: 'Keep specific dollar amounts out of this — if the campaign has its own donation site with a live total, that number goes stale here the moment someone gives.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      initialValue: 'Give Now',
      description: 'e.g. "Give to Phase 2"',
    }),
    defineField({
      name: 'url',
      title: 'Link URL',
      type: 'url',
      validation: (r) => r.required(),
      description: 'Where the button links to — usually the campaign\'s own donation page.',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'enabled' },
    prepare({ title, subtitle }: { title?: string; subtitle?: boolean }) {
      return { title: title ?? '(no heading set)', subtitle: subtitle ? 'Visible' : 'Hidden' }
    },
  },
})
