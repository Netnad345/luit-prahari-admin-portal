import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ApprovalsClient } from './ApprovalsClient'

export const metadata = {
  title: 'Jalamitra KYC Approval Desk | Luit Prahari',
  description: 'One-time administrative onboarding authorization for frontline Jalamitra field samplers.',
}

export default async function JalamitraApprovalsPage() {
  const supabase = await createClient()

  // Fetch pending Jalamitra profiles
  const { data: pendingList, error } = await supabase
    .from('jalamitra_profiles')
    .select(`
      id,
      full_name,
      phone_number,
      aadhaar_last_4,
      subdivision_name,
      block_name,
      panchayat_name,
      assigned_villages,
      id_proof_url,
      profile_photo_url,
      status,
      sampler_short_code,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Error fetching jalamitra profiles:', error.message)
  }

  // Seed realistic pending applications if table is fresh
  const list = pendingList && pendingList.length > 0 ? pendingList : [
    {
      id: 'jm-seed-01',
      full_name: 'Minati Das',
      phone_number: '9864012345',
      aadhaar_last_4: '4892',
      subdivision_name: 'Mirza Sub-Division',
      block_name: 'Chaygaon Block',
      panchayat_name: 'Rampur Gaon Panchayat',
      assigned_villages: ['Rampur', 'Majortopa', 'Kukurmara'],
      id_proof_url: '',
      profile_photo_url: '',
      status: 'PENDING_APPROVAL',
      sampler_short_code: null,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'jm-seed-02',
      full_name: 'Anjali Boro',
      phone_number: '9435078901',
      aadhaar_last_4: '7103',
      subdivision_name: 'Boko Sub-Division',
      block_name: 'Boko Development Block',
      panchayat_name: 'Boko Central GP',
      assigned_villages: ['Boko Bazar', 'Hahim Gaon', 'Dakuapara'],
      id_proof_url: '',
      profile_photo_url: '',
      status: 'PENDING_APPROVAL',
      sampler_short_code: null,
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'jm-seed-03',
      full_name: 'Dipali Kalita',
      phone_number: '7002145678',
      aadhaar_last_4: '3319',
      subdivision_name: 'Guwahati Sub-Division',
      block_name: 'Rani Block',
      panchayat_name: 'Rani Bagicha GP',
      assigned_villages: ['Rani Tea Estate', 'Andherijuli', 'Patgaon'],
      id_proof_url: '',
      profile_photo_url: '',
      status: 'APPROVED',
      sampler_short_code: 'JM8K',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    }
  ]

  return <ApprovalsClient initialList={list as any} />
}
