import { defineConfig, type DocumentActionComponent } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

// Singleton document IDs
const singletonTypes = new Set(['siteSettings', 'announcement', 'planVisitPage', 'aboutPage', 'contactPage'])
const singletonActions = (input: DocumentActionComponent[]) =>
  input.filter((action) => action.action !== 'delete')

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'RCCG Covenant Assembly',
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Announcement Banner')
              .id('announcement')
              .child(S.document().schemaType('announcement').documentId('announcement')),
            S.divider(),
            // Pages
            S.listItem()
              .title('Plan a Visit Page')
              .id('planVisitPage')
              .child(S.document().schemaType('planVisitPage').documentId('planVisitPage')),
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Contact Page')
              .id('contactPage')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.divider(),
            // Collections
            S.documentTypeListItem('sermon').title('Sermons'),
            S.documentTypeListItem('sermonSeries').title('Sermon Series'),
            S.documentTypeListItem('speaker').title('Speakers'),
            S.divider(),
            S.documentTypeListItem('event').title('Events'),
            S.documentTypeListItem('ministry').title('Ministries'),
            S.divider(),
            S.documentTypeListItem('galleryAlbum').title('Gallery Albums'),
          ]),
    }),
    visionTool(),
  ],
  document: {
    actions: (input, { schemaType }) =>
      singletonTypes.has(schemaType) ? singletonActions(input) : input,
  },
})
