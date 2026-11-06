import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'rectangular' | 'rounded' | 'circular' | 'card'
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export function Skeleton({
  className,
  variant = 'rounded',
  delay = 0,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
    circular: 'rounded-full',
    card: 'rounded-2xl border border-slate-200 bg-white p-5 shadow-xs'
  }[variant]

  const delayClass = delay > 0 ? `shimmer-delay-${delay}` : ''

  return (
    <div
      className={cn(
        'skeleton-shimmer overflow-hidden select-none pointer-events-none',
        variantStyles,
        delayClass,
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: 'w-1/2' | 'w-2/3' | 'w-3/4' | 'w-4/5'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'title'
}

export function SkeletonText({
  lines = 2,
  className,
  lastLineWidth = 'w-2/3',
  size = 'sm'
}: SkeletonTextProps) {
  const sizeHeight = {
    xs: 'h-2.5',
    sm: 'h-3.5',
    md: 'h-4',
    lg: 'h-5',
    title: 'h-7'
  }[size]

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, idx) => {
        const isLast = idx === lines - 1
        return (
          <Skeleton
            key={idx}
            className={cn(
              sizeHeight,
              'rounded-md',
              isLast && lines > 1 ? lastLineWidth : 'w-full'
            )}
            delay={(idx % 6) as any}
          />
        )
      })}
    </div>
  )
}

export function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn('h-5 w-20 rounded-full', className)} />
}

export function SkeletonIcon({ size = 16, className }: { size?: number; className?: string }) {
  const sizeMap: Record<number, string> = {
    16: 'h-4 w-4 rounded-md',
    20: 'h-5 w-5 rounded-lg',
    24: 'h-6 w-6 rounded-lg',
    36: 'h-9 w-9 rounded-xl',
    40: 'h-10 w-10 rounded-xl'
  }
  return <Skeleton className={cn(sizeMap[size] || 'h-5 w-5 rounded-md', className)} />
}

