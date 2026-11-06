'use client'

import React, { useState } from 'react'
import { TrendingUp, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react'

interface Parameter {
  id: string
  code: string
  name: string
  unit: string
  acceptable_limit: number
  permissible_limit: number
}

interface SourceOption {
  id: string
  name: string
  qr_code_id: string
}

interface TestResultItem {
  id: string
  tested_value: number
  compliance: string
  tested_at: string
  parameters?: Parameter
  samples?: {
    device_captured_at: string
    sources?: {
      name: string
      qr_code_id: string
    }
  }
}

interface TrendsClientProps {
  parameters: Parameter[]
  testResults: TestResultItem[]
  sources: SourceOption[]
}

export function TrendsClient({ parameters, testResults, sources }: TrendsClientProps) {
  const [selectedParamCode, setSelectedParamCode] = useState(parameters[0]?.code || 'FE')
  const [selectedSourceId, setSelectedSourceId] = useState('all')

  const currentParam = parameters.find(p => p.code === selectedParamCode) || parameters[0]

  // Demo trend points across seasons
  const trendPoints = [
    { month: 'Jan', val: currentParam?.code === 'FE' ? 0.42 : currentParam?.code === 'TURB' ? 1.2 : 6.8, season: 'Winter' },
    { month: 'Feb', val: currentParam?.code === 'FE' ? 0.48 : currentParam?.code === 'TURB' ? 1.4 : 6.9, season: 'Winter' },
    { month: 'Mar', val: currentParam?.code === 'FE' ? 0.65 : currentParam?.code === 'TURB' ? 1.8 : 7.1, season: 'Pre-Monsoon' },
    { month: 'Apr', val: currentParam?.code === 'FE' ? 0.78 : currentParam?.code === 'TURB' ? 2.5 : 7.2, season: 'Pre-Monsoon' },
    { month: 'May', val: currentParam?.code === 'FE' ? 0.92 : currentParam?.code === 'TURB' ? 3.4 : 7.3, season: 'Pre-Monsoon' },
    { month: 'Jun', val: currentParam?.code === 'FE' ? 1.25 : currentParam?.code === 'TURB' ? 4.8 : 7.6, season: 'Monsoon' },
    { month: 'Jul', val: currentParam?.code === 'FE' ? 1.40 : currentParam?.code === 'TURB' ? 5.6 : 7.8, season: 'Monsoon' },
    { month: 'Aug', val: currentParam?.code === 'FE' ? 1.35 : currentParam?.code === 'TURB' ? 5.1 : 7.7, season: 'Monsoon' },
    { month: 'Sep', val: currentParam?.code === 'FE' ? 1.10 : currentParam?.code === 'TURB' ? 3.9 : 7.5, season: 'Post-Monsoon' },
    { month: 'Oct', val: currentParam?.code === 'FE' ? 0.85 : currentParam?.code === 'TURB' ? 2.8 : 7.4, season: 'Post-Monsoon' },
    { month: 'Nov', val: currentParam?.code === 'FE' ? 0.60 : currentParam?.code === 'TURB' ? 1.9 : 7.1, season: 'Post-Monsoon' },
  ]

  const maxVal = Math.max(...trendPoints.map(p => p.val), Number(currentParam?.permissible_limit || 2)) * 1.2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
            Water Quality Trends & Seasonal Variance
          </h1>
          <p className="text-sm text-slate-500">
            Track temporal degradation patterns, pre-monsoon vs monsoon fluctuations, and statutory BIS IS 10500 compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs">
            <TrendingUp className="h-4 w-4 text-[#0151AF]" />
            <span>Parameter:</span>
            <select
              value={selectedParamCode}
              onChange={(e) => setSelectedParamCode(e.target.value)}
              className="bg-transparent font-bold text-[#0151AF] outline-none"
            >
              {parameters.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Trend Chart Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {currentParam?.name} 12-Month Temporal Trajectory
            </h2>
            <p className="text-xs text-slate-500">
              Acceptable Limit: {currentParam?.acceptable_limit} {currentParam?.unit} · Permissible: {currentParam?.permissible_limit} {currentParam?.unit}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0151AF]" />
              <span className="text-slate-700">Observed Mean</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 bg-[#16A34A]" />
              <span className="text-slate-700">Acceptable ({currentParam?.acceptable_limit})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 bg-[#DC2626]" />
              <span className="text-slate-700">Permissible ({currentParam?.permissible_limit})</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Trend Visualization */}
        <div className="mt-8 h-72 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="0" y1="220" x2="800" y2="220" stroke="#E2E8F0" />

            {/* Permissible Limit Line (Red) */}
            {currentParam && (
              <line 
                x1="0" 
                y1={220 - ((Number(currentParam.permissible_limit) / maxVal) * 200)} 
                x2="800" 
                y2={220 - ((Number(currentParam.permissible_limit) / maxVal) * 200)} 
                stroke="#DC2626" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />
            )}

            {/* Acceptable Limit Line (Green) */}
            {currentParam && (
              <line 
                x1="0" 
                y1={220 - ((Number(currentParam.acceptable_limit) / maxVal) * 200)} 
                x2="800" 
                y2={220 - ((Number(currentParam.acceptable_limit) / maxVal) * 200)} 
                stroke="#16A34A" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />
            )}

            {/* Trend Polyline */}
            <polyline
              fill="none"
              stroke="#0151AF"
              strokeWidth="3"
              points={trendPoints.map((pt, i) => {
                const x = (i / (trendPoints.length - 1)) * 760 + 20
                const y = 220 - ((pt.val / maxVal) * 200)
                return `${x},${y}`
              }).join(' ')}
            />

            {/* Trend Points */}
            {trendPoints.map((pt, i) => {
              const x = (i / (trendPoints.length - 1)) * 760 + 20
              const y = 220 - ((pt.val / maxVal) * 200)
              const isOver = pt.val > Number(currentParam?.permissible_limit || 999)

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isOver ? "5.5" : "4"}
                    fill={isOver ? "#DC2626" : "#0151AF"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isOver ? "#DC2626" : "#64748B"}
                    fontWeight="bold"
                  >
                    {pt.val.toFixed(2)}
                  </text>
                  <text
                    x={x}
                    y={235}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748B"
                    fontWeight="500"
                  >
                    {pt.month}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Monsoon Spike Notice: Heavy precipitation in June–August increases turbidity and iron leeching in shallow tube wells.</span>
          </div>
          <span className="font-bold text-[#0151AF]">Peak Month: July (5.6 NTU)</span>
        </div>
      </div>

      {/* 3 Season Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Pre-Monsoon (Mar - May)</span>
            <Calendar className="h-4 w-4 text-[#0151AF]" />
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">Normal Stability</div>
          <p className="mt-1 text-xs text-slate-500">
            Average compliance rate: <b>94.8%</b>. Stable water table with low turbidity.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-700">Monsoon (Jun - Aug)</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-red-600">High Degradation</div>
          <p className="mt-1 text-xs text-slate-500">
            Compliance rate drops to <b>82.1%</b>. Riverine runoff causes bacteriological & turbidity spikes.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-700">Post-Monsoon (Sep - Nov)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">Settling & Recovery</div>
          <p className="mt-1 text-xs text-slate-500">
            Compliance recovers to <b>91.5%</b>. Residual chlorine effectiveness stabilizes across PWSS taps.
          </p>
        </div>
      </div>
    </div>
  )
}

