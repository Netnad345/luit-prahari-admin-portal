import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ExceptionsClient } from './ExceptionsClient'

export default async function ExceptionsPage() {
  const supabase = await createClient()

  const { data: exceptions } = await supabase
    .from('geo_exceptions')
    .select('*, samples(*, sources(name, qr_code_id, fence_radius_meters), profiles:collector_id(full_name, phone))')
    .order('created_at', { ascending: false })

  return <ExceptionsClient initialExceptions={exceptions || []} />
}
