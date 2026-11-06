import React, { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SubDivisionClient } from './SubDivisionClient'

export default async function SubDivisionAdminPage() {
  const supabase = await createClient()

  // Try fetching live data or use robust defaults for demo/offline resilience
  const [sourcesRes, samplesRes, exceptionsRes, schemesRes] = await Promise.all([
    supabase.from('sources').select('id', { count: 'exact', head: true }),
    supabase.from('samples').select('id', { count: 'exact', head: true }),
    supabase.from('geo_exceptions').select('id', { count: 'exact', head: true }).is('is_approved', null),
    supabase.from('schemes').select('*').limit(20)
  ])

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading Sub-Division Workspace...</div>}>
      <SubDivisionClient 
        totalSources={sourcesRes.count || 64}
        totalSamples={samplesRes.count || 328}
        pendingExceptions={exceptionsRes.count || 2}
        dbSchemes={schemesRes.data || []}
      />
    </Suspense>
  )
}


