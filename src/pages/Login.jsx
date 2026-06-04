import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/'); // Secure redirect to premium dashboard
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            backgroundColor: '#f1f5f9', // Light gray background matching dashboard
            fontFamily: '"Inter", "Segoe UI", sans-serif',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            {/* MAIN PREMIUM CREDENTIALS CARD */}
            <div style={{ 
                width: '100%', 
                maxWidth: '420px', 
                backgroundColor: '#fff', 
                padding: '40px 30px', 
                borderRadius: '16px', 
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
                border: '1px solid #e2e8f0',
                boxSizing: 'border-box'
            }}>
                
                {/* BRANDING MODULE */}
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: '#3b82f6', 
                        color: '#fff', 
                        padding: '10px 14px', 
                        borderRadius: '10px', 
                        fontSize: '22px', 
                        fontWeight: 'bold',
                        marginBottom: '15px'
                    }}>
                        T
                    </div>
                    <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                        TRUCK<span style={{ color: '#3b82f6' }}>LOGIC</span>
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                        Operations Portal Login 🔒
                    </p>
                </div>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fee2e2', 
                        color: '#ef4444', 
                        padding: '12px 15px', 
                        borderRadius: '8px', 
                        marginBottom: '20px', 
                        fontSize: '13px', 
                        fontWeight: '500',
                        textAlign: 'center',
                        border: '1px solid #fca5a5'
                    }}>
                        {error}
                    </div>
                )}

                {/* SECURE INPUT FORM */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* EMAIL INPUT FIELD */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="operator@trucklogic.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
                                transition: '0.2s'
                            }} 
                            onFocus={(e) => { e.target.style.border = '1px solid #3b82f6'; e.target.style.backgroundColor = '#fff'; }}
                            onBlur={(e) => { e.target.style.border = '1px solid #cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
                        />
                    </div>

                    {/* PASSWORD INPUT FIELD */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
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
                                transition: '0.2s'
                            }} 
                            onFocus={(e) => { e.target.style.border = '1px solid #3b82f6'; e.target.style.backgroundColor = '#fff'; }}
                            onBlur={(e) => { e.target.style.border = '1px solid #cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
                        />
                    </div>

                    {/* INTERACTIVE COMPOSITE LOGIN BUTTON */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '14px', 
                            backgroundColor: loading ? '#93c5fd' : '#3b82f6', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '15px', 
                            fontWeight: '600', 
                            cursor: loading ? 'not-allowed' : 'pointer', 
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', 
                            marginTop: '10px',
                            transition: '0.2s'
                        }}
                        onMouseEnter={(e) => { if(!loading) e.target.style.backgroundColor = '#2563eb'; }}
                        onMouseLeave={(e) => { if(!loading) e.target.style.backgroundColor = '#3b82f6'; }}
                    >
                        {loading ? 'Authenticating Workspace...' : 'Sign In to Portal'}
                    </button>
                </form>

                {/* REDIRECT ANCHOR LINK BLOCK */}
                <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                        Don't have an operations account?{' '}
                        <span 
                            onClick={() => navigate('/register')} 
                            style={{ 
                                color: '#3b82f6', 
                                fontWeight: '600', 
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Register here
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;