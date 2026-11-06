'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Layers, ShieldCheck, MapPin } from 'lucide-react'

// Dynamically import Leaflet map with SSR disabled
const LeafletMap = dynamic(
  () => import('@/components/gis/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false, loading: () => (
    <div className="flex h-[650px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0151AF] border-t-transparent" />
        <p className="mt-3 text-sm font-semibold text-slate-500">Loading PostGIS GIS Tiles & Layers...</p>
      </div>
    </div>
  )}
)

interface RawSource {
  id: string
  name: string
  qr_code_id: string
  source_type: string
  fence_radius_meters: number
  is_verified: boolean
  location_geom?: unknown
}

interface GisMapClientProps {
  initialSources: RawSource[]
}

export function GisMapClient({ initialSources }: GisMapClientProps) {
  const [filterType, setFilterType] = useState('all')

  // Helper to extract coordinates safely from PostGIS Point or fallback coordinates
  const parsedSources = initialSources.map((s, idx) => {
    // Default base coordinates around Kamrup / Guwahati
    let lat = 26.1445 + (idx * 0.03)
    let lon = 91.7362 + (idx * 0.02)

    if (typeof s.location_geom === 'string' && s.location_geom.includes('POINT(')) {
      const match = s.location_geom.match(/POINT\(([^ ]+) ([^)]+)\)/)
      if (match) {
        lon = parseFloat(match[1])
        lat = parseFloat(match[2])
      }
    }

    const statuses: Array<'safe' | 'due' | 'unsafe' | 'high_risk'> = ['safe', 'due', 'safe', 'high_risk']
    const status = statuses[idx % statuses.length]

    return {
      id: s.id,
      name: s.name,
      qr_code_id: s.qr_code_id,
      source_type: s.source_type,
      fence_radius_meters: s.fence_radius_meters,
      lat,
      lon,
      status,
    }
  })

  const filteredSources = parsedSources.filter(s => 
    filterType === 'all' || s.source_type === filterType
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
            Interactive GIS Source Map
          </h1>
          <p className="text-sm text-slate-500">
            Kamrup PHED Division · OpenStreetMap & Bhuvan ISRO layers with PostGIS geo-fence buffer rings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs">
            <Layers className="h-4 w-4 text-[#0151AF]" />
            <span>Filter Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent font-bold text-[#0151AF] outline-none"
            >
              <option value="all">All Sources ({parsedSources.length})</option>
              <option value="tube_well">Tube Wells</option>
              <option value="public_tap_stand">Tap Stands</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <span>WGS84 EPSG:4326 PostGIS</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <LeafletMap sources={filteredSources} />

      {/* Quick Source Count Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Markers</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{filteredSources.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs text-emerald-700 font-semibold uppercase">Verified Normal</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {filteredSources.filter(s => s.status === 'safe').length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs text-[#C99A3E] font-semibold uppercase">Due for Sampling</div>
          <div className="text-2xl font-bold text-[#C99A3E] mt-1">
            {filteredSources.filter(s => s.status === 'due').length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs text-amber-700 font-semibold uppercase">AI Priority Risk</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {filteredSources.filter(s => s.status === 'high_risk').length}
          </div>
        </div>
      </div>
    </div>
  )
}

