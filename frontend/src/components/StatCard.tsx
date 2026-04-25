import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  bg?: string;
}

export default function StatCard({ title, value, icon, trend, trendUp, bg }: StatCardProps) {
  return (
    <div className="glass-panel stat-card ripple">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <p className="subtitle" style={{ marginBottom: '0.4rem', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{title}</p>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1 }}>{value}</h2>
        </div>
        <div className="stat-icon-wrap" style={{ background: bg || 'rgba(37,99,235,0.08)' }}>
          {icon}
        </div>
      </div>
      {trend && (
        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: trendUp ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          <span style={{ fontSize: '1rem' }}>{trendUp ? '↑' : '↓'}</span>
          <span>{trend} vs last month</span>
        </div>
      )}
    </div>
  );
}
