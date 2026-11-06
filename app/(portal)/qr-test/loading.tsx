import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function QrTestLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-8 w-72 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-2xl" />
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-20 w-full rounded-xl font-mono" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

