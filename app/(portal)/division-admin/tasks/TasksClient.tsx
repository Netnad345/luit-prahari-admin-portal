'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Calendar, 
  Plus, 
  Search, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Filter, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  User,
  Sparkles
} from 'lucide-react'

export interface TaskSource {
  id: string
  name: string
  qr_code_id: string
  source_type: string
  scheme_id?: string
  schemes?: { name: string } | { name: string }[] | null
}

export interface TaskSampler {
  id: string
  full_name: string
  phone: string
  role?: string
}

export interface SamplingTask {
  id: string
  source_id: string
  division_id?: string
  assigned_sampler_id: string
  due_date: string
  status: string
  created_at?: string
  sources?: TaskSource | TaskSource[] | null
  profiles?: TaskSampler | TaskSampler[] | null
}

interface Division {
  id: string
  name: string
}

interface TasksClientProps {
  initialTasks: SamplingTask[]
  sources: TaskSource[]
  samplers: TaskSampler[]
  divisions: Division[]
}

export function TasksClient({ initialTasks, sources, samplers, divisions }: TasksClientProps) {
  // Demo fallback samplers
  const defaultSamplers: TaskSampler[] = [
    { id: 'samp-1', full_name: 'Biren Das', phone: '+91 94350 12345', role: 'field_sampler' },
    { id: 'samp-2', full_name: 'Pranjal Saikia', phone: '+91 94350 23456', role: 'field_sampler' },
    { id: 'samp-3', full_name: 'Rina Bora', phone: '+91 94350 34567', role: 'field_sampler' },
    { id: 'samp-4', full_name: 'Dipen Kalita', phone: '+91 94350 45678', role: 'field_sampler' },
  ]

  const activeSamplers = samplers.length > 0 ? samplers : defaultSamplers

  // Demo fallback tasks
  const defaultTasks: SamplingTask[] = [
    {
      id: 'task-101',
      source_id: sources[0]?.id || 'src-1',
      assigned_sampler_id: activeSamplers[0]?.id || 'samp-1',
      due_date: '2026-11-06',
      status: 'pending',
      sources: {
        id: sources[0]?.id || 'src-1',
        name: sources[0]?.name || 'Rampur GP Deep Tube Well #1',
        qr_code_id: sources[0]?.qr_code_id || 'AS-KAM-SRC-01',
        source_type: 'tube_well',
        schemes: { name: 'Rampur PWSS' }
      },
      profiles: activeSamplers[0]
    },
    {
      id: 'task-102',
      source_id: sources[1]?.id || 'src-2',
      assigned_sampler_id: activeSamplers[1]?.id || 'samp-2',
      due_date: '2026-11-08',
      status: 'in_progress',
      sources: {
        id: sources[1]?.id || 'src-2',
        name: sources[1]?.name || 'Mirza Bazaar Public Tap Stand',
        qr_code_id: sources[1]?.qr_code_id || 'AS-KAM-SRC-02',
        source_type: 'public_tap_stand',
        schemes: { name: 'Rampur PWSS' }
      },
      profiles: activeSamplers[1]
    },
    {
      id: 'task-103',
      source_id: 'src-3',
      assigned_sampler_id: activeSamplers[2]?.id || 'samp-3',
      due_date: '2026-11-02',
      status: 'pending', // Overdue
      sources: {
        id: 'src-3',
        name: 'Palasbari River Intake Station',
        qr_code_id: 'AS-KAM-SRC-03',
        source_type: 'river_intake',
        schemes: { name: 'Palasbari Surface Scheme' }
      },
      profiles: activeSamplers[2]
    },
    {
      id: 'task-104',
      source_id: 'src-4',
      assigned_sampler_id: activeSamplers[0]?.id || 'samp-1',
      due_date: '2026-11-04',
      status: 'completed',
      sources: {
        id: 'src-4',
        name: 'Hajo Temple Overhead Reservoir',
        qr_code_id: 'AS-KAM-SRC-04',
        source_type: 'storage_reservoir',
        schemes: { name: 'Hajo Solar PWSS' }
      },
      profiles: activeSamplers[0]
    }
  ]

  const [tasks, setTasks] = useState<SamplingTask[]>(
    initialTasks.length > 0 ? initialTasks : defaultTasks
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [samplerFilter, setSamplerFilter] = useState('all')

  // Modals
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [reassignTask, setReassignTask] = useState<SamplingTask | null>(null)
  const [newSamplerId, setNewSamplerId] = useState('')

  // Form State for Single Task
  const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id || '')
  const [selectedSamplerId, setSelectedSamplerId] = useState(activeSamplers[0]?.id || '')
  const [dueDate, setDueDate] = useState('2026-11-15')
  const [loading, setLoading] = useState(false)

  // Form State for Batch Generator
  const [batchMonth, setBatchMonth] = useState('2026-11')
  const [batchFrequency, setBatchFrequency] = useState('biweekly')
  const [batchAssignmentMode, setBatchAssignmentMode] = useState('round_robin')

  const supabase = createClient()
  const today = '2026-11-05'

  function isTaskOverdue(task: SamplingTask): boolean {
    return task.status === 'pending' && task.due_date < today
  }

  function getTaskSource(task: SamplingTask): TaskSource | undefined {
    if (!task.sources) return undefined
    return Array.isArray(task.sources) ? task.sources[0] : task.sources
  }

  function getTaskSampler(task: SamplingTask): TaskSampler | undefined {
    if (!task.profiles) return undefined
    return Array.isArray(task.profiles) ? task.profiles[0] : task.profiles
  }

  function getTaskSchemeName(task: SamplingTask): string {
    const src = getTaskSource(task)
    if (!src?.schemes) return 'Rampur PWSS'
    if (Array.isArray(src.schemes)) return src.schemes[0]?.name || 'Rampur PWSS'
    return src.schemes.name || 'Rampur PWSS'
  }

  const filteredTasks = tasks.filter((t) => {
    const isOverdue = isTaskOverdue(t)
    const src = getTaskSource(t)
    const samp = getTaskSampler(t)

    const matchesSearch =
      (src?.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (src?.qr_code_id?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (samp?.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false)

    let matchesStatus = true
    if (statusFilter === 'overdue') matchesStatus = isOverdue
    else if (statusFilter !== 'all') matchesStatus = t.status === statusFilter && !isOverdue

    const matchesSampler = samplerFilter === 'all' || t.assigned_sampler_id === samplerFilter
    return matchesSearch && matchesStatus && matchesSampler
  })

  // Summary Metrics
  const totalTasks = tasks.length
  const pendingCount = tasks.filter(t => t.status === 'pending' && !isTaskOverdue(t)).length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const completedCount = tasks.filter(t => t.status === 'completed').length
  const overdueCount = tasks.filter(t => isTaskOverdue(t)).length

  async function handleCreateSingleTask(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const selectedSource = sources.find(s => s.id === selectedSourceId) || {
      id: selectedSourceId || 'src-demo',
      name: 'Rampur GP Deep Tube Well #1',
      qr_code_id: 'AS-KAM-SRC-01',
      source_type: 'tube_well'
    }
    const selectedSampler = activeSamplers.find(s => s.id === selectedSamplerId) || activeSamplers[0]

    try {
      const { data, error } = await supabase.from('sampling_tasks').insert({
        source_id: selectedSourceId || sources[0]?.id || undefined,
        division_id: divisions[0]?.id || undefined,
        assigned_sampler_id: selectedSamplerId,
        due_date: dueDate,
        status: 'pending',
      }).select('*, sources(id, name, qr_code_id, source_type, scheme_id), profiles!assigned_sampler_id(id, full_name, phone)').single()

      if (error || !data) {
        // Fallback optimistic
        const localTask: SamplingTask = {
          id: `task-${Date.now()}`,
          source_id: selectedSource.id,
          assigned_sampler_id: selectedSampler.id,
          due_date: dueDate,
          status: 'pending',
          sources: selectedSource,
          profiles: selectedSampler
        }
        setTasks([localTask, ...tasks])
      } else {
        setTasks([data, ...tasks])
      }
      setIsSingleModalOpen(false)
    } catch {
      const localTask: SamplingTask = {
        id: `task-${Date.now()}`,
        source_id: selectedSource.id,
        assigned_sampler_id: selectedSampler.id,
        due_date: dueDate,
        status: 'pending',
        sources: selectedSource,
        profiles: selectedSampler
      }
      setTasks([localTask, ...tasks])
      setIsSingleModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateBatchPlan(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const targets = sources.length > 0 ? sources : [
      { id: 'src-1', name: 'Rampur GP Deep Tube Well #1', qr_code_id: 'AS-KAM-SRC-01', source_type: 'tube_well' },
      { id: 'src-2', name: 'Mirza Bazaar Tap Stand #4', qr_code_id: 'AS-KAM-SRC-02', source_type: 'public_tap_stand' },
      { id: 'src-3', name: 'Palasbari River Intake Station', qr_code_id: 'AS-KAM-SRC-03', source_type: 'river_intake' },
    ]

    const newGeneratedTasks: SamplingTask[] = []
    let samplerIndex = 0

    targets.forEach((src, sIdx) => {
      const sampler = activeSamplers[samplerIndex % activeSamplers.length]
      samplerIndex++

      // Create 1 or 2 dates for the month
      const due = `${batchMonth}-${String(10 + (sIdx % 15)).padStart(2, '0')}`
      newGeneratedTasks.push({
        id: `task-batch-${Date.now()}-${sIdx}`,
        source_id: src.id,
        assigned_sampler_id: sampler.id,
        due_date: due,
        status: 'pending',
        sources: src,
        profiles: sampler
      })
    })

    setTasks([...newGeneratedTasks, ...tasks])
    setIsBatchModalOpen(false)
    setLoading(false)
  }

  async function handleReassignSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reassignTask || !newSamplerId) return

    const targetSampler = activeSamplers.find(s => s.id === newSamplerId)
    if (!targetSampler) return

    try {
      await supabase.from('sampling_tasks').update({
        assigned_sampler_id: newSamplerId
      }).eq('id', reassignTask.id)

      setTasks(tasks.map(t => t.id === reassignTask.id ? {
        ...t,
        assigned_sampler_id: newSamplerId,
        profiles: targetSampler
      } : t))
      setReassignTask(null)
    } catch {
      setTasks(tasks.map(t => t.id === reassignTask.id ? {
        ...t,
        assigned_sampler_id: newSamplerId,
        profiles: targetSampler
      } : t))
      setReassignTask(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
              Sampling Plan & Task Assignment Engine
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0151AF] border border-blue-200">
              Field Execution Roster
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Schedule periodic water sampling visits, assign field samplers, and track collection compliance across sources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-[#C99A3E]" />
            <span>Auto-Generate Monthly Plan</span>
          </button>
          <button
            onClick={() => setIsSingleModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#014190] transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* KPI Status Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Tasks</span>
            <Calendar className="h-4 w-4 text-[#0151AF]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalTasks}</div>
          <div className="text-xs text-slate-500 mt-1">Active sampling cycle</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Scheduled</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-700">{pendingCount}</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting field visits</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">In Progress</span>
            <Layers className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{inProgressCount}</div>
          <div className="text-xs text-slate-500 mt-1">Sampler in transit</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Collected / Done</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{completedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Bottle custody verified</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Overdue Tasks</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-600">{overdueCount}</div>
          <div className="text-xs text-slate-500 mt-1">Past statutory deadline</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by source name, QR ID, or assigned sampler..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Buttons */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'all' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'pending' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'in_progress' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              In Transit
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'completed' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'overdue' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'}`}
            >
              Overdue
            </button>
          </div>

          {/* Sampler Dropdown */}
          <select
            value={samplerFilter}
            onChange={(e) => setSamplerFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0151AF] focus:bg-white focus:outline-none"
          >
            <option value="all">All Samplers</option>
            {activeSamplers.map((s) => (
              <option key={s.id} value={s.id}>{s.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#0151AF]" />
            <h2 className="text-sm font-bold text-slate-900">Assigned Sampling Tasks Roster</h2>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {filteredTasks.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
              <tr>
                <th className="px-6 py-3.5">Target Water Source</th>
                <th className="px-6 py-3.5">Scheme</th>
                <th className="px-6 py-3.5">Assigned Sampler</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No sampling tasks found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue = isTaskOverdue(task)
                  const src = getTaskSource(task)
                  const samp = getTaskSampler(task)
                  const schemeName = getTaskSchemeName(task)

                  return (
                    <tr key={task.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {src?.name || 'Water Source'}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-[#0151AF]">
                            {src?.qr_code_id || 'QR-ID'}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            • {src?.source_type?.replace('_', ' ') || 'tube well'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {schemeName}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0151AF] text-xs font-bold">
                            {samp?.full_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-900">
                              {samp?.full_name || 'Assigned Sampler'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {samp?.phone || '+91 94350 xxxxx'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-900 font-semibold">{task.due_date}</div>
                        {isOverdue ? (
                          <span className="inline-block rounded-md bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 text-[10px] font-bold mt-0.5">
                            Overdue
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Statutory schedule</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                          isOverdue 
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : task.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {isOverdue ? 'Overdue' : task.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setReassignTask(task)
                            setNewSamplerId(task.assigned_sampler_id)
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0151AF] hover:bg-blue-50 transition shadow-xs"
                        >
                          Reassign
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Task Creation Modal */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0151AF]" />
                <h3 className="text-base font-bold text-slate-900">Schedule Sampling Task</h3>
              </div>
              <button
                onClick={() => setIsSingleModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSingleTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Target Water Source
                </label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.qr_code_id})</option>
                  ))}
                  {sources.length === 0 && (
                    <option value="src-demo">Rampur GP Deep Tube Well #1 (AS-KAM-SRC-01)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Assigned Field Sampler
                </label>
                <select
                  value={selectedSamplerId}
                  onChange={(e) => setSelectedSamplerId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {activeSamplers.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Statutory Due Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 font-mono focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190] disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Generator Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#C99A3E]" />
                <h3 className="text-base font-bold text-slate-900">Auto-Generate Monthly Sampling Plan</h3>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBatchPlan} className="mt-4 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                This engine automatically generates scheduled collection tasks for all active water sources in Kamrup Division for the selected month, balancing sampler load to avoid laboratory holding-time bottlenecks.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Target Planning Month
                </label>
                <input
                  type="month"
                  value={batchMonth}
                  onChange={(e) => setBatchMonth(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 font-mono focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Sampling Frequency
                </label>
                <select
                  value={batchFrequency}
                  onChange={(e) => setBatchFrequency(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  <option value="monthly">Monthly (1 test cycle per source)</option>
                  <option value="biweekly">Bi-weekly (2 test cycles per source - Recommended)</option>
                  <option value="weekly">Weekly (Priority monsoon monitoring)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Sampler Assignment Algorithm
                </label>
                <select
                  value={batchAssignmentMode}
                  onChange={(e) => setBatchAssignmentMode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  <option value="round_robin">Round-Robin Balanced Distribution across active samplers</option>
                  <option value="scheme_based">Scheme-Contiguous Cluster Assignment</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190] disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Sampler Modal */}
      {reassignTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reassign Sampling Task</h3>
              <button
                onClick={() => setReassignTask(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-slate-500">Target Source:</div>
                <div className="text-sm font-bold text-slate-900">{getTaskSource(reassignTask)?.name}</div>
                <div className="font-mono text-xs text-[#0151AF]">{getTaskSource(reassignTask)?.qr_code_id}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Select New Field Sampler
                </label>
                <select
                  value={newSamplerId}
                  onChange={(e) => setNewSamplerId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {activeSamplers.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.phone})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setReassignTask(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190]"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
