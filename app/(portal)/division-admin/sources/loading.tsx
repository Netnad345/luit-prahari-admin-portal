import React from 'react'
import { Skeleton, DataTableSkeleton } from '@/components/ui/skeletons'

export default function SourcesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-44 rounded-md" />
          </div>
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-[500px] rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-44 rounded-xl" />
        </div>
      </div>

      {/* 4 Source Categories Rollup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Data Table */}
      <DataTableSkeleton columns={6} rows={8} />
    </div>
  )
}

