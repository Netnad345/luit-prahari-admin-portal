import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { SamplesClient } from './SamplesClient'

export default async function SamplesPage() {
  const supabase = await createClient()

  const { data: samples } = await supabase
    .from('samples')
    .select(`
      id,
      fence_result,
      status,
      gps_accuracy_meters,
      device_captured_at,
      server_received_at,
      content_hash_sha256,
      sources ( id, name, qr_code_id, fence_radius_meters ),
      bottles ( id, bottle_qr_code ),
      profiles:collector_id ( full_name, phone ),
      custody_events ( id, step, scan_timestamp, seal_condition ),
      test_results ( id, tested_value, compliance, parameters ( name, unit ) )
    `)
    .order('device_captured_at', { ascending: false })

  return <SamplesClient initialSamples={samples || []} />
}

