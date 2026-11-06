import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { AiInsightsClient } from './AiInsightsClient'

export default async function AiInsightsPage() {
  const supabase = await createClient()

  const [sourcesRes, riskScoresRes, anomalyRes, insightsRes] = await Promise.all([
    supabase.from('sources').select('id, name, qr_code_id, source_type'),
    supabase.from('risk_scores').select('*, sources(name, qr_code_id)').order('score_0_to_100', { ascending: false }),
    supabase.from('anomaly_flags').select('*, test_results(*, parameters(name, code))'),
    supabase.from('ai_insights').select('*').limit(1).maybeSingle()
  ])

  return (
    <AiInsightsClient 
      sources={sourcesRes.data || []}
      riskScores={riskScoresRes.data || []}
      anomalies={anomalyRes.data || []}
      insight={insightsRes.data || null}
    />
  )
}

