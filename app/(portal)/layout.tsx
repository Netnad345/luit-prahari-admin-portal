import React from 'react'
import { TopBar } from '@/components/navigation/TopBar'
import { Sidebar } from '@/components/navigation/Sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <div className="flex h-screen flex-col bg-[#F8FAFC] overflow-hidden">
      {/* Fixed Header */}
      <TopBar 
        userEmail={data?.user?.email || 'admin@phed.assam.gov.in'} 
        roleName="Division Admin"
        divisionName="Kamrup Division"
      />
      {/* Body Container: Full remaining height, no window scroll */}
      <div className="flex flex-1 overflow-hidden">
        {/* Independent Scrollable Sidebar */}
        <Sidebar />
        {/* Independent Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
