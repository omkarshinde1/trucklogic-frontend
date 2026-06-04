import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddTrip = () => {
    const { id } = useParams(); 
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [freightAmount, setFreightAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Dynamic state tracker for pure inline CSS responsive layout scaling
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'https://trucklogic-backend.onrender.com/api/trips/add',
                {
                    truckId: id,         
                    source,              
                    destination,         
                    freightAmount,       
                    startDate
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                navigate(`/truck/${id}`); 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to dispatch transit unit.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Breakpoint tracking flags
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;

    // Shared Input Component Style Factory
    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        marginTop: '6px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#0f172a',
        boxSizing: 'border-box',
        outline: 'none',
        transition: '0.2s'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#475569',
        letterSpacing: '-0.2px'
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            backgroundColor: '#f1f5f9', 
            fontFamily: '"Inter", "Segoe UI", sans-serif', 
            color: '#1e293b',
            flexDirection: isMobile ? 'column' : 'row' 
        }}>
            
            {/* 📁 LEFT PREMIUM ENTERPRISE SIDEBAR (CONVERTS TO ACCENT HEADER ON MOBILE Screens) */}
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
            <div style={{ flex: 1, padding: isMobile ? '25px 20px' : '40px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
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
                        <h1 style={{ margin: 0, fontSize: isMobile ? '22px' : '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>Initialize Transit Waybill</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Deploy a fresh commercial trip profile to this vehicle unit</p>
                    </div>

                    <button onClick={() => navigate(`/truck/${id}`)} style={{ width: isSmallMobile ? '100%' : 'auto', justifyContent: 'center', padding: '12px 20px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⬅️ Cancel Logistics Form
                    </button>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', fontWeight: '500' }}>{error}</div>}

                {/* 📝 FORM MANAGEMENT CENTERED CONTAINER */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: isSmallMobile ? '30px 20px' : '35px', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', 
                    maxWidth: '600px', 
                    width: '100%', 
                    boxSizing: 'border-box' 
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Source and Destination row converts dynamically to column template stack flow on small desktop boundaries */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: isSmallMobile ? '1fr' : '1fr 1fr', 
                            gap: '20px' 
                        }}>
                            <div>
                                <label style={labelStyle}>Source (Kuthun)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Pune"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Destination (Kuthe)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mumbai"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Freight Amount (Bhada ₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 15000"
                                value={freightAmount}
                                onChange={(e) => setFreightAmount(e.target.value)}
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={{ 
                                marginTop: '10px',
                                padding: '14px', 
                                backgroundColor: '#3b82f6', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '10px', 
                                fontSize: '15px', 
                                fontWeight: '600', 
                                cursor: 'pointer', 
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                                transition: '0.2s' 
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                            🚀 Dispatch & Start Journey
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AddTrip;