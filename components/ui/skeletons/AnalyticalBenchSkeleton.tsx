import React from 'react'
import { Skeleton } from './AtomicSkeletons'

export function AnalyticalBenchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-44 rounded-md" />
          </div>
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <Skeleton className="h-9 w-56 rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <Skeleton className="h-9 w-44 rounded-xl" />
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      {/* Bench Testing Card Container */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-36 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>

        {/* 8-Parameter Physicochemical Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-2.5 w-16 rounded-md" />
                <Skeleton className="h-2.5 w-20 rounded-md font-mono" />
              </div>
            </div>
          ))}
        </div>

        {/* Bench Action Buttons & Verdict Box */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

