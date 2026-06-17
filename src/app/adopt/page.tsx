import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable cache to always get fresh data

export default async function AdoptPage() {
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("status", "Available")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#003366] mb-8 text-center border-b-2 border-gray-200 pb-4">
        Available Pets for Adoption
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets && pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden relative flex flex-col transition hover:-translate-y-1">
              <span className="absolute top-3 right-3 bg-[#d4af37] text-[#003366] px-3 py-1 rounded-full text-xs font-bold shadow z-10">
                New
              </span>
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {pet.image_url ? (
                  <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                ) : (
                  <i className="fas fa-paw text-4xl text-gray-300"></i>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#003366] mb-2">{pet.name}</h3>
                  <p className="text-sm text-gray-600 mb-1"><strong>Breed:</strong> {pet.breed}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Age:</strong> {pet.age}</p>
                  <p className="text-sm text-gray-600 mb-4 mt-2 line-clamp-3">{pet.story}</p>
                  {pet.sickness && (
                    <p className="text-sm text-red-600 mb-2 font-semibold">
                      <i className="fas fa-notes-medical"></i> {pet.sickness}
                    </p>
                  )}
                </div>
                <button className="w-full bg-[#003366] text-white py-2 rounded font-semibold hover:bg-[#d4af37] hover:text-[#003366] transition">
                  Adopt {pet.name}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <i className="fas fa-cat text-4xl mb-4"></i>
            <p>No pets are currently available for adoption.</p>
          </div>
        )}
      </div>
    </div>
  );
}
