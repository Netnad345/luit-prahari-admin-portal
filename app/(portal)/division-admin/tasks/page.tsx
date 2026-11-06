import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { TasksClient } from './TasksClient'

export default async function SamplingTasksPage() {
  const supabase = await createClient()

  // Fetch tasks with linked sources, samplers, and divisions
  const [tasksRes, sourcesRes, samplersRes, divisionsRes] = await Promise.all([
    supabase
      .from('sampling_tasks')
      .select('*, sources(id, name, qr_code_id, source_type, scheme_id, schemes(name)), profiles!assigned_sampler_id(id, full_name, phone)')
      .order('due_date', { ascending: true }),
    supabase.from('sources').select('id, name, qr_code_id, source_type, scheme_id, schemes(name)'),
    supabase.from('profiles').select('id, full_name, phone, role').eq('role', 'field_sampler'),
    supabase.from('divisions').select('id, name')
  ])

  return (
    <TasksClient 
      initialTasks={(tasksRes.data as unknown as any[]) || []}
      sources={(sourcesRes.data as unknown as any[]) || []}
      samplers={(samplersRes.data as unknown as any[]) || []}
      divisions={(divisionsRes.data as unknown as any[]) || []}
    />
  )
}
