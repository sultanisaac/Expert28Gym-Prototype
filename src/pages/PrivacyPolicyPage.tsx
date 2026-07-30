import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ position: 'relative', padding: '6rem 2rem 2rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => window.history.back()}
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#fff' }}>Privacy Policy</h1>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em' }}>
          <AlertTriangle size={12} strokeWidth={3} /> DEMO PROTOTYPE
        </span>
      </div>
      
      <div style={{ color: '#9ca3af', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>2. Use of Information</h2>
          <p>We may use the information we collect about you to provide, maintain, and improve our services, including to process transactions, send you related information, and provide customer support.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>3. Sharing of Information</h2>
          <p>We may share the information we collect about you as described in this privacy policy or as described at the time of collection or sharing, including with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>4. Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at hello@expert28.com.</p>
        </section>
      </div>
    </div>
  );
}
