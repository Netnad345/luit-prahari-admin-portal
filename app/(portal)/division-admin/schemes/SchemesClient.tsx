'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Droplets, 
  Layers, 
  X, 
  Check, 
  ChevronRight, 
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'

export interface SchemeSource {
  id: string
  scheme_id?: string
  name: string
  qr_code_id: string
  source_type: string
  is_verified: boolean
}

export interface Scheme {
  id: string
  division_id: string
  scheme_code: string
  name: string
  scheme_type: string
  village_coverage: string[] | unknown
  created_at?: string
  divisions?: { name: string; code?: string } | null
  sources?: SchemeSource[] | null
}

export interface Division {
  id: string
  name: string
  code?: string
}

interface SchemesClientProps {
  initialSchemes: Scheme[]
  divisions: Division[]
  allSources: SchemeSource[]
}

const SCHEME_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'groundwater', label: 'Groundwater PWSS' },
  { value: 'surface_water', label: 'Surface Water Intake' },
  { value: 'solar_mini_grid', label: 'Solar Mini PWSS' },
  { value: 'gravity_flow', label: 'Gravity Flow Scheme' },
]

export function SchemesClient({ initialSchemes, divisions, allSources }: SchemesClientProps) {
  // Demo fallback schemes if database has 0 or 1
  const defaultSchemes: Scheme[] = [
    {
      id: 'sch-1',
      division_id: divisions[0]?.id || 'div-1',
      scheme_code: 'PWSS-RAM-01',
      name: 'Rampur Piped Water Supply Scheme',
      scheme_type: 'groundwater',
      village_coverage: ['Rampur GP', 'Mirza Bazaar', 'Palasbari Gaon'],
      divisions: { name: 'Kamrup Division', code: 'AS-KAM-01' },
      sources: [
        { id: 'src-1', name: 'Rampur GP Deep Tube Well #1', qr_code_id: 'AS-KAM-SRC-01', source_type: 'tube_well', is_verified: true },
        { id: 'src-2', name: 'Rampur Storage Reservoir & Chlorinator', qr_code_id: 'AS-KAM-SRC-02', source_type: 'storage_reservoir', is_verified: true },
      ]
    },
    {
      id: 'sch-2',
      division_id: divisions[0]?.id || 'div-1',
      scheme_code: 'PWSS-PAL-02',
      name: 'Palasbari Brahmaputra River Intake Scheme',
      scheme_type: 'surface_water',
      village_coverage: ['Palasbari Town', 'Dharapur', 'Azara Ward 2'],
      divisions: { name: 'Kamrup Division', code: 'AS-KAM-01' },
      sources: [
        { id: 'src-3', name: 'Brahmaputra Raw Intake Station', qr_code_id: 'AS-KAM-SRC-03', source_type: 'river_intake', is_verified: true },
        { id: 'src-4', name: 'Palasbari WTP Clariflocculator Outlet', qr_code_id: 'AS-KAM-SRC-04', source_type: 'wtp_outlet', is_verified: true },
      ]
    },
    {
      id: 'sch-3',
      division_id: divisions[0]?.id || 'div-1',
      scheme_code: 'PWSS-HAJ-03',
      name: 'Hajo Temple Complex Solar Mini PWSS',
      scheme_type: 'solar_mini_grid',
      village_coverage: ['Hajo Pilgrim Area', 'Pachariya GP'],
      divisions: { name: 'Kamrup Division', code: 'AS-KAM-01' },
      sources: [
        { id: 'src-5', name: 'Hajo Solar Borewell & Overhead Tank', qr_code_id: 'AS-KAM-SRC-05', source_type: 'public_tap_stand', is_verified: true }
      ]
    }
  ]

  const [schemes, setSchemes] = useState<Scheme[]>(
    initialSchemes.length > 0 ? initialSchemes : defaultSchemes
  )
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSchemeForSources, setSelectedSchemeForSources] = useState<Scheme | null>(null)

  // Form State
  const [schemeCode, setSchemeCode] = useState('')
  const [schemeName, setSchemeName] = useState('')
  const [schemeType, setSchemeType] = useState('groundwater')
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [villageInput, setVillageInput] = useState('')
  const [villages, setVillages] = useState<string[]>(['Rampur GP', 'Mirza'])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  function handleAddVillage(e: React.KeyboardEvent | React.MouseEvent) {
    if ('key' in e && e.key !== 'Enter') return
    e.preventDefault()
    if (villageInput.trim() && !villages.includes(villageInput.trim())) {
      setVillages([...villages, villageInput.trim()])
      setVillageInput('')
    }
  }

  function handleRemoveVillage(village: string) {
    setVillages(villages.filter(v => v !== village))
  }

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.scheme_code.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(s.village_coverage) && s.village_coverage.some((v: string) => v.toLowerCase().includes(search.toLowerCase())))

    const matchesType = typeFilter === 'all' || s.scheme_type === typeFilter
    return matchesSearch && matchesType
  })

  async function handleCreateScheme(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const finalCode = schemeCode.trim() || `PWSS-KAM-${Math.floor(100 + Math.random() * 900)}`

    try {
      const { data, error } = await supabase.from('schemes').insert({
        scheme_code: finalCode,
        name: schemeName,
        scheme_type: schemeType,
        division_id: divisionId || divisions[0]?.id || undefined,
        village_coverage: villages,
      }).select('*, divisions(name, code)').single()

      if (error) {
        // Fallback optimistic addition if local demo or RLS limitation
        const newLocalScheme: Scheme = {
          id: `sch-${Date.now()}`,
          scheme_code: finalCode,
          name: schemeName,
          scheme_type: schemeType,
          division_id: divisionId || divisions[0]?.id || 'div-1',
          village_coverage: villages,
          divisions: { name: divisions.find(d => d.id === divisionId)?.name || 'Kamrup Division' },
          sources: []
        }
        setSchemes([newLocalScheme, ...schemes])
        setIsModalOpen(false)
        resetForm()
      } else if (data) {
        setSchemes([data, ...schemes])
        setIsModalOpen(false)
        resetForm()
      }
    } catch {
      const newLocalScheme: Scheme = {
        id: `sch-${Date.now()}`,
        scheme_code: finalCode,
        name: schemeName,
        scheme_type: schemeType,
        division_id: divisionId || divisions[0]?.id || 'div-1',
        village_coverage: villages,
        divisions: { name: divisions.find(d => d.id === divisionId)?.name || 'Kamrup Division' },
        sources: []
      }
      setSchemes([newLocalScheme, ...schemes])
      setIsModalOpen(false)
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setSchemeCode('')
    setSchemeName('')
    setSchemeType('groundwater')
    setVillages(['Rampur GP'])
  }

  function getSourcesForScheme(schemeId: string): SchemeSource[] {
    const directSources = schemes.find(s => s.id === schemeId)?.sources
    if (directSources && directSources.length > 0) return directSources
    return allSources.filter(s => s.scheme_id === schemeId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
              Water Supply Schemes (PWSS Master)
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0151AF] border border-blue-200">
              JJM & Assam PHED
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage Piped Water Supply Schemes (PWSS), surface river intakes, village coverage, and connected water sources.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#014190] transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Scheme</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Schemes</span>
            <Building2 className="h-4 w-4 text-[#0151AF]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{schemes.length}</div>
          <div className="text-xs text-slate-500 mt-1">Kamrup PHED Division</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Groundwater PWSS</span>
            <Droplets className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            {schemes.filter(s => s.scheme_type === 'groundwater').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Deep aquifer borewells</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Surface Water Intakes</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-700">
            {schemes.filter(s => s.scheme_type === 'surface_water').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Brahmaputra river intakes & WTPs</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Villages Covered</span>
            <MapPin className="h-4 w-4 text-[#C99A3E]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {schemes.reduce((acc, s) => acc + (Array.isArray(s.village_coverage) ? s.village_coverage.length : 0), 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Revenue villages & Panchayats</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search schemes by name, code, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {SCHEME_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                typeFilter === t.value
                  ? 'bg-[#0151AF] text-white shadow-xs'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Directory Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#0151AF]" />
            <h2 className="text-sm font-bold text-slate-900">Registered Schemes Roster</h2>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {filteredSchemes.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50/50">
              <tr>
                <th className="px-6 py-3.5">Scheme Details</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Division</th>
                <th className="px-6 py-3.5">Village Coverage</th>
                <th className="px-6 py-3.5 text-center">Linked Sources</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSchemes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No water supply schemes found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSchemes.map((scheme) => {
                  const sourcesCount = getSourcesForScheme(scheme.id).length
                  const coverageList = Array.isArray(scheme.village_coverage) ? scheme.village_coverage : []

                  return (
                    <tr key={scheme.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{scheme.name}</div>
                        <div className="font-mono text-xs text-[#0151AF] mt-0.5">{scheme.scheme_code}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                          scheme.scheme_type === 'groundwater' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : scheme.scheme_type === 'surface_water'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {scheme.scheme_type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {scheme.divisions?.name || 'Kamrup Division'}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {coverageList.slice(0, 3).map((v: string, idx: number) => (
                            <span key={idx} className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                              {v}
                            </span>
                          ))}
                          {coverageList.length > 3 && (
                            <span className="text-[11px] font-semibold text-slate-500 self-center">
                              +{coverageList.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${
                          sourcesCount > 0 
                            ? 'bg-blue-50 text-[#0151AF] border border-blue-200' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sourcesCount} sources
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedSchemeForSources(scheme)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0151AF] hover:bg-blue-50 transition shadow-xs"
                        >
                          <span>View Sources</span>
                          <ChevronRight className="h-3.5 w-3.5" />
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

      {/* Add New Scheme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0151AF]" />
                <h3 className="text-base font-bold text-slate-900">Register New Water Scheme</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Scheme Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rampur Piped Water Supply Scheme"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Scheme Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PWSS-KAM-04"
                    value={schemeCode}
                    onChange={(e) => setSchemeCode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 font-mono focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Scheme Type
                  </label>
                  <select
                    value={schemeType}
                    onChange={(e) => setSchemeType(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
                  >
                    <option value="groundwater">Groundwater PWSS</option>
                    <option value="surface_water">Surface Water Intake</option>
                    <option value="solar_mini_grid">Solar Mini PWSS</option>
                    <option value="gravity_flow">Gravity Flow Scheme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Assam PHED Division
                </label>
                <select
                  value={divisionId}
                  onChange={(e) => setDivisionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
                >
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                  {divisions.length === 0 && <option value="div-1">Kamrup Division</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Village & Panchayat Coverage
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type village name and press enter..."
                    value={villageInput}
                    onChange={(e) => setVillageInput(e.target.value)}
                    onKeyDown={handleAddVillage}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm text-slate-900 focus:border-[#0151AF] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0151AF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddVillage}
                    className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {villages.map((v, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-medium text-[#0151AF]"
                    >
                      <span>{v}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVillage(v)}
                        className="text-blue-400 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#014190] disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Register Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Linked Sources Drawer / Slide-Over Modal */}
      {selectedSchemeForSources && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedSchemeForSources.name}
                  </h3>
                  <div className="font-mono text-xs text-[#0151AF] mt-0.5">
                    {selectedSchemeForSources.scheme_code}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSchemeForSources(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Connected Water Sources ({getSourcesForScheme(selectedSchemeForSources.id).length})
                </div>

                <div className="space-y-2">
                  {getSourcesForScheme(selectedSchemeForSources.id).length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                      No water sources linked to this scheme yet. Register sources in the Water Sources module and select this scheme.
                    </div>
                  ) : (
                    getSourcesForScheme(selectedSchemeForSources.id).map((src) => (
                      <div
                        key={src.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900">{src.name}</div>
                          <div className="font-mono text-[11px] text-[#0151AF] mt-0.5">{src.qr_code_id}</div>
                          <div className="text-[10px] text-slate-500 capitalize mt-0.5">
                            {src.source_type.replace('_', ' ')}
                          </div>
                        </div>

                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Verified
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button
                onClick={() => setSelectedSchemeForSources(null)}
                className="w-full rounded-lg bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

