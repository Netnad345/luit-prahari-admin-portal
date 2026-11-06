import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { StaffClient } from './StaffClient'

export default async function StaffPage() {
  const supabase = await createClient()

  // Fetch profiles and devices for the division
  const [profilesRes, devicesRes, divisionsRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, divisions(name), labs(name), devices(*)')
      .order('created_at', { ascending: false }),
    supabase
      .from('devices')
      .select('*, profiles(full_name, phone, role, division_id)')
      .order('last_sync_at', { ascending: false }),
    supabase.from('divisions').select('id, name')
  ])

  return (
    <StaffClient 
      initialProfiles={(profilesRes.data as unknown as any[]) || []}
      initialDevices={(devicesRes.data as unknown as any[]) || []}
      divisions={(divisionsRes.data as unknown as any[]) || []}
    />
  )
}

