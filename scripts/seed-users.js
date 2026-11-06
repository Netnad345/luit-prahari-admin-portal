const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://kzijlovhoedjeyojecre.supabase.co';
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log("Seeding Divisions, Schemes, Labs, and Test Users...");

  // 1. Create Kamrup Division
  let { data: division, error: divErr } = await supabase
    .from('divisions')
    .upsert({
      code: 'AS-KAM-01',
      name: 'Kamrup Division',
      circle_name: 'Guwahati Circle',
      zone_name: 'Lower Assam Zone',
      districts: ['Kamrup Metropolitan', 'Kamrup Rural']
    }, { onConflict: 'code' })
    .select()
    .single();

  if (divErr) {
    console.error("Division insert error:", divErr);
    return;
  }
  console.log("Created/Found Division:", division.name, division.id);

  // 2. Create Scheme
  let { data: scheme, error: schErr } = await supabase
    .from('schemes')
    .upsert({
      division_id: division.id,
      scheme_code: 'PWSS-RAM-01',
      name: 'Rampur Piped Water Supply Scheme',
      scheme_type: 'groundwater',
      village_coverage: ['Rampur', 'Mirza', 'Palasbari']
    }, { onConflict: 'scheme_code' })
    .select()
    .single();

  if (schErr) console.error("Scheme error:", schErr);
  else console.log("Created/Found Scheme:", scheme.name);

  // 3. Create Lab
  let { data: lab, error: labErr } = await supabase
    .from('labs')
    .upsert({
      division_id: division.id,
      name: 'Kamrup District Water Quality Laboratory',
      lab_type: 'division_lab',
      is_nabl_accredited: true
    })
    .select()
    .single();

  if (labErr) console.error("Lab error:", labErr);
  else console.log("Created/Found Lab:", lab.name);

  // 4. Create Test Users
  const usersToCreate = [
    {
      email: 'admin@phed.assam.gov.in',
      password: 'LuitPrahari@2026',
      fullName: 'Pranjal Saikia (EE)',
      phone: '+919876543210',
      role: 'division_admin',
      divisionId: division.id,
      labId: lab?.id
    },
    {
      email: 'superadmin@phed.assam.gov.in',
      password: 'LuitPrahari@2026',
      fullName: 'Dr. Debojit Baruah (Chief Chemist)',
      phone: '+919876543211',
      role: 'super_admin',
      divisionId: division.id,
      labId: lab?.id
    },
    {
      email: 'lab@phed.assam.gov.in',
      password: 'LuitPrahari@2026',
      fullName: 'Ananya Kalita (Lab In-Charge)',
      phone: '+919876543212',
      role: 'lab_incharge',
      divisionId: division.id,
      labId: lab?.id
    },
    {
      email: 'sampler@phed.assam.gov.in',
      password: 'LuitPrahari@2026',
      fullName: 'Bikash Das (Field Sampler)',
      phone: '+919876543213',
      role: 'field_sampler',
      divisionId: division.id,
      labId: null
    }
  ];

  for (const u of usersToCreate) {
    // Check if user already exists
    const { data: userList } = await supabase.auth.admin.listUsers();
    let existingUser = userList.users.find(item => item.email === u.email);

    let userId;
    if (existingUser) {
      console.log(`User ${u.email} already exists, updating password...`);
      const { data: updated, error: updErr } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password: u.password,
        email_confirm: true,
        user_metadata: { role: u.role, full_name: u.fullName }
      });
      if (updErr) console.error("Error updating user:", updErr);
      userId = existingUser.id;
    } else {
      console.log(`Creating user ${u.email}...`);
      const { data: created, error: crtErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { role: u.role, full_name: u.fullName }
      });
      if (crtErr) {
        console.error("Error creating user:", crtErr);
        continue;
      }
      userId = created.user.id;
    }

    // Insert or update profiles
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: u.fullName,
      phone: u.phone,
      role: u.role,
      division_id: u.divisionId,
      lab_id: u.labId,
      is_active: true
    }, { onConflict: 'id' });

    if (profErr) {
      console.error(`Error saving profile for ${u.email}:`, profErr);
    } else {
      console.log(`✓ Profile linked for ${u.email} with role [${u.role}]`);
    }
  }

  // Also seed 2 initial demo sources so the dashboard isn't blank
  const demoSources = [
    {
      name: 'Rampur GP Public Tube Well #1',
      source_type: 'tube_well',
      scheme_id: scheme.id,
      division_id: division.id,
      qr_code_id: 'AS-KAM-SRC-01',
      location_geom: 'SRID=4326;POINT(91.7362 26.1445)',
      fence_radius_meters: 50,
      is_verified: true
    },
    {
      name: 'Mirza Bazaar Tap Stand #4',
      source_type: 'public_tap_stand',
      scheme_id: scheme.id,
      division_id: division.id,
      qr_code_id: 'AS-KAM-SRC-02',
      location_geom: 'SRID=4326;POINT(91.5218 26.0821)',
      fence_radius_meters: 40,
      is_verified: true
    }
  ];

  for (const src of demoSources) {
    const { error: sErr } = await supabase.from('sources').upsert(src, { onConflict: 'qr_code_id' });
    if (!sErr) console.log(`✓ Seeded demo source: ${src.name}`);
  }

  console.log("\nSeeding complete! You can now log in.");
}

main().catch(console.error);

