import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import TelemetryCard from '../components/dashboard/TelemetryCard';
import {
  Users, DollarSign, Activity, TrendingUp,
  UserPlus, FileText, Bell, ArrowRight,
  ChevronDown, Shield, Clock, CheckCircle2
} from 'lucide-react';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const RECENT_ACTIVITY = [
  { type: 'signup', text: 'James Thornton joined Elite Expert', time: '2 min ago', color: '#10b981', icon: UserPlus },
  { type: 'payment', text: 'Payment of $149 received from Aisha Rahman', time: '18 min ago', color: '#3b82f6', icon: DollarSign },
  { type: 'checkin', text: 'Marcus Webb checked in — The Expert Pit', time: '34 min ago', color: '#f59e0b', icon: CheckCircle2 },
  { type: 'signup', text: 'Lea Voss joined 7-Day Trial', time: '1 hr ago', color: '#10b981', icon: UserPlus },
  { type: 'payment', text: 'Payment of $100 received from Daniel Kahn', time: '2 hr ago', color: '#3b82f6', icon: DollarSign },
  { type: 'alert', text: 'Ben Clarke membership due for renewal in 3 days', time: '3 hr ago', color: '#ef4444', icon: Bell },
  { type: 'checkin', text: 'Nour Hassan checked in — High-Octane Turf', time: '4 hr ago', color: '#f59e0b', icon: CheckCircle2 },
];

const DATE_RANGES = ['7 Days', '30 Days', '3 Months', '12 Months'];

const SPARK_MEMBERS   = [488, 495, 499, 502, 510, 518, 525, 530, 536, 538, 540, 542];
const SPARK_REVENUE   = [9800, 10200, 10500, 10900, 11200, 11500, 11800, 12100, 12400, 12600, 12750, 12850];
const SPARK_ATTENDANCE = [72, 75, 80, 78, 82, 85, 88, 84, 87, 89, 84, 86];
const SPARK_GROWTH    = [3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 11, 12];

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────

function QuickActions({ setPathname }: { setPathname: (p: string) => void }) {
  const actions = [
    { label: 'Add New Member', desc: 'Register a client manually', icon: UserPlus, color: '#10b981', path: '/admin/clients' },
    { label: 'View Payments', desc: 'Audit recent transactions', icon: DollarSign, color: '#3b82f6', path: '/admin/payments' },
    { label: 'Export Report', desc: 'Download analytics as CSV', icon: FileText, color: '#f59e0b', path: '/admin/reporting' },
    { label: 'Notification Center', desc: 'Manage system alerts', icon: Bell, color: '#8b5cf6', path: '/admin/notifications' },
  ];

  const navigate = (path: string) => {
    setPathname(path);
    history.pushState({}, '', path);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
      {actions.map(action => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.1rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget).style.background = `${action.color}10`; (e.currentTarget).style.borderColor = `${action.color}33`; }}
            onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.025)'; (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '0.6rem', background: `${action.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={17} color={action.color} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f9fafb', margin: 0 }}>{action.label}</p>
              <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: 0, marginTop: '0.1rem' }}>{action.desc}</p>
            </div>
            <ArrowRight size={14} color="#374151" strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────

function ActivityFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {RECENT_ACTIVITY.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.65rem', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
          >
            <div style={{ width: 30, height: 30, borderRadius: '0.45rem', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={14} color={item.color} strokeWidth={1.5} />
            </div>
            <p style={{ flex: 1, fontSize: '0.8rem', color: '#d1d5db', margin: 0 }}>{item.text}</p>
            <span style={{ fontSize: '0.65rem', color: '#4b5563', flexShrink: 0 }}>{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.01em', margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: '0.2rem 0 0' }}>{subtitle}</p>}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminDashboard({ setPathname }: { setPathname: (p: string) => void }) {
  const [dateRange, setDateRange] = useState('30 Days');
  const [rangeOpen, setRangeOpen] = useState(false);

  return (
    <DashboardLayout currentPath="/admin/dashboard" setPathname={setPathname}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1200 }}>

        {/* Page Title + Date Filter */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
              Performance Lab <span style={{ color: '#10b981' }}>Overview</span>
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.4rem 0 0' }}>
              Real-time metrics and operational status
            </p>
          </div>

          {/* Date Range Filter */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRangeOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', cursor: 'pointer', color: '#d1d5db', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s' }}
            >
              <Clock size={13} strokeWidth={1.5} />
              {dateRange}
              <ChevronDown size={13} color="#6b7280" style={{ transform: rangeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {rangeOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 100, minWidth: 140 }}>
                {DATE_RANGES.map(r => (
                  <button key={r} onClick={() => { setDateRange(r); setRangeOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.65rem 1rem', background: r === dateRange ? 'rgba(16,185,129,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: r === dateRange ? '#10b981' : '#9ca3af', fontSize: '0.8rem', fontWeight: r === dateRange ? 700 : 500 }}
                  >{r}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Telemetry Cards */}
        <div>
          <SectionHeader title="Key Metrics" subtitle={`Showing data for the last ${dateRange.toLowerCase()}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            <TelemetryCard label="Total Members" value="542" trend={12} trendLabel="vs last month" sparkData={SPARK_MEMBERS} color="#10b981" icon={Users} />
            <TelemetryCard label="Monthly Revenue" value="12,850" trend={5} trendLabel="vs last month" sparkData={SPARK_REVENUE} color="#3b82f6" icon={DollarSign} prefix="$" />
            <TelemetryCard label="Daily Attendance" value="86" trend={3} trendLabel="vs last week" sparkData={SPARK_ATTENDANCE} color="#f59e0b" icon={Activity} />
            <TelemetryCard label="Member Growth" value="12" trend={11} trendLabel="vs last month" sparkData={SPARK_GROWTH} color="#8b5cf6" icon={TrendingUp} suffix="%" />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <SectionHeader title="Quick Actions" subtitle="Jump to frequent administrative tasks" />
          <QuickActions setPathname={setPathname} />
        </div>

        {/* Two-column bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Activity Feed */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem', overflow: 'hidden' }}>
            <SectionHeader title="Recent Activity" subtitle="Live operational feed" />
            <ActivityFeed />
          </div>

          {/* System Status */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem' }}>
            <SectionHeader title="System Status" subtitle="Infrastructure health" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Database', status: 'Operational', color: '#10b981' },
                { label: 'Authentication', status: 'Operational', color: '#10b981' },
                { label: 'Storage (Avatars)', status: 'Operational', color: '#10b981' },
                { label: 'Payment Sync (Stripe)', status: 'Pending Setup', color: '#f59e0b' },
                { label: 'Realtime Notifications', status: 'Pending Setup', color: '#f59e0b' },
                { label: 'Make.com Automation', status: 'Pending Setup', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Shield size={13} color={s.color} strokeWidth={1.5} />
                    <span style={{ fontSize: '0.78rem', color: '#d1d5db', fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: s.color, background: `${s.color}15`, padding: '0.15rem 0.5rem', borderRadius: '0.3rem' }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
