import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { AlertsClient } from './AlertsClient'

export default async function AlertsPage() {
  const supabase = await createClient()

  // Fetch alerts with linked sources, alert rules, and assigned staff
  const [alertsRes, sourcesRes, staffRes] = await Promise.all([
    supabase
      .from('alerts')
      .select('*, sources(id, name, qr_code_id, source_type, schemes(name)), alert_rules(rule_name, severity, threshold_value), profiles!assigned_to(id, full_name, phone)')
      .order('created_at', { ascending: false }),
    supabase.from('sources').select('id, name, qr_code_id'),
    supabase.from('profiles').select('id, full_name, phone, role')
  ])

  return (
    <AlertsClient 
      initialAlerts={(alertsRes.data as unknown as any[]) || []}
      sources={(sourcesRes.data as unknown as any[]) || []}
      staff={(staffRes.data as unknown as any[]) || []}
    />
  )
}

