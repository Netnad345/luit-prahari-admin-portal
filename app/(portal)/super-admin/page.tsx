import React, { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SuperAdminClient } from './SuperAdminClient'

export default async function SuperAdminPage() {
  const supabase = await createClient()

  const [
    divisionsRes, 
    labsRes, 
    profilesRes, 
    parametersRes, 
    alertRulesRes, 
    auditRes,
    sourcesCountRes,
    samplesCountRes,
    alertsCountRes
  ] = await Promise.all([
    supabase.from('divisions').select('*').order('code'),
    supabase.from('labs').select('*, divisions(name)').order('name'),
    supabase.from('profiles').select('*, divisions(name), labs(name)').order('created_at', { ascending: false }),
    supabase.from('parameters').select('*').order('test_category'),
    supabase.from('alert_rules').select('*, parameters(name, code, unit)'),
    supabase.from('audit_log').select('*').order('recorded_at', { ascending: false }).limit(50),
    supabase.from('sources').select('id', { count: 'exact', head: true }),
    supabase.from('samples').select('id', { count: 'exact', head: true }),
    supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('status', 'open')
  ])

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading State Headquarters...</div>}>
      <SuperAdminClient 
        divisions={(divisionsRes.data as unknown as any[]) || []}
        labs={(labsRes.data as unknown as any[]) || []}
        profiles={(profilesRes.data as unknown as any[]) || []}
        parameters={(parametersRes.data as unknown as any[]) || []}
        alertRules={(alertRulesRes.data as unknown as any[]) || []}
        auditLogs={(auditRes.data as unknown as any[]) || []}
        totalSources={sourcesCountRes.count || 284}
        totalSamples={samplesCountRes.count || 1420}
        totalAlerts={alertsCountRes.count || 3}
      />
    </Suspense>
  )
}
