import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function LostAndFoundPage() {
  const { data: lostPets } = await supabase
    .from("lost_pets")
    .select("*")
    .eq("status", "Lost")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#003366] mb-8 text-center border-b-2 border-gray-200 pb-4">
        Lost & Found Pets
      </h1>

      <div className="flex justify-end mb-6">
        <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition shadow">
          <i className="fas fa-bullhorn mr-2"></i> Report Lost Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lostPets && lostPets.length > 0 ? (
          lostPets.map((pet) => (
            <div key={pet.id} className="bg-white p-4 rounded-lg border-l-4 border-red-600 shadow-sm flex gap-4">
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                {pet.photo_path ? (
                  <img src={pet.photo_path} alt={pet.pet_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <i className="fas fa-paw text-2xl"></i>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#003366]">{pet.pet_name}</h3>
                <p className="text-sm text-gray-600"><i className="fas fa-map-marker-alt w-4"></i> {pet.location}</p>
                <p className="text-sm text-gray-600"><i className="fas fa-clock w-4"></i> {pet.time_lost ? new Date(pet.time_lost).toLocaleDateString() : 'Unknown'}</p>
                <p className="text-sm text-gray-600"><i className="fas fa-phone w-4"></i> {pet.contact_number}</p>
                <p className="text-sm mt-2 text-gray-700">{pet.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p>No lost pets reported at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
