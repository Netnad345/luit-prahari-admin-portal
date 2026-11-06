import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function AlertsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      {/* Alert Cards Stack */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md font-mono" />
              </div>
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>

            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-3/4 rounded-md" />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-28 rounded-md font-mono" />
                <Skeleton className="h-3 w-36 rounded-md font-mono" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

