'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import {
  Users,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
  Send,
  Search,
  Filter,
  ArrowUpRight,
  Activity,
  Check,
  X,
  BatteryMedium,
  BatteryLow,
  BatteryCharging,
  Wifi,
  UserCheck,
  Droplets,
  FileCheck2,
  Inbox,
  PhoneCall,
  Compass,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Plus
} from 'lucide-react'

interface JalMitraRecord {
  id: string
  name: string
  phone: string
  assignedScheme: string
  village: string
  status: 'active' | 'syncing' | 'idle'
  todayCompleted: number
  todayTarget: number
  battery: number
  lastSync: string
  gpsAccuracy?: string
  distanceKm?: number
}

interface CitizenRequestRecord {
  id: string
  requestCode: string
  citizenName: string
  citizenPhone: string
  village: string
  sourceType: string
  reason: string
  urgency: 'high' | 'normal' | 'emergency'
  status: 'pending' | 'assigned' | 'collected'
  assignedTo?: string
  createdAt: string
}

interface LocalScheme {
  id: string
  name: string
  code: string
  schemeType: string
  habitation: string
  status: 'operational' | 'maintenance' | 'alert'
  sourcesCount: number
  lastTested: string
  waterQuality: 'Safe' | 'Attention' | 'Critical'
}

interface LocalException {
  id: string
  sampleCode: string
  jalMitraName: string
  sourceName: string
  distanceMeters: number
  reason: string
  timestamp: string
  status: 'pending' | 'endorsed' | 'rejected'
}

interface SubDivisionClientProps {
  totalSources: number
  totalSamples: number
  pendingExceptions: number
  dbSchemes: any[]
}

export function SubDivisionClient({
  totalSources,
  totalSamples,
  pendingExceptions,
  dbSchemes
}: SubDivisionClientProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const validTabs = ['overview', 'citizen_requests', 'jal_mitras', 'schemes', 'exceptions'] as const
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

  const [searchQuery, setSearchQuery] = useState('')

  // Jal Mitras Ground Force State
  const [jalMitras, setJalMitras] = useState<JalMitraRecord[]>([
    {
      id: 'JM-01',
      name: 'Pranab Das (প্ৰণৱ দাস)',
      phone: '+91 94350 11223',
      assignedScheme: 'Rampur PWSS',
      village: 'Rampur Ward 1-4',
      status: 'active',
      todayCompleted: 5,
      todayTarget: 6,
      battery: 86,
      lastSync: '4 mins ago',
      gpsAccuracy: '3.2m',
      distanceKm: 1.2
    },
    {
      id: 'JM-02',
      name: 'Anjali Barman (অঞ্জলি বৰ্মন)',
      phone: '+91 98640 44556',
      assignedScheme: 'Chaygaon Water Scheme',
      village: 'Chaygaon Gaon',
      status: 'active',
      todayCompleted: 4,
      todayTarget: 6,
      battery: 72,
      lastSync: '12 mins ago',
      gpsAccuracy: '4.1m',
      distanceKm: 3.5
    },
    {
      id: 'JM-03',
      name: 'Bitupon Kalita (বিতুপন কলিতা)',
      phone: '+91 97060 77889',
      assignedScheme: 'Palasbari DTW Cluster',
      village: 'Palasbari Ghat',
      status: 'syncing',
      todayCompleted: 6,
      todayTarget: 6,
      battery: 91,
      lastSync: 'Just now',
      gpsAccuracy: '2.8m',
      distanceKm: 5.1
    },
    {
      id: 'JM-04',
      name: 'Manashjyoti Rabha (মানসজ্যোতি ৰাভা)',
      phone: '+91 91012 33445',
      assignedScheme: 'Boko Border Scheme',
      village: 'Boko North',
      status: 'idle',
      todayCompleted: 2,
      todayTarget: 5,
      battery: 48,
      lastSync: '35 mins ago',
      gpsAccuracy: '5.5m',
      distanceKm: 8.4
    }
  ])

  // Citizen Water Test Requests Queue
  const [citizenRequests, setCitizenRequests] = useState<CitizenRequestRecord[]>([
    {
      id: 'CR-101',
      requestCode: 'REQ-AS-247300',
      citizenName: 'Bipul Sarma (বিপুল শৰ্মা)',
      citizenPhone: '+91 98540 23145',
      village: 'Rampur Ward 3, Near Namghar',
      sourceType: 'Public Tube Well',
      reason: 'Metallic taste and yellowish discoloration observed after heavy morning rain.',
      urgency: 'high',
      status: 'pending',
      createdAt: 'Today, 10:15 AM'
    },
    {
      id: 'CR-102',
      requestCode: 'REQ-AS-189201',
      citizenName: 'Runu Begum (ৰুনু বেগম)',
      citizenPhone: '+91 94351 90812',
      village: 'Chaygaon Bazar',
      sourceType: 'Piped Water Tap (PWSS)',
      reason: 'Water has slight chlorine odor; request potability confirmation for LP school.',
      urgency: 'normal',
      status: 'assigned',
      assignedTo: 'Anjali Barman',
      createdAt: 'Today, 08:30 AM'
    },
    {
      id: 'CR-103',
      requestCode: 'REQ-AS-091423',
      citizenName: 'Dhruba Jyoti Nath (ধ্ৰুৱজ্যোতি নাথ)',
      citizenPhone: '+91 98642 55109',
      village: 'Palasbari Riverbank',
      sourceType: 'Ring Well (Public)',
      reason: 'Diarrhea cases reported in 3 adjacent households; urgent bacteriological sampling needed.',
      urgency: 'emergency',
      status: 'pending',
      createdAt: 'Yesterday, 04:45 PM'
    }
  ])

  // Schemes State
  const localSchemes: LocalScheme[] = [
    {
      id: 'SCH-01',
      name: 'Rampur PWSS (Pipe Water Supply Scheme)',
      code: 'AS-KAM-RAM-001',
      schemeType: 'PWSS Piped Supply',
      habitation: 'Rampur Center & Extension',
      status: 'operational',
      sourcesCount: 18,
      lastTested: 'Today (4 hrs ago)',
      waterQuality: 'Safe'
    },
    {
      id: 'SCH-02',
      name: 'Chaygaon High-Yield Deep Tube Well Cluster',
      code: 'AS-KAM-CHY-002',
      schemeType: 'Deep Tube Well',
      habitation: 'Chaygaon Town & Market',
      status: 'operational',
      sourcesCount: 14,
      lastTested: 'Yesterday',
      waterQuality: 'Safe'
    },
    {
      id: 'SCH-03',
      name: 'Palasbari Surface River Intake System',
      code: 'AS-KAM-PAL-003',
      schemeType: 'Surface Water Treatment',
      habitation: 'Palasbari Municipal Outskirts',
      status: 'alert',
      sourcesCount: 22,
      lastTested: 'Today (Turbidity Spike)',
      waterQuality: 'Attention'
    },
    {
      id: 'SCH-04',
      name: 'Boko Rural Drinking Water Outpost',
      code: 'AS-KAM-BOK-004',
      schemeType: 'Solar Powered Mini PWSS',
      habitation: 'Boko Foothills',
      status: 'operational',
      sourcesCount: 10,
      lastTested: '2 days ago',
      waterQuality: 'Safe'
    }
  ]

  // Exceptions State
  const [exceptions, setExceptions] = useState<LocalException[]>([
    {
      id: 'EX-01',
      sampleCode: 'SMP-AS-24-0089',
      jalMitraName: 'Bitupon Kalita',
      sourceName: 'Palasbari Ghat Point 2',
      distanceMeters: 68,
      reason: 'River erosion submerged direct approach; collected from safe elevated bund 68m away.',
      timestamp: 'Today, 11:20 AM',
      status: 'pending'
    },
    {
      id: 'EX-02',
      sampleCode: 'SMP-AS-24-0074',
      jalMitraName: 'Pranab Das',
      sourceName: 'Rampur Namghar Well',
      distanceMeters: 55,
      reason: 'Namghar inner gate locked for festival preparation; tapped from exterior boundary line pipe.',
      timestamp: 'Yesterday, 03:10 PM',
      status: 'pending'
    }
  ])

  // Dispatch Modal State
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequestRecord | null>(null)
  const [selectedMitraId, setSelectedMitraId] = useState<string>(jalMitras[0]?.id || '')
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null)

  // Jal Mitra & Lab Management Modals
  const [showAssignMitraModal, setShowAssignMitraModal] = useState(false)
  const [showLinkLabModal, setShowLinkLabModal] = useState(false)
  const [newMitraName, setNewMitraName] = useState('')
  const [newMitraPhone, setNewMitraPhone] = useState('')
  const [newMitraScheme, setNewMitraScheme] = useState(localSchemes[0]?.name || 'Rampur PWSS')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  // Fetch live citizen requests from API
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch('/api/citizen-requests')
        const data = await res.json()
        if (data.success && data.requests && data.requests.length > 0) {
          const mapped = data.requests.map((r: any) => ({
            id: r.id,
            requestCode: r.request_code,
            citizenName: r.citizen_name,
            citizenPhone: r.citizen_phone,
            village: r.village,
            sourceType: r.source_type,
            reason: r.reason,
            urgency: r.urgency || 'normal',
            status: r.status || 'pending',
            assignedTo: r.assigned_to_mitra_name || undefined,
            createdAt: 'Live Synced'
          }))
          setCitizenRequests(mapped)
        }
      } catch {
        // Fallback to local state
      }
    }
    fetchRequests()
  }, [])

  async function handleAssignRequest() {
    if (!selectedRequest) return
    const mitra = jalMitras.find(m => m.id === selectedMitraId)
    if (!mitra) return

    const assignedName = mitra.name.split('(')[0].trim()

    try {
      await fetch('/api/dispatch-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          jalMitraId: mitra.id,
          jalMitraName: assignedName,
          sourceName: selectedRequest.village,
          urgency: selectedRequest.urgency
        })
      })

      // Update local state
      setCitizenRequests(prev => prev.map(cr => {
        if (cr.id === selectedRequest.id) {
          return { ...cr, status: 'assigned', assignedTo: assignedName }
        }
        return cr
      }))

      setDispatchSuccessMsg(`Sample collection dispatched to ${assignedName}. Task synchronized with Jal Mitra app.`)
      setTimeout(() => {
        setSelectedRequest(null)
        setDispatchSuccessMsg(null)
      }, 1800)
    } catch {
      setDispatchSuccessMsg(`Task dispatched to ${assignedName} (Local Offline Mode).`)
      setTimeout(() => {
        setSelectedRequest(null)
        setDispatchSuccessMsg(null)
      }, 1800)
    }
  }

  function handleEndorseException(exId: string) {
    setExceptions(prev => prev.map(e => e.id === exId ? { ...e, status: 'endorsed' } : e))
    setActionNotice('Geographical barrier exception endorsed & certified under JJM Exception Protocols.')
    setTimeout(() => setActionNotice(null), 3000)
  }

  function handleRejectException(exId: string) {
    setExceptions(prev => prev.map(e => e.id === exId ? { ...e, status: 'rejected' } : e))
    setActionNotice('Exception rejected. Jal Mitra requested to re-sample within verified 50m radius.')
    setTimeout(() => setActionNotice(null), 3000)
  }

  const pendingRequestsCount = citizenRequests.filter(r => r.status === 'pending').length
  const activeMitrasCount = jalMitras.filter(m => m.status === 'active' || m.status === 'syncing').length
  const pendingExceptionsCount = exceptions.filter(e => e.status === 'pending').length

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Action Notice Toast */}
      {actionNotice && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-none" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0151AF] text-[10.5px] font-bold uppercase tracking-wider">
              AEE Jurisdiction
            </span>
            <span className="text-xs text-slate-400 font-medium">Kamrup District · Block Rampur</span>
          </div>
          <h1 className="mt-1 font-['Tiro_Bangla'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ৰামপুৰ উপ-সংমণ্ডল (Rampur Sub-Division)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Jal Mitra ground fleet telemetry, on-demand citizen water testing triage, and PWSS scheme supervision.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAssignMitraModal(true)}
            className="btn-tactile flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            <span>+ Enroll Jal Mitra</span>
          </button>

          <Link
            href="/division-admin/sources"
            className="btn-tactile flex items-center gap-2 rounded-xl bg-[#0151AF] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#014190] transition"
          >
            <Plus className="h-3.5 w-3.5 text-white" />
            <span>Register Water Source</span>
          </Link>
        </div>
      </div>

      {/* Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Water Sources Monitored</span>
            <Droplets className="h-4 w-4 text-[#0151AF]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 font-['Tiro_Bangla']">
            {totalSources || 342}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="text-[#0151AF] font-bold">12 PWSS</span>
            <span>· 100% Geo-Mapped</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>IS 10500 Potability Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 font-['Tiro_Bangla']">
            94.8%
          </div>
          <div className="mt-1 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Within Acceptable Standard</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Citizen Requests</span>
            <Inbox className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 font-['Tiro_Bangla']">
            {citizenRequests.length}
          </div>
          <div className="mt-1 text-[11px] font-bold text-amber-700 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingRequestsCount} Pending Action</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Ground Force (Jal Mitras)</span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 font-['Tiro_Bangla']">
            {activeMitrasCount} <span className="text-lg font-normal text-slate-400">/ {jalMitras.length}</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-purple-700">
            24 Sample Collections Today
          </div>
        </div>
      </div>

      {/* Modern Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => handleTabChange('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Operations Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('citizen_requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'citizen_requests'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          <span>Citizen Requests</span>
          {pendingRequestsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('jal_mitras')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'jal_mitras'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Jal Mitra Ground Force</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0151AF] text-[10px] font-extrabold">
            {activeMitrasCount} Active
          </span>
        </button>

        <button
          onClick={() => handleTabChange('schemes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'schemes'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>PWSS Schemes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">
            {localSchemes.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('exceptions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition btn-tactile whitespace-nowrap ${
            activeTab === 'exceptions'
              ? 'bg-white text-[#0151AF] shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Geo-Exceptions</span>
          {pendingExceptionsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold animate-pulse">
              {pendingExceptionsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Urgent Action Banner if Citizen Requests Pending */}
          {pendingRequestsCount > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50/50 to-white border border-red-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-100 text-red-700 flex-none mt-0.5">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-900">
                    Urgent Citizen Water Quality Grievances ({pendingRequestsCount})
                  </h3>
                  <p className="text-xs text-red-700 mt-0.5">
                    Citizens from Rampur Ward 3 and Palasbari have reported discolored or contaminated drinking water. Immediate sample collection required.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTabChange('citizen_requests')}
                className="btn-tactile flex-none flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition"
              >
                <span>Triage Requests ➔</span>
              </button>
            </div>
          )}

          {/* Dual Panel: Ground Force Radar & Recent Scheme Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Jal Mitra Live Status Radar */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#0151AF]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Active Ground Fleet Telemetry
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange('jal_mitras')}
                  className="text-xs font-bold text-[#0151AF] hover:underline"
                >
                  View All ({jalMitras.length})
                </button>
              </div>

              <div className="space-y-3">
                {jalMitras.map((jm) => (
                  <div key={jm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{jm.name}</span>
                        <span className="text-[10px] text-slate-500">· {jm.id}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {jm.assignedScheme} · {jm.village}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[10.5px] text-slate-600">
                        <span className="flex items-center gap-1 font-mono">
                          <BatteryCharging className="h-3 w-3 text-emerald-600" />
                          {jm.battery}%
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Compass className="h-3 w-3 text-[#0151AF]" />
                          GPS {jm.gpsAccuracy}
                        </span>
                        <span className="text-slate-400">Sync: {jm.lastSync}</span>
                      </div>
                    </div>

                    <div className="text-right flex-none">
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        {jm.todayCompleted} / {jm.todayTarget}
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">Samples</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: PWSS Scheme Operational Status */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#0151AF]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    PWSS Schemes Water Quality Status
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange('schemes')}
                  className="text-xs font-bold text-[#0151AF] hover:underline"
                >
                  View All Schemes
                </button>
              </div>

              <div className="space-y-3">
                {localSchemes.map((sch) => (
                  <div key={sch.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{sch.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {sch.code} · {sch.sourcesCount} Connected Water Taps
                      </div>
                      <div className="text-[10.5px] text-slate-400 mt-1">
                        Last Tested: {sch.lastTested}
                      </div>
                    </div>

                    <div className="flex-none text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${
                        sch.waterQuality === 'Safe'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {sch.waterQuality === 'Safe' ? '🟢 Potable' : '🟡 Attention'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CITIZEN REQUESTS */}
      {activeTab === 'citizen_requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Citizen Water Test Grievance Queue
              </h2>
              <p className="text-xs text-slate-500">
                Public requests received via Assam Citizen Water Portal. Sub-division AEE dispatches to nearest field Jal Mitra.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {citizenRequests.map((req) => {
              const isPending = req.status === 'pending'
              const isEmergency = req.urgency === 'emergency'

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEmergency && isPending
                      ? 'bg-red-50/70 border-red-200 shadow-sm'
                      : req.urgency === 'high' && isPending
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-white border-slate-200 shadow-micro'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {req.requestCode}
                      </span>

                      {isEmergency ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10.5px] font-extrabold border border-red-300 flex items-center gap-1 animate-pulse">
                          🚨 Emergency Triage
                        </span>
                      ) : req.urgency === 'high' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold border border-amber-300">
                          ⚠️ High Urgency
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10.5px] font-semibold border border-blue-200">
                          Routine Request
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">· {req.createdAt}</span>
                    </div>

                    <div>
                      {req.status === 'assigned' ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0151AF] text-xs font-bold border border-blue-200 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Dispatched: {req.assignedTo}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Awaiting Dispatch
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Citizen Contact
                      </span>
                      <span className="font-bold text-slate-900 block mt-0.5">{req.citizenName}</span>
                      <a href={`tel:${req.citizenPhone}`} className="text-[#0151AF] hover:underline flex items-center gap-1 mt-0.5 font-mono">
                        <PhoneCall className="h-3 w-3" />
                        {req.citizenPhone}
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Location & Source Type
                      </span>
                      <span className="font-semibold text-slate-800 block mt-0.5">{req.village}</span>
                      <span className="text-slate-500 block mt-0.5">{req.sourceType}</span>
                    </div>

                    <div className="md:col-span-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Reported Observation
                      </span>
                      <p className="text-slate-700 mt-0.5 italic line-clamp-2">
                        &quot;{req.reason}&quot;
                      </p>
                    </div>
                  </div>

                  {isPending && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(req)
                          setSelectedMitraId(jalMitras[0]?.id || '')
                        }}
                        className="btn-tactile flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190] transition"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Dispatch to Jal Mitra ➔</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: JAL MITRAS GROUND FORCE */}
      {activeTab === 'jal_mitras' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Ground Sampling Fleet (Jal Mitras)
              </h2>
              <p className="text-xs text-slate-500">
                Live device health, hardware GNSS accuracy lock, and daily sampling targets.
              </p>
            </div>
            <button
              onClick={() => setShowAssignMitraModal(true)}
              className="btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190] transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Enroll Jal Mitra</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jalMitras.map((jm) => {
              const progressPct = Math.round((jm.todayCompleted / jm.todayTarget) * 100)

              return (
                <div key={jm.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0151AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {jm.id}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{jm.name}</h3>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {jm.assignedScheme} · {jm.village}
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border flex items-center gap-1 ${
                      jm.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : jm.status === 'syncing'
                        ? 'bg-blue-50 text-[#0151AF] border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        jm.status === 'active' ? 'bg-emerald-500 animate-pulse' : jm.status === 'syncing' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                      {jm.status === 'active' ? 'Active Online' : jm.status === 'syncing' ? 'Syncing Task' : 'Standby / Idle'}
                    </span>
                  </div>

                  {/* Telemetry Bar */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Battery</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" />
                        {jm.battery}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Hardware GNSS</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Compass className="h-3.5 w-3.5 text-[#0151AF]" />
                        {jm.gpsAccuracy}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Sync</span>
                      <span className="text-slate-600 font-medium block mt-0.5 truncate">
                        {jm.lastSync}
                      </span>
                    </div>
                  </div>

                  {/* Daily Quota Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">Today&apos;s Sampling Quota</span>
                      <span className="font-mono font-bold text-[#0151AF]">
                        {jm.todayCompleted} / {jm.todayTarget} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0151AF] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Mitra Quick Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${jm.phone}`}
                      className="btn-tactile flex items-center gap-1 text-slate-700 hover:text-[#0151AF] font-semibold"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{jm.phone}</span>
                    </a>

                    <Link
                      href="/division-admin/gis-map"
                      className="btn-tactile text-[#0151AF] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Track on Map</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PWSS SCHEMES */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Piped Water Supply Schemes (PWSS)
              </h2>
              <p className="text-xs text-slate-500">
                Functional infrastructure, treatment intake systems, and connected water distribution taps.
              </p>
            </div>
            <Link
              href="/division-admin/schemes"
              className="btn-tactile text-xs font-bold text-[#0151AF] hover:underline flex items-center gap-1"
            >
              <span>Manage in Division View ➔</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localSchemes.map((sch) => (
              <div key={sch.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400 block">
                      {sch.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{sch.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{sch.habitation}</p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                    sch.waterQuality === 'Safe'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {sch.waterQuality === 'Safe' ? '🟢 Potable (IS 10500)' : '🟡 Attention Required'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Type</span>
                    <span className="font-semibold text-slate-800 block mt-0.5 truncate">{sch.schemeType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Taps</span>
                    <span className="font-mono font-bold text-slate-800 block mt-0.5">{sch.sourcesCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Test</span>
                    <span className="text-slate-600 block mt-0.5 truncate">{sch.lastTested}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/division-admin/sources?scheme=${sch.code}`}
                    className="text-xs font-bold text-[#0151AF] hover:underline flex items-center gap-1"
                  >
                    <span>View Connected Sources</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GEO-EXCEPTIONS */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Field Barrier & Geo-Exception Review
            </h2>
            <p className="text-xs text-slate-500">
              When physical barriers (flooding, locked gates, erosion) prevent sampling within the 50m geofence, Jal Mitras file an audited exception.
            </p>
          </div>

          <div className="space-y-3">
            {exceptions.map((ex) => (
              <div key={ex.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0151AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {ex.sampleCode}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{ex.sourceName}</span>
                  </div>

                  <div>
                    {ex.status === 'endorsed' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Endorsed by AEE
                      </span>
                    ) : ex.status === 'rejected' ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-800 text-xs font-bold border border-red-200 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Rejected / Re-sample Required
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1 animate-pulse">
                        <Clock className="h-3 w-3" />
                        Awaiting AEE Endorsement
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Jal Mitra</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{ex.jalMitraName}</span>
                    <span className="text-slate-400 text-[10.5px]">{ex.timestamp}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Distance Delta</span>
                    <span className="font-mono font-bold text-red-600 block mt-0.5">
                      {ex.distanceMeters} meters from source
                    </span>
                    <span className="text-[10.5px] text-slate-500">(Normal geofence limit: 50m)</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Audited Reason</span>
                    <p className="text-slate-700 italic mt-0.5">&quot;{ex.reason}&quot;</p>
                  </div>
                </div>

                {ex.status === 'pending' && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleRejectException(ex.id)}
                      className="btn-tactile px-3.5 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition"
                    >
                      Reject & Require Re-Sampling
                    </button>
                    <button
                      onClick={() => handleEndorseException(ex.id)}
                      className="btn-tactile px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs transition"
                    >
                      ✓ Endorse Exception (Override Barrier)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISPATCH TASK MODAL (SLIDE-OVER / DIALOG) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="h-1.5 w-full bg-[#0151AF]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0151AF]">
                    Direct Task Dispatch
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Assign {selectedRequest.requestCode} to Jal Mitra
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {dispatchSuccessMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-none" />
                  <span>{dispatchSuccessMsg}</span>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Citizen:</span>
                      <span className="font-bold text-slate-900">{selectedRequest.citizenName} ({selectedRequest.citizenPhone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-semibold text-slate-800">{selectedRequest.village}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-700">{selectedRequest.sourceType}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Select Available Ground Force Jal Mitra
                    </label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {jalMitras.map((m) => {
                        const isSelected = selectedMitraId === m.id
                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMitraId(m.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition btn-tactile flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50 border-[#0151AF] ring-2 ring-[#0151AF]/10'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{m.name}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {m.assignedScheme} · {m.distanceKm} km away
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
                                <BatteryMedium className="h-3.5 w-3.5 text-emerald-600" />
                                {m.battery}%
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {m.todayCompleted} done today
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="btn-tactile px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAssignRequest}
                      className="btn-tactile flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0151AF] text-white hover:bg-[#014190] text-xs font-bold shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Confirm & Dispatch Task ➔</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ENROLL JAL MITRA MODAL */}
      {showAssignMitraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="h-1.5 w-full bg-[#0151AF]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Enroll Field Jal Mitra
                </h3>
                <button
                  onClick={() => setShowAssignMitraModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name (with Assamese script)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramen Deka (ৰমেন ডেকা)"
                    value={newMitraName}
                    onChange={(e) => setNewMitraName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-900 focus:border-[#0151AF] focus:ring-2 focus:ring-[#0151AF]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Phone Number (Active WhatsApp / SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94350 XXXXX"
                    value={newMitraPhone}
                    onChange={(e) => setNewMitraPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-900 focus:border-[#0151AF] focus:ring-2 focus:ring-[#0151AF]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assigned PWSS Scheme
                  </label>
                  <select
                    value={newMitraScheme}
                    onChange={(e) => setNewMitraScheme(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-900 focus:border-[#0151AF] focus:ring-2 focus:ring-[#0151AF]/20"
                  >
                    {localSchemes.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAssignMitraModal(false)}
                  className="btn-tactile px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newMitraName && newMitraPhone) {
                      const newJM: JalMitraRecord = {
                        id: `JM-0${jalMitras.length + 1}`,
                        name: newMitraName,
                        phone: newMitraPhone,
                        assignedScheme: newMitraScheme,
                        village: 'Rampur Sub-Div Area',
                        status: 'active',
                        todayCompleted: 0,
                        todayTarget: 6,
                        battery: 100,
                        lastSync: 'Enrolled Just now',
                        gpsAccuracy: '3.0m',
                        distanceKm: 2.0
                      }
                      setJalMitras(prev => [...prev, newJM])
                      setShowAssignMitraModal(false)
                      setNewMitraName('')
                      setNewMitraPhone('')
                      setActionNotice(`Jal Mitra ${newMitraName} enrolled and credentials provisioned.`)
                      setTimeout(() => setActionNotice(null), 3000)
                    }
                  }}
                  className="btn-tactile px-5 py-2 rounded-xl bg-[#0151AF] text-white text-xs font-bold shadow-xs hover:bg-[#014190]"
                >
                  Enroll & Issue Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
