import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function StaffLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-44 rounded-md" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <Skeleton className="h-3 w-20 rounded-md font-mono" />
              <Skeleton className="h-3 w-20 rounded-md font-mono" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

