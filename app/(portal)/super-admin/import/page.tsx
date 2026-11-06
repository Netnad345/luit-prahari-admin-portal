import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ImportClient } from './ImportClient'

export default async function SuperAdminImportPage() {
  const supabase = await createClient()

  const [sourcesRes, parametersRes, divisionsRes] = await Promise.all([
    supabase.from('sources').select('id, name, qr_code_id'),
    supabase.from('parameters').select('id, code, name, unit, acceptable_limit, permissible_limit'),
    supabase.from('divisions').select('id, name')
  ])

  return (
    <ImportClient 
      existingSources={(sourcesRes.data as unknown as any[]) || []}
      parameters={(parametersRes.data as unknown as any[]) || []}
      divisions={(divisionsRes.data as unknown as any[]) || []}
    />
  )
}

