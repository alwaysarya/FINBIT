import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, ArrowLeft, ChevronRight, User, Briefcase, MapPin, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import Toast from '../components/Toast';

const CreditCardApply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [form, setForm] = useState({
    fullName: '', dob: '', mobile: '', email: '', pan: '',
    employmentType: 'Salaried', monthlyIncome: '', annualIncome: '', existingEmi: '',
    address: '', city: '', state: '', pin: '',
    cardType: 'Platinum', consent: false
  });

  const [appId, setAppId] = useState('');

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent) {
      setToast({ message: 'Please accept the terms and conditions.', type: 'error' });
      return;
    }
    const refId = 'FIN' + Math.floor(100000 + Math.random() * 900000);
    setAppId(refId);
    setStep(5);
  };

  const inputStyle = { width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem' };
  const labelStyle = { fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem', position: 'relative' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        
        {step < 5 && (
          <div style={{ marginBottom: '2rem' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
        )}

        {step < 5 && (
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>Apply for Credit Card</h1>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><User size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Personal Details</h3>
              </div>
              <label style={labelStyle}>Full Legal Name</label>
              <input style={inputStyle} type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
              <label style={labelStyle}>Date of Birth</label>
              <input style={inputStyle} type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} required />
              <label style={labelStyle}>Mobile Number</label>
              <input style={inputStyle} type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} required />
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <label style={labelStyle}>PAN Number</label>
              <input style={inputStyle} type="text" value={form.pan} onChange={e => setForm({...form, pan: e.target.value.toUpperCase()})} placeholder="ABCDE1234F" required />
              <button onClick={handleNext} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Next <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><Briefcase size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Employment & Income</h3>
              </div>
              
              <label style={labelStyle}>Employment Type</label>
              {/* CUSTOM DROPDOWN */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  style={{ ...inputStyle, marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  {form.employmentType}
                  <ChevronDown size={18} color="#888" />
                </div>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      style={{ position: 'absolute', top: '105%', left: 0, width: '100%', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}
                    >
                      {['Salaried', 'Self-Employed', 'Retired / Pensioner'].map(opt => (
                        <div 
                          key={opt} 
                          onClick={() => { setForm({...form, employmentType: opt}); setDropdownOpen(false); }} 
                          style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: form.employmentType === opt ? '#F2C879' : '#FFF', color: '#1A1A1A', fontWeight: form.employmentType === opt ? 600 : 500 }}
                        >
                          {opt}
                          {form.employmentType === opt && <Check size={16} color="#1A1A1A" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <label style={labelStyle}>Monthly Income (₹)</label>
              <input style={inputStyle} type="number" value={form.monthlyIncome} onChange={e => setForm({...form, monthlyIncome: e.target.value})} required />
              <label style={labelStyle}>Annual Income (₹)</label>
              <input style={inputStyle} type="number" value={form.annualIncome} onChange={e => setForm({...form, annualIncome: e.target.value})} required />
              <label style={labelStyle}>Existing Monthly EMI (₹)</label>
              <input style={inputStyle} type="number" value={form.existingEmi} onChange={e => setForm({...form, existingEmi: e.target.value})} />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleBack} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 1 }}>Back</button>
                <button onClick={handleNext} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 2 }}>Next</button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><MapPin size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Address Details</h3>
              </div>
              <label style={labelStyle}>Current Residential Address</label>
              <input style={inputStyle} type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>City</label><input style={inputStyle} type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required /></div>
                <div><label style={labelStyle}>State</label><input style={inputStyle} type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} required /></div>
              </div>
              <label style={labelStyle}>PIN Code</label>
              <input style={inputStyle} type="text" value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} required />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleBack} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 1 }}>Back</button>
                <button onClick={handleNext} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 2 }}>Next</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><CreditCard size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Select Card & Consent</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {['Classic', 'Platinum', 'Signature'].map(card => (
                  <div key={card} onClick={() => setForm({...form, cardType: card})} style={{ padding: '1.5rem 1rem', borderRadius: '16px', border: form.cardType === card ? '2px solid #DBA030' : '1px solid #E5E5E5', background: form.cardType === card ? '#FCF9F2' : '#FFF', cursor: 'pointer', textAlign: 'center' }}>
                    <CreditCard size={24} color={form.cardType === card ? '#DBA030' : '#888'} style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A' }}>FINBIT {card}</p>
                  </div>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '2rem' }}>
                <input type="checkbox" checked={form.consent} onChange={e => setForm({...form, consent: e.target.checked})} style={{ marginTop: '5px' }} />
                <span style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>I confirm that the information provided is accurate. I authorize FINBIT to verify my identity and documents, and consent to applicable credit bureau checks as per the privacy policy.</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleBack} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 1 }}>Back</button>
                <button onClick={handleSubmit} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 2 }}>Submit Application</button>
              </div>
            </motion.div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#FFF', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', marginTop: '2rem' }}>
              <div style={{ background: '#ECFDF5', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={48} color="#10B981" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '0.5rem' }}>Application Submitted!</h2>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>Your application has been received successfully.</p>
              <div style={{ background: '#FCF9F2', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', textAlign: 'left', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Application Reference ID</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A1A', fontFamily: 'monospace', letterSpacing: '2px' }}>{appId}</p>
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '10px' }}>Status: <span style={{ color: '#DBA030', fontWeight: 600 }}>Under Review</span></p>
              </div>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Our team will contact you within 24-48 hours.</p>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#1A1A1A', color: '#FFF', border: 'none', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
                Back to Dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreditCardApply;
