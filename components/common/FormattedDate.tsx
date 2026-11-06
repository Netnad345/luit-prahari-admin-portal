'use client'

import React, { useEffect, useState } from 'react'

interface FormattedDateProps {
  date?: string | number | Date | null
  type?: 'date' | 'time' | 'datetime'
  className?: string
  fallback?: string
}

export function FormattedDate({ date, type = 'datetime', className, fallback = '—' }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>('')

  useEffect(() => {
    if (!date) {
      setFormatted(fallback)
      return
    }

    const d = new Date(date)
    if (isNaN(d.getTime())) {
      setFormatted(fallback)
      return
    }

    if (type === 'date') {
      setFormatted(d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }))
    } else if (type === 'time') {
      setFormatted(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } else {
      setFormatted(d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
    }
  }, [date, type, fallback])

  // Provide deterministic SSR content to completely prevent React hydration mismatch errors
  const deterministicFallback = React.useMemo(() => {
    if (!date) return fallback
    const d = new Date(date)
    if (isNaN(d.getTime())) return fallback
    const iso = d.toISOString()
    if (type === 'time') return iso.slice(11, 16)
    if (type === 'date') return iso.slice(0, 10)
    return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`
  }, [date, type, fallback])

  return (
    <span className={className} suppressHydrationWarning>
      {formatted || deterministicFallback}
    </span>
  )
}

