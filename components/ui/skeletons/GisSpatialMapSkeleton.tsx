import React from 'react'
import { Skeleton } from './AtomicSkeletons'

export function GisSpatialMapSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-8 w-72 rounded-lg" />
          <Skeleton className="h-3.5 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      {/* Filter Capsule Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-36 rounded-xl" />
        <Skeleton className="h-8 w-36 rounded-xl" />
        <Skeleton className="h-8 w-40 rounded-xl" />
      </div>

      {/* Map Viewport Canvas Placeholder */}
      <div className="relative h-[620px] w-full rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shadow-card">
        {/* Subtle Map Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

        {/* Pulsing Radar Compass Center Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-2 border-blue-300/40 animate-ping opacity-30" />
            <div className="h-20 w-20 rounded-full border-2 border-blue-400/60 animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-[#0151AF] shadow-lg" />
          </div>
        </div>

        {/* Simulated Floating Markers */}
        <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 p-2 rounded-xl bg-white/80 backdrop-blur shadow-sm border border-slate-200 animate-pulse">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1.5 p-2 rounded-xl bg-white/80 backdrop-blur shadow-sm border border-slate-200 animate-pulse">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
        <div className="absolute top-1/2 right-1/3 flex items-center gap-1.5 p-2 rounded-xl bg-white/80 backdrop-blur shadow-sm border border-slate-200 animate-pulse">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>

        {/* Top-Right Map Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Skeleton className="h-8 w-8 rounded-lg shadow-sm" />
          <Skeleton className="h-8 w-8 rounded-lg shadow-sm" />
          <Skeleton className="h-8 w-8 rounded-lg shadow-sm" />
        </div>

        {/* Bottom Legend Pill Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto flex items-center gap-3 p-3 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-md">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}

