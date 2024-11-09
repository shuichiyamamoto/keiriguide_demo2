import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings,
  LogOut,
  Archive,
  Calendar as CalendarIcon,
  Bell,
  X,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  link?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '確定申告の期限が近づいています',
      content: '令和5年分の確定申告の提出期限は3月15日です。',
      date: '2024-02-15',
      read: false,
      link: 'https://www.nta.go.jp/'
    },
    {
      id: '2',
      title: '青色申告の控除額が変更されました',
      content: '令和6年分以降の青色申告特別控除額が改正されます。',
      date: '2024-02-01',
      read: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const user = {
    name: '山田 太郎',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    taxType: '青色申告'
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'ダッシュボード' },
    { id: 'calendar', icon: <CalendarIcon size={20} />, label: '年間カレンダー' },
    { id: 'archive', icon: <Archive size={20} />, label: '申告書等アーカイブ' },
    { id: 'settings', icon: <Settings size={20} />, label: '設定' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      window.open(notification.link, '_blank');
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img
            src={user.image}
            alt={user.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-400">{user.taxType}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
                  currentPage === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-between w-full p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Bell size={20} />
              <span>経理のガイド</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="mt-2 space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg text-sm ${
                    notification.read ? 'bg-gray-800/50' : 'bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-white">{notification.title}</h4>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-gray-400 mb-2">{notification.content}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {new Date(notification.date).toLocaleDateString('ja-JP')}
                    </span>
                    {notification.link && (
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="flex items-center text-primary-400 hover:text-primary-300"
                      >
                        詳細を見る
                        <ExternalLink size={12} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center space-x-3 text-gray-400 hover:text-white w-full p-3 rounded-lg transition-colors hover:bg-gray-800">
          <LogOut size={20} />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;