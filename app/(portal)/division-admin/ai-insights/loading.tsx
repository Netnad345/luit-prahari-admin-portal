import React from 'react'
import { Skeleton, MetricRowSkeleton } from '@/components/ui/skeletons'

export default function AiInsightsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-8 w-96 rounded-lg" />
          <Skeleton className="h-3.5 w-[520px] rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* 4 Risk & Metric Gauges */}
      <MetricRowSkeleton count={4} />

      {/* Simulator Control & Visual Graph Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulation Sliders */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="space-y-1">
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-3 w-72 rounded-md" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Slider 1 */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-16 rounded-md font-mono" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-2.5 w-20 rounded-md" />
              <Skeleton className="h-2.5 w-20 rounded-md" />
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-16 rounded-md font-mono" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-2.5 w-20 rounded-md" />
              <Skeleton className="h-2.5 w-20 rounded-md" />
            </div>
          </div>

          {/* Mathematical Formula Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <Skeleton className="h-3 w-48 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md font-mono" />
          </div>
        </div>

        {/* Right 1 Col: WQI Safety Dial Gauge Preview */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-4 w-36 rounded-md" />
          <div className="relative flex items-center justify-center">
            <Skeleton className="h-44 w-44 rounded-full" />
            <div className="absolute flex flex-col items-center space-y-1">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-3 w-48 rounded-md text-center" />
        </div>
      </div>
    </div>
  )
}

