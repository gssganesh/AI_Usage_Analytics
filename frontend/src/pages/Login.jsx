import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, UserPlus, LogIn, Sparkles, Box, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* --- Interactive Owl Mascot Component --- */
function OwlMascot({ isPasswordFocused, mousePos }) {
    const owlRef = useRef(null);
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (owlRef.current && !isPasswordFocused) {
            const rect = owlRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(mousePos.y - centerY, mousePos.x - centerX);
            const dist = Math.min(3, Math.hypot(mousePos.x - centerX, mousePos.y - centerY) / 50);
            setEyeOffset({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
        } else {
            setEyeOffset({ x: 0, y: 0 });
        }
    }, [mousePos, isPasswordFocused]);

    return (
        <div className="owl-mascot" ref={owlRef}>
            <svg viewBox="0 0 100 100" width="120" height="120">
                {/* Owl Body */}
                <path d="M50 20 C30 20 20 40 20 60 C20 80 35 90 50 90 C65 90 80 80 80 60 C80 40 70 20 50 20Z" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2" />
                
                {/* Ears */}
                <path d="M25 35 L15 20 L35 25" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M75 35 L85 20 L65 25" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
                
                {/* Face Circles */}
                <circle cx="38" cy="45" r="15" fill="var(--bg-input)" opacity="0.6" />
                <circle cx="62" cy="45" r="15" fill="var(--bg-input)" opacity="0.6" />

                {/* Eyes */}
                {isPasswordFocused ? (
                    /* Closed Eyes (Wings covering) with slow transition defined in CSS class */
                    <g className="owl-eyes-closed">
                        <path d="M30 45 Q38 52 46 45" fill="none" stroke="var(--accent-light)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M54 45 Q62 52 70 45" fill="none" stroke="var(--accent-light)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M15 60 Q30 40 45 45" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="1.5" className="wing-left-hide" />
                        <path d="M85 60 Q70 40 55 45" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="1.5" className="wing-right-hide" />
                    </g>
                ) : (
                    /* Open Eyes with Tracking */
                    <g className="owl-eyes-open">
                        <circle cx={38 + eyeOffset.x} cy={45 + eyeOffset.y} r="6" fill="var(--accent-light)" />
                        <circle cx={38 + eyeOffset.x + 2} cy={45 + eyeOffset.y - 2} r="2" fill="white" />
                        <circle cx={62 + eyeOffset.x} cy={45 + eyeOffset.y} r="6" fill="var(--accent-light)" />
                        <circle cx={62 + eyeOffset.x + 2} cy={45 + eyeOffset.y - 2} r="2" fill="white" />
                    </g>
                )}

                {/* Beak */}
                <path d="M46 55 L50 63 L54 55 Z" fill="var(--warning)" />
                
                {/* Belly Pattern */}
                <path d="M40 75 Q50 72 60 75" fill="none" stroke="var(--border-light)" strokeWidth="1.5" />
                <path d="M42 80 Q50 77 58 80" fill="none" stroke="var(--border-light)" strokeWidth="1.5" />
            </svg>
        </div>
    );
}

/* --- Animated 3D Wireframe Sphere Background Component --- */
function AnimatedSphere() {
    return (
        <div className="sphere-mesh">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="sphere-lat" style={{ transform: `rotateY(${i * 15}deg)`, position:'absolute', inset:0, background:'transparent' }}></div>
            ))}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="sphere-long" style={{ transform: `translate(-50%, -50%) rotateX(${i * 30}deg)`, position:'absolute', top:'50%', left:'50%', width:'100%', height:'100%', background:'transparent' }}></div>
            ))}
        </div>
    );
}

export default function Login() {
    var auth = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    var [isSignup, setIsSignup] = useState(false);
    var [username, setUsername] = useState('');
    var [fullName, setFullName] = useState('');
    var [password, setPassword] = useState('');
    var [confirmPassword, setConfirmPassword] = useState('');
    var [error, setError] = useState('');
    var [loading, setLoading] = useState(false);
    var [isPasswordFocused, setIsPasswordFocused] = useState(false);
    var [showCelebration, setShowCelebration] = useState(false);
    var [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    var handleSubmit = async function(e) {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter username and password.');
            return;
        }

        if (isSignup) {
            if (!fullName.trim()) {
                setError('Please enter your full name.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (password.length < 4) {
                setError('Password must be at least 4 characters.');
                return;
            }
        }

        setLoading(true);
        try {
            if (isSignup) {
                await auth.signup(username.trim(), password.trim(), fullName.trim());
            } else {
                await auth.login(username.trim(), password.trim());
            }

            setShowCelebration(true);
            // Delay navigation slightly to let the user see the celebration
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-page-centered">
            <div className="login-form-container">
                {/* Centered Glass Module */}
                <div className="login-glass-card">
                
                <div className="form-content">
                    <OwlMascot isPasswordFocused={isPasswordFocused} mousePos={mousePos} />
                    
                    <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px' }}>
                            {isSignup ? 'Join the System' : 'Welcome to Student ED & AI Analytics'}
                        </h2>
                        <p style={{ color: '#000', fontSize: '1.05rem' }}>
                            {isSignup ? 'Create your professional account' : 'Sign in to explore performance data'}
                        </p>
                    </div>

                    {error && (
                        <div className="login-error" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <AlertCircle size={18} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="form-group floating">
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={loading}
                                    placeholder="Full Name"
                                />
                            </div>
                        )}

                        <div className="form-group floating">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                placeholder="Username"
                                autoFocus={!isSignup}
                            />
                        </div>

                        <div className="form-group floating">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                disabled={loading}
                                placeholder="Password"
                            />
                        </div>

                        {isSignup && (
                            <div className="form-group floating">
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    disabled={loading}
                                    placeholder="Confirm Password"
                                />
                            </div>
                        )}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '25px' }}>
                        <button
                            type="button"
                            className="btn-ghost"
                            style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 700, display: 'inline-flex', gap: '8px', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                            onClick={() => { setIsSignup(!isSignup); setError(''); }}
                        >
                            {isSignup ? (
                                <><LogIn size={16} /> Already have an account? <span style={{ color: 'var(--accent)' }}>Sign In</span></>
                            ) : (
                                <><UserPlus size={16} /> New here? <span style={{ color: 'var(--accent)' }}>Create Account</span></>
                            )}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', fontSize: '0.8rem', color: '#000' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={14} /> Powered by Student ED</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Info size={14} /> Help & Security</div>
                </div>
            </div>

            {showCelebration && (
                <div className="celebration-overlay">
                    <div className="confetti-container">
                        {[...Array(60)].map((_, i) => (
                            <div key={i} className="confetti" style={{
                                left: `${Math.random() * 100}%`,
                                background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                                animationDuration: `${1.5 + Math.random() * 2}s`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                position:'absolute', top:'-10%', width:'10px', height:'10px'
                            }}></div>
                        ))}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:'20px' }}>
                        <Sparkles size={80} color="var(--accent)" />
                        <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>Verified!</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Preparing your personalized dashboard...</p>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}