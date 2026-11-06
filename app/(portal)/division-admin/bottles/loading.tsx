import React from 'react'
import { Skeleton, DataTableSkeleton } from '@/components/ui/skeletons'

export default function BottlesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-56 rounded-md" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <DataTableSkeleton columns={4} rows={5} />
        </div>
      </div>
    </div>
  )
}

