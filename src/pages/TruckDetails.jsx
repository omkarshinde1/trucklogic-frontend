import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TruckDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [trips, setTrips] = useState([]);
    const [truckInfo, setTruckInfo] = useState(null); 
    const [error, setError] = useState('');

    // Dynamic state tracker for inline responsive execution
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        fetchTruckAndTrips();

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    const fetchTruckAndTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(response.data.data);

            const trucksResponse = await axios.get('http://localhost:5000/api/trucks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const currentTruck = trucksResponse.data.data.find(t => t._id === id);
            if (currentTruck) {
                setTruckInfo(currentTruck);
            }

        } catch (err) {
            setError('Failed to sync enterprise telemetry data stream.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Breakpoint calculation rules
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            backgroundColor: '#f1f5f9', 
            fontFamily: '"Inter", "Segoe UI", sans-serif', 
            color: '#1e293b',
            flexDirection: isMobile ? 'column' : 'row'
        }}>
            
            {/* 📁 LEFT PREMIUM ENTERPRISE SIDEBAR (CONVERTS TO RESPONSIVE STRIP ON MOBILE) */}
            <div style={{ 
                width: isMobile ? '100%' : '260px', 
                backgroundColor: '#0f172a', 
                color: '#fff', 
                padding: isMobile ? '15px 20px' : '30px 20px', 
                display: 'flex', 
                flexDirection: isMobile ? 'row' : 'column', 
                justifyContent: isMobile ? 'space-between' : 'flex-start',
                alignItems: isMobile ? 'center' : 'stretch',
                boxSizing: 'border-box', 
                boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
                position: isMobile ? 'sticky' : 'relative',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '0' : '40px' }}>
                    <div style={{ backgroundColor: '#3b82f6', padding: '6px 12px', borderRadius: '8px', fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold' }}>T</div>
                    <span style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '800', letterSpacing: '0.5px', color: '#f8fafc' }}>TRUCK<span style={{ color: '#3b82f6' }}>LOGIC</span></span>
                </div>

                {!isMobile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <div onClick={() => navigate('/')} style={{ padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>📊</span> Dashboard Overview
                        </div>
                        <div onClick={() => navigate('/add-truck')} style={{ padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🚛</span> Register Vehicle
                        </div>
                    </div>
                )}

                <div style={{ borderTop: isMobile ? 'none' : '1px solid #334155', paddingTop: isMobile ? '0' : '20px' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: isMobile ? '8px 14px' : '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: isMobile ? '13px' : '14px' }}>
                        ❌ {isMobile ? 'Logout' : 'Secure Logout'}
                    </button>
                </div>
            </div>

            {/* 💻 MAIN APP CONTENT WORKSPACE CONTAINER */}
            <div style={{ flex: 1, padding: isMobile ? '20px' : '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                {/* GLOBAL TOP APP BAR MODULE */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: isSmallMobile ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: isSmallMobile ? 'flex-start' : 'center', 
                    gap: '15px',
                    marginBottom: '35px', 
                    backgroundColor: '#fff', 
                    padding: '20px 30px', 
                    borderRadius: '16px', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: isMobile ? '22px' : '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
                            {truckInfo ? `Fleet Unit: ${truckInfo.truckNumber}` : 'Vehicle Ledger Registry'}
                        </h1>
                        {truckInfo && (
                            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span> 
                                Assigned Driver: <strong style={{ color: '#334155' }}>{truckInfo.driverName}</strong>
                            </p>
                        )}
                    </div>

                    <button onClick={() => navigate('/')} style={{ width: isSmallMobile ? '100%' : 'auto', justifyContent: 'center', padding: '12px 20px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⬅️ Back to Dashboard
                    </button>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', fontWeight: '500' }}>{error}</div>}

                {/* 🛣️ TRIP MANAGEMENT HISTORY DISPLAY PANEL */}
                <div style={{ marginTop: '25px' }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: isSmallMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: isSmallMobile ? 'flex-start' : 'center', 
                        gap: '15px',
                        marginBottom: '20px', 
                        borderBottom: '1px solid #e2e8f0', 
                        paddingBottom: '12px' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Historical Transit Logs</h3>
                            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{trips.length} Journeys</span>
                        </div>
                        
                        <button 
                            onClick={() => navigate(`/truck/${id}/add-trip`)} 
                            style={{ width: isSmallMobile ? '100%' : 'auto', justifyContent: 'center', padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            + Add New Trip
                        </button>
                    </div>

                    {trips.length === 0 ? (
                        <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '50px', borderRadius: '16px', color: '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🛣️</span>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>No active transit manifests logged for this strategic fleet asset.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                            gap: '20px' 
                        }}>
                            {trips.map((trip) => (
                                <div key={trip._id} style={{
                                    backgroundColor: '#fff',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '4px', 
                                        backgroundColor: trip.status === 'Ongoing' ? '#f59e0b' : '#10b981' 
                                    }}></div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                color: trip.status === 'Ongoing' ? '#b45309' : '#047857', 
                                                backgroundColor: trip.status === 'Ongoing' ? '#fef3c7' : '#d1fae5', 
                                                padding: '4px 10px', 
                                                borderRadius: '30px', 
                                                fontWeight: '700', 
                                                textTransform: 'uppercase' 
                                            }}>
                                                {trip.status}
                                            </span>
                                            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                                                📅 {new Date(trip.startDate).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                                            {trip.source} <span style={{ color: '#3b82f6' }}>➔</span> {trip.destination}
                                        </h4>
                                        
                                        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #e2e8f0', marginTop: '12px' }}>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Gross Revenue (Bhada):</p>
                                            <p style={{ margin: '2px 0 0 0', color: '#10b981', fontSize: '20px', fontWeight: '800' }}>₹{trip.freightAmount}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/trip/${trip._id}`)}
                                        style={{ 
                                            marginTop: '20px', 
                                            padding: '12px', 
                                            backgroundColor: '#0f172a', 
                                            color: '#fff', 
                                            border: 'none', 
                                            borderRadius: '10px', 
                                            cursor: 'pointer', 
                                            width: '100%', 
                                            fontSize: '13px', 
                                            fontWeight: '600', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            gap: '6px', 
                                            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.15)'
                                        }}
                                    >
                                        Manage Expenses ➔
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TruckDetails;