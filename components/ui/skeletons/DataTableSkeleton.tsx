import React from 'react'
import { Skeleton } from './AtomicSkeletons'
import { cn } from '@/lib/utils'

export function DataTableSkeleton({
  columns = 6,
  rows = 8,
  title = 'Water Assets Ledger'
}: {
  columns?: number
  rows?: number
  title?: string
}) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-3 w-64 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-52 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <div className="min-w-full divide-y divide-slate-100">
          {/* Header Row */}
          <div className="flex items-center justify-between py-3 px-3 bg-slate-50/80 rounded-xl mb-2">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className={cn(
                  'h-3 rounded-md',
                  colIdx === 0 ? 'w-32' : colIdx === columns - 1 ? 'w-20' : 'w-24'
                )}
                delay={colIdx as any}
              />
            ))}
          </div>

          {/* Body Rows */}
          <div className="space-y-2 mt-2">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="flex items-center justify-between py-3 px-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition"
              >
                {/* Column 1: Primary Name + Code */}
                <div className="w-32 space-y-1.5">
                  <Skeleton className="h-3.5 w-28 rounded-md" delay={(rowIdx % 4) as any} />
                  <Skeleton className="h-2.5 w-16 rounded-md" delay={(rowIdx % 4) as any} />
                </div>

                {/* Column 2: Geographic Habitation */}
                <div className="w-24 space-y-1">
                  <Skeleton className="h-3 w-20 rounded-md" delay={(rowIdx % 4) as any} />
                </div>

                {/* Column 3: Quality Compliance Pill */}
                <div className="w-24">
                  <Skeleton className="h-5 w-18 rounded-full" delay={(rowIdx % 4) as any} />
                </div>

                {/* Column 4: Timestamp / Sync */}
                <div className="w-24">
                  <Skeleton className="h-3 w-20 rounded-md" delay={(rowIdx % 4) as any} />
                </div>

                {/* Column 5: Coordinates / GPS */}
                <div className="w-24">
                  <Skeleton className="h-3 w-22 rounded-md font-mono" delay={(rowIdx % 4) as any} />
                </div>

                {/* Column 6: Action Button */}
                <div className="w-20 flex justify-end">
                  <Skeleton className="h-7 w-16 rounded-lg" delay={(rowIdx % 4) as any} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Skeleton className="h-3.5 w-40 rounded-md" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

