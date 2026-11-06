import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { GisMapClient } from './GisMapClient'

export default async function GisMapPage() {
  const supabase = await createClient()

  const { data: sources } = await supabase
    .from('sources')
    .select('id, name, qr_code_id, source_type, fence_radius_meters, is_verified, location_geom')

  return <GisMapClient initialSources={sources || []} />
}

