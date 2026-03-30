import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── SPARKLINE ────────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const area = `0,${h} ${polyline} ${w},${h}`;

  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = (data.length - 1) * step;
        const y = h - ((last - min) / range) * h;
        return <circle cx={x} cy={y} r={2.5} fill={color} />;
      })()}
    </svg>
  );
}

// ─── TELEMETRY CARD ───────────────────────────────────────────────────────────

interface TelemetryCardProps {
  label: string;
  value: string;
  trend: number; // percentage, positive = up, negative = down
  trendLabel: string;
  sparkData: number[];
  color: string;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
}

export default function TelemetryCard({
  label, value, trend, trendLabel, sparkData, color, icon: Icon, prefix = '', suffix = ''
}: TelemetryCardProps) {
  const isUp = trend > 0;
  const isFlat = trend === 0;
  const TrendIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const trendColor = isFlat ? '#6b7280' : isUp ? '#10b981' : '#ef4444';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '1rem',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = `${color}33`;
      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${color}12`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    }}>
      {/* Subtle corner glow */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '0.5rem', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={15} color={color} strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        </div>
        <Sparkline data={sparkData} color={color} />
      </div>

      {/* Value */}
      <div>
        <p style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#f9fafb' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9ca3af', marginRight: '0.15rem' }}>{prefix}</span>
          {value}
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginLeft: '0.2rem' }}>{suffix}</span>
        </p>
      </div>

      {/* Trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: `${trendColor}15`, padding: '0.2rem 0.5rem', borderRadius: '0.35rem' }}>
          <TrendIcon size={11} color={trendColor} strokeWidth={2} />
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: trendColor }}>
            {isFlat ? '0' : isUp ? '+' : ''}{trend}%
          </span>
        </div>
        <span style={{ fontSize: '0.68rem', color: '#4b5563' }}>{trendLabel}</span>
      </div>
    </div>
  );
}
