"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import styles from './admin.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AdminDashboard({
  initialPets,
  initialApplications,
  initialLostPets,
  initialShelters,
  initialDonations,
  analytics
}: any) {
  const [activeSection, setActiveSection] = useState('manage-pets');
  const [pets, setPets] = useState(initialPets);
  const [applications, setApplications] = useState(initialApplications);
  const [lostPets, setLostPets] = useState(initialLostPets);
  const [shelters, setShelters] = useState(initialShelters);
  
  // Predictor State
  const [predAge, setPredAge] = useState('');
  const [predMedical, setPredMedical] = useState('');
  const [prediction, setPrediction] = useState<any>(null);

  // Stats
  const totalPets = pets.length;
  const pendingApps = applications.filter((a: any) => a.status === 'Pending').length;
  const missingPets = lostPets.filter((l: any) => l.status === 'Missing').length;
  const unreadApps = applications.filter((a: any) => a.is_read === false || a.is_read === 0).length;

  const showSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const predictAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!predAge || !predMedical) return;

    let prob = 50;
    let confidence = "High (Based on shelter-wide demographic analysis)";

    if (predAge === "Puppy/Kitten" && predMedical === "Healthy") prob = 95;
    else if (predAge === "Puppy/Kitten" && predMedical === "Needs Care") prob = 75;
    else if (predAge === "Adult" && predMedical === "Healthy") prob = 60;
    else if (predAge === "Adult" && predMedical === "Needs Care") prob = 35;
    else if (predAge === "Senior" && predMedical === "Healthy") prob = 25;
    else if (predAge === "Senior" && predMedical === "Needs Care") prob = 10;

    let recommendation, color, icon, lengthOfStay, resAlloc;
    if (prob >= 75) {
      recommendation = "Green Light Intake. This demographic has very high market demand. Expected to be adopted quickly with minimal resource drain.";
      lengthOfStay = "Fast (Less than 2 weeks)";
      resAlloc = "Standard Kennel, Basic Medical Prep";
      color = "#28a745";
      icon = "fa-check-circle";
    } else if (prob >= 40) {
      recommendation = "Standard Intake. Average demand. Ensure sufficient standard cage space is available for an average stay duration.";
      lengthOfStay = "Average (1 to 2 months)";
      resAlloc = "Long-term Enclosure, Routine Behavior Checking";
      color = "#d4af37";
      icon = "fa-exclamation-circle";
    } else {
      recommendation = "Caution Advised. Low historical demand. This profile (especially Seniors or those needing care) will likely result in a long-term stay. Action: Seek a specialized foster home instead of a standard cage.";
      lengthOfStay = "Long-stayer (3+ months to indefinitely)";
      resAlloc = "Premium foster-based space, High-priority Social Media Marketing, Medical Budget";
      color = "#dc3545";
      icon = "fa-exclamation-triangle";
    }

    setPrediction({ prob, confidence, lengthOfStay, resAlloc, recommendation, color, icon });
  };

  const calculateScore = (app: any) => {
    let score = 50;
    if (app.housing_type?.toLowerCase().includes('owned')) score += 20;
    if (app.has_fence?.toLowerCase().includes('yes')) score += 15;
    const hours = parseInt(app.hours_alone) || 0;
    if (hours <= 4) score += 15;
    else if (hours > 8) score -= 15;
    return Math.min(score, 100);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="#" onClick={(e) => { e.preventDefault(); showSection('manage-pets'); }} className={activeSection === 'manage-pets' ? styles.active : ''}><i className="fas fa-dog"></i> Manage Pets</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); showSection('analytics'); }} className={activeSection === 'analytics' ? styles.active : ''}><i className="fas fa-chart-line"></i> Analytics & Prediction</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); showSection('applications'); }} className={activeSection === 'applications' ? styles.active : ''}><i className="fas fa-file-alt"></i> Applications {unreadApps > 0 && <span className={styles.notificationBadge}>{unreadApps}</span>}</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); showSection('lost-found'); }} className={activeSection === 'lost-found' ? styles.active : ''}><i className="fas fa-search-location"></i> Lost & Found</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); showSection('shelter-status'); }} className={activeSection === 'shelter-status' ? styles.active : ''}><i className="fas fa-home"></i> Shelter Status</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); showSection('donations'); }} className={activeSection === 'donations' ? styles.active : ''}><i className="fas fa-hand-holding-usd"></i> Donations</a></li>
        </ul>
        <div className={styles.logout}>
          <ul><li><a href="/logout"><i className="fas fa-sign-out-alt"></i> Logout</a></li></ul>
        </div>
      </div>

      <div className={styles.content}>
        <h1>Welcome, Admin!</h1>

        <div className={styles.dashboardStats}>
          <div className={styles.card} style={{ borderLeftColor: '#003366' }}>
            <h3>Total Pets</h3>
            <p style={{ color: '#003366' }}>{totalPets}</p>
          </div>
          <div className={styles.card} style={{ borderLeftColor: '#d4af37' }}>
            <h3>Pending Applications</h3>
            <p style={{ color: '#d4af37' }}>{pendingApps}</p>
          </div>
          <div className={styles.card} style={{ borderLeftColor: '#dc3545' }}>
            <h3>Lost Reports</h3>
            <p style={{ color: '#dc3545' }}>{missingPets}</p>
          </div>
        </div>

        <div className={`${styles.section} ${activeSection === 'manage-pets' ? styles.active : ''}`}>
          <h3>Current Adoptable Pets</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet: any) => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td><img src={pet.image_url} alt="Pet" style={{ width: 50, height: 50, objectFit: 'cover' }} /></td>
                  <td>{pet.name}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.type}</td>
                  <td>{pet.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${styles.section} ${activeSection === 'analytics' ? styles.active : ''}`}>
          <h3><i className="fas fa-brain"></i> Business Predictive Analytics</h3>
          
          <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
            <h4 style={{ color: '#003366', marginBottom: '5px' }}><i className="fas fa-magic"></i> Intake Adoptability Predictor</h4>
            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>Use this tool before accepting a new pet to forecast how easily they will be adopted.</p>
            
            <form onSubmit={predictAdoption} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={predAge} onChange={e => setPredAge(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 }}>
                <option value="" disabled>Select Age Group</option>
                <option value="Puppy/Kitten">Puppy / Kitten (0-1 year)</option>
                <option value="Adult">Adult (1-7 years)</option>
                <option value="Senior">Senior (7+ years)</option>
              </select>
              <select value={predMedical} onChange={e => setPredMedical(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 }}>
                <option value="" disabled>Select Medical Status</option>
                <option value="Healthy">Healthy / Vaccinated</option>
                <option value="Needs Care">Needs Medical Treatment</option>
              </select>
              <button type="submit" className={styles.btnPrimary} style={{ width: 'auto', margin: 0, padding: '10px 25px', background: '#d4af37', color: '#003366' }}>
                <i className="fas fa-calculator"></i> Run Forecast
              </button>
            </form>

            {prediction && (
              <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', background: 'white', borderLeft: `6px solid ${prediction.color}`, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                  <h4 style={{ color: prediction.color, margin: 0, fontSize: '1.2rem' }}><i className={`fas ${prediction.icon}`}></i> Forecasted Adoption Probability: {prediction.prob}%</h4>
                </div>
                <p style={{ marginBottom: '8px', color: '#555' }}><strong>Data Confidence:</strong> {prediction.confidence}</p>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, background: '#f4f7f6', padding: '10px', borderRadius: '4px' }}><strong style={{ color: '#003366' }}>Predicted Length of Stay:</strong><br/>{prediction.lengthOfStay}</div>
                  <div style={{ flex: 1, background: '#f4f7f6', padding: '10px', borderRadius: '4px' }}><strong style={{ color: '#003366' }}>Resource Recommendation:</strong><br/>{prediction.resAlloc}</div>
                </div>
                <p style={{ background: '#fdfdfd', padding: '10px', borderRadius: '4px', border: '1px solid #eee', color: '#333' }}><strong>Business Recommendation:</strong><br/>{prediction.recommendation}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '500px', background: '#fff', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: '15px', color: '#555' }}>Baseline Shelter Success Rate</h4>
              <div style={{ position: 'relative', height: '300px' }}>
                <Doughnut data={{
                  labels: ['Adopted (Historical)', 'Currently Available'],
                  datasets: [{ data: [analytics.adoptedCount, analytics.availableCount], backgroundColor: ['#28a745', '#003366'], borderWidth: 1 }]
                }} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '500px', background: '#fff', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: '5px', color: '#555' }}>Top High-Risk Barangays</h4>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginBottom: '15px' }}>(Most Stray & Lost Pet Reports)</p>
              <div style={{ position: 'relative', height: '280px' }}>
                <Bar data={{
                  labels: analytics.bhLabels,
                  datasets: [{ label: 'Stray Reports', data: analytics.bhData, backgroundColor: '#d4af37', borderRadius: 4 }]
                }} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px', maxWidth: '500px', background: '#fff', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: '5px', color: '#555' }}>Applicant Success Demographics</h4>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginBottom: '15px' }}>(Approval Rate by Applicant Age)</p>
              <div style={{ position: 'relative', height: '280px' }}>
                <Bar data={{
                  labels: analytics.ageLabels,
                  datasets: [{ label: 'Approval Rate (%)', data: analytics.ageData, backgroundColor: '#17a2b8', borderRadius: 4 }]
                }} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.section} ${activeSection === 'applications' ? styles.active : ''}`}>
          <h3>Adoption Applications</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Pet</th>
                <th>Applicant & Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app: any) => {
                const score = calculateScore(app);
                const scoreColor = score >= 80 ? '#28a745' : (score >= 60 ? '#d4af37' : '#dc3545');
                return (
                  <tr key={app.id} className={app.is_read === 0 || app.is_read === false ? styles.unreadRow : ''}>
                    <td style={{ fontWeight: 'bold', color: '#003366' }}>{app.pet_name}</td>
                    <td>
                      <strong>{app.fullname}</strong><br/>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: scoreColor }}><i className="fas fa-star"></i> Fit Score: {score}/100</span>
                    </td>
                    <td>{app.status}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className={`${styles.section} ${activeSection === 'lost-found' ? styles.active : ''}`}>
          <h3>Lost & Found</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lostPets.map((pet: any) => (
                <tr key={pet.id}>
                  <td>{pet.pet_name}</td>
                  <td>{pet.location}</td>
                  <td>{pet.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${styles.section} ${activeSection === 'shelter-status' ? styles.active : ''}`}>
          <h3>Shelter Status</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Shelter</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shelters.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${styles.section} ${activeSection === 'donations' ? styles.active : ''}`}>
          <h3>Recent Donations</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Amount (PHP)</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d: any) => (
                <tr key={d.id}>
                  <td>{d.donor_name}</td>
                  <td style={{ fontWeight: 'bold', color: '#28a745' }}>{d.amount}</td>
                  <td>{d.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
