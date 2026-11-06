import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { TrendsClient } from './TrendsClient'

export default async function TrendsPage() {
  const supabase = await createClient()

  const [parametersRes, testResultsRes, sourcesRes] = await Promise.all([
    supabase.from('parameters').select('*').order('name'),
    supabase.from('test_results').select('*, parameters(name, code, unit, acceptable_limit, permissible_limit), samples(device_captured_at, sources(name, qr_code_id))').order('tested_at', { ascending: true }),
    supabase.from('sources').select('id, name, qr_code_id')
  ])

  return (
    <TrendsClient 
      parameters={parametersRes.data || []}
      testResults={testResultsRes.data || []}
      sources={sourcesRes.data || []}
    />
  )
}

