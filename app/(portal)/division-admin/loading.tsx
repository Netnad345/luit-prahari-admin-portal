import React from 'react'
import { Skeleton, MetricRowSkeleton } from '@/components/ui/skeletons'

export default function DivisionAdminLoading() {
  return (
    <div className="space-y-6">
      {/* Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-44 rounded-xl" />
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <MetricRowSkeleton count={4} />

      {/* Dual Panel (Critical Alerts + Surveillance Schedule) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Alerts Panel */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-36 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <Skeleton className="h-3 w-full rounded-md" />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-28 rounded-md font-mono" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sampling Tasks Schedule */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-40 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                  <Skeleton className="h-2.5 w-28 rounded-md" />
                </div>
                <Skeleton className="h-7 w-20 rounded-lg flex-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

