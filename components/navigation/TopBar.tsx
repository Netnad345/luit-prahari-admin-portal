'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LogOut, 
  User, 
  Bell, 
  Search, 
  PhoneCall, 
  Activity, 
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
  Building,
  LayoutDashboard,
  TestTubes,
  ExternalLink,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  userEmail?: string
  roleName?: string
  divisionName?: string
}

export function TopBar({ userEmail = 'division@phed.assam.gov.in', roleName, divisionName }: TopBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationTray, setShowNotificationTray] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Derive active portal level from route
  const currentRole = (
    pathname.startsWith('/super-admin')
      ? 'Head Branch (State HQ)'
      : pathname.startsWith('/subdivision-admin')
      ? 'Sub-Division (AEE)'
      : pathname.startsWith('/lab-portal')
      ? 'District Testing Lab'
      : roleName || 'Division Admin (EE)'
  )

  const currentJurisdiction = (
    pathname.startsWith('/super-admin')
      ? 'Statewide Assam'
      : pathname.startsWith('/subdivision-admin')
      ? 'Rampur Sub-Division'
      : pathname.startsWith('/lab-portal')
      ? 'Kamrup District Lab'
      : divisionName || 'Kamrup Division'
  )

  const activeEmail =
    pathname.startsWith('/super-admin')
      ? 'headbranch@phed.assam.gov.in'
      : pathname.startsWith('/subdivision-admin')
      ? 'subdivision@phed.assam.gov.in'
      : pathname.startsWith('/lab-portal')
      ? 'lab@phed.assam.gov.in'
      : userEmail

  const officerInitials = activeEmail.split('@')[0].slice(0, 2).toUpperCase()

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setShowProfileMenu(false)
        setShowNotificationTray(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    if (typeof document !== 'undefined') {
      document.cookie = 'demo_user=; path=/; max-age=0'
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex flex-col bg-white text-slate-800 border-b border-slate-200 shadow-xs">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
          {/* Left: Sovereign Brand & Jurisdiction Identity */}
          <div className="flex items-center gap-3 sm:gap-4 flex-none">
            <Link href="/division-admin" className="flex items-center gap-3 group">
              <div className="relative h-9 w-36 sm:w-40 transition-transform group-hover:scale-[1.02]">
                <Image 
                  src="/brand/logo-full.png" 
                  alt="Luit Prahari Official Logo" 
                  fill 
                  className="object-contain object-left" 
                  priority
                />
              </div>
              <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-50 text-amber-900 font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                    PHED ASSAM
                  </span>
                  <span className="font-['Tiro_Bangla'] text-xs font-bold text-slate-900">
                    লুইত প্ৰহৰী
                  </span>
                </div>
                <span className="text-[10.5px] font-medium tracking-wider text-slate-500">
                  Drinking Water Custody Intelligence
                </span>
              </div>
            </Link>

            <span className="hidden sm:block h-6 w-px bg-slate-200" />

            {/* Jurisdiction Badge with Live Ping */}
            <div className="flex items-center gap-2 rounded-full bg-blue-50/80 border border-blue-200/80 px-3 py-1 text-xs font-semibold text-[#0151AF]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="truncate max-w-[140px] sm:max-w-none">{currentJurisdiction}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 hidden md:inline">
                LIVE
              </span>
            </div>
          </div>

          {/* Center: Command Palette Search Bar (Ctrl+K) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 hover:border-slate-300 transition shadow-micro"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search source, bottle QR, Jal Mitra...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 shadow-xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right: Emergency Hotline, Alerts, Switch Portal & Officer Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-none">
            {/* Switch Portal (Re-Login) Action */}
            <button
              onClick={handleSignOut}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-[#0151AF] hover:text-white hover:border-[#0151AF] transition shadow-xs btn-tactile"
              title="Sign out and log in to another administrative portal / jurisdiction"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Switch Portal</span>
            </button>

            {/* 24x7 Emergency Water Line */}
            <a
              href="tel:18003453880"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#0151AF] hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
              title="24x7 State Water Quality Emergency Desk"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
              <span>1800-345-3880</span>
            </a>

            {/* Notification Bell with Remediation Count */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationTray(!showNotificationTray)}
                title="IS 10500 Remediation Alerts" 
                className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition border border-transparent hover:border-slate-200"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9.5px] font-bold text-white shadow-xs animate-pulse">
                  3
                </span>
              </button>

              {/* Notification Slide-Over Popover */}
              {showNotificationTray && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        IS 10500 Action Alerts (3)
                      </h4>
                    </div>
                    <button 
                      onClick={() => setShowNotificationTray(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-red-800">
                        <span>Rampur PWSS · Arsenic Spike</span>
                        <span className="text-[10px] font-normal text-red-600">12m ago</span>
                      </div>
                      <p className="text-xs text-red-700 mt-1">
                        Tube Well #04 exceeded permissible limit (0.018 mg/L). Immediate notice issued.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                        <span>Mirza Scheme · High Turbidity</span>
                        <span className="text-[10px] font-normal text-amber-600">45m ago</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        Filter bed backwash required. Reading: 3.8 NTU.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-800">
                        <span>Barrier Exception Filed</span>
                        <span className="text-[10px] font-normal text-purple-600">1h ago</span>
                      </div>
                      <p className="text-xs text-purple-700 mt-1">
                        Pranab Das filed flood barrier exception at 84m. Awaiting AEE endorsement.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                    <Link
                      href="/division-admin/alerts"
                      onClick={() => setShowNotificationTray(false)}
                      className="text-xs font-bold text-[#0151AF] hover:underline flex items-center gap-1"
                    >
                      <span>View All Incident Reports</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Officer Profile Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0151AF] to-[#014190] text-white font-bold text-xs shadow-xs">
                  {officerInitials}
                </div>

                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {activeEmail.split('@')[0]}
                  </div>
                  <div className="text-[10.5px] font-semibold text-[#0151AF] leading-tight">
                    {currentRole}
                  </div>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{activeEmail}</div>
                    <div className="text-[11px] font-semibold text-[#0151AF] mt-0.5">{currentRole}</div>
                    <div className="text-[10.5px] text-slate-500 mt-1">Jurisdiction: {currentJurisdiction}</div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Authenticated Session Active</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-blue-50 hover:text-[#0151AF] transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-3.5 w-3.5 text-slate-400" />
                        <span>Switch Portal / Re-Login</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Login Screen ➔</span>
                    </button>
                  </div>

                  <div className="p-1 pt-1 border-t border-slate-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <LogOut className="h-3.5 w-3.5 text-red-500" />
                      <span>Sign Out (লগআউট কৰক)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Traditional Assamese Woven Gamosa Band Ribbon */}
        <div 
          className="h-1 w-full bg-[#A51D24] bg-repeat-x shadow-xs"
          style={{
            backgroundImage: "url('/patterns/gamosa-tile-muga.svg')",
            backgroundSize: '48px 4px',
          }}
        />
      </header>

      {/* Global Quick Search Modal Dialog (Command Palette) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200">
              <Search className="h-4 w-4 text-slate-400 flex-none" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type source ID (AS-KAM-...), bottle QR, or Jal Mitra name..."
                className="w-full text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                Quick Results
              </div>
              <Link
                href="/subdivision-admin"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 transition group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#0151AF]">
                    AS-KAM-RAM-001 · Rampur Bazar Public Tap
                  </div>
                  <div className="text-[11px] text-slate-500">PWSS Scheme #12 · Last tested: 3 days ago</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Potable
                </span>
              </Link>
              <Link
                href="/division-admin/bottles"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 transition group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#0151AF]">
                    AS-KAM-2026-B4318 · Active Bottle QR
                  </div>
                  <div className="text-[11px] text-slate-500">Collected by Pranab Das · Kamrup Lab</div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  In Transit
                </span>
              </Link>
              <Link
                href="/subdivision-admin"
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 transition group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#0151AF]">
                    Pranab Das (প্ৰণৱ দাস) · JM-01
                  </div>
                  <div className="text-[11px] text-slate-500">Rampur PWSS · Active Online (Battery 82%)</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Online
                </span>
              </Link>
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px]">Esc</kbd> to exit</span>
              <span>Luit Prahari Fast Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
