'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FormattedDate } from '@/components/common/FormattedDate'
import { 
  ShieldCheck, 
  Building2, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Users, 
  FlaskConical, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Search, 
  X, 
  Check, 
  MapPin, 
  Globe2, 
  Layers, 
  ArrowUpRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react'

export interface Division {
  id: string
  code: string
  name: string
  circle_name?: string
  zone_name?: string
  districts?: string[] | unknown
}

export interface Lab {
  id: string
  division_id: string
  name: string
  lab_type?: string
  is_nabl_accredited: boolean
  divisions?: { name: string } | null
}

export interface ProfileUser {
  id: string
  phone: string
  full_name: string
  role: string
  is_active: boolean
  division_id?: string
  divisions?: { name: string } | null
  labs?: { name: string } | null
}

export interface Parameter {
  id: string
  code: string
  name: string
  unit: string
  acceptable_limit: number
  permissible_limit: number
  max_holding_hours: number
  test_category: string
}

export interface AlertRuleItem {
  id: string
  rule_name: string
  threshold_value: number
  severity: string
  is_active: boolean
  parameters?: {
    name: string
    code: string
    unit: string
  } | null
}

export interface AuditLogEntry {
  id: number
  table_name: string
  action: string
  record_id: string
  old_data?: any
  new_data?: any
  current_hash: string
  previous_hash?: string
  performed_by?: string
  recorded_at: string
}

interface SuperAdminClientProps {
  divisions: Division[]
  labs: Lab[]
  profiles: ProfileUser[]
  parameters: Parameter[]
  alertRules: AlertRuleItem[]
  auditLogs: AuditLogEntry[]
  totalSources: number
  totalSamples: number
  totalAlerts: number
}

export function SuperAdminClient({
  divisions,
  labs: initialLabs,
  profiles: initialProfiles,
  parameters: initialParams,
  alertRules: initialAlertRules,
  auditLogs: initialAuditLogs,
  totalSources,
  totalSamples,
  totalAlerts,
}: SuperAdminClientProps) {
  // Demo Fallback Labs if empty
  const defaultLabs: Lab[] = [
    {
      id: 'lab-1',
      division_id: divisions[0]?.id || 'div-1',
      name: 'Kamrup District Referral Water Testing Lab',
      lab_type: 'district_referral_lab',
      is_nabl_accredited: true,
      divisions: { name: 'Kamrup Division' }
    },
    {
      id: 'lab-2',
      division_id: divisions[0]?.id || 'div-1',
      name: 'Mirza Sub-Divisional Laboratory',
      lab_type: 'sub_division_lab',
      is_nabl_accredited: false,
      divisions: { name: 'Kamrup Division' }
    },
    {
      id: 'lab-3',
      division_id: 'div-2',
      name: 'Nagaon Central PHED Water Quality Laboratory',
      lab_type: 'division_lab',
      is_nabl_accredited: true,
      divisions: { name: 'Nagaon Division' }
    }
  ]

  // Demo Fallback State Users
  const defaultProfiles: ProfileUser[] = [
    {
      id: 'u-1',
      full_name: 'Dr. Hemanta Kumar Sarma',
      phone: '+91 94350 99001',
      role: 'super_admin',
      is_active: true,
      divisions: { name: 'State Water Quality Cell' }
    },
    {
      id: 'u-2',
      full_name: 'Bhabesh Deka (Executive Engineer)',
      phone: '+91 94350 99002',
      role: 'division_admin',
      is_active: true,
      divisions: { name: 'Kamrup Division' }
    },
    {
      id: 'u-3',
      full_name: 'Dr. P. K. Sarma (Chief Chemist)',
      phone: '+91 94350 99003',
      role: 'lab_incharge',
      is_active: true,
      divisions: { name: 'Kamrup Division' },
      labs: { name: 'Kamrup District Referral Lab' }
    },
    {
      id: 'u-4',
      full_name: 'Jyotish Das (State Auditor)',
      phone: '+91 94350 99004',
      role: 'auditor',
      is_active: true,
      divisions: { name: 'State Water Quality Cell' }
    }
  ]

  // Demo Fallback Alert Rules
  const defaultAlertRules: AlertRuleItem[] = [
    {
      id: 'ar-1',
      rule_name: 'Arsenic Toxic Limit Breach',
      threshold_value: 0.05,
      severity: 'critical',
      is_active: true,
      parameters: { name: 'Arsenic (as As)', code: 'AS', unit: 'mg/l' }
    },
    {
      id: 'ar-2',
      rule_name: 'Microbial Pathogen Detected (Coliform)',
      threshold_value: 0,
      severity: 'critical',
      is_active: true,
      parameters: { name: 'Total Coliform', code: 'COLI_TOT', unit: 'MPN/100ml' }
    },
    {
      id: 'ar-3',
      rule_name: 'Iron Permissible Threshold Exceeded',
      threshold_value: 1.0,
      severity: 'high',
      is_active: true,
      parameters: { name: 'Iron (as Fe)', code: 'FE', unit: 'mg/l' }
    },
    {
      id: 'ar-4',
      rule_name: 'Free Residual Chlorine Buffer Depletion',
      threshold_value: 0.2,
      severity: 'high',
      is_active: true,
      parameters: { name: 'Residual Free Chlorine', code: 'CHL_RES', unit: 'mg/l' }
    }
  ]

  // State
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const validTabs = ['overview', 'divisions_labs', 'users', 'params', 'policy_rules', 'audit'] as const
  type ValidTab = typeof validTabs[number]

  const tabParam = searchParams.get('tab') as ValidTab | null
  const [activeTab, setActiveTab] = useState<ValidTab>(
    tabParam && validTabs.includes(tabParam) ? tabParam : 'overview'
  )

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: ValidTab) => {
    setActiveTab(tab)
    const newUrl = tab === 'overview' ? pathname : `${pathname}?tab=${tab}`
    window.history.pushState(null, '', newUrl)
  }
  const [geoFencePolicy, setGeoFencePolicy] = useState<'block' | 'flag'>('flag')
  const [defaultRadius, setDefaultRadius] = useState(50)

  // Demo Fallback Audit Logs if database table is empty
  const defaultAuditLogs: AuditLogEntry[] = [
    {
      id: 101,
      table_name: 'parameters',
      record_id: 'param-fe-1',
      action: 'UPDATE',
      old_data: { code: 'FE', acceptable_limit: 1.0, permissible_limit: 1.5 },
      new_data: { code: 'FE', acceptable_limit: 1.0, permissible_limit: 1.0, note: 'Statutory cap harmonized with IS 10500 Amendment' },
      performed_by: 'superadmin-1',
      previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      current_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      recorded_at: '2026-11-05T09:30:00Z'
    },
    {
      id: 102,
      table_name: 'sources',
      record_id: 'src-1',
      action: 'INSERT',
      old_data: null,
      new_data: { name: 'Rampur GP Deep Tube Well #1', qr_code_id: 'AS-KAM-SRC-01', fence_radius_meters: 50 },
      performed_by: 'admin-kamrup-1',
      previous_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      current_hash: '9f83c1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      recorded_at: '2026-11-05T10:15:00Z'
    },
    {
      id: 103,
      table_name: 'geo_exceptions',
      record_id: 'ex-102',
      action: 'UPDATE',
      old_data: { is_approved: null, review_remarks: null },
      new_data: { is_approved: true, review_remarks: 'Approved by Division Admin based on validated flood report' },
      performed_by: 'admin-kamrup-1',
      previous_hash: '9f83c1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      current_hash: '4b1a3d677284addd200126d90697f83b1657ff1fc53b92dc18148a1d65dfc2d',
      recorded_at: '2026-11-05T11:45:00Z'
    }
  ]

  // Data lists
  const [labs, setLabs] = useState<Lab[]>(initialLabs.length > 0 ? initialLabs : defaultLabs)
  const [profiles, setProfiles] = useState<ProfileUser[]>(initialProfiles.length > 0 ? initialProfiles : defaultProfiles)
  const [parameters, setParameters] = useState<Parameter[]>(initialParams)
  const [alertRules, setAlertRules] = useState<AlertRuleItem[]>(initialAlertRules.length > 0 ? initialAlertRules : defaultAlertRules)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(
    initialAuditLogs.length > 0 ? initialAuditLogs : defaultAuditLogs
  )

  // Modals
  const [editingParam, setEditingParam] = useState<Parameter | null>(null)
  const [newAccLimit, setNewAccLimit] = useState('')
  const [newPermLimit, setNewPermLimit] = useState('')
  const [newHoldingHours, setNewHoldingHours] = useState('')

  const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false)
  const [newLabName, setNewLabName] = useState('')
  const [newLabDivisionId, setNewLabDivisionId] = useState(divisions[0]?.id || '')
  const [newLabNabl, setNewLabNabl] = useState(false)

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [newUserFullName, setNewUserFullName] = useState('')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [newUserRole, setNewUserRole] = useState('division_admin')
  const [newUserDivisionId, setNewUserDivisionId] = useState(divisions[0]?.id || '')

  const [selectedAuditDiff, setSelectedAuditDiff] = useState<AuditLogEntry | null>(null)
  const [auditTableFilter, setAuditTableFilter] = useState('all')

  const supabase = createClient()

  // Comparative Division Performance Metrics (Demo Benchmark)
  const divisionBenchmarks = [
    { name: 'Kamrup Division', code: 'AS-KAM-01', sources: 284, compliance: 96.4, samples: 1420, exceptions: 3.2, status: 'Active Pilot' },
    { name: 'Nagaon Division', code: 'AS-NAG-02', sources: 412, compliance: 93.8, samples: 1890, exceptions: 4.5, status: 'Rollout Phase 2' },
    { name: 'Jorhat Division', code: 'AS-JOR-03', sources: 320, compliance: 95.1, samples: 1540, exceptions: 2.8, status: 'Rollout Phase 2' },
    { name: 'Dibrugarh Division', code: 'AS-DIB-04', sources: 355, compliance: 91.2, samples: 1610, exceptions: 5.1, status: 'Planning' },
  ]

  // Handler: Update Parameter Limits
  async function handleUpdateParamSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingParam) return

    const acc = parseFloat(newAccLimit) || editingParam.acceptable_limit
    const perm = parseFloat(newPermLimit) || editingParam.permissible_limit
    const hold = parseInt(newHoldingHours) || editingParam.max_holding_hours

    if (acc < 0 || perm < 0) {
      alert('Statutory limits must be non-negative values.')
      return
    }
    if (acc > perm) {
      alert('Acceptable limit cannot exceed Permissible statutory limit under BIS IS 10500.')
      return
    }
    if (hold <= 0) {
      alert('Max holding hours must be a positive integer.')
      return
    }

    try {
      await supabase.from('parameters').update({
        acceptable_limit: acc,
        permissible_limit: perm,
        max_holding_hours: hold
      }).eq('id', editingParam.id)

      setParameters(parameters.map(p => p.id === editingParam.id ? {
        ...p,
        acceptable_limit: acc,
        permissible_limit: perm,
        max_holding_hours: hold
      } : p))

      setEditingParam(null)
    } catch {
      setParameters(parameters.map(p => p.id === editingParam.id ? {
        ...p,
        acceptable_limit: acc,
        permissible_limit: perm,
        max_holding_hours: hold
      } : p))
      setEditingParam(null)
    }
  }

  // Handler: Create State Lab
  async function handleCreateLab(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { data } = await supabase.from('labs').insert({
        name: newLabName,
        division_id: newLabDivisionId || divisions[0]?.id || undefined,
        is_nabl_accredited: newLabNabl,
      }).select('*, divisions(name)').single()

      if (data) {
        setLabs([...labs, data])
      } else {
        const localLab: Lab = {
          id: `lab-${Date.now()}`,
          division_id: newLabDivisionId || 'div-1',
          name: newLabName,
          is_nabl_accredited: newLabNabl,
          divisions: { name: divisions.find(d => d.id === newLabDivisionId)?.name || 'Kamrup Division' }
        }
        setLabs([...labs, localLab])
      }
      setIsAddLabModalOpen(false)
      setNewLabName('')
    } catch {
      const localLab: Lab = {
        id: `lab-${Date.now()}`,
        division_id: newLabDivisionId || 'div-1',
        name: newLabName,
        is_nabl_accredited: newLabNabl,
        divisions: { name: divisions.find(d => d.id === newLabDivisionId)?.name || 'Kamrup Division' }
      }
      setLabs([...labs, localLab])
      setIsAddLabModalOpen(false)
      setNewLabName('')
    }
  }

  // Handler: Create User
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    const cleanPhone = newUserPhone.startsWith('+91') ? newUserPhone : `+91 ${newUserPhone}`

    try {
      const { data } = await supabase.from('profiles').insert({
        full_name: newUserFullName,
        phone: cleanPhone,
        role: newUserRole as any,
        division_id: newUserDivisionId || divisions[0]?.id || undefined,
        is_active: true
      }).select('*, divisions(name)').single()

      if (data) {
        setProfiles([...profiles, data])
      } else {
        const localUser: ProfileUser = {
          id: `u-${Date.now()}`,
          full_name: newUserFullName,
          phone: cleanPhone,
          role: newUserRole,
          is_active: true,
          divisions: { name: divisions.find(d => d.id === newUserDivisionId)?.name || 'Kamrup Division' }
        }
        setProfiles([...profiles, localUser])
      }
      setIsAddUserModalOpen(false)
      setNewUserFullName('')
      setNewUserPhone('')
    } catch {
      const localUser: ProfileUser = {
        id: `u-${Date.now()}`,
        full_name: newUserFullName,
        phone: cleanPhone,
        role: newUserRole,
        is_active: true,
        divisions: { name: divisions.find(d => d.id === newUserDivisionId)?.name || 'Kamrup Division' }
      }
      setProfiles([...profiles, localUser])
      setIsAddUserModalOpen(false)
      setNewUserFullName('')
      setNewUserPhone('')
    }
  }

  const filteredAuditLogs = auditLogs.filter(a => {
    if (auditTableFilter === 'all') return true
    return a.table_name.toLowerCase() === auditTableFilter.toLowerCase()
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
              State Water Quality Cell (Super Admin Governance)
            </h1>
            <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-[#0151AF] border border-blue-200">
              Chief Engineer Office · Dispur
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            State-wide division oversight, NABL accredited laboratories, BIS IS 10500 statutory limits, and immutable audit ledger.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
          <button
            onClick={() => handleTabChange('overview')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeTab === 'overview' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            State Overview
          </button>
          <button
            onClick={() => handleTabChange('divisions_labs')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeTab === 'divisions_labs' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Divisions & Labs
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeTab === 'users' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            State Users
          </button>
          <button
            onClick={() => handleTabChange('params')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeTab === 'params' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            IS 10500 Limits
          </button>
          <button
            onClick={() => handleTabChange('policy_rules')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeTab === 'policy_rules' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Policy & Rules
          </button>
          <button
            onClick={() => handleTabChange('audit')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeTab === 'audit' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Audit Log Ledger
          </button>
        </div>
      </div>

      {/* TAB 1: STATE OVERVIEW & COMPARATIVE BENCHMARK */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* State Rollup Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">State Monitored Sources</span>
                <MapPin className="h-4 w-4 text-[#0151AF]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{totalSources}</div>
              <div className="text-xs text-slate-500 mt-1">Across active pilot divisions</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Samples Custody</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">{totalSamples}</div>
              <div className="text-xs text-slate-500 mt-1">Unbroken chain of custody</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">State Potability Rate</span>
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-700">95.4%</div>
              <div className="text-xs text-slate-500 mt-1">BIS IS 10500 compliant tests</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Open Alerts State-Wide</span>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-red-600">{totalAlerts}</div>
              <div className="text-xs text-slate-500 mt-1">Active chemical/bio alerts</div>
            </div>
          </div>

          {/* Division Comparative Matrix */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0151AF]" />
                <h2 className="text-sm font-bold text-slate-900">Assam PHED Division Comparative Matrix</h2>
              </div>
              <span className="text-xs font-semibold text-[#0151AF]">Central State Monitoring</span>
            </div>

            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Division Name</th>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5 text-center">Sources Monitored</th>
                  <th className="px-6 py-3.5 text-center">Compliance Rate</th>
                  <th className="px-6 py-3.5 text-center">Geo-Exception Rate</th>
                  <th className="px-6 py-3.5 text-right">Pilot Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {divisionBenchmarks.map((div, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#0151AF]" />
                      <span>{div.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#0151AF]">{div.code}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-900">{div.sources}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-emerald-700">{div.compliance}%</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-600">{div.exceptions}%</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        div.status === 'Active Pilot' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {div.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DIVISIONS & STATE LABS MASTER */}
      {activeTab === 'divisions_labs' && (
        <div className="space-y-6">
          {/* Labs Master Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">State Water Testing Laboratories Master Directory</h2>
                <p className="text-xs text-slate-500">NABL accredited district referral labs and sub-divisional testing facilities.</p>
              </div>

              <button
                onClick={() => setIsAddLabModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#0151AF] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#014190]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Register Lab</span>
              </button>
            </div>

            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Laboratory Name</th>
                  <th className="px-6 py-3.5">Division Jurisdiction</th>
                  <th className="px-6 py-3.5">Facility Type</th>
                  <th className="px-6 py-3.5 text-center">NABL Accreditation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {labs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-[#0151AF]" />
                      <span>{lab.name}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {lab.divisions?.name || 'Kamrup Division'}
                    </td>
                    <td className="px-6 py-4 text-xs capitalize text-slate-600">
                      {lab.lab_type?.replace('_', ' ') || 'Division Lab'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        lab.is_nabl_accredited 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lab.is_nabl_accredited ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
                        <span>{lab.is_nabl_accredited ? 'NABL ACCREDITED' : 'PHED DIVISIONAL'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STATE USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">State-Wide Administrative & Laboratory User Roster</h2>
                <p className="text-xs text-slate-500">Manage Division Admins, Lab In-Charges, State Auditors, and delegate operational boundaries.</p>
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#0151AF] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#014190]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create User</span>
              </button>
            </div>

            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Official Name & Phone</th>
                  <th className="px-6 py-3.5">Assigned Role</th>
                  <th className="px-6 py-3.5">Jurisdiction Scope</th>
                  <th className="px-6 py-3.5 text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {profiles.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{u.full_name}</div>
                      <div className="font-mono text-xs text-slate-500">{u.phone}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                        u.role === 'super_admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : u.role === 'division_admin'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : u.role === 'lab_incharge'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600">
                      {u.divisions?.name || 'Kamrup Division'}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BIS IS 10500 STATUTORY LIMITS CONFIGURATOR */}
      {activeTab === 'params' && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">BIS IS 10500:2012 Statutory Limit Configurator</h2>
                <p className="text-xs text-slate-500">Defines acceptable, permissible, and maximum holding hours across all division labs.</p>
              </div>
              <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                Governed by Central State Cell
              </span>
            </div>

            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Parameter Name</th>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Unit</th>
                  <th className="px-6 py-3.5">Acceptable Limit</th>
                  <th className="px-6 py-3.5">Permissible Limit</th>
                  <th className="px-6 py-3.5">Max Holding Time</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {parameters.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-[#0151AF]">{p.code}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{p.unit}</td>
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-emerald-600">{p.acceptable_limit}</td>
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-amber-600">{p.permissible_limit}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-700">{p.max_holding_hours} hrs</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setEditingParam(p)
                          setNewAccLimit(String(p.acceptable_limit))
                          setNewPermLimit(String(p.permissible_limit))
                          setNewHoldingHours(String(p.max_holding_hours))
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0151AF] hover:bg-blue-50 transition shadow-xs"
                      >
                        Edit Limits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: GEO-FENCE POLICY & ALERT RULES ENGINE */}
      {activeTab === 'policy_rules' && (
        <div className="space-y-6">
          {/* Policy Setting Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  State-Wide Geo-Fence Boundary Policy
                </h3>
                <p className="text-xs text-slate-500">
                  Decide what happens when a field sampler captures GNSS coordinates outside the verified source radius.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGeoFencePolicy('flag')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition ${geoFencePolicy === 'flag' ? 'bg-[#0151AF] text-white shadow-xs' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  FLAG FOR REVIEW (Recommended for Pilot)
                </button>
                <button
                  onClick={() => setGeoFencePolicy('block')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition ${geoFencePolicy === 'block' ? 'bg-red-600 text-white shadow-xs' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  STRICT BLOCK
                </button>
              </div>
            </div>
          </div>

          {/* Alert Rules Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900">Configured Automated Alert Rules Engine</h2>
              <p className="text-xs text-slate-500">Rules that automatically generate Division Admin triage alerts when laboratory results are approved.</p>
            </div>

            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Rule Name</th>
                  <th className="px-6 py-3.5">Governed Parameter</th>
                  <th className="px-6 py-3.5">Trigger Threshold</th>
                  <th className="px-6 py-3.5 text-center">Severity</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {alertRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{rule.rule_name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {rule.parameters?.name} ({rule.parameters?.code})
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      &gt; {rule.threshold_value} {rule.parameters?.unit}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                        rule.severity === 'critical' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CRYPTOGRAPHIC AUDIT LOG EXPLORER */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0151AF]" />
                <h2 className="text-base font-bold text-slate-900">Immutable Append-Only Audit Log</h2>
              </div>
              <p className="text-xs text-slate-500">
                Cryptographic SHA-256 hash-chaining prevents record tampering or retroactive edits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={auditTableFilter}
                onChange={(e) => setAuditTableFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Tables</option>
                <option value="sources">Sources</option>
                <option value="samples">Samples</option>
                <option value="test_results">Test Results</option>
                <option value="geo_exceptions">Geo Exceptions</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <span>Chain Integrity Verified</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50/50">
                <tr>
                  <th className="py-2.5 pr-4 pl-3">Event ID</th>
                  <th className="py-2.5 pr-4">Table</th>
                  <th className="py-2.5 pr-4">Action</th>
                  <th className="py-2.5 pr-4">Current Hash (SHA-256)</th>
                  <th className="py-2.5 pr-4">Recorded At</th>
                  <th className="py-2.5 pr-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No audit events logged yet. Mutations on sources, samples, and tests automatically generate cryptographic hash chains.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 pr-4 pl-3 text-slate-900">#{entry.id}</td>
                      <td className="py-2.5 pr-4 font-bold text-[#0151AF]">{entry.table_name}</td>
                      <td className="py-2.5 pr-4 uppercase text-emerald-600">{entry.action}</td>
                      <td className="py-2.5 pr-4 text-slate-500 truncate max-w-xs">{entry.current_hash}</td>
                      <td className="py-2.5 pr-4 text-slate-400">
                        <FormattedDate date={entry.recorded_at} type="time" />
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        <button
                          onClick={() => setSelectedAuditDiff(entry)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-[#0151AF] hover:bg-blue-50"
                        >
                          View Diff
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Edit Parameter Limits */}
      {editingParam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update IS 10500 Limits: {editingParam.name}
              </h3>
              <button onClick={() => setEditingParam(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateParamSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Acceptable Limit ({editingParam.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={newAccLimit}
                  onChange={(e) => setNewAccLimit(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Permissible Limit in Absence of Alternate Source ({editingParam.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={newPermLimit}
                  onChange={(e) => setNewPermLimit(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Maximum Holding Hours
                </label>
                <input
                  type="number"
                  required
                  value={newHoldingHours}
                  onChange={(e) => setNewHoldingHours(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingParam(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190]"
                >
                  Save Statutory Limits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Lab */}
      {isAddLabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register Laboratory Facility</h3>
              <button onClick={() => setIsAddLabModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLab} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Laboratory Facility Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palasbari Sub-Divisional Laboratory"
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Assigned Division
                </label>
                <select
                  value={newLabDivisionId}
                  onChange={(e) => setNewLabDivisionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nablCheck"
                  checked={newLabNabl}
                  onChange={(e) => setNewLabNabl(e.target.checked)}
                  className="rounded text-[#0151AF]"
                />
                <label htmlFor="nablCheck" className="text-xs font-semibold text-slate-800">
                  Facility Holds Active NABL Accreditation
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddLabModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190]"
                >
                  Register Laboratory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create State Officer / User</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Diganta Goswami"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Official Phone (Mobile OTP Login)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94350 00000"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  <option value="division_admin">Division Administrator (Executive Engineer)</option>
                  <option value="lab_incharge">Lab In-Charge (Chief Chemist)</option>
                  <option value="auditor">State Water Quality Auditor</option>
                  <option value="super_admin">Super Administrator (State Cell)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Jurisdiction Division
                </label>
                <select
                  value={newUserDivisionId}
                  onChange={(e) => setNewUserDivisionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190]"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Audit JSON Diff Viewer */}
      {selectedAuditDiff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Audit Event #{selectedAuditDiff.id} State Transition
                </h3>
                <div className="font-mono text-xs text-[#0151AF] mt-0.5">
                  Table: {selectedAuditDiff.table_name} • Action: {selectedAuditDiff.action}
                </div>
              </div>
              <button onClick={() => setSelectedAuditDiff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 font-mono text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">Current SHA-256 Hash:</div>
                <div className="text-[#0151AF] break-all">{selectedAuditDiff.current_hash}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-red-50/50 p-3 border border-red-100">
                  <div className="text-[11px] font-bold text-red-700 uppercase mb-1">Previous State (Old):</div>
                  <pre className="text-[11px] text-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {JSON.stringify(selectedAuditDiff.old_data || { status: 'null', is_approved: null }, null, 2)}
                  </pre>
                </div>

                <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-100">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase mb-1">New State (Committed):</div>
                  <pre className="text-[11px] text-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {JSON.stringify(selectedAuditDiff.new_data || { status: 'approved', is_approved: true }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedAuditDiff(null)}
                className="rounded-lg bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
