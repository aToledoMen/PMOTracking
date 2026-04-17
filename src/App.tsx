import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ViewType } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { MyTasksView } from '@/components/tasks/MyTasksView';
import { ReportsView } from '@/components/reports/ReportsView';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { ProjectView } from '@/components/project/ProjectView';
import { ConfigView } from '@/components/config/ConfigView';
import { notifications as initialNotifications } from '@/data/mock-data';
import { DataProvider } from '@/data/data-context';
import { Notification } from '@/data/types';

function AppInner() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [allNotifications, setAllNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setAllNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setAllNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'project':
        return <ProjectView />;
      case 'tasks':
        return <TaskBoard />;
      case 'my-tasks':
        return <MyTasksView />;
      case 'reports':
        return <ReportsView />;
      case 'config':
        return <ConfigView />;
      case 'notifications':
        return (
          <NotificationPanel
            notifications={allNotifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
        );
    }
  };

  return (
    <AppLayout
      activeView={activeView}
      onViewChange={setActiveView}
      notificationCount={unreadCount}
    >
      {renderView()}
    </AppLayout>
  );
}

function App() {
  return (
    <DataProvider>
      <AppInner />
    </DataProvider>
  );
}

export default App;
