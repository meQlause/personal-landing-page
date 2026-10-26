import type { ReactNode } from 'react';

interface SectionPreviewTemplateProps {
  children: ReactNode;
}

// One section on its own page, with a full-screen lead and tail so its scroll pin has room to play.
export function SectionPreviewTemplate({ children }: SectionPreviewTemplateProps) {
  return (
    <main>
      <div aria-hidden="true" style={{ height: '100svh' }} />
      {children}
      <div aria-hidden="true" style={{ height: '100svh' }} />
    </main>
  );
}
