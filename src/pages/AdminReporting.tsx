import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import TelemetryCard from '../components/dashboard/TelemetryCard';
import { supabase } from '../lib/supabase';
import { Users, DollarSign, Activity, TrendingUp, Download, RefreshCw, AlertCircle } from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface PlanBreakdown {
  plan: string;
  count: number;
  revenue: number;
  color: string;
}

interface TopMember {
  name: string;
  tier: string;
  checkins: number;
}

interface MonthlyRevenue {
  month: string;
  value: number;
}

interface ReportingStats {
  totalMembers: number;
  monthlyRevenue: number;
  avgDailyAttendance: number;
  retentionRate: number;
  planBreakdown: PlanBreakdown[];
  topMembers: TopMember[];
  monthlyRevenueSeries: MonthlyRevenue[];
}

const PLAN_COLORS: Record<string, string> = {
  'Elite Expert': '#10b981',
  'Base Expert':  '#3b82f6',
  '7-Day Trial':  '#f59e0b',
};

// ─── BAR CHART ────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: MonthlyRevenue[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.65rem', height: 140, padding: '1rem 0' }}>
        {data.map((d, i) => (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
            {/* Tooltip */}
            {hovered === i && (
              <div style={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', background: '#0d1117', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.4rem', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', animation: 'slideUp 0.15s ease' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6' }}>${d.value.toLocaleString()}</span>
              </div>
            )}
            <div
              style={{ width: '100%', background: hovered === i ? '#3b82f6' : 'rgba(59,130,246,0.25)', borderRadius: '0.4rem 0.4rem 0 0', height: `${(d.value / max) * 100}%`, transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer', minHeight: d.value > 0 ? 6 : 2 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            <span style={{ fontSize: '0.65rem', color: '#4b5563', fontWeight: 700, textTransform: 'uppercase' }}>{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────

function DonutChart({ data }: { data: PlanBreakdown[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#4b5563', fontSize: '0.8rem' }}>
        No membership data yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={100} height={100} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          {data.filter(d => d.count > 0).map((d, i) => {
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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

// ─── EXPORT REPORT ────────────────────────────────────────────────────────────

function exportReport(stats: ReportingStats | null) {
  if (!stats) return;
  const lines = [
    'Expert28 Gym – Analytics Report',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    '=== KPIs ===',
    `Total Members,${stats.totalMembers}`,
    `Monthly Revenue,$${stats.monthlyRevenue}`,
    `Avg Daily Attendance,${stats.avgDailyAttendance}`,
    `Retention Rate,${stats.retentionRate}%`,
    '',
    '=== Plan Breakdown ===',
    'Plan,Members,Revenue',
    ...stats.planBreakdown.map(p => `${p.plan},${p.count},$${p.revenue}`),
    '',
    '=== Top Members by Check-ins ===',
    'Name,Tier,Check-ins',
    ...stats.topMembers.map(m => `${m.name},${m.tier},${m.checkins}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'expert28_report.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function SkeletonBlock({ h = 100 }: { h?: number }) {
  return <div style={{ height: h, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminReporting({ setPathname }: { setPathname: (p: string) => void }) {
  const [stats, setStats] = useState<ReportingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sparkMembers = [480, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540];
  const sparkRevenue = [9800, 10000, 10200, 10400, 10600, 10800, 11000, 11200, 11400, 11600, 11800, 12000];
  const sparkAttend  = [70, 72, 75, 74, 78, 80, 82, 79, 83, 85, 82, 84];
  const sparkRetain  = [85, 86, 87, 88, 88, 89, 89, 90, 90, 91, 91, 91];

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ── Total members ──────────────────────────────────────
      const { count: totalMembers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // ── Monthly revenue (current month) ───────────────────
      const startOfMonth = new Date();
      startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

      const { data: revenueData } = await supabase
        .from('payment_history')
        .select('amount')
        .in('status', ['paid', 'completed'])
        .gte('created_at', startOfMonth.toISOString());

      const monthlyRevenue = (revenueData ?? []).reduce((s: number, p: { amount: number | null }) => s + (p.amount ?? 0), 0);

      // ── Avg daily attendance (last 30 days) ───────────────
      const thirtyAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count: totalAttendance } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .gte('check_in_time', thirtyAgo);

      const avgDailyAttendance = Math.round((totalAttendance ?? 0) / 30);

      // ── Membership tier breakdown ─────────────────────────
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('membership_tier');

      const tierCounts: Record<string, number> = {};
      (profilesData ?? []).forEach((p: { membership_tier: string | null }) => {
        const t = p.membership_tier ?? 'Unassigned';
        tierCounts[t] = (tierCounts[t] ?? 0) + 1;
      });

      // Revenue per plan (from payment_history + profiles join)
      const { data: tierRevData } = await supabase
        .from('payment_history')
        .select('amount, profiles(membership_tier)')
        .in('status', ['paid', 'completed']);

      const tierRevenue: Record<string, number> = {};
      interface TierRevItem {
        amount: number | null;
        profiles: { membership_tier: string | null } | null;
      }
      (tierRevData as unknown as TierRevItem[] ?? []).forEach((p) => {
        const t = p.profiles?.membership_tier ?? 'Unassigned';
        tierRevenue[t] = (tierRevenue[t] ?? 0) + (p.amount ?? 0);
      });

      const knownPlans = ['Elite Expert', 'Base Expert', '7-Day Trial'];
      const planBreakdown: PlanBreakdown[] = knownPlans.map(plan => ({
        plan,
        count: tierCounts[plan] ?? 0,
        revenue: tierRevenue[plan] ?? 0,
        color: PLAN_COLORS[plan] ?? '#6b7280',
      }));

      // ── Top members by attendance ─────────────────────────
      const { data: attendanceRaw } = await supabase
        .from('attendance')
        .select('user_id')
        .gte('check_in_time', thirtyAgo);

      const checkinMap: Record<string, number> = {};
      (attendanceRaw ?? []).forEach((a: { user_id: string }) => {
        checkinMap[a.user_id] = (checkinMap[a.user_id] ?? 0) + 1;
      });

      const topUserIds = Object.entries(checkinMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      let topMembers: TopMember[] = [];
      if (topUserIds.length > 0) {
        const { data: topProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, email, membership_tier')
          .in('id', topUserIds);

        topMembers = topUserIds.map(uid => {
          const p = (topProfiles ?? []).find((x: { id: string }) => x.id === uid) as { full_name: string | null; email: string | null; membership_tier: string | null } | undefined;
          return {
            name: p?.full_name ?? p?.email ?? 'Unknown',
            tier: p?.membership_tier ?? '—',
            checkins: checkinMap[uid],
          };
        });
      }

      // ── Monthly revenue series (last 6 months) ────────────
      const months: MonthlyRevenue[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1); d.setMonth(d.getMonth() - i); d.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setMonth(end.getMonth() + 1);
        const { data: rev } = await supabase
          .from('payment_history')
          .select('amount')
          .in('status', ['paid', 'completed'])
          .gte('created_at', d.toISOString())
          .lt('created_at', end.toISOString());
        months.push({
          month: d.toLocaleString('en-US', { month: 'short' }),
          value: (rev ?? []).reduce((s: number, p: { amount: number | null }) => s + (p.amount ?? 0), 0),
        });
      }

      // ── Retention rate proxy ──────────────────────────────
      const activeCount = (profilesData ?? []).filter((p: { membership_tier: string | null }) => p.membership_tier && p.membership_tier !== 'Unassigned').length;
      const retentionRate = (totalMembers ?? 0) > 0
        ? Math.round((activeCount / (totalMembers ?? 1)) * 100)
        : 0;

      setStats({
        totalMembers: totalMembers ?? 0,
        monthlyRevenue,
        avgDailyAttendance,
        retentionRate,
        planBreakdown,
        topMembers,
        monthlyRevenueSeries: months,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load reporting data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const totalSixMonthRevenue = stats?.monthlyRevenueSeries.reduce((s, m) => s + m.value, 0) ?? 0;

  return (
    <DashboardLayout currentPath="/admin/reporting" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Reporting' }]}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes spin { to{transform:rotate(360deg)} } @keyframes slideUp { from{opacity:0;transform:translate(-50%,5px)} to{opacity:1;transform:translate(-50%,0)} }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Analytics & <span style={{ color: '#8b5cf6' }}>Reporting</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>
              {loading ? 'Fetching live data...' : 'Live from Supabase'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={fetchStats}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af' }}
              title="Refresh"
            >
              <RefreshCw size={13} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button
              onClick={() => exportReport(stats)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '0.65rem', cursor: 'pointer', color: '#8b5cf6', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <Download size={14} strokeWidth={1.5} />
              Export Report
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.82rem' }}>
            <AlertCircle size={15} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {/* KPI Row */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            {[1,2,3,4].map(i => <SkeletonBlock key={i} h={90} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <TelemetryCard label="Total Members" value={stats?.totalMembers.toString() ?? '0'} trend={12} trendLabel="vs last month" sparkData={sparkMembers} color="#10b981" icon={Users} />
            <TelemetryCard label="Monthly Revenue" value={(stats?.monthlyRevenue ?? 0).toLocaleString()} trend={5} trendLabel="vs last month" sparkData={sparkRevenue} color="#3b82f6" icon={DollarSign} prefix="$" />
            <TelemetryCard label="Avg. Check-ins/day" value={stats?.avgDailyAttendance.toString() ?? '0'} trend={3} trendLabel="vs last week" sparkData={sparkAttend} color="#f59e0b" icon={Activity} />
            <TelemetryCard label="Retention Rate" value={stats?.retentionRate.toString() ?? '0'} trend={4} trendLabel="vs last quarter" sparkData={sparkRetain} color="#8b5cf6" icon={TrendingUp} suffix="%" />
          </div>
        )}

        {/* Charts Row - Stacks on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {/* Revenue Bar Chart */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Monthly Revenue</p>
              <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: '0.2rem 0 0' }}>Last 6 months · Live</p>
            </div>
            {loading ? <SkeletonBlock h={100} /> : <BarChart data={stats?.monthlyRevenueSeries ?? []} />}
            {!loading && (
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1.5rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#3b82f6' }}>${totalSixMonthRevenue.toLocaleString()}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>6-month total</p>
                </div>
              </div>
            )}
          </div>

          {/* Membership Breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Membership Breakdown</p>
              <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: '0.2rem 0 0' }}>By plan type</p>
            </div>
            {loading ? <SkeletonBlock h={100} /> : <DonutChart data={stats?.planBreakdown ?? []} />}
            {!loading && (stats?.planBreakdown ?? []).length > 0 && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                {(stats?.planBreakdown ?? []).map(d => (
                  <div key={d.plan} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{d.plan}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: d.color }}>${d.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Members by Attendance */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f9fafb', margin: 0 }}>Most Active Members</p>
            <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: '0.2rem 0 0' }}>By check-in count · Last 30 days</p>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1,2,3].map(i => <SkeletonBlock key={i} h={44} />)}
            </div>
          ) : (stats?.topMembers ?? []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#4b5563', fontSize: '0.82rem' }}>
              No attendance data yet. Check-ins will appear here once members start using the facility.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(stats?.topMembers ?? []).map((m, i) => {
                const max = stats?.topMembers[0]?.checkins ?? 1;
                return (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.55rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4b5563', width: 20 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#f9fafb' }}>{m.name}</p>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>{m.tier}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ height: 4, width: `${(m.checkins / max) * 80}px`, background: '#10b981', borderRadius: '999px', opacity: 0.6 }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>{m.checkins}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
