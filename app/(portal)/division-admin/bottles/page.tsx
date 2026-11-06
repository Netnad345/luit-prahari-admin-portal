import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { BottlesClient } from './BottlesClient'

export default async function BottlesPage() {
  const supabase = await createClient()

  // Fetch recent bottles
  const { data: bottles } = await supabase
    .from('bottles')
    .select('*, profiles(full_name)')
    .order('printed_at', { ascending: false })
    .limit(50)

  return <BottlesClient initialBottles={bottles || []} />
}
