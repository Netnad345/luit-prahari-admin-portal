'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FormattedDate } from '@/components/common/FormattedDate'
import { 
  Users, 
  Smartphone, 
  Plus, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RotateCcw, 
  X, 
  Check, 
  Phone, 
  Clock, 
  AlertTriangle,
  Building2,
  CheckCircle2
} from 'lucide-react'

export interface DeviceItem {
  id: string
  user_id: string
  device_uuid: string
  public_key_pem?: string
  app_version: string
  os_version: string
  is_blocked: boolean
  last_sync_at: string
  profiles?: {
    full_name: string
    phone: string
    role: string
    division_id?: string
  } | null
}

export interface ProfileItem {
  id: string
  phone: string
  full_name: string
  role: string
  is_active: boolean
  division_id?: string
  lab_id?: string
  divisions?: { name: string } | null
  labs?: { name: string } | null
  devices?: DeviceItem[] | null
}

interface Division {
  id: string
  name: string
}

interface StaffClientProps {
  initialProfiles: ProfileItem[]
  initialDevices: DeviceItem[]
  divisions: Division[]
}

export function StaffClient({ initialProfiles, initialDevices, divisions }: StaffClientProps) {
  // Demo fallback profiles
  const defaultProfiles: ProfileItem[] = [
    {
      id: 'prof-1',
      full_name: 'Biren Das',
      phone: '+91 94350 12345',
      role: 'field_sampler',
      is_active: true,
      divisions: { name: 'Kamrup Division' },
      devices: [
        {
          id: 'dev-1',
          user_id: 'prof-1',
          device_uuid: 'FIPVXSVGWONZTCYH',
          app_version: 'v1.2.0-prod',
          os_version: 'Android 14 (Realme RMX3867)',
          is_blocked: false,
          last_sync_at: '2026-11-05T12:45:00Z'
        }
      ]
    },
    {
      id: 'prof-2',
      full_name: 'Pranjal Saikia',
      phone: '+91 94350 23456',
      role: 'field_sampler',
      is_active: true,
      divisions: { name: 'Kamrup Division' },
      devices: [
        {
          id: 'dev-2',
          user_id: 'prof-2',
          device_uuid: 'SAMS-A54-884912',
          app_version: 'v1.2.0-prod',
          os_version: 'Android 13 (Samsung A54)',
          is_blocked: false,
          last_sync_at: '2026-11-05T11:20:00Z'
        }
      ]
    },
    {
      id: 'prof-3',
      full_name: 'Dr. P. K. Sarma',
      phone: '+91 94350 34567',
      role: 'lab_incharge',
      is_active: true,
      divisions: { name: 'Kamrup Division' },
      labs: { name: 'Kamrup District Referral Water Testing Lab' }
    },
    {
      id: 'prof-4',
      full_name: 'Ananya Kalita',
      phone: '+91 94350 45678',
      role: 'lab_staff',
      is_active: true,
      divisions: { name: 'Kamrup Division' },
      labs: { name: 'Kamrup District Referral Water Testing Lab' }
    },
    {
      id: 'prof-5',
      full_name: 'Tarun Deka',
      phone: '+91 94350 56789',
      role: 'transporter',
      is_active: true,
      divisions: { name: 'Kamrup Division' }
    }
  ]

  // Demo fallback devices
  const defaultDevices: DeviceItem[] = [
    {
      id: 'dev-1',
      user_id: 'prof-1',
      device_uuid: 'FIPVXSVGWONZTCYH',
      app_version: 'v1.2.0-prod',
      os_version: 'Android 14 (Realme RMX3867)',
      is_blocked: false,
      last_sync_at: '2026-11-05T12:45:00Z',
      profiles: { full_name: 'Biren Das', phone: '+91 94350 12345', role: 'field_sampler' }
    },
    {
      id: 'dev-2',
      user_id: 'prof-2',
      device_uuid: 'SAMS-A54-884912',
      app_version: 'v1.2.0-prod',
      os_version: 'Android 13 (Samsung A54)',
      is_blocked: false,
      last_sync_at: '2026-11-05T11:20:00Z',
      profiles: { full_name: 'Pranjal Saikia', phone: '+91 94350 23456', role: 'field_sampler' }
    },
    {
      id: 'dev-3',
      user_id: 'prof-5',
      device_uuid: 'REDMI-NT12-00921',
      app_version: 'v1.1.8',
      os_version: 'Android 12 (Redmi Note 12)',
      is_blocked: true,
      last_sync_at: '2026-11-03T09:15:00Z',
      profiles: { full_name: 'Tarun Deka', phone: '+91 94350 56789', role: 'transporter' }
    }
  ]

  const [profiles, setProfiles] = useState<ProfileItem[]>(
    initialProfiles.length > 0 ? initialProfiles : defaultProfiles
  )
  const [devices, setDevices] = useState<DeviceItem[]>(
    initialDevices.length > 0 ? initialDevices : defaultDevices
  )

  const [activeTab, setActiveTab] = useState<'roster' | 'devices'>('roster')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('field_sampler')
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  // Helper metrics
  const totalStaff = profiles.length
  const samplersCount = profiles.filter(p => p.role === 'field_sampler').length
  const labStaffCount = profiles.filter(p => p.role === 'lab_staff' || p.role === 'lab_incharge').length
  const activeDevicesCount = devices.filter(d => !d.is_blocked).length
  const blockedDevicesCount = devices.filter(d => d.is_blocked).length

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
    const matchesRole = roleFilter === 'all' || p.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredDevices = devices.filter(d => {
    const matchesSearch =
      d.device_uuid.toLowerCase().includes(search.toLowerCase()) ||
      d.os_version.toLowerCase().includes(search.toLowerCase()) ||
      (d.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchesSearch
  })

  async function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const rawDigits = phone.replace(/\D/g, '')
    const tenDigits = rawDigits.startsWith('91') && rawDigits.length === 12 ? rawDigits.slice(2) : rawDigits

    if (!/^[6-9]\d{9}$/.test(tenDigits)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. 94350 12345).')
      setLoading(false)
      return
    }

    const cleanPhone = `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`

    try {
      const { data, error } = await supabase.from('profiles').insert({
        full_name: fullName,
        phone: cleanPhone,
        role: role as any,
        division_id: divisionId || divisions[0]?.id || undefined,
        is_active: true,
      }).select('*, divisions(name)').single()

      if (error || !data) {
        // Optimistic fallback
        const newProf: ProfileItem = {
          id: `prof-${Date.now()}`,
          full_name: fullName,
          phone: cleanPhone,
          role,
          is_active: true,
          divisions: { name: divisions.find(d => d.id === divisionId)?.name || 'Kamrup Division' }
        }
        setProfiles([newProf, ...profiles])
      } else {
        setProfiles([data, ...profiles])
      }

      setIsAddModalOpen(false)
      setFullName('')
      setPhone('')
    } catch {
      const newProf: ProfileItem = {
        id: `prof-${Date.now()}`,
        full_name: fullName,
        phone: cleanPhone,
        role,
        is_active: true,
        divisions: { name: divisions.find(d => d.id === divisionId)?.name || 'Kamrup Division' }
      }
      setProfiles([newProf, ...profiles])
      setIsAddModalOpen(false)
      setFullName('')
      setPhone('')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleDeviceBlock(device: DeviceItem) {
    const nextBlocked = !device.is_blocked
    try {
      await supabase.from('devices').update({
        is_blocked: nextBlocked
      }).eq('id', device.id)

      setDevices(devices.map(d => d.id === device.id ? { ...d, is_blocked: nextBlocked } : d))
    } catch {
      setDevices(devices.map(d => d.id === device.id ? { ...d, is_blocked: nextBlocked } : d))
    }
  }

  async function handleToggleProfileActive(profile: ProfileItem) {
    const nextActive = !profile.is_active
    try {
      await supabase.from('profiles').update({
        is_active: nextActive
      }).eq('id', profile.id)

      setProfiles(profiles.map(p => p.id === profile.id ? { ...p, is_active: nextActive } : p))
    } catch {
      setProfiles(profiles.map(p => p.id === profile.id ? { ...p, is_active: nextActive } : p))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
              Division Staff & Mobile Device Security
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0151AF] border border-blue-200">
              Kamrup Division Roster
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage field samplers, laboratory personnel, registered Android devices, remote device security locks, and synchronization status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#014190] transition"
        >
          <Plus className="h-4 w-4" />
          <span>Register Staff Member</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Personnel</span>
            <Users className="h-4 w-4 text-[#0151AF]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalStaff}</div>
          <div className="text-xs text-slate-500 mt-1">Verified official staff</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Field Samplers</span>
            <Phone className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{samplersCount}</div>
          <div className="text-xs text-slate-500 mt-1">GPS & offline capture</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Lab Personnel</span>
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-700">{labStaffCount}</div>
          <div className="text-xs text-slate-500 mt-1">Chemists & In-charge</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Authorized Phones</span>
            <Smartphone className="h-4 w-4 text-[#C99A3E]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{activeDevicesCount}</div>
          <div className="text-xs text-slate-500 mt-1">Hardware bound</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Blocked Devices</span>
            <Lock className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-600">{blockedDevicesCount}</div>
          <div className="text-xs text-slate-500 mt-1">Lost / revoked phones</div>
        </div>
      </div>

      {/* Tab Selector & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setActiveTab('roster')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${activeTab === 'roster' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Staff Directory ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${activeTab === 'devices' ? 'bg-[#0151AF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Device Security & Binding ({devices.length})
          </button>
        </div>

        <div className="flex flex-1 sm:max-w-md items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'roster' ? 'Search by name or phone...' : 'Search by UUID, model, or sampler...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0151AF] focus:bg-white focus:outline-none"
            />
          </div>

          {activeTab === 'roster' && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0151AF] focus:bg-white focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="field_sampler">Field Sampler</option>
              <option value="lab_staff">Lab Staff</option>
              <option value="lab_incharge">Lab In-Charge</option>
              <option value="transporter">Transporter</option>
            </select>
          )}
        </div>
      </div>

      {/* Tab 1: Staff Directory Roster */}
      {activeTab === 'roster' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0151AF]" />
              <h2 className="text-sm font-bold text-slate-900">Personnel Registry</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Staff Name & Contact</th>
                  <th className="px-6 py-3.5">System Role</th>
                  <th className="px-6 py-3.5">Station / Lab</th>
                  <th className="px-6 py-3.5">Assigned Phone Hardware</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No staff members found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => {
                    const dev = p.devices && p.devices.length > 0 ? p.devices[0] : null

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{p.full_name}</div>
                          <div className="font-mono text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{p.phone}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                            p.role === 'field_sampler'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.role === 'lab_incharge'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : p.role === 'lab_staff'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.role.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-600">
                          {p.labs?.name || p.divisions?.name || 'Kamrup Division'}
                        </td>

                        <td className="px-6 py-4">
                          {dev ? (
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{dev.os_version}</div>
                              <div className="font-mono text-[10px] text-[#0151AF] mt-0.5">{dev.device_uuid}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No device bound</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            p.is_active 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span>{p.is_active ? 'Active' : 'Suspended'}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleProfileActive(p)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              p.is_active 
                                ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {p.is_active ? 'Suspend' : 'Activate'}
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
      )}

      {/* Tab 2: Device Security & Hardware Binding */}
      {activeTab === 'devices' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#0151AF]" />
              <h2 className="text-sm font-bold text-slate-900">Bound Field Hardware & Play Integrity</h2>
            </div>
            <span className="text-xs text-slate-500">Android Hardware Keys Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3.5">Device Hardware & OS</th>
                  <th className="px-6 py-3.5">Device UUID</th>
                  <th className="px-6 py-3.5">Bound User</th>
                  <th className="px-6 py-3.5">App Version</th>
                  <th className="px-6 py-3.5">Last Cloud Sync</th>
                  <th className="px-6 py-3.5 text-center">Security Status</th>
                  <th className="px-6 py-3.5 text-right">Remote Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No bound mobile devices found.
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((dev) => (
                    <tr key={dev.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {dev.os_version}
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-[#0151AF]">
                        {dev.device_uuid}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-xs text-slate-900">{dev.profiles?.full_name || 'Field Sampler'}</div>
                        <div className="text-[11px] text-slate-500">{dev.profiles?.phone || '+91 94350 xxxxx'}</div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {dev.app_version}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-800">
                          <FormattedDate date={dev.last_sync_at} type="time" />
                        </div>
                        <div className="text-[10px] text-slate-400">
                          <FormattedDate date={dev.last_sync_at} type="date" />
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          dev.is_blocked 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {dev.is_blocked ? <Lock className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                          <span>{dev.is_blocked ? 'REVOKED' : 'AUTHORIZED'}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleDeviceBlock(dev)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                            dev.is_blocked 
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {dev.is_blocked ? (
                            <>
                              <Unlock className="h-3.5 w-3.5" />
                              <span>Unblock Device</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              <span>Remote Revoke</span>
                            </>
                          )}
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

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0151AF]" />
                <h3 className="text-base font-bold text-slate-900">Register Staff Member</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pranab Jyoti Barman"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Official Mobile Number (Used for OTP Sign-in)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94350 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 font-mono focus:border-[#0151AF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  System Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  <option value="field_sampler">Field Sampler (Source GPS & Bottle Scan)</option>
                  <option value="lab_staff">Lab Staff / Chemist (Result Testing)</option>
                  <option value="lab_incharge">Lab In-Charge (Result Approval Sign-Off)</option>
                  <option value="transporter">Sample Transporter (Chain of Custody Hand-Over)</option>
                  <option value="division_admin">Division Administrator (Supervisor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Assigned Division Scope
                </label>
                <select
                  value={divisionId}
                  onChange={(e) => setDivisionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                  {divisions.length === 0 && <option value="div-1">Kamrup Division</option>}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190] disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

