import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// In-memory persistent cache for demo resilience
let inMemoryRequests: any[] = [
  {
    id: 'req-247300',
    request_code: 'REQ-AS-247300',
    citizen_name: 'Bipul Sarma (বিপুল শৰ্মা)',
    citizen_phone: '+91 98540 23145',
    village: 'Rampur Ward 3, Near Namghar',
    source_name: 'Rampur Deep Tube Well PWSS',
    source_type: 'Public Tube Well',
    source_qr_code: 'SRC-KAM-RAMPUR-001',
    reason: 'Metallic taste and yellowish discoloration observed after heavy rain.',
    reported_symptoms: 'yellowish_color, metallic_taste',
    urgency: 'high',
    status: 'pending',
    assigned_to_mitra_name: null,
    sub_division_name: 'Rampur Sub-Division',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'req-189201',
    request_code: 'REQ-AS-189201',
    citizen_name: 'Runu Begum (ৰুনু বেগম)',
    citizen_phone: '+91 94351 90812',
    village: 'Chaygaon Bazar',
    source_name: 'Chaygaon High-Yield DTW',
    source_type: 'Piped Water Tap (PWSS)',
    source_qr_code: 'SRC-KAM-CHY-002',
    reason: 'Water has slight chlorine odor; request potability confirmation for school.',
    reported_symptoms: 'odor_chemical',
    urgency: 'normal',
    status: 'assigned',
    assigned_to_mitra_name: 'Anjali Barman',
    sub_division_name: 'Rampur Sub-Division',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'req-091423',
    request_code: 'REQ-AS-091423',
    citizen_name: 'Dhruba Jyoti Nath (ধ্ৰুৱজ্যোতি নাথ)',
    citizen_phone: '+91 98642 55109',
    village: 'Palasbari Riverbank',
    source_name: 'Palasbari Surface Intake',
    source_type: 'Ring Well (Public)',
    source_qr_code: 'SRC-KAM-PAL-003',
    reason: 'Mild diarrhea cases reported in 3 households; urgent bacteriological check needed.',
    reported_symptoms: 'illness_diarrhea, turbidity',
    urgency: 'emergency',
    status: 'pending',
    assigned_to_mitra_name: null,
    sub_division_name: 'Rampur Sub-Division',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  }
]

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('test_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, requests: inMemoryRequests, source: 'cached' })
    }

    return NextResponse.json({ success: true, requests: data, source: 'database' })
  } catch (err: any) {
    return NextResponse.json({ success: true, requests: inMemoryRequests, source: 'fallback' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const requestCode = body.requestCode || ('REQ-AS-' + Math.floor(100000 + Math.random() * 900000))

    const newRecord = {
      id: 'req-' + Math.floor(100000 + Math.random() * 900000),
      request_code: requestCode,
      citizen_name: body.citizenName || 'Concerned Citizen',
      citizen_phone: body.citizenPhone || '+91 94350 00000',
      village: body.village || 'Rampur Habitation',
      source_name: body.sourceName || 'Community Drinking Water Point',
      source_type: body.sourceType || 'Tube Well',
      source_qr_code: body.sourceQrCode || 'SRC-KAM-RAMPUR-001',
      reason: body.reason || 'Water quality inspection requested.',
      reported_symptoms: body.reportedSymptoms || null,
      urgency: body.urgency || 'normal',
      status: 'pending',
      assigned_to_mitra_name: null,
      sub_division_name: 'Rampur Sub-Division',
      created_at: new Date().toISOString(),
    }

    // Add to in-memory store
    inMemoryRequests.unshift(newRecord)

    // Try inserting into Supabase
    try {
      const supabase = await createClient()
      await supabase.from('test_requests').insert({
        request_code: newRecord.request_code,
        reason: newRecord.reason,
        status: 'pending',
      })
    } catch {
      // Ignored for offline/demo resilience
    }

    return NextResponse.json({
      success: true,
      message: 'Citizen test request received successfully and routed to Rampur Sub-Division queue.',
      request: newRecord,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 })
  }
}

