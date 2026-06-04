import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTruck = () => {
    const [truckNumber, setTruckNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Dynamic state tracker for pure inline CSS responsive framework
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'https://trucklogic-backend.onrender.com/api/trucks/add',
                { truckNumber, driverName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                navigate('/'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to catalog asset in database routing logs.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Breakpoint dynamic validation flags
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
            
            {/* 📁 LEFT PREMIUM ENTERPRISE SIDEBAR (AUTO-SWITCH TO HEADER PANEL ON MOBILE) */}
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
                        <div onClick={() => navigate('/')} style={{ padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#1e293b'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                            <span>📊</span> Dashboard Overview
                        </div>
                        <div onClick={() => navigate('/add-truck')} style={{ padding: '12px 16px', backgroundColor: '#1e293b', color: '#3b82f6', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <div style={{ 
                flex: 1, 
                padding: isMobile ? '25px 20px' : '40px', 
                boxSizing: 'border-box', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                
                {/* FORM PANEL CONTAINER */}
                <div style={{ 
                    width: '100%', 
                    maxWidth: '480px', 
                    backgroundColor: '#fff', 
                    padding: isSmallMobile ? '30px 20px' : '40px 35px', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    border: '1px solid #e2e8f0',
                    boxSizing: 'border-box'
                }}>
                    
                    {/* TOP TITLE */}
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ margin: 0, fontSize: isSmallMobile ? '20px' : '24px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
                            Asset Provisioning Panel ➕🚛
                        </h2>
                        <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            Register new fleet logistics hardware node below.
                        </p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '500', border: '1px solid #fca5a5' }}>
                            {error}
                        </div>
                    )}

                    {/* ENTRY REPOSITORY FORM */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        
                        {/* TRUCK NUMBER FIELD */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Vehicle Registration Number
                            </label>
                            <input 
                                type="text" 
                                placeholder="MH-17-BY-1234" 
                                value={truckNumber} 
                                onChange={(e) => setTruckNumber(e.target.value.toUpperCase())} 
                                required 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 16px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    fontSize: '14px', 
                                    color: '#1e293b',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f8fafc',
                                    fontWeight: '500',
                                    transition: '0.2s'
                                }} 
                                onFocus={(e) => { e.target.style.border = '1px solid #3b82f6'; e.target.style.backgroundColor = '#fff'; }}
                                onBlur={(e) => { e.target.style.border = '1px solid #cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
                            />
                        </div>

                        {/* DRIVER NAME FIELD */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Appointed Driver Identity
                            </label>
                            <input 
                                type="text" 
                                placeholder="Logistics Operator" 
                                value={driverName} 
                                onChange={(e) => setDriverName(e.target.value)} 
                                required 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 16px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    fontSize: '14px', 
                                    color: '#1e293b',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f8fafc',
                                    fontWeight: '500',
                                    transition: '0.2s'
                                }} 
                                onFocus={(e) => { e.target.style.border = '1px solid #3b82f6'; e.target.style.backgroundColor = '#fff'; }}
                                onBlur={(e) => { e.target.style.border = '1px solid #cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
                            />
                        </div>

                        {/* ACTION PANEL ACTIONS */}
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: isSmallMobile ? 'column-reverse' : 'row', 
                            gap: '15px', 
                            marginTop: '10px' 
                        }}>
                            {/* GO BACK */}
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                style={{ 
                                    flex: 1,
                                    width: '100%',
                                    padding: '14px', 
                                    backgroundColor: '#fff', 
                                    color: '#64748b', 
                                    border: '1px solid #cbd5e1', 
                                    borderRadius: '8px', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                            >
                                ⬅️ Cancel
                            </button>

                            {/* SUBMIT LOG */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ 
                                    flex: 2,
                                    width: '100%',
                                    padding: '14px', 
                                    backgroundColor: loading ? '#93c5fd' : '#3b82f6', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    cursor: loading ? 'not-allowed' : 'pointer', 
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', 
                                    transition: '0.2s'
                                }}
                            >
                                {loading ? 'Provisioning...' : 'Save Asset 💾'}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddTruck;