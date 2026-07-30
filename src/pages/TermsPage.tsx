import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ position: 'relative', padding: '6rem 2rem 2rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => window.history.back()}
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#fff' }}>Terms & Conditions</h1>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em' }}>
          <AlertTriangle size={12} strokeWidth={3} /> DEMO PROTOTYPE
        </span>
      </div>
      
      <div style={{ color: '#9ca3af', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using the Expert28 facilities, website, and services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>2. Membership and Access</h2>
          <p>Memberships are non-transferable. You must present valid identification or your digital access pass upon entry. We reserve the right to refuse service or terminate memberships for violation of facility rules.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>3. Facility Rules and Conduct</h2>
          <p>All members must adhere to the facility code of conduct, which includes respecting other members, racking weights after use, and following instructions from Expert28 staff and coaches.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>4. Payment and Billing</h2>
          <p>Membership fees are billed automatically on a recurring monthly basis unless otherwise specified. You may cancel or freeze your membership in accordance with our cancellation policy.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>5. Liability Waiver</h2>
          <p>Use of the gym facilities and participation in training programs involve inherent risks. By using our services, you agree to release Expert28 from liability for any injuries or damages sustained.</p>
        </section>
      </div>
    </div>
  );
}
