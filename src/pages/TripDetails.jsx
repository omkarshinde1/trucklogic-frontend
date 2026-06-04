import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const TripDetails = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [tripInfo, setTripInfo] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Diesel');
    const [description, setDescription] = useState('');

    // Dynamic State hook for pure CSS responsiveness tracking
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        fetchTripAndExpenses();

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [tripId]);

    const fetchTripAndExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            const expResponse = await axios.get(`https://trucklogic-backend.onrender.com/api/expenses/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(expResponse.data.data);

            try {
                const tripResponse = await axios.get(`https://trucklogic-backend.onrender.com/api/trips/single/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTripInfo(tripResponse.data.data);
            } catch (e) {
                setTripInfo({ freightAmount: 0, status: 'Ongoing', source: 'N/A', destination: 'N/A' });
            }

            const analyticsResponse = await axios.get(`https://trucklogic-backend.onrender.com/api/expenses/analytics/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChartData(analyticsResponse.data.data);

        } catch (err) {
            setError('Failed to load trip operations telemetry data.');
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://trucklogic-backend.onrender.com/api/expenses/add',
                {
                    tripId,
                    amount: Number(amount),
                    expenseType: category,
                    description
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setAmount('');
                setDescription('');
                fetchTripAndExpenses(); 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense.');
        }
    };

    const handleCompleteTrip = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://trucklogic-backend.onrender.com/api/trips/status/${tripId}`,
                { status: 'Completed' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTripAndExpenses();
        } catch (err) {
            if (tripInfo) setTripInfo({ ...tripInfo, status: 'Completed' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const freight = tripInfo?.freightAmount || 0;
    const netProfit = freight - totalExpense;

    // Breakpoints for mobile alignment flags
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#1e293b', flexDirection: isMobile ? 'column' : 'row' }}>
            
            {/* 📁 LEFT PREMIUM ENTERPRISE SIDEBAR */}
            <div style={{ 
                width: isMobile ? '100%' : '260px', 
                backgroundColor: '#0f172a', 
                color: '#fff', 
                padding: isMobile ? '20px' : '30px 20px', 
                display: 'flex', 
                flexDirection: isMobile ? 'row' : 'column', 
                justifyContent: isMobile ? 'space-between' : 'flex-start',
                alignItems: isMobile ? 'center' : 'stretch',
                boxSizing: 'border-box', 
                boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
                position: isMobile ? 'sticky' : 'relative',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '0' : '40px' }}>
                    <div style={{ backgroundColor: '#3b82f6', padding: '6px 12px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold' }}>T</div>
                    <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', color: '#f8fafc' }}>TRUCK<span style={{ color: '#3b82f6' }}>LOGIC</span></span>
                </div>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: '8px 12px', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>📊 Overview</button>
                    <button onClick={handleLogout} style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>❌ Logout</button>
                </div>
            </div>

            {/* 💻 MAIN APP CONTENT WORKSPACE CONTAINER */}
            <div style={{ flex: 1, padding: isMobile ? '20px' : '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                {/* GLOBAL TOP APP BAR MODULE */}
                <div style={{ display: 'flex', flexDirection: isSmallMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isSmallMobile ? 'flex-start' : 'center', gap: '15px', marginBottom: '35px', backgroundColor: '#fff', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: isMobile ? '22px' : '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
                            {tripInfo?.source ? `${tripInfo.source} ➔ ${tripInfo.destination}` : 'Trip Audit Room'}
                        </h1>
                        <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Status: 
                            <span style={{ padding: '4px 10px', borderRadius: '30px', fontSize: '12px', fontWeight: '700', backgroundColor: tripInfo?.status === 'Completed' ? '#d1fae5' : '#fef3c7', color: tripInfo?.status === 'Completed' ? '#047857' : '#b45309' }}>
                                {tripInfo?.status || 'Ongoing'}
                            </span>
                        </p>
                    </div>

                    <button onClick={() => navigate(-1)} style={{ padding: '12px 20px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: isSmallMobile ? '100%' : 'auto', textAlign: 'center' }}>
                        ⬅️ Go Back
                    </button>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', fontWeight: '500' }}>{error}</div>}

                {/* BUSINESS INTELLIGENCE SCORECARD */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Gross Freight (Bhada)</span>
                        <h3 style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>₹{freight}</h3>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #ef4444', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Total Operations Expense</span>
                        <h3 style={{ margin: '8px 0 0 0', color: '#ef4444', fontSize: '24px', fontWeight: '800' }}>₹{totalExpense}</h3>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', borderLeft: `4px solid ${netProfit >= 0 ? '#10b981' : '#f97316'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Net Cash Flow (Profit)</span>
                        <h3 style={{ margin: '8px 0 0 0', color: netProfit >= 0 ? '#10b981' : '#f97316', fontSize: '24px', fontWeight: '800' }}>₹{netProfit}</h3>
                    </div>
                </div>

                {/* CHARTS CONTAINER GRID */}
                {chartData.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
                        
                        {/* Pie Chart Card */}
                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Expense Share Breakdown (Pie)</h4>
                            <div style={{ width: '100%', height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value}`} />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart Card */}
                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Category Volume Metrics (Bar)</h4>
                            <div style={{ width: '100%', height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                                        <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} />
                                        <Tooltip formatter={(value) => `₹${value}`} />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* TRIP ACTIONS MANAGEMENT CONTROL */}
                {tripInfo?.status !== 'Completed' && (
                    <div style={{ marginBottom: '35px', textAlign: 'right' }}>
                        <button onClick={handleCompleteTrip} style={{ width: isSmallMobile ? '100%' : 'auto', padding: '14px 24px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
                            ✓ Mark Trip as Completed 🏁
                        </button>
                    </div>
                )}

                {/* EXPENSE ENTRY FORM */}
                {tripInfo?.status !== 'Completed' ? (
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '35px' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Log Real-time Operational Cost</h4>
                        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: isMobile ? 'stretch' : 'flex-end' }}>
                            <div style={{ flex: isMobile ? 'none' : '0 0 150px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Amount (₹)</label>
                                <input type="number" placeholder="eg. 2500" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '100%', padding: '12px', marginTop: '6px', border: '1px solid #e2e8f0', borderRadius: '10px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ flex: isMobile ? 'none' : '0 0 200px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '6px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
                                    <option value="Diesel">Diesel ⛽</option>
                                    <option value="Toll">Toll 🛣️</option>
                                    <option value="Maintenance">Maintenance 🛠️</option>
                                    <option value="Driver Allowance">Driver Allowance 💵</option>
                                    <option value="Fine">Fine 🚨</option>
                                    <option value="Other">Other 📁</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Description</label>
                                <input type="text" placeholder="eg. HP Petrol Pump fuel refill" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '6px', border: '1px solid #e2e8f0', borderRadius: '10px', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" style={{ padding: '13px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}>
                                Log Expense
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ padding: '20px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '16px', marginBottom: '35px', fontWeight: '600', textAlign: 'center', fontSize: '14px' }}>
                        🔒 This transit manifestation is securely locked. Core financial assets cannot be mutated.
                    </div>
                )}

                {/* EXPENSES LIST LEDGER */}
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Operational Cost Registry Logs</h3>
                    {expenses.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>No transactional entries filed in this active profile workspace yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {expenses.map(exp => (
                                <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                                    <div style={{ paddingRight: '10px' }}>
                                        <strong style={{ color: '#0f172a', fontSize: '15px' }}>{exp.expenseType}</strong> 
                                        <span style={{ color: '#64748b', fontSize: '14px', marginLeft: '8px' }}>— {exp.description || 'General Manifest Item'}</span>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>📅 {new Date(exp.date).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ color: '#ef4444', fontWeight: '800', fontSize: '18px', whiteSpace: 'nowrap' }}>₹{exp.amount}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripDetails;