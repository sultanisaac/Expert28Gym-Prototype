import DashboardLayout from '../components/dashboard/DashboardLayout';
import TelemetryCard from '../components/dashboard/TelemetryCard';
import { Users, DollarSign, Activity, TrendingUp, Download } from 'lucide-react';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: 'Oct', value: 9200 }, { month: 'Nov', value: 9800 }, { month: 'Dec', value: 10400 },
  { month: 'Jan', value: 10900 }, { month: 'Feb', value: 11500 }, { month: 'Mar', value: 12850 },
];

const PLAN_BREAKDOWN = [
  { plan: 'Elite Expert', count: 214, revenue: 31886, color: '#10b981' },
  { plan: 'Base Expert',  count: 278, revenue: 27800, color: '#3b82f6' },
  { plan: '7-Day Trial',  count: 50,  revenue: 2000,  color: '#f59e0b' },
];

const TOP_MEMBERS = [
  { name: 'James Thornton', tier: 'Elite Expert', checkins: 24 },
  { name: 'Lea Voss',        tier: 'Elite Expert', checkins: 22 },
  { name: 'Ben Clarke',      tier: 'Elite Expert', checkins: 20 },
  { name: 'Aisha Rahman',    tier: 'Base Expert',  checkins: 19 },
  { name: 'Nour Hassan',     tier: 'Base Expert',  checkins: 17 },
];

// ─── BAR CHART ────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: typeof MONTHLY_REVENUE }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 100 }}>
      {data.map(d => (
        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{ width: '100%', background: 'rgba(59,130,246,0.3)', borderRadius: '0.3rem 0.3rem 0 0', height: `${(d.value / max) * 100}%`, position: 'relative', transition: 'height 0.3s', cursor: 'default' }}
            title={`$${d.value.toLocaleString()}`}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.6)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.3)'}
          />
          <span style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: 600 }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────

function DonutChart({ data }: { data: typeof PLAN_BREAKDOWN }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={100} height={100} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          {data.map((d, i) => {
            const pct = d.count / total;
            const seg = (
              <circle key={i} cx="50" cy="50" r={r} fill="none"
                stroke={d.color} strokeWidth="12"
                strokeDasharray={`${pct * c} ${c}`}
                strokeDashoffset={-offset * c}
                strokeLinecap="butt"
                opacity={0.85}
              />
            );
            offset += pct;
            return seg;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'translateY(0)' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f9fafb' }}>{total}</span>
          <span style={{ fontSize: '0.55rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Members</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map(d => (
          <div key={d.plan} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{d.plan}</span>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f9fafb' }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminReporting({ setPathname }: { setPathname: (p: string) => void }) {
  return (
    <DashboardLayout currentPath="/admin/reporting" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Reporting' }]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Analytics & <span style={{ color: '#8b5cf6' }}>Reporting</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>Last 6 months · Mockup data</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '0.65rem', cursor: 'pointer', color: '#8b5cf6', fontSize: '0.82rem', fontWeight: 700 }}>
            <Download size={14} strokeWidth={1.5} />
            Export Report
          </button>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <TelemetryCard label="Total Members" value="542" trend={12} trendLabel="vs last month" sparkData={[480,495,505,515,525,530,534,538,540,541,542,542]} color="#10b981" icon={Users} />
          <TelemetryCard label="Monthly Revenue" value="12,850" trend={5} trendLabel="vs last month" sparkData={[9800,10200,10500,10900,11200,11500,11800,12100,12400,12600,12750,12850]} color="#3b82f6" icon={DollarSign} prefix="$" />
          <TelemetryCard label="Avg. Check-ins/day" value="86" trend={3} trendLabel="vs last week" sparkData={[72,75,80,78,82,85,88,84,87,89,84,86]} color="#f59e0b" icon={Activity} />
          <TelemetryCard label="Retention Rate" value="91" trend={4} trendLabel="vs last quarter" sparkData={[85,86,87,88,88,89,89,90,90,91,91,91]} color="#8b5cf6" icon={TrendingUp} suffix="%" />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
          {/* Revenue Bar Chart */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Monthly Revenue</p>
              <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: '0.2rem 0 0' }}>Oct 2025 – Mar 2026</p>
            </div>
            <BarChart data={MONTHLY_REVENUE} />
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1.5rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#3b82f6' }}>$64,650</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>6-month total</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#10b981' }}>+39%</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>Growth (6mo)</p>
              </div>
            </div>
          </div>

          {/* Membership Breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Membership Breakdown</p>
              <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: '0.2rem 0 0' }}>By plan type</p>
            </div>
            <DonutChart data={PLAN_BREAKDOWN} />
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              {PLAN_BREAKDOWN.map(d => (
                <div key={d.plan} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{d.plan}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: d.color }}>${d.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Members */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Most Active Members</p>
            <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: '0.2rem 0 0' }}>By check-in count · Last 30 days</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TOP_MEMBERS.map((m, i) => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.55rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4b5563', width: 20 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#f9fafb' }}>{m.name}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>{m.tier}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ height: 4, width: `${(m.checkins / 24) * 80}px`, background: '#10b981', borderRadius: '999px', opacity: 0.6 }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>{m.checkins}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
