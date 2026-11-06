import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { SchemesClient } from './SchemesClient'

export default async function SchemesPage() {
  const supabase = await createClient()

  // Fetch schemes with linked division and sources
  const [schemesRes, divisionsRes, sourcesRes] = await Promise.all([
    supabase
      .from('schemes')
      .select('*, divisions(name, code), sources(id, name, qr_code_id, source_type, is_verified)')
      .order('created_at', { ascending: false }),
    supabase.from('divisions').select('id, name, code'),
    supabase.from('sources').select('id, scheme_id, name, qr_code_id, source_type, is_verified')
  ])

  return (
    <SchemesClient 
      initialSchemes={schemesRes.data || []}
      divisions={divisionsRes.data || []}
      allSources={sourcesRes.data || []}
    />
  )
}

