import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
    h3: ({ children }) => <h3 className="mb-3 mt-6 text-xl font-semibold text-foreground">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 mt-5 text-lg font-semibold text-foreground">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    ),
  },
}

interface PortableTextRendererProps {
  value: PortableTextBlock[]
  className?: string
}

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
