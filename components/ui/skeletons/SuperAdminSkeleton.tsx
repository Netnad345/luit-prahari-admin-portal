import React from 'react'
import { Skeleton } from './AtomicSkeletons'
import { MetricRowSkeleton } from './MetricCardSkeleton'

export function SuperAdminSkeleton() {
  return (
    <div className="space-y-6">
      {/* Sovereign Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>
          <Skeleton className="h-8 w-96 rounded-lg" />
          <Skeleton className="h-3.5 w-[500px] rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl flex-none" />
      </div>

      {/* 6 Segmented Tabs Pill Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* 4 Statewide Rollup Metrics */}
      <MetricRowSkeleton count={4} />

      {/* Division Comparative Matrix Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <Skeleton className="h-4 w-52 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>
              <Skeleton className="h-3 w-20 rounded-md font-mono" />
              <Skeleton className="h-3.5 w-16 rounded-md font-bold" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

