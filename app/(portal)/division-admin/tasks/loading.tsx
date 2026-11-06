import React from 'react'
import { Skeleton, DataTableSkeleton } from '@/components/ui/skeletons'

export default function TasksLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      <DataTableSkeleton columns={6} rows={7} />
    </div>
  )
}

