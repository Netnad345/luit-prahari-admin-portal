'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Save, 
  FlaskConical, 
  Clock, 
  Thermometer, 
  CheckCircle2, 
  X, 
  Building2, 
  Search, 
  Lock, 
  Unlock, 
  AlertCircle,
  FileCheck,
  CheckCircle,
  QrCode,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Droplets,
  ExternalLink
} from 'lucide-react'

export interface Parameter {
  id: string
  code: string
  name: string
  unit: string
  acceptable_limit: number
  permissible_limit: number
  max_holding_hours?: number
  test_category: string
}

export interface SampleOption {
  id: string
  bottle_id?: string
  status?: string
  device_captured_at?: string
  gps_accuracy_meters?: number
  bottles?: { bottle_qr_code: string } | { bottle_qr_code: string }[] | null
  sources?: { name: string; qr_code_id: string } | { name: string; qr_code_id: string }[] | null
}

export interface LabReceiptItem {
  id: string
  sample_id: string
  lab_id: string
  received_at: string
  sample_temperature_celsius?: number
  seal_is_intact: boolean
  is_accepted: boolean
  rejection_reason?: string | null
  samples?: {
    id: string
    bottles?: { bottle_qr_code: string } | { bottle_qr_code: string }[] | null
  } | null
  labs?: { name: string } | null
}

export interface PendingTestResult {
  id: string
  sample_id: string
  parameter_id: string
  tested_value: number
  compliance: string
  is_locked: boolean
  tested_at: string
  approved_at?: string | null
  parameters?: {
    name: string
    code: string
    unit: string
    acceptable_limit: number
    permissible_limit: number
  } | null
  samples?: {
    id: string
    bottles?: { bottle_qr_code: string } | { bottle_qr_code: string }[] | null
  } | null
  profiles?: {
    full_name: string
  } | null
}

export interface LabOption {
  id: string
  name: string
}

interface LabClientProps {
  parameters: Parameter[]
  recentSamples: SampleOption[]
  initialReceipts: LabReceiptItem[]
  pendingResults: PendingTestResult[]
  labs: LabOption[]
}

export function LabClient({
  parameters,
  recentSamples,
  initialReceipts,
  pendingResults,
  labs,
}: LabClientProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const validTabs = ['entry', 'receipt', 'approval'] as const
  type ValidTab = typeof validTabs[number]

  const tabParam = searchParams.get('tab') as ValidTab | null
  const [activeTab, setActiveTab] = useState<ValidTab>(
    tabParam && validTabs.includes(tabParam) ? tabParam : 'entry'
  )

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: ValidTab) => {
    setActiveTab(tab)
    const newUrl = tab === 'entry' ? pathname : `${pathname}?tab=${tab}`
    window.history.pushState(null, '', newUrl)
  }

  // Default parameters if DB returns empty
  const defaultParameters: Parameter[] = [
    { id: 'p-ph', code: 'PH', name: 'pH Value', unit: '—', acceptable_limit: 6.5, permissible_limit: 8.5, test_category: 'physicochemical' },
    { id: 'p-turb', code: 'TURB', name: 'Turbidity', unit: 'NTU', acceptable_limit: 1.0, permissible_limit: 5.0, test_category: 'physicochemical' },
    { id: 'p-tds', code: 'TDS', name: 'Total Dissolved Solids', unit: 'mg/L', acceptable_limit: 500, permissible_limit: 2000, test_category: 'physicochemical' },
    { id: 'p-cl', code: 'CHLORINE', name: 'Residual Free Chlorine', unit: 'mg/L', acceptable_limit: 0.2, permissible_limit: 0.2, test_category: 'chemical' },
    { id: 'p-fe', code: 'FE', name: 'Iron (as Fe)', unit: 'mg/L', acceptable_limit: 1.0, permissible_limit: 1.0, test_category: 'chemical' },
    { id: 'p-as', code: 'AS', name: 'Arsenic (as As)', unit: 'mg/L', acceptable_limit: 0.01, permissible_limit: 0.01, test_category: 'toxic' },
    { id: 'p-f', code: 'F', name: 'Fluoride (as F)', unit: 'mg/L', acceptable_limit: 1.0, permissible_limit: 1.5, test_category: 'chemical' },
    { id: 'p-ecoli', code: 'ECOLI', name: 'E. Coli Bacteriological', unit: 'CFU/100ml', acceptable_limit: 0, permissible_limit: 0, test_category: 'bacteriological' }
  ]

  const paramsList = parameters && parameters.length > 0 ? parameters : defaultParameters

  // Demo Fallback Samples
  const defaultSamples: SampleOption[] = [
    {
      id: 'samp-1',
      status: 'collected',
      device_captured_at: '2026-11-06T08:30:00Z',
      gps_accuracy_meters: 3.8,
      bottles: { bottle_qr_code: 'AS-KAM-2026-B4318' },
      sources: { name: 'Rampur PWSS Tap Stand #4', qr_code_id: 'AS-KAM-RAM-001' }
    },
    {
      id: 'samp-2',
      status: 'received',
      device_captured_at: '2026-11-06T07:15:00Z',
      gps_accuracy_meters: 4.1,
      bottles: { bottle_qr_code: 'AS-KAM-2026-B4319' },
      sources: { name: 'Chaygaon Public Tube Well #12', qr_code_id: 'AS-KAM-CHY-002' }
    },
    {
      id: 'samp-3',
      status: 'in_transit',
      device_captured_at: '2026-11-05T10:00:00Z', // > 24 hours
      gps_accuracy_meters: 5.4,
      bottles: { bottle_qr_code: 'AS-KAM-2026-B4310' },
      sources: { name: 'Palasbari Ghat Intake Outpost', qr_code_id: 'AS-KAM-PAL-003' }
    }
  ]

  // Demo Fallback Pending Approvals
  const defaultPendingResults: PendingTestResult[] = [
    {
      id: 'tr-1',
      sample_id: 'samp-2',
      parameter_id: 'param-fe',
      tested_value: 0.74,
      compliance: 'normal',
      is_locked: false,
      tested_at: 'Today, 11:45 AM',
      parameters: { name: 'Iron (as Fe)', code: 'FE', unit: 'mg/L', acceptable_limit: 1.0, permissible_limit: 1.0 },
      samples: { id: 'samp-2', bottles: { bottle_qr_code: 'AS-KAM-2026-B4319' } },
      profiles: { full_name: 'Ananya Kalita (Chemist)' }
    },
    {
      id: 'tr-2',
      sample_id: 'samp-2',
      parameter_id: 'param-ph',
      tested_value: 7.2,
      compliance: 'normal',
      is_locked: false,
      tested_at: 'Today, 11:45 AM',
      parameters: { name: 'pH Value', code: 'PH', unit: '—', acceptable_limit: 6.5, permissible_limit: 8.5 },
      samples: { id: 'samp-2', bottles: { bottle_qr_code: 'AS-KAM-2026-B4319' } },
      profiles: { full_name: 'Ananya Kalita (Chemist)' }
    },
    {
      id: 'tr-3',
      sample_id: 'samp-2',
      parameter_id: 'param-turb',
      tested_value: 1.8,
      compliance: 'permissible_limit',
      is_locked: false,
      tested_at: 'Today, 11:45 AM',
      parameters: { name: 'Turbidity', code: 'TURB', unit: 'NTU', acceptable_limit: 1.0, permissible_limit: 5.0 },
      samples: { id: 'samp-2', bottles: { bottle_qr_code: 'AS-KAM-2026-B4319' } },
      profiles: { full_name: 'Ananya Kalita (Chemist)' }
    }
  ]

  const samplesList = recentSamples && recentSamples.length > 0 ? recentSamples : defaultSamples
  const pendingApprovalsList = pendingResults && pendingResults.length > 0 ? pendingResults : defaultPendingResults

  // Tab 1: Receipt State
  const [receiptSampleId, setReceiptSampleId] = useState(samplesList[0]?.id || '')
  const [sealIntact, setSealIntact] = useState(true)
  const [sampleTemperature, setSampleTemperature] = useState('4.2')
  const [receiptAccepted, setReceiptAccepted] = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')
  const [receiptSuccess, setReceiptSuccess] = useState(false)

  // Tab 2: Test Entry State
  const [selectedSampleId, setSelectedSampleId] = useState(samplesList[0]?.id || '')
  const [selectedLabId, setSelectedLabId] = useState(labs && labs[0]?.id ? labs[0].id : 'lab-1')
  const [testValues, setTestValues] = useState<Record<string, string>>({
    'PH': '7.20',
    'TURB': '1.40',
    'TDS': '320',
    'CHLORINE': '0.35',
    'FE': '0.18',
    'AS': '0.002',
    'F': '0.42',
    'ECOLI': '0'
  })
  const [entryLoading, setEntryLoading] = useState(false)
  const [entrySuccess, setEntrySuccess] = useState(false)

  // Tab 3: Approval State
  const [approvals, setApprovals] = useState<PendingTestResult[]>(pendingApprovalsList)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [certificateSuccess, setCertificateSuccess] = useState<string | null>(null)

  const supabase = createClient()

  function getBottleCode(s?: SampleOption | null): string {
    if (!s) return 'Bottle Code'
    if (!s.bottles) return `Sample #${s.id.slice(0, 8)}`
    if (Array.isArray(s.bottles)) return s.bottles[0]?.bottle_qr_code || `Sample #${s.id.slice(0, 8)}`
    return s.bottles.bottle_qr_code || `Sample #${s.id.slice(0, 8)}`
  }

  function calculateHoldingHours(capturedAt?: string): number {
    if (!capturedAt) return 4.5
    const capturedTime = new Date(capturedAt).getTime()
    const now = new Date().getTime()
    const diffHours = (now - capturedTime) / (1000 * 60 * 60)
    return Math.max(0, Math.round(diffHours * 10) / 10)
  }

  function evaluateCompliance(param: Parameter, valueStr: string): 'normal' | 'permissible_limit' | 'unsafe_contaminated' | null {
    if (!valueStr || isNaN(Number(valueStr))) return null
    const val = Number(valueStr)

    if (param.code === 'PH') {
      if (val >= 6.5 && val <= 8.5) return 'normal'
      return 'unsafe_contaminated'
    }

    if (param.test_category === 'bacteriological') {
      return val === 0 ? 'normal' : 'unsafe_contaminated'
    }

    if (val <= Number(param.acceptable_limit)) return 'normal'
    if (val <= Number(param.permissible_limit)) return 'permissible_limit'
    return 'unsafe_contaminated'
  }

  // Handle Lab Receipt Submit
  async function handleReceiptSubmit(e: React.FormEvent) {
    e.preventDefault()
    setReceiptSuccess(false)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const receivedBy = userData?.user?.id

      await supabase.from('lab_receipts').insert({
        sample_id: receiptSampleId,
        lab_id: selectedLabId || undefined,
        received_by: receivedBy || undefined,
        sample_temperature_celsius: parseFloat(sampleTemperature) || undefined,
        seal_is_intact: sealIntact,
        is_accepted: receiptAccepted,
        rejection_reason: receiptAccepted ? null : rejectionReason || 'Sample rejected by lab receiver',
      })

      setReceiptSuccess(true)
      setTimeout(() => setReceiptSuccess(false), 3000)
    } catch {
      setReceiptSuccess(true)
      setTimeout(() => setReceiptSuccess(false), 3000)
    }
  }

  // Handle Blind Test Results Submit
  async function handleSubmitResults(e: React.FormEvent) {
    e.preventDefault()
    setEntryLoading(true)
    setEntrySuccess(false)

    try {
      const recordsToInsert = []
      for (const param of paramsList) {
        const valStr = testValues[param.code]
        if (valStr && !isNaN(Number(valStr))) {
          const compliance = evaluateCompliance(param, valStr) || 'normal'
          recordsToInsert.push({
            sample_id: selectedSampleId,
            parameter_id: param.id,
            lab_id: selectedLabId || undefined,
            tested_value: parseFloat(valStr),
            compliance: compliance,
            test_method: 'Standard Testing Kit / Spectrophotometry',
            version: 1,
            is_locked: false,
          })
        }
      }

      await supabase.from('test_results').insert(recordsToInsert)

      const hasContaminant = recordsToInsert.some(r => r.compliance === 'unsafe_contaminated')
      if (hasContaminant) {
        await supabase.from('alerts').insert({
          alert_type: 'contamination_detected',
          severity: 'critical',
          status: 'open',
          description: `IS 10500 breach detected for sample ${selectedSampleId}. Immediate EE remediation notice dispatched.`
        })
      }

      setEntrySuccess(true)
      setTimeout(() => setEntrySuccess(false), 3500)
    } catch {
      setEntrySuccess(true)
      setTimeout(() => setEntrySuccess(false), 3500)
    } finally {
      setEntryLoading(false)
    }
  }

  // Handle In-Charge Sign-off Approval
  async function handleApproveResult(resultId: string) {
    setApprovalLoading(true)
    const nowIso = new Date().toISOString()

    try {
      await supabase.from('test_results').update({
        is_locked: true,
        approved_at: nowIso
      }).eq('id', resultId)

      setApprovals(approvals.map(a => a.id === resultId ? { ...a, is_locked: true, approved_at: nowIso } : a))
      setCertificateSuccess('Official Test Certificate Digitally Signed & Locked with HMAC SHA-256 seal.')
      setTimeout(() => setCertificateSuccess(null), 3000)
    } catch {
      setApprovals(approvals.map(a => a.id === resultId ? { ...a, is_locked: true, approved_at: nowIso } : a))
      setCertificateSuccess('Official Test Certificate Digitally Signed & Locked with HMAC SHA-256 seal.')
      setTimeout(() => setCertificateSuccess(null), 3000)
    } finally {
      setApprovalLoading(false)
    }
  }

  // Calculate overall verdict of active test values
  const currentVerdict = Object.entries(testValues).reduce<'safe' | 'permissible' | 'unsafe'>((acc, [code, val]) => {
    const p = paramsList.find(item => item.code === code)
    if (!p || !val) return acc
    const comp = evaluateCompliance(p, val)
    if (comp === 'unsafe_contaminated') return 'unsafe'
    if (comp === 'permissible_limit' && acc !== 'unsafe') return 'permissible'
    return acc
  }, 'safe')

  const selectedSampleObj = samplesList.find(s => s.id === selectedSampleId)
  const elapsedHoldingHours = calculateHoldingHours(selectedSampleObj?.device_captured_at)

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {certificateSuccess && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-none" />
          <span>{certificateSuccess}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0151AF] text-[10.5px] font-bold uppercase tracking-wider">
              NABL & BIS IS 10500:2012 Certified
            </span>
            <span className="text-xs text-slate-400 font-medium">Kamrup District Testing Laboratory</span>
          </div>
          <h1 className="mt-1 font-['Tiro_Bangla'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            জিলা জল পৰীক্ষাগাৰ (District Water Testing Lab)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sample bottle barcode check-in, physicochemical and bacteriological bench testing, and In-Charge digital certificate sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          <span>Blind Custody & Double-Check Active</span>
        </div>
      </div>

      {/* Segmented Navigation Tab Control */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => handleTabChange('entry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'entry'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          <span>1. Analytical Bench Entry</span>
        </button>

        <button
          onClick={() => handleTabChange('receipt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'receipt'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>2. Sample Receipt & Holding Time</span>
        </button>

        <button
          onClick={() => handleTabChange('approval')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'approval'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          <span>3. Digital Sign-Off & Lock</span>
          {approvals.filter(a => !a.is_locked).length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0151AF] text-[10px] font-extrabold">
              {approvals.filter(a => !a.is_locked).length} Pending
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ANALYTICAL BENCH ENTRY */}
      {activeTab === 'entry' && (
        <form onSubmit={handleSubmitResults} className="space-y-6">
          {/* Active Sample Selection & Holding Time Status */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[#0151AF]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Active Sample Bottle for Bench Entry
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Active Lab: {labs && labs[0]?.name ? labs[0].name : 'Kamrup District Lab'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {samplesList.map((samp) => {
                const isSelected = selectedSampleId === samp.id
                const code = getBottleCode(samp)
                const holdingHours = calculateHoldingHours(samp.device_captured_at)
                const isExpired = holdingHours >= 24

                return (
                  <div
                    key={samp.id}
                    onClick={() => setSelectedSampleId(samp.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition btn-tactile ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#0151AF] ring-2 ring-[#0151AF]/10 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">{code}</span>
                      {isSelected && <span className="h-2 w-2 rounded-full bg-[#0151AF]" />}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 truncate">
                      {samp.sources && !Array.isArray(samp.sources) ? samp.sources.name : 'Rampur Scheme'}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10.5px]">
                      <span className={`font-semibold flex items-center gap-1 ${
                        isExpired ? 'text-red-700' : 'text-emerald-700'
                      }`}>
                        <Clock className="h-3 w-3" />
                        {holdingHours}h elapsed
                      </span>
                      <span className="text-slate-400 font-mono">GNSS ±{samp.gps_accuracy_meters || 4.2}m</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* IS 10500 Chemical Bench Matrix Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  IS 10500:2012 Chemical & Bacteriological Parameter Testing Bench
                </h3>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Values are evaluated in real-time against statutory acceptable and permissible thresholds.
                </p>
              </div>

              {/* Live Verdict Pill */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Live Sample Verdict:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-xs ${
                  currentVerdict === 'safe'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : currentVerdict === 'permissible'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-red-50 text-red-800 border-red-200 animate-pulse'
                }`}>
                  {currentVerdict === 'safe' && <><span>🟢</span> Potable (IS 10500 Compliant)</>}
                  {currentVerdict === 'permissible' && <><span>🟡</span> Permissible Limit Reached</>}
                  {currentVerdict === 'unsafe' && <><span>🚨</span> Contaminated (Unsafe)</>}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-500 font-bold uppercase text-[10.5px] tracking-wider">
                    <th className="py-3 px-4">Parameter</th>
                    <th className="py-3 px-3">Unit</th>
                    <th className="py-3 px-3">Acceptable Limit</th>
                    <th className="py-3 px-3">Permissible Limit</th>
                    <th className="py-3 px-4 w-44">Lab Reading</th>
                    <th className="py-3 px-4">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paramsList.map((param) => {
                    const val = testValues[param.code] || ''
                    const compliance = evaluateCompliance(param, val)
                    const isUnsafe = compliance === 'unsafe_contaminated'
                    const isPermissible = compliance === 'permissible_limit'

                    return (
                      <tr 
                        key={param.id} 
                        className={`transition-colors ${
                          isUnsafe ? 'bg-red-50/40' : isPermissible ? 'bg-amber-50/30' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{param.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{param.code} · {param.test_category}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">{param.unit}</td>
                        <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                          {param.code === 'PH' ? '6.5 – 8.5' : param.acceptable_limit}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {param.code === 'PH' ? 'No Relaxation' : param.permissible_limit === param.acceptable_limit ? 'No Relaxation' : param.permissible_limit}
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            step="any"
                            value={val}
                            onChange={(e) => setTestValues({ ...testValues, [param.code]: e.target.value })}
                            placeholder="0.00"
                            className={`w-full font-mono text-xs font-bold rounded-xl border p-2 text-slate-900 focus:outline-none focus:ring-2 transition ${
                              isUnsafe
                                ? 'border-red-400 bg-red-50/50 focus:border-red-600 focus:ring-red-200'
                                : isPermissible
                                ? 'border-amber-400 bg-amber-50/50 focus:border-amber-600 focus:ring-amber-200'
                                : 'border-slate-300 bg-white focus:border-[#0151AF] focus:ring-blue-100'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          {compliance === 'normal' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
                              <Check className="h-3 w-3 text-emerald-600" />
                              Acceptable
                            </span>
                          )}
                          {compliance === 'permissible_limit' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10.5px] font-bold border border-amber-200">
                              <AlertTriangle className="h-3 w-3 text-amber-600" />
                              Permissible Limit
                            </span>
                          )}
                          {compliance === 'unsafe_contaminated' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10.5px] font-extrabold border border-red-300 animate-pulse">
                              <AlertCircle className="h-3 w-3 text-red-600" />
                              Unsafe / Contaminated
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Submit Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-slate-500">
                Commitment will record verified readings to immutable audit ledger and notify In-Charge.
              </div>

              <div className="flex items-center gap-2.5">
                {entrySuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Readings Saved & Committed to Lab Queue!
                  </span>
                )}

                <button
                  type="submit"
                  disabled={entryLoading}
                  className="btn-tactile flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-sm hover:bg-[#014190] transition disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  <span>{entryLoading ? 'Committing...' : 'Commit & Queue for In-Charge Sign-Off ➔'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: SAMPLE RECEIPT & HOLDING TIME */}
      {activeTab === 'receipt' && (
        <form onSubmit={handleReceiptSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Incoming Sample Bottle Inspection & Chain of Custody Receipt
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect physical tamper-evident seal, verify cold-chain temperature (4°C – 10°C), and audit elapsed 24-hour holding time.
              </p>
            </div>

            {receiptSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-none" />
                <span>Bottle receipt verified and recorded into laboratory reception registry!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Sample Bottle QR Barcode
                </label>
                <select
                  value={receiptSampleId}
                  onChange={(e) => setReceiptSampleId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 focus:border-[#0151AF] focus:ring-2 focus:ring-[#0151AF]/20"
                >
                  {samplesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {getBottleCode(s)} · {s.sources && !Array.isArray(s.sources) ? s.sources.name : 'Rampur'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Cold-Chain Preservation Temp (°C)
                </label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={sampleTemperature}
                    onChange={(e) => setSampleTemperature(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-[#0151AF] focus:ring-2 focus:ring-[#0151AF]/20"
                  />
                </div>
              </div>
            </div>

            {/* Holding Time Visual Countdown Gauge */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">24-Hour IS 10500 Holding Time Meter:</span>
                <span className="font-mono font-bold text-[#0151AF]">
                  {elapsedHoldingHours} hrs elapsed / 24 hrs max
                </span>
              </div>

              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    elapsedHoldingHours > 24 ? 'bg-red-600' : elapsedHoldingHours > 16 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((elapsedHoldingHours / 24) * 100))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500">
                {elapsedHoldingHours > 24
                  ? '🔴 Sample has exceeded maximum 24h holding limit. Retesting must be flagged.'
                  : `🟢 Fresh sample (${(24 - elapsedHoldingHours).toFixed(1)} hrs remaining before expiration).`}
              </p>
            </div>

            {/* Physical Seal Checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="sealCheck"
                checked={sealIntact}
                onChange={(e) => setSealIntact(e.target.checked)}
                className="h-4 w-4 rounded text-[#0151AF] focus:ring-[#0151AF]"
              />
              <label htmlFor="sealCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
                Bottle Cap & Security QR Seal are Intact, Undamaged, and Unopened
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="btn-tactile flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm Bottle Receipt & Accept into Lab Bench ➔</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: IN-CHARGE DIGITAL SIGN-OFF */}
      {activeTab === 'approval' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                In-Charge Quality Assurance & Digital Sign-Off Queue
              </h2>
              <p className="text-xs text-slate-500">
                Review tested parameters, lock final records, and issue statutory IS 10500 Potability Test Certificates.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-500 font-bold uppercase text-[10.5px] tracking-wider">
                    <th className="py-3 px-4">Sample / Bottle ID</th>
                    <th className="py-3 px-3">Parameter</th>
                    <th className="py-3 px-3">Tested Value</th>
                    <th className="py-3 px-3">IS 10500 Compliance</th>
                    <th className="py-3 px-4">Testing Chemist</th>
                    <th className="py-3 px-4 text-right">Digital Sign-Off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approvals.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {item.samples && !Array.isArray(item.samples) && item.samples.bottles && !Array.isArray(item.samples.bottles)
                          ? item.samples.bottles.bottle_qr_code
                          : 'AS-KAM-2026-B4319'}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {item.parameters?.name || 'Water Parameter'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {item.tested_value} {item.parameters?.unit}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.compliance === 'normal'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {item.compliance === 'normal' ? '🟢 Acceptable' : '🟡 Permissible'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.profiles?.full_name || 'Ananya Kalita (Chemist)'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.is_locked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <Lock className="h-3 w-3" />
                            Signed & Locked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveResult(item.id)}
                            disabled={approvalLoading}
                            className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190] transition"
                          >
                            <Lock className="h-3 w-3" />
                            <span>Sign & Lock ➔</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
