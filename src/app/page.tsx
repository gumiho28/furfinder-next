"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState({ users: 0, adoptions: 0, missing: 0 });
  const [activeTab, setActiveTab] = useState("registration");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true });
      const { count: appsCount } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq('status', 'Approved');
      const { count: lostCount } = await supabase.from("lost_pets").select("*", { count: "exact", head: true }).eq('status', 'Missing');
      
      setStats({
        users: usersCount || 0,
        adoptions: (appsCount || 0) + 12,
        missing: lostCount || 0
      });
    }
    fetchStats();
  }, []);

  const switchGuidelineTab = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
            --primary-color: #003366; 
            --accent-color: #d4af37; 
            --bg-light: #f4f7f6;
            --text-dark: #333;
            --white: #ffffff;
            --success: #28a745;
            --danger: #dc3545;
            --transition: all 0.3s ease;
            --border-color: #ddd;
        }
        body { background-color: var(--bg-light); color: var(--text-dark); line-height: 1.6; padding-bottom: 50px; font-family: 'Open Sans', sans-serif; }
        .container { max-width: 1100px; margin: 2rem auto; padding: 0 20px; }
        .hero { background: linear-gradient(rgba(0,51,102,0.7), rgba(0,51,102,0.7)), url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80'); background-size: cover; background-position: center; padding: 4rem 2rem; border-radius: 8px; text-align: center; margin-bottom: 2rem; color: white; }
        .hero h1 { color: white; font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.6); margin-bottom: 1rem; }
        .hero p { color: #f1f1f1; font-size: 1.1rem; }
        .btn-primary { background-color: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; transition: 0.2s; }
        .btn-primary:hover { background-color: var(--accent-color); color: var(--primary-color); }
        .content-box { background: var(--white); padding: 2rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 3px 6px rgba(0,0,0,0.1); border: 1px solid var(--border-color); }
        h2 { color: var(--primary-color); margin-bottom: 1rem; }
        .req-list li { margin-bottom: 15px; list-style: none; padding-left: 1.5rem; position: relative; }
        .req-list li::before { content: "\\f00c"; font-family: "Font Awesome 6 Free"; font-weight: 900; color: var(--success); position: absolute; left: 0; top: 3px; }
        .faq-box { margin-top: 2rem; }
        .faq-item { border-bottom: 1px solid #eee; padding: 15px 0; }
        .faq-item h4 { color: var(--primary-color); margin-bottom: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-item h4:hover { color: var(--accent-color); }
        .faq-item p { color: #555; font-size: 0.95rem; line-height: 1.5; display: none; margin-left: 10px; }
        .faq-item.open p { display: block; animation: slideDown 0.3s ease; }
        @keyframes slideDown { from {opacity:0; transform:translateY(-5px);} to {opacity:1; transform:translateY(0);} }
        .ordinance-box { background: var(--white); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid var(--accent-color); }
        .guidelines-wrapper { display: flex; background: var(--white); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; margin-top: 30px; border: 1px solid #eee; }
        .tabs-left { min-width: 250px; background: #fafafa; border-right: 2px solid #eee; display: flex; flex-direction: column; }
        .tab-btn { padding: 20px; background: none; border: none; text-align: left; font-size: 1.05rem; font-weight: 600; cursor: pointer; color: #555; border-right: 4px solid transparent; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .tab-btn:hover { background: #f0f0f0; color: var(--primary-color); }
        .tab-btn.active { background: var(--white); color: var(--primary-color); border-right: 4px solid var(--accent-color); font-weight: 700; }
        .tab-content-right { flex-grow: 1; padding: 40px; background: var(--white); }
        .g-content { display: none; animation: fadeIn 0.4s; }
        .g-content.active { display: block; }
        .g-content h3 { color: var(--primary-color); margin-bottom: 20px; font-size: 1.8rem; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px; display: inline-block;}
        .g-content ul { list-style: none; padding: 0; }
        .g-content ul li { margin-bottom: 15px; font-size: 1.05rem; color: #444; display: flex; align-items: flex-start; }
        .g-content ul li i { color: var(--accent-color); margin-top: 5px; margin-right: 15px; font-size: 1.2rem; }
        @media (max-width: 768px) {
            .guidelines-wrapper { flex-direction: column; }
            .tabs-left { min-width: 100%; border-right: none; border-bottom: 2px solid #eee; display: flex; overflow-x: auto; white-space: nowrap; }
            .tab-btn { border-bottom: 3px solid transparent; border-right: none; text-align: center; }
            .tab-btn.active { border-right: none; border-bottom: 3px solid var(--accent-color); background: #f8f9fa; }
        }
      `}} />

      <section className="container">
          <div className="hero">
              <h1>Adopt, Don't Shop.</h1>
              <p>Help us find loving homes for the strays of Baguio City.</p>
              <div style={{ marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/adopt">
                    <button className="btn-primary" style={{ width: 'auto', display: 'inline-block', padding: '12px 30px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                        <i className="fas fa-search"></i> Find a Friend
                    </button>
                  </Link>
                  <Link href="/lost-and-found">
                    <button className="btn-primary" style={{ background: 'white', color: 'var(--primary-color)', width: 'auto', display: 'inline-block', padding: '12px 30px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                        <i className="fas fa-exclamation-triangle"></i> Report Lost
                    </button>
                  </Link>
                  <button className="btn-primary" style={{ background: '#17a2b8', width: 'auto', display: 'inline-block', padding: '12px 30px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                      <i className="fas fa-magic"></i> Pet Matcher
                  </button>
              </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '-30px 20px 30px 20px', position: 'relative', zIndex: 10 }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderBottom: '4px solid var(--success)' }}>
                  <i className="fas fa-home fa-2x" style={{ color: 'var(--success)', marginBottom: '10px' }}></i>
                  <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>
                      {stats.adoptions}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Happy Adoptions</p>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderBottom: '4px solid var(--danger)' }}>
                  <i className="fas fa-search-location fa-2x" style={{ color: 'var(--danger)', marginBottom: '10px' }}></i>
                  <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>
                      {stats.missing}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Missing Pets</p>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderBottom: '4px solid var(--primary-color)' }}>
                  <i className="fas fa-users fa-2x" style={{ color: 'var(--primary-color)', marginBottom: '10px' }}></i>
                  <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>
                      {stats.users}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Registered Users</p>
              </div>
          </div>

          <div className="content-box">
              <h2>About FurFinder</h2>
              <p style={{ color: 'var(--text-dark)' }}>FurFinder is a dedicated initiative committed to the welfare of stray dogs and cats in Baguio City and beyond. We bridge the gap between compassionate citizens and animals in need.</p>
          </div>

          <div className="content-box" id="guidelines" style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
              <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', fontSize: '2.2rem', marginBottom: '5px' }}>CITY ORDINANCE No.19, Series of 2021</h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem', marginBottom: '20px' }}>The Responsible Dog Ownership Ordinance of Baguio</p>
              
              <div className="guidelines-wrapper">
                  <div className="tabs-left">
                      <button className={`tab-btn ${activeTab === 'registration' ? 'active' : ''}`} onClick={() => switchGuidelineTab('registration')}>Dog Registration</button>
                      <button className={`tab-btn ${activeTab === 'impounding' ? 'active' : ''}`} onClick={() => switchGuidelineTab('impounding')}>Dog Impounding</button>
                      <button className={`tab-btn ${activeTab === 'adoption' ? 'active' : ''}`} onClick={() => switchGuidelineTab('adoption')}>Dog Adoption of Unclaimed Dogs</button>
                      <button className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => switchGuidelineTab('fees')}>Fees and Penalties</button>
                  </div>
                  
                  <div className="tab-content-right">
                      <div className={`g-content ${activeTab === 'registration' ? 'active' : ''}`}>
                          <h3>Dog Registration Process</h3>
                          <p>All dog owners residing in Baguio City must register their pets at the City Veterinary and Agriculture Office (CVAO) or during scheduled barangay registration drives.</p>
                          <ul style={{ marginTop: '20px' }}>
                              <li><i className="fas fa-check-circle"></i> Present updated anti-rabies vaccination records.</li>
                              <li><i className="fas fa-check-circle"></i> Provide clear photos of the dog (front and side profiles).</li>
                              <li><i className="fas fa-check-circle"></i> Submit a filled-out registration form along with a valid ID of the owner.</li>
                              <li><i className="fas fa-check-circle"></i> Dogs must be at least 3 months old to be registered.</li>
                          </ul>
                      </div>
                      
                      <div className={`g-content ${activeTab === 'impounding' ? 'active' : ''}`}>
                          <h3>Dog Impounding Regulations</h3>
                          <p>Any dog found roaming public places without a leash and an owner will be considered a stray and subject to impounding by the city pound catchers.</p>
                          <ul style={{ marginTop: '20px' }}>
                              <li><i className="fas fa-exclamation-triangle"></i> Strays are brought to the City Pound facility.</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Owners have a maximum of three (3) working days to claim their impounded dogs.</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Failure to claim within the period designates the dog as "Unclaimed" and eligible for adoption or euthanasia.</li>
                          </ul>
                      </div>
                      
                      <div className={`g-content ${activeTab === 'adoption' ? 'active' : ''}`}>
                          <h3>Adoption of Unclaimed Dogs</h3>
                          <p>Unclaimed impounded dogs are rehabilitated and put up for adoption. The public is highly encouraged to adopt rather than shop to help reduce the stray population.</p>
                          <ul style={{ marginTop: '20px' }}>
                              <li><i className="fas fa-paw"></i> Prospective adopters must pass a screening process (interview and housing check).</li>
                              <li><i className="fas fa-paw"></i> Adopters must prove financial capacity to provide food, shelter, and medical care.</li>
                              <li><i className="fas fa-paw"></i> All adopted dogs will be spayed/neutered and vaccinated prior to release.</li>
                          </ul>
                      </div>
                      
                      <div className={`g-content ${activeTab === 'fees' ? 'active' : ''}`}>
                          <h3>Fees and Penalties</h3>
                          <p>In accordance with the ordinance, the following administrative fees apply:</p>
                          <ul style={{ marginTop: '20px' }}>
                              <li><i className="fas fa-coins"></i> <span style={{ display: 'inline-flex', alignItems: 'center' }}><strong>Registration Fee, including certificates:</strong><span style={{ marginLeft: '10px' }}>₱ 50.00</span></span></li>
                              <li><i className="fas fa-coins"></i> <span style={{ display: 'inline-flex', alignItems: 'center' }}><strong>Re-issuance of certificates:</strong><span style={{ marginLeft: '10px' }}>₱ 100.00</span></span></li>
                              <li><i className="fas fa-coins"></i> <span style={{ display: 'inline-flex', alignItems: 'center' }}><strong>Impounding Fee:</strong><span style={{ marginLeft: '10px' }}>₱ 500.00</span></span></li>
                              <li><i className="fas fa-coins"></i> <span style={{ display: 'inline-flex', alignItems: 'center' }}><strong>Maintenance Fee:</strong><span style={{ marginLeft: '10px' }}>₱ 50.00/day/dog</span></span></li>
                              <li><i className="fas fa-coins"></i> <span style={{ display: 'inline-flex', alignItems: 'center' }}><strong>Adoption Fee:</strong><span style={{ marginLeft: '10px' }}>₱ 650.00</span></span></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>

          <div className="content-box">
              <h2><i className="fas fa-question-circle"></i> Pet Adoption FAQ</h2>
              <div className="faq-box">
                  {[
                    {q: "How can I adopt from FurFinder?", a: "Applicants go through a screening process to ensure our rescued animals go to loving homes. The process includes filling out the application form on this site, an interview (phone/online), and a shelter visit to meet your chosen pet."},
                    {q: "Can you adopt my pet?", a: "FurFinder and its partners generally do not adopt owned pets. We already have hundreds of shelter animals rescued from cruelty and neglect. If you need to give up your pet, please consider other rehoming options first."},
                    {q: "Why is there an adoption fee?", a: "The adoption fee is a token of your commitment and helps cover the costs of spay/neuter surgery, vaccinations, and flea/tick treatments for the animals. It is typically P500 for cats and P1000 for dogs."},
                    {q: "Can my adoption application get denied?", a: "Yes. Reasons for denial include: inability to keep the pet indoors (or safe), incompatibility with household members, or circumstances that may compromise the health and safety of the animal."},
                    {q: "I live in the province/abroad. Can I still adopt?", a: "Yes, but special arrangements must be made for meet-and-greets. Please contact us to discuss logistics."},
                    {q: "Do you have purebred cats or dogs?", a: "It is rare that purebreds are admitted. Sadly, they are often valued more than aspins/puspins who are equally deserving. Please consider adopting a local breed!"},
                    {q: "Can I return my adopted pet if I change my mind?", a: "A pet is a lifetime commitment. However, if you truly cannot keep your adopted pet, please do not abandon them. Return them to us so we can find another home for them."}
                  ].map((faq, index) => (
                    <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                        <h4>{faq.q} <i className={`fas fa-chevron-${openFaq === index ? 'up' : 'down'}`}></i></h4>
                        <p>{faq.a}</p>
                    </div>
                  ))}
              </div>
          </div>

          <div className="ordinance-box">
              <h2><i className="fas fa-gavel"></i> City Ordinance Requirements</h2>
              <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-dark)' }}>As per Baguio City Ordinance #19 s.2021</p>
              <ul className="req-list" style={{ color: 'var(--text-dark)' }}>
                  <li><strong>Barangay Certificate:</strong> Must state that you are a resident of said barangay.</li>
                  <li><strong>Valid Identification (ID):</strong> Present one of the following: UMID, Driver's License, PRC ID, etc.</li>
                  <li><strong>Dog Cage & Leash:</strong> Required for transport.</li>
              </ul>
          </div>
      </section>
    </>
  );
}
