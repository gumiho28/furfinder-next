"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DonatePage() {
  const [totalRaised, setTotalRaised] = useState(0);
  const fundraiserTarget = 50000;

  const [dname, setDname] = useState("");
  const [damt, setDamt] = useState("");
  const [dmsg, setDmsg] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const { data } = await supabase.from("donations").select("amount");
    if (data) {
      const sum = data.reduce((acc: number, row: any) => acc + (Number(row.amount) || 0), 0);
      setTotalRaised(sum);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("donations").insert([{
      donor_name: dname || "Anonymous",
      amount: parseFloat(damt),
      message: dmsg
    }]);

    if (!error) {
      alert("Thank you for your donation!");
      setDname(""); setDamt(""); setDmsg("");
      fetchDonations();
    } else {
      alert("Error submitting donation.");
    }
  };

  let progressPercent = (totalRaised / fundraiserTarget) * 100;
  if (progressPercent > 100) progressPercent = 100;

  return (
    <section className="container" style={{ display: 'block' }}>
        <div className="section-header"><h2>Support Us</h2></div>

        <div className="content-box" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--primary-color)' }}><i className="fas fa-home"></i> New Shelter Housing Fund</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>Help us reach our goal to build additional kennels for 20 more strays!</p>
            
            <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--success)' }}>Raised: ₱{totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span style={{ color: 'var(--primary-color)' }}>Goal: ₱{fundraiserTarget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div style={{ background: '#e9ecef', borderRadius: '20px', height: '25px', width: '100%', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                <div style={{ background: 'linear-gradient(90deg, var(--success), #218838)', width: `${progressPercent}%`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', transition: 'width 1s ease-in-out' }}>
                    {Math.round(progressPercent)}%
                </div>
            </div>
        </div>

        <div className="content-box" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', textAlign: 'center' }}>
            <i className="fas fa-hand-holding-usd fa-3x" style={{ color: 'var(--accent-color)', marginBottom: '15px' }}></i>
            <h3>Monetary Donation</h3>
            <p style={{ marginBottom: '15px', fontSize: '0.9rem' }}>Your donation automatically updates our fundraiser goal above.</p>
            
            <form onSubmit={handleDonate} style={{ textAlign: 'left' }}>
                <div className="form-group"><label>Name</label><input type="text" value={dname} onChange={e=>setDname(e.target.value)} placeholder="Anonymous or Your Name" required /></div>
                <div className="form-group"><label>Amount (PHP)</label><input type="number" value={damt} onChange={e=>setDamt(e.target.value)} placeholder="e.g. 500" required /></div>
                <div className="form-group"><label>Message</label><textarea value={dmsg} onChange={e=>setDmsg(e.target.value)} placeholder="A short message for the animals..."></textarea></div>
                <button type="submit" className="btn-primary">Donate Now</button>
            </form>
        </div>

        <div className="content-box" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <i className="fas fa-gift fa-3x" style={{ color: 'var(--accent-color)', marginBottom: '15px' }}></i>
            <h3>In-Kind Donations</h3>
            <p style={{ marginBottom: '20px' }}>We gratefully accept clothing, shelter materials, old newspapers, and pet food.</p>
            
            <div style={{ background: 'var(--bg-light)', padding: '15px', borderRadius: '8px', border: '1px solid #e1e4e8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <i className="fas fa-truck" style={{ color: 'var(--primary-color)' }}></i>
                <span>Call for pickup: <strong>0967 213 7048</strong></span>
            </div>
            <a href="tel:09672137048" className="btn-primary" style={{ display: 'inline-block', width: 'auto', marginTop: '15px', textDecoration: 'none' }}>
                <i className="fas fa-phone"></i> Call Now
            </a>
        </div>
    </section>
  );
}
