"use client";
export default function SheltersPage() {
  return (
    <section className="container" style={{ display: 'block' }}>
        <div className="section-header"><h2>Partner Shelters</h2></div>
        
        <div className="shelter-card">
            <div className="shelter-logo"><img src="/uploads/shelter_furvent.jpg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=Logo'; }} alt="Furvent" /></div>
            <div className="shelter-info">
                <h3>Furvent Animal Rescue <span className="status-badge status-open">Open</span></h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '5px' }}><i className="fas fa-map-marker-alt" style={{ width: '20px' }}></i> Baguio City</li>
                    <li style={{ marginBottom: '5px' }}><a href="tel:09122126617" style={{ color: 'inherit', textDecoration: 'none' }}><i className="fas fa-phone" style={{ width: '20px' }}></i> 0912-212-6617</a></li>
                    <li style={{ marginBottom: '5px' }}><i className="fas fa-envelope" style={{ width: '20px' }}></i> furventrescueadvocacy@gmail.com</li>
                </ul>
            </div>
        </div>
        <div className="shelter-card">
            <div className="shelter-logo"><img src="/uploads/shelter_cvao.jpg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=Logo'; }} alt="CVAO" /></div>
            <div className="shelter-info">
                <h3>Baguio City Vet Office <span className="status-badge status-open">Open</span></h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '5px' }}><i className="fas fa-map-marker-alt" style={{ width: '20px' }}></i> Slaughterhouse Cmpnd, Baguio</li>
                    <li style={{ marginBottom: '5px' }}><a href="tel:0744435332" style={{ color: 'inherit', textDecoration: 'none' }}><i className="fas fa-phone" style={{ width: '20px' }}></i> (074) 443-5332</a></li>
                    <li style={{ marginBottom: '5px' }}><i className="far fa-clock" style={{ width: '20px' }}></i> Mon - Fri, 8AM - 5PM</li>
                </ul>
            </div>
        </div>
    </section>
  );
}
