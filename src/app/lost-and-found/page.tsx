"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LostAndFoundPage() {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Form State
  const [lfName, setLfName] = useState("");
  const [lfLocation, setLfLocation] = useState("");
  const [lfTime, setLfTime] = useState("");
  const [lfContact, setLfContact] = useState("");
  const [lfDesc, setLfDesc] = useState("");
  const [lfPhoto, setLfPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetchLostPets();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
    }
  };

  const fetchLostPets = async () => {
    const { data } = await supabase
      .from("lost_pets")
      .select("*")
      .neq("status", "Archived")
      .order("id", { ascending: false });
    
    if (data) setLostPets(data);
  };

  const handlePostAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfPhoto) {
      alert("Please upload a photo.");
      return;
    }

    let photoPath = "";
    if (lfPhoto) {
      const fileName = `public/${Date.now()}_${lfPhoto.name}`;
      const { data, error } = await supabase.storage.from("uploads").upload(fileName, lfPhoto);
      if (error) {
        alert(`Error uploading photo: ${error.message}`);
        return;
      }
      photoPath = supabase.storage.from("uploads").getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase.from("lost_pets").insert([{
      pet_name: lfName,
      location: lfLocation,
      time_lost: lfTime,
      contact_number: lfContact,
      description: lfDesc,
      photo_path: photoPath,
      user_id: userId,
      status: "Missing"
    }]);

    if (!error) {
      alert("Alert Posted Successfully!");
      setLfName(""); setLfLocation(""); setLfTime(""); setLfContact(""); setLfDesc(""); setLfPhoto(null);
      fetchLostPets();
    } else {
      alert("Error posting alert.");
    }
  };

  return (
    <section className="container" style={{ display: 'block' }}>
        <div className="section-header">
            <h2>Lost & Found</h2>
        </div>
        <div className="lf-layout">
            <div className="report-form">
                <h3>Report Missing Pet</h3>
                <form onSubmit={handlePostAlert}>
                    <div className="form-group"><label>Pet Name</label><input type="text" value={lfName} onChange={e=>setLfName(e.target.value)} required /></div>
                    <div className="form-group"><label>Location</label><input type="text" value={lfLocation} onChange={e=>setLfLocation(e.target.value)} required /></div>
                    <div className="form-group"><label>Time</label><input type="datetime-local" value={lfTime} onChange={e=>setLfTime(e.target.value)} required /></div>
                    <div className="form-group"><label>Contact</label><input type="tel" value={lfContact} onChange={e=>setLfContact(e.target.value)} required /></div>
                    <div className="form-group"><label>Photo</label><input type="file" accept="image/*" onChange={e => setLfPhoto(e.target.files?.[0] || null)} required /></div>
                    <div className="form-group"><label>Description</label><textarea value={lfDesc} onChange={e=>setLfDesc(e.target.value)}></textarea></div>
                    <button type="submit" className="btn-primary">Post Alert</button>
                </form>
            </div>
            <div className="missing-feed">
                <h3>Recent Reports</h3>
                {lostPets.length > 0 ? (
                  lostPets.map((row) => {
                    const status = row.status || "Missing";
                    const borderColor = (status === 'Found') ? "var(--success)" : "var(--danger)";
                    const badgeColor = (status === 'Found') ? "#d4edda" : "white";
                    const textColor = (status === 'Found') ? "#155724" : "#721c24";
                    const mapQuery = encodeURIComponent(`${row.location} Baguio City`);
                    const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

                    return (
                      <div key={row.id} className="missing-card" style={{ borderLeft: `5px solid ${borderColor}`, background: badgeColor }}>
                          <div className="missing-img-container"><img src={row.photo_path || "https://via.placeholder.com/100"} alt="Missing Pet" /></div>
                          <div style={{ flexGrow: 1 }}>
                              <h4 style={{ color: textColor }}>{status}: {row.pet_name}</h4>
                              <p><a href={mapLink} target="_blank" style={{ textDecoration: 'none', color: '#555' }}><i className="fas fa-map-marker-alt" style={{ color: 'var(--danger)' }}></i> {row.location}</a></p>
                              <p><a href={`tel:${row.contact_number}`} style={{ textDecoration: 'none', color: '#555' }}><i className="fas fa-phone"></i> {row.contact_number}</a></p>
                              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>{row.description}</p>
                          </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No lost pets reported.</p>
                )}
            </div>
        </div>
    </section>
  );
}
