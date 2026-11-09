import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, ArrowLeft, ChevronRight, User, Briefcase, MapPin, ChevronDown, Check, AlertCircle } from 'lucide-react';

const CreditCardApply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [form, setForm] = useState({
    fullName: '', dob: '', mobile: '', email: '', pan: '',
    employmentType: 'Salaried', monthlyIncome: '', annualIncome: '', existingEmi: '',
    address: '', city: '', state: '', pin: '',
    cardType: 'Platinum', consent: false
  });

  const [appId, setAppId] = useState('');

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!form.fullName || !form.dob || !form.mobile || !form.email || !form.pan) {
        setErrorMsg('Please fill all personal details before proceeding.');
        return;
      }
    }
    if (step === 2) {
      if (!form.monthlyIncome || !form.annualIncome) {
        setErrorMsg('Please fill income details before proceeding.');
        return;
      }
    }
    if (step === 3) {
      if (!form.address || !form.city || !form.state || !form.pin) {
        setErrorMsg('Please fill complete address details.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => { setErrorMsg(''); setStep(step - 1); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent) {
      setErrorMsg('Please accept the terms and conditions.');
      return;
    }
    const refId = 'FIN' + Math.floor(100000 + Math.random() * 900000);
    setAppId(refId);
    setStep(5);
  };

  // Yahan onChange me setErrorMsg('') add kar diya gaya hai
  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const inputStyle = { width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#1A1A1A', fontSize: '1rem', outline: 'none', marginBottom: '1rem' };
  const labelStyle = { fontSize: '0.9rem', color: '#666', fontWeight: 600, marginBottom: '0.5rem', display: 'block' };

  const ErrorBanner = () => errorMsg ? (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500, border: '1px solid #FCA5A5' }}>
      <AlertCircle size={18} /> {errorMsg}
    </motion.div>
  ) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#FCF9F2', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
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
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><User size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Personal Details</h3>
              </div>
              <ErrorBanner />
              <label style={labelStyle}>Full Legal Name</label>
              <input style={inputStyle} type="text" value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} />
              <label style={labelStyle}>Date of Birth</label>
              <input style={inputStyle} type="date" value={form.dob} onChange={e => updateForm('dob', e.target.value)} />
              <label style={labelStyle}>Mobile Number</label>
              <input style={inputStyle} type="tel" value={form.mobile} onChange={e => updateForm('mobile', e.target.value)} />
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} />
              <label style={labelStyle}>PAN Number</label>
              <input style={inputStyle} type="text" value={form.pan} onChange={e => updateForm('pan', e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
              <button onClick={handleNext} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Next <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><Briefcase size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Employment & Income</h3>
              </div>
              <ErrorBanner />
              
              <label style={labelStyle}>Employment Type</label>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ ...inputStyle, marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  {form.employmentType}
                  <ChevronDown size={18} color="#888" />
                </div>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'absolute', top: '105%', left: 0, width: '100%', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}>
                      {['Salaried', 'Self-Employed', 'Retired / Pensioner'].map(opt => (
                        <div key={opt} onClick={() => { updateForm('employmentType', opt); setDropdownOpen(false); }} style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: form.employmentType === opt ? '#F2C879' : '#FFF', color: '#1A1A1A', fontWeight: form.employmentType === opt ? 600 : 500 }}>
                          {opt}
                          {form.employmentType === opt && <Check size={16} color="#1A1A1A" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <label style={labelStyle}>Monthly Income (₹)</label>
              <input style={inputStyle} type="number" value={form.monthlyIncome} onChange={e => updateForm('monthlyIncome', e.target.value)} />
              <label style={labelStyle}>Annual Income (₹)</label>
              <input style={inputStyle} type="number" value={form.annualIncome} onChange={e => updateForm('annualIncome', e.target.value)} />
              <label style={labelStyle}>Existing Monthly EMI (₹)</label>
              <input style={inputStyle} type="number" value={form.existingEmi} onChange={e => updateForm('existingEmi', e.target.value)} />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleBack} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 1 }}>Back</button>
                <button onClick={handleNext} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 2 }}>Next</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><MapPin size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Address Details</h3>
              </div>
              <ErrorBanner />
              <label style={labelStyle}>Current Residential Address</label>
              <input style={inputStyle} type="text" value={form.address} onChange={e => updateForm('address', e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>City</label><input style={inputStyle} type="text" value={form.city} onChange={e => updateForm('city', e.target.value)} /></div>
                <div><label style={labelStyle}>State</label><input style={inputStyle} type="text" value={form.state} onChange={e => updateForm('state', e.target.value)} /></div>
              </div>
              <label style={labelStyle}>PIN Code</label>
              <input style={inputStyle} type="text" value={form.pin} onChange={e => updateForm('pin', e.target.value)} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleBack} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 1 }}>Back</button>
                <button onClick={handleNext} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 2 }}>Next</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F2C879', padding: '10px', borderRadius: '50%' }}><CreditCard size={20} color="#1A1A1A" /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Select Card & Consent</h3>
              </div>
              <ErrorBanner />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {['Classic', 'Platinum', 'Signature'].map(card => (
                  <div key={card} onClick={() => updateForm('cardType', card)} style={{ padding: '1.5rem 1rem', borderRadius: '16px', border: form.cardType === card ? '2px solid #DBA030' : '1px solid #E5E5E5', background: form.cardType === card ? '#FCF9F2' : '#FFF', cursor: 'pointer', textAlign: 'center' }}>
                    <CreditCard size={24} color={form.cardType === card ? '#DBA030' : '#888'} style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A' }}>FINBIT {card}</p>
                  </div>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '2rem' }}>
                <input type="checkbox" checked={form.consent} onChange={e => updateForm('consent', e.target.checked)} style={{ marginTop: '5px' }} />
                <span style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>I confirm that the information provided is accurate. I authorize FINBIT to verify my identity and documents, and consent to applicable credit bureau checks as per the privacy policy.</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleBack} style={{ background: '#F9F9F9', color: '#1A1A1A', border: '1px solid #E5E5E5', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 1 }}>Back</button>
                <button onClick={handleSubmit} style={{ background: '#DBA030', color: '#FFF', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', flex: 2 }}>Submit Application</button>
              </div>
            </motion.div>
          )}

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
