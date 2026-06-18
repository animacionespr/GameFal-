'use client'

import { useState } from 'react'

interface Props {
  sources: string[]
  fallback: string
  alt: string
  className?: string
}

export function OfficialPhoto({ sources, fallback, alt, className = '' }: Props) {
  const allSrcs = [...sources, fallback]
  const [idx, setIdx] = useState(0)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={allSrcs[idx]}
      alt={alt}
      className={className}
      onError={() => {
        if (idx < allSrcs.length - 1) setIdx(i => i + 1)
      }}
    />
  )
}
