import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { SourcesClient } from './SourcesClient'

export default async function SourcesPage() {
  const supabase = await createClient()

  // Fetch divisions and schemes for form dropdowns
  const [sourcesRes, schemesRes, divisionsRes] = await Promise.all([
    supabase.from('sources').select('*, schemes(name), divisions(name)').order('created_at', { ascending: false }),
    supabase.from('schemes').select('id, name, scheme_code'),
    supabase.from('divisions').select('id, name')
  ])

  return (
    <SourcesClient 
      initialSources={sourcesRes.data || []} 
      schemes={schemesRes.data || []} 
      divisions={divisionsRes.data || []}
    />
  )
}
