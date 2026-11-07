'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  QrCode,
  AlertTriangle,
} from 'lucide-react'

interface JalamitraRecord {
  id: string
  full_name: string
  phone_number: string
  aadhaar_last_4: string
  subdivision_name: string
  block_name: string
  panchayat_name: string
  assigned_villages: string[]
  id_proof_url?: string
  profile_photo_url?: string
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  sampler_short_code?: string | null
  created_at: string
}

interface ApprovalsClientProps {
  initialList: JalamitraRecord[]
}

export function ApprovalsClient({ initialList }: ApprovalsClientProps) {
  const [list, setList] = useState<JalamitraRecord[]>(initialList)
  const [selectedDossier, setSelectedDossier] = useState<JalamitraRecord | null>(initialList[0] || null)
  const [activeTab, setActiveTab] = useState<'PENDING_APPROVAL' | 'APPROVED' | 'ALL'>('PENDING_APPROVAL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  // Rejection Modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const supabase = createClient()

  // Filter list
  const filteredList = list.filter((item) => {
    const matchesTab = activeTab === 'ALL' ? true : item.status === activeTab
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_number.includes(searchQuery) ||
      item.panchayat_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const pendingCount = list.filter((i) => i.status === 'PENDING_APPROVAL').length
  const approvedCount = list.filter((i) => i.status === 'APPROVED').length

  // 1-Click Approve Action
  const handleApprove = async (profile: JalamitraRecord) => {
    setLoadingId(profile.id)
    try {
      const generatedPrefix = 'JM' + Math.floor(10 + Math.random() * 89)

      const { error } = await supabase
        .from('jalamitra_profiles')
        .update({
          status: 'APPROVED',
          sampler_short_code: profile.sampler_short_code || generatedPrefix,
          approved_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) {
        console.warn('Supabase update note:', error.message)
      }

      // Optimistic update
      setList((prev) =>
        prev.map((item) =>
          item.id === profile.id
            ? { ...item, status: 'APPROVED', sampler_short_code: item.sampler_short_code || generatedPrefix }
            : item
        )
      )

      if (selectedDossier?.id === profile.id) {
        setSelectedDossier((prev) =>
          prev ? { ...prev, status: 'APPROVED', sampler_short_code: prev.sampler_short_code || generatedPrefix } : null
        )
      }

      alert(`âœ… Authorization Granted! Jalamitra ${profile.full_name} is now approved with Sampler Code #${profile.sampler_short_code || generatedPrefix}. Autonomous QR minting is active.`)
    } catch (err: any) {
      alert(`Approval error: ${err.message}`)
    } finally {
      setLoadingId(null)
    }
  }

  // Reject Action
  const handleRejectConfirm = async () => {
    if (!selectedDossier || !rejectionReason.trim()) {
      alert('Please provide a specific reason for rejection.')
      return
    }

    setLoadingId(selectedDossier.id)
    try {
      await supabase
        .from('jalamitra_profiles')
        .update({
          status: 'REJECTED',
          rejection_reason: rejectionReason,
        })
        .eq('id', selectedDossier.id)

      setList((prev) =>
        prev.map((item) =>
          item.id === selectedDossier.id ? { ...item, status: 'REJECTED' } : item
        )
      )

      setSelectedDossier((prev) => (prev ? { ...prev, status: 'REJECTED' } : null))
      setRejectionModalOpen(false)
      setRejectionReason('')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Jalamitra KYC Approval Desk</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              One-Time Gatekeeper
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Authorize frontline women water samplers and scheme operators once. After approval, samplers autonomously generate QR codes on their mobile phones for bottles and vials with zero administrative bottlenecks.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-center">
            <span className="text-xs font-semibold text-amber-700 block">Pending Review</span>
            <span className="text-xl font-extrabold text-amber-800">{pendingCount}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-center">
            <span className="text-xs font-semibold text-emerald-700 block">Approved Fleet</span>
            <span className="text-xl font-extrabold text-emerald-800">{approvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('PENDING_APPROVAL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'PENDING_APPROVAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'APPROVED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Authorized Fleet ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Applications ({list.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone, GP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Grid: Application Queue + Dossier Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-sm">
              Application Dossiers ({filteredList.length})
            </h3>
            <span className="text-xs text-slate-400">Click row to review complete credentials</span>
          </div>

          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShieldCheck className="mx-auto h-12 w-12 text-slate-300 mb-2" />
              <p className="text-sm">No applications found matching the current filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedDossier(item)}
                  className={`p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                    selectedDossier?.id === item.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {item.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{item.full_name}</h4>
                        {item.status === 'APPROVED' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700">
                            #{item.sampler_short_code || 'APPROVED'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-700">
                            PENDING
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Phone size={12} /> {item.phone_number}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.panchayat_name}</span>
                        <span className="hidden sm:inline text-slate-400">Â· {item.block_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDossier(item)
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <Eye size={12} /> Inspect
                    </button>
                    {item.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApprove(item)
                        }}
                        disabled={loadingId === item.id}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1"
                      >
                        <Check size={12} /> 1-Click Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Dossier Inspector */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Candidate KYC Dossier</h3>
            {selectedDossier?.status === 'APPROVED' && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 size={12} /> Authorized
              </span>
            )}
          </div>

          {selectedDossier ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 font-bold text-xl flex items-center justify-center mx-auto mb-2 border border-blue-200">
                  {selectedDossier.full_name.slice(0, 2).toUpperCase()}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{selectedDossier.full_name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aadhaar (Last 4): <span className="font-mono font-bold text-slate-700">XXXX-XXXX-{selectedDossier.aadhaar_last_4}</span>
                </p>
                {selectedDossier.sampler_short_code && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                    <QrCode size={13} />
                    <span>Prefix: #{selectedDossier.sampler_short_code}</span>
                  </div>
                )}
              </div>

              {/* Geographic Jurisdictions */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Sub-Division:</span>
                  <span className="font-semibold text-slate-800">{selectedDossier.subdivision_name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Development Block:</span>
                  <span className="font-semibold text-slate-800">{selectedDossier.block_name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Gaon Panchayat (GP):</span>
                  <span className="font-semibold text-slate-800">{selectedDossier.panchayat_name}</span>
                </div>
                <div className="py-1.5">
                  <span className="text-slate-500 block mb-1">Assigned Village Habitations:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDossier.assigned_villages.map((v) => (
                      <span key={v} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zero-Intervention Info */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-blue-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles size={13} /> Autonomous Minting Rights
                </div>
                <p className="text-blue-700 leading-relaxed">
                  Upon approval, this Jalamitra will be granted direct authority to mint QR stickers on their mobile phone for 15ml test tubes and 500ml sample bottles without needing division approval for each batch.
                </p>
              </div>

              {/* Action Buttons */}
              {selectedDossier.status === 'PENDING_APPROVAL' && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setRejectionModalOpen(true)}
                    className="flex-1 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedDossier)}
                    disabled={loadingId === selectedDossier.id}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center justify-center gap-1 transition"
                  >
                    <Check size={14} /> 1-Click Authorize
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">Select an application from the queue to view dossier.</p>
          )}
        </div>
      </div>

      {/* Rejection Remarks Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reject Application</h3>
            <p className="text-xs text-slate-500 mb-4">
              Please state why this application is being rejected. This feedback will be sent to the Jalamitra's app so they can resubmit corrected documentation.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Aadhaar mismatch with departmental records / Village jurisdiction outside Mirza Sub-Division..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
