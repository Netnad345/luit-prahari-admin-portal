import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function ImportLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
      </div>

      <div className="p-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-4 w-64 rounded-md" />
        <Skeleton className="h-3 w-80 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>
    </div>
  )
}

