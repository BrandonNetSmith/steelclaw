import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className='page-header' style={{ marginBottom: '24px' }}>
          <h1 className='page-title'>{title}</h1>
          {subtitle && <p className='page-subtitle'>{subtitle}</p>}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }}>
        {children}
      </div>
    </div>
  );
}
