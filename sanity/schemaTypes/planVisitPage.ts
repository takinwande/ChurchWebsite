import { defineField, defineType } from 'sanity'

export const planVisitPage = defineType({
  name: 'planVisitPage',
  title: 'Plan a Visit Page',
  type: 'document',
  fields: [
    defineField({ name: 'heroText', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubtext', title: 'Hero Subtext', type: 'text', rows: 2 }),
    defineField({
      name: 'whatToExpectBody',
      title: 'What to Expect (rich text)',
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
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string', title: 'Question' }),
            defineField({ name: 'answer', type: 'text', title: 'Answer', rows: 4 }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),
    defineField({ name: 'contactCta', title: 'Contact CTA Text', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Plan a Visit Page' }) },
})
