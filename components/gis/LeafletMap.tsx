'use client'

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

interface MapSource {
  id: string
  name: string
  qr_code_id: string
  source_type: string
  fence_radius_meters: number
  lat: number
  lon: number
  status: 'safe' | 'due' | 'unsafe' | 'high_risk'
}

interface LeafletMapProps {
  sources: MapSource[]
}

export function LeafletMap({ sources }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerGroupRef = useRef<any>(null)

  // 1. Initialize Map Base Instance (Runs once on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return
    let isMounted = true

    import('leaflet').then((L) => {
      if (!isMounted || mapInstanceRef.current) return

      // Default focus on Guwahati / Kamrup Assam
      const map = L.map(mapContainerRef.current!).setView([26.1445, 91.7362], 11)
      mapInstanceRef.current = map

      // OpenStreetMap Tiles (Clean CartoDB Positron / OSM)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Bhuvan ISRO Base',
        maxZoom: 19,
      }).addTo(map)

      // Dedicated layer group for reactive marker updates
      const layerGroup = L.layerGroup().addTo(map)
      layerGroupRef.current = layerGroup
    })

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        layerGroupRef.current = null
      }
    }
  }, [])

  // 2. Reactive Marker & Buffer Update (Runs whenever sources prop changes)
  useEffect(() => {
    let isMounted = true

    import('leaflet').then((L) => {
      if (!isMounted) return

      // If map instance is not ready yet, wait briefly
      const checkAndRender = () => {
        if (!layerGroupRef.current || !mapInstanceRef.current) {
          setTimeout(checkAndRender, 100)
          return
        }

        const layerGroup = layerGroupRef.current
        layerGroup.clearLayers()

        sources.forEach((src) => {
          const color = 
            src.status === 'safe' ? '#16A34A' :
            src.status === 'due' ? '#C99A3E' :
            src.status === 'high_risk' ? '#F59E0B' : '#DC2626'

          // Geo-fence buffer circle
          L.circle([src.lat, src.lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.15,
            radius: src.fence_radius_meters,
            weight: 1.5,
            dashArray: '4, 4'
          }).addTo(layerGroup)

          // Custom HTML marker pin
          const customIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); color: white; font-weight: bold; font-size: 11px;">
                ${src.source_type === 'tube_well' ? 'TW' : 'TAP'}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          })

          const marker = L.marker([src.lat, src.lon], { icon: customIcon }).addTo(layerGroup)

          marker.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px;">
              <div style="font-size: 10px; font-weight: bold; color: #64748B; text-transform: uppercase;">${src.qr_code_id}</div>
              <div style="font-size: 13px; font-weight: bold; color: #0F172A; margin-top: 2px;">${src.name}</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 4px;">
                Type: <b>${src.source_type.replace('_', ' ')}</b><br/>
                Geo-Fence Radius: <b>${src.fence_radius_meters}m</b>
              </div>
              <div style="margin-top: 6px; padding: 2px 6px; border-radius: 4px; background: ${color}18; color: ${color}; font-size: 10px; font-weight: bold; display: inline-block;">
                Status: ${src.status.toUpperCase()}
              </div>
            </div>
          `)
        })
      }

      checkAndRender()
    })

    return () => {
      isMounted = false
    }
  }, [sources])

  return (
    <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="h-full w-full z-10" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-20 rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-md backdrop-blur-xs text-xs space-y-1.5 text-slate-800">
        <div className="font-bold text-slate-900 mb-1">Source Status Legend</div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#16A34A]" />
          <span>Geo-Verified & Safe</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#C99A3E]" />
          <span>Due for Testing (&gt;14 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#DC2626]" />
          <span>Water Quality Alert (Contaminated)</span>
        </div>
      </div>
    </div>
  )
}
