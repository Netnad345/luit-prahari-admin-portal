'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FormattedDate } from '@/components/common/FormattedDate'
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  X, 
  Check, 
  User, 
  Wrench, 
  MapPin, 
  Building2, 
  ArrowRight,
  FileText
} from 'lucide-react'

export interface AlertSource {
  id: string
  name: string
  qr_code_id: string
  source_type?: string
  schemes?: { name: string } | { name: string }[] | null
}

export interface AlertRule {
  rule_name: string
  severity: string
  threshold_value: number
}

export interface AlertProfile {
  id: string
  full_name: string
  phone: string
  role?: string
}

export interface WaterAlert {
  id: string
  source_id: string
  sample_id?: string
  division_id?: string
  alert_rule_id?: string
  title: string
  description: string
  status: string // 'open', 'investigating', 'resolved'
  assigned_to?: string
  action_taken?: string | null
  resolved_at?: string | null
  created_at: string
  sources?: AlertSource | AlertSource[] | null
  alert_rules?: AlertRule | AlertRule[] | null
  profiles?: AlertProfile | AlertProfile[] | null
}

interface AlertsClientProps {
  initialAlerts: WaterAlert[]
  sources: { id: string; name: string; qr_code_id: string }[]
  staff: AlertProfile[]
}

const REMEDIATION_ACTIONS = [
  'Bleaching Powder Shock Dosing & Well Disinfection',
  'Booster Chlorination Unit Servicing & Re-dosing',
  'Filter Bed Air-Scour Backwashing & Media Replenishment',
  'Distribution Pipe Fracture Excavation & Joint Repair',
  'Deep Aquifer Borewell Air-Compressor Flushing',
  'Community Boil-Water Public Health Advisory Issued',
  'Alternate Tanker Water Supply Mobilized for Village',
]

export function AlertsClient({ initialAlerts, sources, staff }: AlertsClientProps) {
  // Demo fallback alerts
  const defaultAlerts: WaterAlert[] = [
    {
      id: 'alt-1',
      source_id: sources[0]?.id || 'src-1',
      title: 'Iron (Fe) Concentration Exceeded BIS Statutory Threshold',
      description: 'Tested value 1.45 mg/L exceeds the statutory permissible limit of 1.00 mg/L. Iron precipitation observed at public outlet.',
      status: 'open',
      created_at: '2026-11-05T09:30:00Z',
      sources: {
        id: sources[0]?.id || 'src-1',
        name: 'Rampur GP Deep Tube Well #1',
        qr_code_id: 'AS-KAM-SRC-01',
        schemes: { name: 'Rampur PWSS' }
      },
      alert_rules: {
        rule_name: 'Iron Statutory Cap Exceeded',
        severity: 'critical',
        threshold_value: 1.0
      }
    },
    {
      id: 'alt-2',
      source_id: 'src-2',
      title: 'Residual Free Chlorine Depleted Below Sanitary Buffer',
      description: 'Residual Chlorine measured at 0.05 mg/L at the tail-end tap stand (minimum safe threshold is 0.20 mg/L). Risk of microbial re-growth in pipe network.',
      status: 'investigating',
      assigned_to: staff[0]?.id || 'st-1',
      created_at: '2026-11-04T14:15:00Z',
      sources: {
        id: 'src-2',
        name: 'Mirza Bazaar Tap Stand #4',
        qr_code_id: 'AS-KAM-SRC-02',
        schemes: { name: 'Rampur PWSS' }
      },
      alert_rules: {
        rule_name: 'Residual Chlorine Buffer Depleted',
        severity: 'high',
        threshold_value: 0.2
      },
      profiles: staff[0] || { id: 'st-1', full_name: 'Pranab Jyoti Barman', phone: '+91 94350 11223' }
    },
    {
      id: 'alt-3',
      source_id: 'src-3',
      title: 'Monsoon Turbidity Spike Observed in River Intake',
      description: 'Raw water turbidity reached 8.2 NTU (permissible limit 5.0 NTU) due to pre-winter sediment runoff in Brahmaputra feeder stream.',
      status: 'open',
      created_at: '2026-11-05T08:00:00Z',
      sources: {
        id: 'src-3',
        name: 'Palasbari River Intake Station',
        qr_code_id: 'AS-KAM-SRC-03',
        schemes: { name: 'Palasbari Surface Scheme' }
      },
      alert_rules: {
        rule_name: 'Turbidity Sediment Spike',
        severity: 'moderate',
        threshold_value: 5.0
      }
    },
    {
      id: 'alt-4',
      source_id: 'src-4',
      title: 'Bacteriological Contamination Remediated & Chlorinated',
      description: 'Total Coliform was detected at 4 MPN/100ml. Section engineer completed booster bleaching powder dosing. Retest confirmed 0 MPN/100ml.',
      status: 'resolved',
      action_taken: 'Bleaching Powder Shock Dosing & Well Disinfection',
      resolved_at: '2026-11-04T17:30:00Z',
      created_at: '2026-11-03T10:00:00Z',
      sources: {
        id: 'src-4',
        name: 'Hajo Temple Overhead Tank Outlet',
        qr_code_id: 'AS-KAM-SRC-04',
        schemes: { name: 'Hajo Solar PWSS' }
      },
      alert_rules: {
        rule_name: 'Microbial Pathogen Detected',
        severity: 'critical',
        threshold_value: 0
      },
      profiles: staff[1] || { id: 'st-2', full_name: 'Biren Das', phone: '+91 94350 12345' }
    }
  ]

  const [alerts, setAlerts] = useState<WaterAlert[]>(
    initialAlerts.length > 0 ? initialAlerts : defaultAlerts
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  // Modal State
  const [selectedAlert, setSelectedAlert] = useState<WaterAlert | null>(null)
  const [assignedStaffId, setAssignedStaffId] = useState('')
  const [remediationAction, setRemediationAction] = useState(REMEDIATION_ACTIONS[0])
  const [actionRemarks, setActionRemarks] = useState('')
  const [newStatus, setNewStatus] = useState('resolved')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  function getAlertSource(alert: WaterAlert): AlertSource | undefined {
    if (!alert.sources) return undefined
    return Array.isArray(alert.sources) ? alert.sources[0] : alert.sources
  }

  function getAlertRule(alert: WaterAlert): AlertRule | undefined {
    if (!alert.alert_rules) return undefined
    return Array.isArray(alert.alert_rules) ? alert.alert_rules[0] : alert.alert_rules
  }

  function getAlertProfile(alert: WaterAlert): AlertProfile | undefined {
    if (!alert.profiles) return undefined
    return Array.isArray(alert.profiles) ? alert.profiles[0] : alert.profiles
  }

  function getAlertSchemeName(alert: WaterAlert): string {
    const src = getAlertSource(alert)
    if (!src?.schemes) return 'Kamrup PHED Scheme'
    if (Array.isArray(src.schemes)) return src.schemes[0]?.name || 'Kamrup PHED Scheme'
    return src.schemes.name || 'Kamrup PHED Scheme'
  }

  // Filtered Alert List
  const filteredAlerts = alerts.filter(a => {
    const src = getAlertSource(a)
    const rule = getAlertRule(a)
    const matchesSearch = 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      (src?.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (src?.qr_code_id?.toLowerCase().includes(search.toLowerCase()) ?? false)

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    const matchesSeverity = severityFilter === 'all' || (rule?.severity?.toLowerCase() === severityFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesSeverity
  })

  // Metrics
  const totalOpenAlerts = alerts.filter(a => a.status === 'open').length
  const totalInvestigating = alerts.filter(a => a.status === 'investigating').length
  const totalCritical = alerts.filter(a => getAlertRule(a)?.severity === 'critical' && a.status !== 'resolved').length
  const totalResolved = alerts.filter(a => a.status === 'resolved').length

  function openTriageModal(alert: WaterAlert) {
    setSelectedAlert(alert)
    setAssignedStaffId(alert.assigned_to || staff[0]?.id || '')
    setRemediationAction(alert.action_taken || REMEDIATION_ACTIONS[0])
    setActionRemarks('')
    setNewStatus(alert.status === 'resolved' ? 'resolved' : 'resolved')
  }

  async function handleTriageSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAlert) return

    setLoading(true)
    const targetStaff = staff.find(s => s.id === assignedStaffId)
    const nowIso = new Date().toISOString()

    try {
      await supabase.from('alerts').update({
        status: newStatus,
        assigned_to: assignedStaffId || undefined,
        action_taken: remediationAction,
        resolved_at: newStatus === 'resolved' ? nowIso : null,
      }).eq('id', selectedAlert.id)

      setAlerts(alerts.map(a => a.id === selectedAlert.id ? {
        ...a,
        status: newStatus,
        assigned_to: assignedStaffId,
        action_taken: remediationAction,
        resolved_at: newStatus === 'resolved' ? nowIso : null,
        profiles: targetStaff || a.profiles
      } : a))

      setSelectedAlert(null)
    } catch {
      setAlerts(alerts.map(a => a.id === selectedAlert.id ? {
        ...a,
        status: newStatus,
        assigned_to: assignedStaffId,
        action_taken: remediationAction,
        resolved_at: newStatus === 'resolved' ? nowIso : null,
        profiles: targetStaff || a.profiles
      } : a))
      setSelectedAlert(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
              Water Quality Alerts & Corrective Action Triage
            </h1>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#DC2626] border border-red-200">
              BIS IS 10500 Exceptions
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time statutory threshold violation alerts, automated severity classification, and documented engineering remediation workflow.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-700 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          <span>Active Monitoring: Kamrup Division</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Open Alerts</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-600">{totalOpenAlerts}</div>
          <div className="text-xs text-slate-500 mt-1">Requires engineering action</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Critical Severity</span>
            <ShieldAlert className="h-4 w-4 text-[#DC2626]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#DC2626]">{totalCritical}</div>
          <div className="text-xs text-slate-500 mt-1">Microbial or toxic metals</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Under Investigation</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{totalInvestigating}</div>
          <div className="text-xs text-slate-500 mt-1">Engineer dispatched to field</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Resolved & Safe</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{totalResolved}</div>
          <div className="text-xs text-slate-500 mt-1">Chlorinated & unblocked</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by contaminant, source name, or QR ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0151AF] focus:bg-white focus:outline-none"
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
              onClick={() => setStatusFilter('open')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'open' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'}`}
            >
              Open
            </button>
            <button
              onClick={() => setStatusFilter('investigating')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'investigating' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'}`}
            >
              Investigating
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${statusFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'}`}
            >
              Resolved
            </button>
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0151AF] focus:bg-white focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
          </select>
        </div>
      </div>

      {/* Alert Feed Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#0151AF]" />
            <h2 className="text-sm font-bold text-slate-900">Alert Triage Queue</h2>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {filteredAlerts.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No water quality alerts found matching criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const src = getAlertSource(alert)
              const rule = getAlertRule(alert)
              const prof = getAlertProfile(alert)
              const schemeName = getAlertSchemeName(alert)
              const isResolved = alert.status === 'resolved'

              return (
                <div key={alert.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          rule?.severity === 'critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : rule?.severity === 'high'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          <ShieldAlert className="h-3 w-3" />
                          <span>{rule?.severity || 'HIGH'} SEVERITY</span>
                        </span>

                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                          alert.status === 'open'
                            ? 'bg-red-600 text-white'
                            : alert.status === 'investigating'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {alert.status}
                        </span>

                        <span className="text-xs text-slate-400 font-mono">
                          <FormattedDate date={alert.created_at} type="datetime" />
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {alert.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{src?.name}</span>
                          <span className="font-mono text-[#0151AF]">({src?.qr_code_id})</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{schemeName}</span>
                        </div>

                        {prof && (
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>Assigned: <b>{prof.full_name}</b></span>
                          </div>
                        )}
                      </div>

                      {isResolved && alert.action_taken && (
                        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-emerald-800 flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-none mt-0.5" />
                          <div>
                            <span className="font-bold">Remediation Completed: </span>
                            <span>{alert.action_taken}</span>
                            {alert.resolved_at && (
                              <span className="text-slate-500 ml-2">
                                (Resolved at <FormattedDate date={alert.resolved_at} type="time" />)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 flex-none">
                      <button
                        onClick={() => openTriageModal(alert)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition shadow-xs ${
                          isResolved
                            ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            : 'bg-[#0151AF] text-white hover:bg-[#014190]'
                        }`}
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>{isResolved ? 'View Remediation Log' : 'Triage & Take Action'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Triage & Corrective Action Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#0151AF]" />
                <h3 className="text-base font-bold text-slate-900">Document Remediation & Close Alert</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTriageSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Alert Title:</div>
                <div className="text-sm font-bold text-slate-900">{selectedAlert.title}</div>
                <div className="text-xs text-[#0151AF] font-mono mt-0.5">
                  {getAlertSource(selectedAlert)?.name} ({getAlertSource(selectedAlert)?.qr_code_id})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Update Triage Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  <option value="investigating">Under Field Investigation (Engineer Dispatched)</option>
                  <option value="resolved">Resolved & Water Supply Cleared (Remediation Complete)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Assigned Section Engineer / Staff
                </label>
                <select
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.phone})</option>
                  ))}
                  {staff.length === 0 && <option value="st-1">Pranab Jyoti Barman (Section Engineer)</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Executed Corrective Action
                </label>
                <select
                  value={remediationAction}
                  onChange={(e) => setRemediationAction(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {REMEDIATION_ACTIONS.map((act, i) => (
                    <option key={i} value={act}>{act}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Engineering Remarks & Retest Confirmation
                </label>
                <textarea
                  rows={2}
                  placeholder="Record chemical quantities, dosage, flush time, and subsequent field kit verification..."
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedAlert(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190] disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Save & Resolve Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

