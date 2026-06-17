import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const revalidate = 0; // Opt out of static rendering

export default async function AdminPage() {
  const [
    { data: petsData },
    { data: applicationsData },
    { data: lostPetsData },
    { data: sheltersData },
    { data: donationsData }
  ] = await Promise.all([
    supabase.from('pets').select('*').neq('status', 'archived').order('id', { ascending: false }),
    supabase.from('applications').select('*').neq('status', 'Archived').order('id', { ascending: false }),
    supabase.from('lost_pets').select('*').neq('status', 'Archived').order('id', { ascending: false }),
    supabase.from('shelters').select('*'),
    supabase.from('donations').select('*').order('date_created', { ascending: false })
  ]);

  const pets = petsData || [];
  const applications = applicationsData || [];
  const lostPets = lostPetsData || [];
  const shelters = sheltersData || [];
  const donations = donationsData || [];

  // Compute analytics
  let adoptedCount = 0;
  let availableCount = 0;
  pets.forEach((p) => {
    if (p.status?.toLowerCase() === 'adopted') adoptedCount++;
    if (p.status?.toLowerCase() === 'available') availableCount++;
  });

  // Barangay Hotspots
  const hotspotsMap: Record<string, number> = {};
  lostPets.forEach((lp) => {
    if (lp.location && lp.location.trim() !== '') {
      hotspotsMap[lp.location] = (hotspotsMap[lp.location] || 0) + 1;
    }
  });
  const sortedHotspots = Object.entries(hotspotsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const bhLabels = sortedHotspots.map(h => h[0]);
  const bhData = sortedHotspots.map(h => h[1]);

  // Age Group Success
  const ageStats: Record<string, { total: number, approved: number }> = {
    '18-25': { total: 0, approved: 0 },
    '26-35': { total: 0, approved: 0 },
    '36-50': { total: 0, approved: 0 },
    '50+': { total: 0, approved: 0 }
  };
  applications.forEach((app) => {
    const age = parseInt(app.applicant_age);
    if (!isNaN(age)) {
      let group = '';
      if (age >= 18 && age <= 25) group = '18-25';
      else if (age >= 26 && age <= 35) group = '26-35';
      else if (age >= 36 && age <= 50) group = '36-50';
      else if (age > 50) group = '50+';
      
      if (group) {
        ageStats[group].total++;
        if (app.status === 'Approved') {
          ageStats[group].approved++;
        }
      }
    }
  });

  const ageLabels = Object.keys(ageStats);
  const ageData = Object.values(ageStats).map(s => {
    return s.total > 0 ? Math.round((s.approved / s.total) * 100) : 0;
  });

  const analytics = {
    adoptedCount,
    availableCount,
    bhLabels,
    bhData,
    ageLabels,
    ageData
  };

  return (
    <AdminDashboard 
      initialPets={pets}
      initialApplications={applications}
      initialLostPets={lostPets}
      initialShelters={shelters}
      initialDonations={donations}
      analytics={analytics}
    />
  );
}
