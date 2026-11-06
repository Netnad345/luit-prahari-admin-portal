import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ReportsClient } from './ReportsClient'

export default async function ReportsPage() {
  const supabase = await createClient()

  const [sourcesRes, samplesRes, testResultsRes, divisionRes] = await Promise.all([
    supabase.from('sources').select('id', { count: 'exact', head: true }),
    supabase.from('samples').select('id, status, fence_result, device_captured_at'),
    supabase.from('test_results').select('id, compliance, tested_value, parameters(name, code)'),
    supabase.from('divisions').select('name, code').limit(1).single()
  ])

  return (
    <ReportsClient
      totalSources={sourcesRes.count || 0}
      samples={samplesRes.data || []}
      testResults={testResultsRes.data || []}
      divisionName={divisionRes.data?.name || 'Kamrup Division'}
    />
  )
}

