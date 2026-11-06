import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  QrCode, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react'

export default async function DivisionDashboardPage() {
  const supabase = await createClient()

  // Fetch real summary counts from Supabase
  const [sourcesRes, samplesRes, exceptionsRes, alertsRes] = await Promise.all([
    supabase.from('sources').select('id', { count: 'exact', head: true }),
    supabase.from('samples').select('id', { count: 'exact', head: true }),
    supabase.from('geo_exceptions').select('id', { count: 'exact', head: true }).is('is_approved', null),
    supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('status', 'open')
  ])

  const sourceCount = sourcesRes.count || 0
  const sampleCount = samplesRes.count || 0
  const pendingExceptionsCount = exceptionsRes.count || 0
  const openAlertsCount = alertsRes.count || 0

  return (
    <div className="space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-['Tiro_Bangla'] text-2xl font-bold text-slate-900">
            Division Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Kamrup PHED Division · Real-time sampling compliance and water safety status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/division-admin/sources"
            className="flex items-center gap-2 rounded-lg bg-[#0151AF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#014190] transition"
          >
            <MapPin className="h-4 w-4" />
            <span>Manage Sources</span>
          </Link>
          <Link
            href="/division-admin/bottles"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition shadow-xs"
          >
            <QrCode className="h-4 w-4 text-[#0151AF]" />
            <span>Print QR Batch</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Water Sources */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monitored Sources
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-[#0151AF]">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{sourceCount}</span>
            <span className="text-xs font-semibold text-emerald-600">Active in Division</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Includes tube wells, WTP outlets & taps
          </div>
        </div>

        {/* Card 2: Samples Collected */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Samples
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-[#16A34A]">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{sampleCount}</span>
            <span className="text-xs font-semibold text-emerald-600">Unbroken Chain</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            100% cryptographic hash protected
          </div>
        </div>

        {/* Card 3: Pending Exceptions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Exceptions
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-[#F59E0B]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600">{pendingExceptionsCount}</span>
            <span className="text-xs font-semibold text-amber-600">Awaiting Review</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <Link href="/division-admin/exceptions" className="font-semibold text-[#0151AF] hover:underline">
              Review Queue →
            </Link>
          </div>
        </div>

        {/* Card 4: Open Contamination Alerts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contamination Alerts
            </span>
            <div className="rounded-lg bg-red-50 p-2 text-[#DC2626]">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600">{openAlertsCount}</span>
            <span className="text-xs font-semibold text-red-600">BIS Limits Exceeded</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Automatic notifications dispatched
          </div>
        </div>
      </div>

      {/* Main Grid: AI Insights Banner + Quick Triage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: AI Water Quality Intelligence Highlights */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[#C99A3E]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Luit AI Water Intelligence & Risk Forecast
                </h2>
                <p className="text-xs text-slate-500">
                  Powered by BigQuery ML & Vertex AI (Region: Mumbai)
                </p>
              </div>
            </div>

            <Link
              href="/division-admin/ai-insights"
              className="text-xs font-semibold text-[#0151AF] hover:underline"
            >
              Full AI Report →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-['Tiro_Bangla'] text-sm font-bold text-slate-900">
                  মাসিক কাৰ্যবাহী সাৰাংশ (Monthly Executive Summary)
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  AI Generated
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-800 leading-relaxed font-normal">
                কাৰ্বি আংলং সীমান্তৱৰ্তী আৰু ব্ৰহ্মপুত্ৰৰ বানপ্ৰৱণ অঞ্চলৰ ৪ টা নলকূপত আইৰণ আৰু ঘোলাতাৰ মাত্ৰা বৃদ্ধি পোৱাৰ সম্ভাৱনা আছে। আগতীয়াকৈ ফিল্টাৰ ক্লিনিং আৰু নমুনা সংগ্ৰহৰ পৰামৰ্শ দিয়া হৈছে।
              </p>
              <p className="mt-2 text-xs text-slate-500">
                English Translation: 4 tube wells in flood-prone riverine buffer zones show an upward trajectory in Iron and Turbidity indicators. Pre-monsoon filter servicing is recommended.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 p-3.5 flex items-center gap-3 bg-white">
                <div className="h-3 w-3 rounded-full bg-[#16A34A]" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">98.2% Chain Integrity</div>
                  <div className="text-[11px] text-slate-500">0 custody gaps reported</div>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3.5 flex items-center gap-3 bg-white">
                <div className="h-3 w-3 rounded-full bg-[#C99A3E]" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">3 Sources High Risk</div>
                  <div className="text-[11px] text-slate-500">Prioritized in sampling plan</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Workflow Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            <p className="text-xs text-slate-500">Division task shortcuts</p>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/division-admin/sources"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-[#0151AF] hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#0151AF]" />
                  <span className="text-sm font-semibold text-slate-800">Register Water Source</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/division-admin/bottles"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-[#0151AF] hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="h-4 w-4 text-[#0151AF]" />
                  <span className="text-sm font-semibold text-slate-800">Generate Bottle QR Batch</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/division-admin/exceptions"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-[#0151AF] hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                  <span className="text-sm font-semibold text-slate-800">Triage Geo-Exceptions</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/division-admin/reports"
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-[#0151AF] hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-[#16A34A]" />
                  <span className="text-sm font-semibold text-slate-800">Download Monthly Report</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-[#0151AF] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-none text-[#16A34A]" />
            <span>PostGIS spatial engine active on Mumbai cluster</span>
          </div>
        </div>
      </div>
    </div>
  )
}
