import React from 'react'
import { Skeleton } from '@/components/ui/skeletons'

export default function LoginLoading() {
  return (
    <div className="space-y-5">
      {/* 4-Role Selector */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40 rounded-md" />
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>

      {/* Input 1 */}
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-32 rounded-md" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      {/* Input 2 */}
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}

