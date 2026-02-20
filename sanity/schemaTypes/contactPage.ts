import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'address', title: 'Address (display text)', type: 'text', rows: 3 }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'officeHours', title: 'Office Hours', type: 'text', rows: 2 }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
      description: 'Get this from Google Maps → Share → Embed a map → copy the src URL from the iframe code.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
})
