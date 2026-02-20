import React from 'react'

const NextImage = ({
  src,
  alt,
  fill,
  sizes,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  fill?: boolean
  sizes?: string
}) => <img src={src} alt={alt ?? ''} {...props} />

NextImage.displayName = 'NextImage'
export default NextImage
