import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: petsCount } = await supabase
    .from("pets")
    .select("*", { count: "exact", head: true });

  const { count: lostPetsCount } = await supabase
    .from("lost_pets")
    .select("*", { count: "exact", head: true });

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div 
        className="text-center py-24 px-4 bg-cover bg-center mb-8 text-white rounded-b-lg shadow-lg"
        style={{ backgroundImage: "linear-gradient(rgba(0,51,102,0.7), rgba(0,51,102,0.7)), url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80')" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg text-white">Find Your New Best Friend</h1>
        <p className="text-lg md:text-xl text-gray-200">Adopt, don't shop. Help us give every animal a loving home in Baguio City.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg text-center shadow border-b-4 border-[#003366]">
            <i className="fas fa-paw fa-2x text-[#003366] mb-3"></i>
            <h3 className="text-3xl font-bold m-0">{petsCount || 0}</h3>
            <p className="text-gray-500 text-sm">Pets Available</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow border-b-4 border-[#003366]">
            <i className="fas fa-search fa-2x text-[#003366] mb-3"></i>
            <h3 className="text-3xl font-bold m-0">{lostPetsCount || 0}</h3>
            <p className="text-gray-500 text-sm">Active Lost/Found</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow border-b-4 border-[#003366]">
            <i className="fas fa-users fa-2x text-[#003366] mb-3"></i>
            <h3 className="text-3xl font-bold m-0">{usersCount || 0}</h3>
            <p className="text-gray-500 text-sm">Registered Users</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
          <h2 className="text-2xl font-bold text-[#003366] mb-4">About FurFinder</h2>
          <p className="text-gray-700">FurFinder is a dedicated initiative committed to the welfare of stray dogs and cats in Baguio City and beyond. We bridge the gap between compassionate citizens and animals in need.</p>
        </div>

      </div>
    </div>
  );
}
