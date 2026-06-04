import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [trucks, setTrucks] = useState([]);
    const [userProfile, setUserProfile] = useState(null); 
    const [monthlyData, setMonthlyData] = useState([]); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Dynamic state tracker for pure inline CSS responsive layout
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        fetchDashboardData();

        // Screen resize dynamic event handler setup
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            const profileResponse = await axios.get('https://trucklogic-backend.onrender.com/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProfile(profileResponse.data.data);

            const trucksResponse = await axios.get('https://trucklogic-backend.onrender.com/api/trucks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrucks(trucksResponse.data.data);

            const monthlyRes = await axios.get('https://trucklogic-backend.onrender.com/api/trips/analytics/monthly', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMonthlyData(monthlyRes.data.data);

        } catch (err) {
            setError('Failed to sync enterprise telemetry data stream.');
            if (err.response?.status === 401) handleLogout();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const totalActiveTrucks = trucks.length;

    // Viewport break flag triggers
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
            
            {/* 📁 LEFT PREMIUM ENTERPRISE SIDEBAR (CONVERTS TO TOP HEADER ON MOBILE) */}
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

                {/* Hide detailed nav links on mobile for cleaner top action strip */}
                {!isMobile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <div onClick={() => navigate('/')} style={{ padding: '12px 16px', backgroundColor: '#1e293b', color: '#3b82f6', borderRadius: '8px', fontWeight: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>📊</span> Dashboard Overview
                        </div>
                        <div onClick={() => navigate('/add-truck')} style={{ padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#1e293b'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                            <span>🚛</span> Register Vehicle
                        </div>
                    </div>
                )}

                <div style={{ borderTop: isMobile ? 'none' : '1px solid #334155', paddingTop: isMobile ? '0' : '20px' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: isMobile ? '8px 14px' : '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.1)', fontSize: isMobile ? '13px' : '14px' }}>
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
                        <h1 style={{ margin: 0, fontSize: isMobile ? '22px' : '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>Operations Control Room</h1>
                        {userProfile && (
                            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span> 
                                Operator: <strong style={{ color: '#334155' }}>{userProfile.name}</strong>
                            </p>
                        )}
                    </div>

                    <button onClick={() => navigate('/add-truck')} style={{ width: isSmallMobile ? '100%' : 'auto', justifyContent: 'center', padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        + Add Fleet Unit
                    </button>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', fontWeight: '500' }}>{error}</div>}

                {/* 📈 DYNAMIC COMMERCIALLY ALIGNED EXECUTIVE ANALYTICS GRAPH */}
                {monthlyData.length > 0 && (
                    <div style={{ backgroundColor: '#fff', padding: isMobile ? '20px' : '25px 30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', marginBottom: '35px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Financial Performance Matrix</h3>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Gross freight revenue mapped against optimized net cash flows</span>
                        </div>
                        
                        {/* Native Recharts Container fluidity integration */}
                        <div style={{ width: '100%', height: isMobile ? 220 : 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 10, right: 5, left: isMobile ? -25 : 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '500' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '500' }} />
                                    <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none' }} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px', fontWeight: '500' }} />
                                    <Bar dataKey="revenue" fill="#10b981" name="Gross Revenue" radius={[4, 4, 0, 0]} barSize={isMobile ? 12 : 24} />
                                    <Bar dataKey="profit" fill="#3b82f6" name="Net Profit" radius={[4, 4, 0, 0]} barSize={isMobile ? 12 : 24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* 🚛 FLEET MANAGEMENT SYSTEM DISPLAY PANEL */}
                <div style={{ marginTop: '35px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Active Logistics Fleet</h3>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{totalActiveTrucks} Vehicles</span>
                    </div>

                    {trucks.length === 0 ? (
                        <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '50px', borderRadius: '16px', color: '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>📦</span>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>No fleet assets cataloged in current workspace environment.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                            gap: '20px' 
                        }}>
                            {trucks.map((truck) => (
                                <div key={truck._id} style={{
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
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#3b82f6' }}></div>
                                    
                                    <div>
                                        <span style={{ fontSize: '11px', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Asset Active</span>
                                        <h2 style={{ margin: '12px 0 6px 0', fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>{truck.truckNumber}</h2>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span>👤</span> Driver: <strong style={{ color: '#334155' }}>{truck.driverName}</strong>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/truck/${truck._id}`)}
                                        style={{ marginTop: '24px', padding: '12px', backgroundColor: '#f8fafc', color: '#3b82f6', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', width: '100%', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        Inspect Ledger Logs ➔
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

export default Dashboard;