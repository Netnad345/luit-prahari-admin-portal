'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { 
  LayoutDashboard, 
  MapPin, 
  Building2,
  Calendar,
  QrCode, 
  AlertTriangle, 
  ShieldCheck, 
  TestTubes, 
  Map, 
  TrendingUp, 
  FileSpreadsheet, 
  Users, 
  UserCheck,
  UploadCloud, 
  Sparkles,
  Droplets,
  Building,
  CheckCircle2,
  LogOut,
  type LucideIcon 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string
  badgeVariant?: 'red' | 'blue' | 'amber' | 'green'
  highlight?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

function SidebarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // All 5 Unified Departmental Pillars are permanently accessible
  const navSections: NavSection[] = [
    {
      title: 'Command Centers',
      items: [
        { name: 'Head Branch (HQ)', href: '/super-admin', icon: Building, badge: 'HQ', badgeVariant: 'amber' },
        { name: 'Division Executive (EE)', href: '/division-admin', icon: LayoutDashboard, badge: 'Kamrup', badgeVariant: 'blue' },
        { name: 'Sub-Division (AEE)', href: '/subdivision-admin', icon: Building2, badge: 'Rampur', badgeVariant: 'blue' },
        { name: 'District Testing Lab', href: '/lab-portal', icon: TestTubes, badge: 'Betkuchi', badgeVariant: 'green' },
      ]
    },
    {
      title: 'Water Assets & Infrastructure',
      items: [
        { name: 'Drinking Water Sources', href: '/division-admin/sources', icon: MapPin, badge: '64' },
        { name: 'PWSS Schemes', href: '/division-admin/schemes', icon: Droplets, badge: '12' },
        { name: 'GIS Spatial Map', href: '/division-admin/gis-map', icon: Map },
      ]
    },
    {
      title: 'Field Surveillance & Sampling',
      items: [
        { name: 'Jalamitra KYC Approvals', href: '/division-admin/jalamitra-approvals', icon: UserCheck, badge: 'Gate', badgeVariant: 'green' },
        { name: 'Sampling Tasks Queue', href: '/division-admin/tasks', icon: Calendar, badge: '5 Active' },
        { name: 'Samples & Custody', href: '/division-admin/samples', icon: ShieldCheck },
        { name: 'Geo-Exceptions Queue', href: '/division-admin/exceptions', icon: AlertTriangle, badge: '1', badgeVariant: 'amber' },
        { name: 'Jal Mitra Ground Fleet', href: '/division-admin/staff', icon: Users, badge: '8/10 Live', badgeVariant: 'blue' },
      ]
    },
    {
      title: 'Laboratory & Testing',
      items: [
        { name: 'Analytical Lab Bench', href: '/lab-portal', icon: TestTubes },
        { name: 'Bottle QR Batches', href: '/division-admin/bottles', icon: QrCode },
      ]
    },
    {
      title: 'Intelligence & Compliance',
      items: [
        { name: 'Remediation Alerts', href: '/division-admin/alerts', icon: AlertTriangle, badge: '3', badgeVariant: 'red' },
        { name: 'Contaminant Trends', href: '/division-admin/trends', icon: TrendingUp },
        { name: 'Mathematical Risk & WQI', href: '/division-admin/ai-insights', icon: Sparkles, highlight: true },
        { name: 'Statutory Reports', href: '/division-admin/reports', icon: FileSpreadsheet },
        { name: 'Bulk Data Ingestion (JJM)', href: '/super-admin/import', icon: UploadCloud },
      ]
    }
  ]

  // Active portal level metadata for the header badge
  const currentPortalTitle = pathname.startsWith('/super-admin')
    ? 'State Head Branch (HQ)'
    : pathname.startsWith('/subdivision-admin')
    ? 'Sub-Division (AEE)'
    : pathname.startsWith('/lab-portal')
    ? 'District Testing Lab'
    : 'Division Office (EE)'

  const currentJurisdictionSub = pathname.startsWith('/super-admin')
    ? 'Statewide Assam'
    : pathname.startsWith('/subdivision-admin')
    ? 'Rampur Sub-Division'
    : pathname.startsWith('/lab-portal')
    ? 'Kamrup District Lab'
    : 'Kamrup Division'

  return (
    <aside className="w-64 flex-none border-r border-slate-200 bg-white py-5 px-3 h-full overflow-y-auto flex flex-col justify-between custom-scrollbar">
      <div className="flex flex-col gap-5">
        {/* Active Portal Scope Header Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/80 via-slate-50 to-amber-50/30 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Jurisdiction</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-1 font-bold text-xs text-slate-900 leading-tight">
            {currentPortalTitle}
          </div>
          <div className="text-[11px] font-medium text-[#0151AF] mt-0.5">
            {currentJurisdictionSub}
          </div>
        </div>

        {/* Section Navigation Lists */}
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="flex flex-col gap-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </h3>
            <div className="mt-0.5 flex flex-col gap-0.5">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon
                
                // Exact match or prefix match for non-root routes
                const isExact = pathname === item.href
                const isPrefix = 
                  item.href !== '/division-admin' &&
                  item.href !== '/super-admin' &&
                  item.href !== '/subdivision-admin' &&
                  item.href !== '/lab-portal' &&
                  pathname.startsWith(item.href)
                const isActive = isExact || isPrefix

                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all btn-tactile',
                      isActive
                        ? 'bg-[#0151AF] text-white shadow-xs ring-1 ring-[#0151AF]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn('h-4 w-4 flex-none', isActive ? 'text-white' : 'text-slate-400')} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[9.5px] font-bold flex-none',
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.badgeVariant === 'red'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : item.badgeVariant === 'green'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-[#0151AF] border border-blue-200'
                      )}>
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && !isActive && (
                      <span className="flex h-2 w-2 rounded-full bg-[#C99A3E] flex-none animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions & Sovereign Branding */}
      <div className="pt-4 border-t border-slate-100 mt-6 space-y-2.5">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-[#0151AF] hover:text-white hover:border-[#0151AF] transition shadow-xs btn-tactile"
          title="Sign in as another officer / change administrative portal"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Switch Portal (Login)</span>
        </Link>
        <div className="text-center text-[10px] text-slate-400 font-medium">
          Assam PHED Sovereign GovTech 2.0
        </div>
      </div>
    </aside>
  )
}

export function Sidebar() {
  return (
    <Suspense fallback={<aside className="w-64 flex-none border-r border-slate-200 bg-white p-4" />}>
      <SidebarContent />
    </Suspense>
  )
}
