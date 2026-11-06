import React from 'react'
import { Skeleton } from './AtomicSkeletons'
import { MetricRowSkeleton } from './MetricCardSkeleton'

export function SubDivisionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards */}
      <MetricRowSkeleton count={4} />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Urgent Grievance Banner Placeholder */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl flex-none" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-64 rounded-md" />
            <Skeleton className="h-3 w-96 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-32 rounded-xl flex-none" />
      </div>

      {/* Dual Panel Grid (Fleet Radar + Scheme Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Jal Mitra Fleet */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-32 rounded-md" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-48 rounded-md" />
                  <div className="flex items-center gap-3 pt-1">
                    <Skeleton className="h-2.5 w-16 rounded-md" />
                    <Skeleton className="h-2.5 w-20 rounded-md" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-12 rounded-md ml-auto" />
                  <Skeleton className="h-2.5 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: PWSS Scheme Operational Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-40 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                  <Skeleton className="h-2.5 w-32 rounded-md" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-20 rounded-full ml-auto" />
                  <Skeleton className="h-2.5 w-16 rounded-md ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

