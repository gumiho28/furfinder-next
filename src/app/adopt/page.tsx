"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdoptionModal from "@/components/AdoptionModal";

export default function AdoptPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  
  const [selectedPet, setSelectedPet] = useState<any>(null);

  useEffect(() => {
    fetchPets();
  }, [search, typeFilter, ageFilter]);

  const fetchPets = async () => {
    let query = supabase.from("pets").select("*").eq("status", "available").order("id", { ascending: false });
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%`);
    }
    if (typeFilter) {
      query = query.eq("type", typeFilter);
    }
    if (ageFilter === "young") {
      query = query.or(`age.ilike.%month%,age.ilike.%week%,age.ilike.%day%`);
    } else if (ageFilter === "adult") {
      query = query.or(`age.ilike.%year%`); // Simplification for adult
    }
    
    const { data } = await query;
    if (data) setPets(data);
  };

  return (
    <section className="container" style={{ display: 'block' }}>
        <div className="section-header">
            <h2>Available for Adoption</h2>
            <p>Meet our furry friends looking for a forever home.</p>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <form onSubmit={(e) => { e.preventDefault(); fetchPets(); }} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '750px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search by name or breed..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', flexGrow: 1, minWidth: '180px' }}
                />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <option value="">All Types</option>
                    <option value="dog">Dogs</option>
                    <option value="cat">Cats</option>
                </select>
                <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <option value="">All Ages</option>
                    <option value="young">Young (Months/Weeks)</option>
                    <option value="adult">Adult/Senior (Years)</option>
                </select>
                <button type="submit" className="btn-primary" style={{ width: 'auto', marginTop: 0 }}>Search</button>
            </form>
        </div>

        <div className="pet-grid">
            {pets.length > 0 ? pets.map((pet) => {
              const isYoung = pet.age?.toLowerCase().includes("month") || pet.age?.toLowerCase().includes("week");
              return (
                <div className="pet-card" key={pet.id}>
                    {isYoung && <span className="badge-new">Young</span>}
                    <div className="pet-img">
                      <img src={pet.image_url || 'https://via.placeholder.com/300?text=Pet'} alt={pet.name} />
                    </div>
                    <div className="pet-details">
                        <div>
                            <h3 style={{ marginBottom: '5px' }}>{pet.name}</h3>
                            <p style={{ color: 'var(--text-dark)' }}><strong>Breed:</strong> {pet.breed}</p>
                            <p style={{ color: 'var(--text-dark)' }}><strong>Age:</strong> {pet.age}</p>
                            <p style={{ fontSize: '0.85rem', color: '#d9534f', marginTop: '4px' }}>
                              <i className="fas fa-heartbeat"></i> <strong>Medical:</strong> {pet.sickness || 'None'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                            <button className="btn-primary" style={{ flex: 1, marginTop: 0 }} onClick={() => setSelectedPet(pet)}>Adopt</button>
                            <button className="btn-secondary" style={{ color: '#ccc' }}><i className="fas fa-heart"></i></button>
                            <button className="btn-secondary"><i className="fas fa-share-alt"></i></button>
                        </div>
                    </div>
                </div>
              );
            }) : (
                <p style={{ textAlign: 'center', width: '100%', color: '#666', gridColumn: '1 / -1' }}>No pets match your search criteria.</p>
            )}
        </div>
        
        {selectedPet && (
          <AdoptionModal 
            isOpen={true} 
            onClose={() => setSelectedPet(null)} 
            petId={selectedPet.id.toString()} 
            petName={selectedPet.name} 
          />
        )}
    </section>
  );
}
