import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
        <Skeleton className="h-4 w-48 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
        <div className="pt-4 flex justify-end">
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

