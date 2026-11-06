import React from 'react'
import { Skeleton } from './AtomicSkeletons'

export function MetricCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-32 rounded-md" delay={delay as any} />
        <Skeleton className="h-7 w-7 rounded-lg" delay={delay as any} />
      </div>

      {/* Main Metric Stat Numeral */}
      <div className="pt-1">
        <Skeleton className="h-9 w-24 rounded-lg" delay={(delay + 1) as any} />
      </div>

      {/* Footer Meta Row */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <Skeleton className="h-2.5 w-2.5 rounded-full" delay={delay as any} />
        <Skeleton className="h-3 w-36 rounded-md" delay={delay as any} />
      </div>
    </div>
  )
}

export function MetricRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={i} delay={i} />
      ))}
    </div>
  )
}

