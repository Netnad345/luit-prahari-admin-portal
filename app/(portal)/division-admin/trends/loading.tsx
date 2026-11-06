import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function TrendsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <Skeleton className="h-4 w-52 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  )
}

