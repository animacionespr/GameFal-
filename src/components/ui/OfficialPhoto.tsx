'use client'

import { useState } from 'react'

interface Props {
  sources: string[]
  fallback: string
  alt: string
  className?: string
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

function resolve(src: string) {
  return src.startsWith('/') && !src.startsWith('//') ? `${BASE}${src}` : src
}

export function OfficialPhoto({ sources, fallback, alt, className = '' }: Props) {
  const all = [...sources, fallback].map(resolve)
  const [idx, setIdx] = useState(0)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={all[idx]}
      alt={alt}
      className={className}
      onError={() => {
        if (idx < all.length - 1) setIdx(i => i + 1)
      }}
    />
  )
}
