import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Church Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', type: 'string', title: 'Street' }),
        defineField({ name: 'city', type: 'string', title: 'City' }),
        defineField({ name: 'state', type: 'string', title: 'State' }),
        defineField({ name: 'zip', type: 'string', title: 'ZIP Code' }),
      ],
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'serviceTimes',
      title: 'Service Times',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Service Name (e.g. Sunday Worship)' }),
            defineField({ name: 'day', type: 'string', title: 'Day (e.g. Sunday)' }),
            defineField({ name: 'time', type: 'string', title: 'Time (e.g. 10:00 AM)' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', type: 'url', title: 'Facebook URL' }),
        defineField({ name: 'instagram', type: 'url', title: 'Instagram URL' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube URL' }),
        defineField({ name: 'tiktok', type: 'url', title: 'TikTok URL' }),
      ],
    }),
    defineField({ name: 'givingUrl', title: 'Online Giving URL', type: 'url' }),
    defineField({ name: 'livestreamUrl', title: 'Livestream URL', type: 'url' }),
  ],
  preview: { select: { title: 'name' } },
})
