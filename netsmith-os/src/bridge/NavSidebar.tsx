import type { AppMode } from '../api/types';

interface NavItem {
  mode: AppMode;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { mode: 'bridge', icon: '⬡', label: 'Bridge' },
  { mode: 'health', icon: '🖥', label: 'Health' },
  { mode: 'org', icon: '👥', label: 'Org Chart' },
  { mode: 'tasks', icon: '⚡', label: 'Tasks' },
  { mode: 'standup', icon: '📋', label: 'Standup' },
  { mode: 'workspaces', icon: '🗂', label: 'Workspaces' },
  { mode: 'docs', icon: '📖', label: 'Docs' },
];

interface NavSidebarProps {
  currentMode: AppMode;
  onNavigate: (mode: AppMode) => void;
}

export function NavSidebar({ currentMode, onNavigate }: NavSidebarProps) {
  return (
    <div className='module-sidebar'>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.mode}
          className={`module-btn ${currentMode === item.mode ? 'active' : ''}`}
          title={item.label}
          onClick={() => onNavigate(item.mode)}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
      <button
        className='module-btn settings'
        title='Settings'
        aria-label='Settings'
        onClick={() => {}}
      >
        ⚙
      </button>
    </div>
  );
}
