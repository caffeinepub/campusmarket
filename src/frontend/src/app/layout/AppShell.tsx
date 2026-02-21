import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomTabs } from './BottomTabs';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  showSearch?: boolean;
  actions?: ReactNode;
}

export function AppShell({ children, title, showBack, onBackClick, showSearch, actions }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar title={title} showBack={showBack} onBackClick={onBackClick} showSearch={showSearch} actions={actions} />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <BottomTabs />
    </div>
  );
}
