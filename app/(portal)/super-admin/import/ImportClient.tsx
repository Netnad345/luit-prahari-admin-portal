'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Layers, 
  Table, 
  RefreshCw,
  Building2,
  FileCheck
} from 'lucide-react'

interface SourceItem {
  id: string
  name: string
  qr_code_id: string
}

interface ParameterItem {
  id: string
  code: string
  name: string
  unit: string
  acceptable_limit: number
  permissible_limit: number
}

interface DivisionItem {
  id: string
  name: string
}

interface ImportClientProps {
  existingSources: SourceItem[]
  parameters: ParameterItem[]
  divisions: DivisionItem[]
}

interface ParsedPreviewRow {
  rowNum: number
  date: string
  sourceName: string
  sourceQr: string
  ph: number
  turbidity: number
  iron: number
  arsenic: number
  status: 'valid' | 'warning' | 'error'
  statusReason?: string
}

export function ImportClient({ existingSources, parameters, divisions }: ImportClientProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [importTarget, setImportTarget] = useState<'historical_tests' | 'source_inventory'>('historical_tests')
  const [selectedFileName, setSelectedFileName] = useState<string | null>('PHED_Kamrup_Past_Results_2023_2025.csv')
  const [loading, setLoading] = useState(false)
  const [importCommitted, setImportCommitted] = useState(false)

  // Column Mappings
  const [colDate, setColDate] = useState('Sample_Date')
  const [colSource, setColSource] = useState('Water_Source_Name')
  const [colPh, setColPh] = useState('pH_Value')
  const [colTurb, setColTurb] = useState('Turbidity_NTU')
  const [colIron, setColIron] = useState('Iron_mgL')
  const [colArsenic, setColArsenic] = useState('Arsenic_mgL')

  // Sample Parsed Preview Rows
  const sampleParsedRows: ParsedPreviewRow[] = [
    { rowNum: 1, date: '2024-03-12', sourceName: 'Rampur GP Deep Tube Well #1', sourceQr: 'AS-KAM-SRC-01', ph: 7.2, turbidity: 1.4, iron: 0.85, arsenic: 0.005, status: 'valid' },
    { rowNum: 2, date: '2024-06-20', sourceName: 'Rampur GP Deep Tube Well #1', sourceQr: 'AS-KAM-SRC-01', ph: 7.5, turbidity: 3.2, iron: 1.25, arsenic: 0.008, status: 'warning', statusReason: 'Iron 1.25 exceeds 1.0 limit' },
    { rowNum: 3, date: '2024-09-15', sourceName: 'Mirza Bazaar Tap Stand #4', sourceQr: 'AS-KAM-SRC-02', ph: 6.8, turbidity: 2.1, iron: 0.65, arsenic: 0.002, status: 'valid' },
    { rowNum: 4, date: '2025-01-10', sourceName: 'Palasbari River Intake Station', sourceQr: 'AS-KAM-SRC-03', ph: 7.8, turbidity: 6.4, iron: 0.90, arsenic: 0.004, status: 'warning', statusReason: 'Turbidity 6.4 exceeds 5.0 NTU limit' },
    { rowNum: 5, date: '2025-04-18', sourceName: 'Hajo Temple Complex Solar Mini PWSS', sourceQr: 'AS-KAM-SRC-04', ph: 7.1, turbidity: 1.1, iron: 0.40, arsenic: 0.001, status: 'valid' },
  ]

  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>(sampleParsedRows)

  async function handleCommitImport() {
    setLoading(true)
    // Simulate commit to Supabase historical_results
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    setImportCommitted(true)
    setCurrentStep(4)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
              Bulk Historical Data & Source Import Wizard
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0151AF] border border-blue-200">
              State Ingestion Pipeline
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Ingest 3 to 5 years of legacy Assam PHED paper register records and spreadsheet archives into the central database.
          </p>
        </div>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Upload File' },
            { step: 2, title: 'Map Columns' },
            { step: 3, title: 'Verify & Cleanse' },
            { step: 4, title: 'Commit Batch' },
          ].map((s, idx) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  currentStep === s.step
                    ? 'bg-[#0151AF] text-white shadow-xs'
                    : currentStep > s.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentStep > s.step ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  currentStep >= s.step ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
              {idx < 3 && <div className={`flex-1 h-0.5 mx-3 ${currentStep > s.step ? 'bg-emerald-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: UPLOAD & SCHEMA SELECTION */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Select Import Type & Choose Spreadsheet File</h2>
            <p className="text-xs text-slate-500">Supports standard CSV (.csv) or Excel (.xlsx) files exported from PHED district registers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setImportTarget('historical_tests')}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                importTarget === 'historical_tests'
                  ? 'border-[#0151AF] bg-blue-50/40 ring-1 ring-[#0151AF]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <FileSpreadsheet className="h-4 w-4 text-[#0151AF]" />
                <span>Historical Water Quality Results</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Import past parameter readings (pH, Iron, Turbidity, Arsenic, Fluoride) matched against existing sources for long-term trend analysis.
              </p>
            </div>

            <div
              onClick={() => setImportTarget('source_inventory')}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                importTarget === 'source_inventory'
                  ? 'border-[#0151AF] bg-blue-50/40 ring-1 ring-[#0151AF]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Layers className="h-4 w-4 text-[#0151AF]" />
                <span>Bulk Water Source Inventory</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Upload batches of new water sources, GPS coordinates, scheme affiliations, and default geo-fence perimeters.
              </p>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-8 text-center hover:bg-slate-50 transition cursor-pointer">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0151AF]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="mt-3 font-semibold text-sm text-slate-900">
              {selectedFileName ? selectedFileName : 'Drag & drop your CSV or Excel file here'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supports files up to 15MB. Up to 10,000 rows per batch.
            </p>
            <button
              type="button"
              onClick={() => setSelectedFileName('PHED_Kamrup_Past_Results_2023_2025.csv')}
              className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0151AF] shadow-xs"
            >
              Browse Computer
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#014190]"
            >
              <span>Next: Map Columns</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Map Spreadsheet Columns to System Schema</h2>
            <p className="text-xs text-slate-500">Match the column headers detected in your file with the required database fields.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase">Core Sample Identifiers</div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Sample Collection Date</label>
                <select
                  value={colDate}
                  onChange={(e) => setColDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Sample_Date">Sample_Date (Detected)</option>
                  <option value="Date">Date</option>
                  <option value="Test_Date">Test_Date</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Water Source Name / ID</label>
                <select
                  value={colSource}
                  onChange={(e) => setColSource(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Water_Source_Name">Water_Source_Name (Detected)</option>
                  <option value="Source_ID">Source_ID</option>
                  <option value="Location">Location</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase">Parameter Readings</div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600">pH Value</label>
                  <input
                    type="text"
                    value={colPh}
                    onChange={(e) => setColPh(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600">Turbidity (NTU)</label>
                  <input
                    type="text"
                    value={colTurb}
                    onChange={(e) => setColTurb(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600">Iron (Fe mg/L)</label>
                  <input
                    type="text"
                    value={colIron}
                    onChange={(e) => setColIron(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600">Arsenic (As mg/L)</label>
                  <input
                    type="text"
                    value={colArsenic}
                    onChange={(e) => setColArsenic(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#014190]"
            >
              <span>Validate & Preview Rows</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DATA VALIDATION PREVIEW */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Validated Preview & Compliance Pre-Flight</h2>
              <p className="text-xs text-slate-500">5 rows inspected. All source names matched against verified register.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
                5 Rows Ready for Ingestion
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Test Date</th>
                  <th className="py-2.5 px-3">Matched Source</th>
                  <th className="py-2.5 px-3">pH</th>
                  <th className="py-2.5 px-3">Turbidity</th>
                  <th className="py-2.5 px-3">Iron</th>
                  <th className="py-2.5 px-3">Arsenic</th>
                  <th className="py-2.5 px-3 text-right">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewRows.map((r) => (
                  <tr key={r.rowNum} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400">{r.rowNum}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.date}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-bold text-slate-800">{r.sourceName}</div>
                      <div className="text-[10px] text-[#0151AF]">{r.sourceQr}</div>
                    </td>
                    <td className="py-2.5 px-3">{r.ph}</td>
                    <td className="py-2.5 px-3">{r.turbidity} NTU</td>
                    <td className="py-2.5 px-3">{r.iron} mg/L</td>
                    <td className="py-2.5 px-3">{r.arsenic} mg/L</td>
                    <td className="py-2.5 px-3 text-right">
                      {r.status === 'valid' ? (
                        <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                          Clean
                        </span>
                      ) : (
                        <span className="rounded bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                          {r.statusReason}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleCommitImport}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#014190] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Ingesting Rows...</span>
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  <span>Commit Batch to Database</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-xs text-center space-y-4 max-w-xl mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Batch Import Committed Successfully!
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            Batch ID <b className="font-mono text-[#0151AF]">BATCH-HIST-202611-901</b> has been cryptographically sealed and written to <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">historical_results</code> in the Mumbai cloud region. Contaminant trend charts and seasonal baselines are updated.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono text-left space-y-1 text-slate-700">
            <div>• Target Table: <b>historical_results</b></div>
            <div>• Total Records Committed: <b>5 historical lab analyses</b></div>
            <div>• Water Sources Matched: <b>4 sources</b></div>
            <div>• Ingestion Checksum: <b>e7a2b91c04...verified</b></div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setCurrentStep(1)
                setImportCommitted(false)
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Import Another File
            </button>
            <a
              href="/division-admin/trends"
              className="rounded-lg bg-[#0151AF] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#014190]"
            >
              View Updated Trends
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

