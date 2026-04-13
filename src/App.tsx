import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ViewType } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { MyTasksView } from '@/components/tasks/MyTasksView';
import { ReportsView } from '@/components/reports/ReportsView';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { tasks as initialTasks, notifications as initialNotifications } from '@/data/mock-data';
import { Task, Notification } from '@/data/types';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);
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
      case 'tasks':
        return <TaskBoard allTasks={allTasks} onTasksChange={setAllTasks} />;
      case 'my-tasks':
        return <MyTasksView allTasks={allTasks} onTasksChange={setAllTasks} />;
      case 'reports':
        return <ReportsView />;
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

export default App;
