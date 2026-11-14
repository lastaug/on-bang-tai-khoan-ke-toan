// Apple HIG Mobile Bottom Tab Bar Component
import React from 'https://esm.sh/react@18.2.0';
import { Icons } from './Icons.js';
import { sound } from '../services/audio.js';

export function MobileNav({ currentView, setView }) {
  const tabs = [
    { id: 'dashboard', label: 'Trang chủ', icon: Icons.Compass },
    { id: 'catalog', label: 'Danh mục', icon: Icons.List },
    { id: 'setup', label: 'Học tập', icon: Icons.Play, isCenter: true },
    { id: 'smart-review', label: 'Ôn tập', icon: Icons.Flame },
    { id: 'stats', label: 'Tiến độ', icon: Icons.BarChart3 }
  ];

  return React.createElement('nav', {
    className: 'md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 glass-header border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-around px-2 select-none'
  }, tabs.map(tab => {
    const isActive = currentView === tab.id;

    if (tab.isCenter) {
      return React.createElement('button', {
        key: tab.id,
        onClick: () => {
          sound.playClick();
          setView(tab.id);
        },
        className: 'flex flex-col items-center -mt-5 group'
      }, [
        React.createElement('div', {
          key: 'circle',
          className: 'w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-active:scale-95 transition-transform'
        }, React.createElement(tab.icon, { size: 22 })),
        React.createElement('span', {
          key: 'lbl',
          className: 'text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5'
        }, tab.label)
      ]);
    }

    return React.createElement('button', {
      key: tab.id,
      onClick: () => {
        sound.playClick();
        setView(tab.id);
      },
      className: `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'
      }`
    }, [
      React.createElement(tab.icon, { key: 'icon', size: 20 }),
      React.createElement('span', {
        key: 'lbl',
        className: 'text-[10px] font-medium mt-1 truncate'
      }, tab.label)
    ]);
  }));
}
