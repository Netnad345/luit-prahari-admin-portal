import React, { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { LabClient } from './LabClient'

export default async function LabPortalPage() {
  const supabase = await createClient()

  const [parametersRes, samplesRes, receiptsRes, pendingResultsRes, labsRes] = await Promise.all([
    supabase.from('parameters').select('*').order('test_category', { ascending: true }),
    supabase
      .from('samples')
      .select('id, bottle_id, status, device_captured_at, gps_accuracy_meters, bottles(bottle_qr_code), sources(name, qr_code_id)')
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('lab_receipts')
      .select('*, samples(id, bottles(bottle_qr_code)), labs(name)')
      .order('received_at', { ascending: false })
      .limit(20),
    supabase
      .from('test_results')
      .select('*, parameters(name, code, unit, acceptable_limit, permissible_limit), samples(id, bottles(bottle_qr_code), sources(name, qr_code_id)), profiles!entered_by(full_name)')
      .order('tested_at', { ascending: false })
      .limit(30),
    supabase.from('labs').select('id, name')
  ])

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading District Testing Lab...</div>}>
      <LabClient 
        parameters={(parametersRes.data as unknown as any[]) || []}
        recentSamples={(samplesRes.data as unknown as any[]) || []}
        initialReceipts={(receiptsRes.data as unknown as any[]) || []}
        pendingResults={(pendingResultsRes.data as unknown as any[]) || []}
        labs={(labsRes.data as unknown as any[]) || []}
      />
    </Suspense>
  )
}
