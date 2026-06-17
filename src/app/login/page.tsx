"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration fields
  const [name, setName] = useState("");
  const [dogStatus, setDogStatus] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [breedPreference, setBreedPreference] = useState("");
  const [barangay, setBarangay] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              dog_status: dogStatus,
              age_group: ageGroup,
              breed_preference: breedPreference,
              barangay: barangay
            }
          }
        });
        if (error) throw error;
        setIsLogin(true);
        setError("Registration Successful! Please check your email or log in.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', background: '#f4f7f6', padding: '20px', boxSizing: 'border-box' }}>
      
      {isLogin ? (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#003366', marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Login</h2>
          {error && <p style={{ color: error.includes('Successful') ? 'green' : 'red', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              onMouseOver={(e) => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#003366'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#003366'; e.currentTarget.style.color = 'white'; }}
              style={{ width: '100%', padding: '12px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 600, marginTop: '10px', transition: 'background 0.3s' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p 
            onClick={() => { setIsLogin(false); setError(""); }}
            style={{ marginTop: '15px', fontSize: '0.9rem', color: '#003366', cursor: 'pointer', textDecoration: 'underline' }}
          >
            No account? Register here.
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#003366', marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Register</h2>
          {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={dogStatus} 
                onChange={(e) => setDogStatus(e.target.value)} 
                required
                style={{ flex: 1, padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
              >
                <option value="" disabled>Pet Experience</option>
                <option value="First-time Owner">First-time Owner</option>
                <option value="Experienced">Experienced Owner</option>
              </select>
              <select 
                value={ageGroup} 
                onChange={(e) => setAgeGroup(e.target.value)} 
                required
                style={{ flex: 1, padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
              >
                <option value="" disabled>Age Group</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-50">36-50</option>
                <option value="50+">50+</option>
              </select>
            </div>
            
            <input
              type="text"
              placeholder="Breed Preference (e.g., Aspin, Cat)"
              value={breedPreference}
              onChange={(e) => setBreedPreference(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <input
              type="text"
              placeholder="Barangay (e.g., Upper Quezon Hill)"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            
            <button 
              type="submit" 
              disabled={loading}
              onMouseOver={(e) => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#003366'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#003366'; e.currentTarget.style.color = 'white'; }}
              style={{ width: '100%', padding: '12px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 600, margin: '10px 0 0 0', transition: 'background 0.3s' }}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
          <p 
            onClick={() => { setIsLogin(true); setError(""); }}
            style={{ marginTop: '15px', fontSize: '0.9rem', color: '#003366', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Have an account? Login here.
          </p>
        </div>
      )}
    </div>
  );
}
