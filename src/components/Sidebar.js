// Apple HIG Sidebar Navigation Component
import React from 'https://esm.sh/react@18.2.0';
import { Icons } from './Icons.js';
import { sound } from '../services/audio.js';

export function Sidebar({ currentView, setView, isOpen = true, toggleCollapse, stats }) {
  const menuSections = [
    {
      title: 'TỔNG QUAN',
      items: [
        { id: 'dashboard', label: 'Trang chủ', icon: Icons.Compass },
        { id: 'catalog', label: 'Danh mục tài khoản', icon: Icons.List },
        { id: 'groups', label: '8 Nhóm tài khoản', icon: Icons.Layers }
      ]
    },
    {
      title: 'PHƯƠNG PHÁP HỌC',
      items: [
        { id: 'flashcard', label: 'Flashcard 3D', icon: Icons.Sparkles, badge: 'Thẻ' },
        { id: 'quiz', label: 'Trắc nghiệm', icon: Icons.HelpCircle, badge: '4 Đ.án' },
        { id: 'matching', label: 'Ghép đôi nối từ', icon: Icons.Shuffle, badge: 'Game' },
        { id: 'smart-review', label: 'Ôn tập thông minh', icon: Icons.Flame, badge: stats?.dueCount > 0 ? stats.dueCount : 'SRS' }
      ]
    },
    {
      title: 'CÁ NHÂN HÓA',
      items: [
        { id: 'decks', label: 'Bộ học cá nhân', icon: Icons.FolderPlus },
        { id: 'stats', label: 'Thống kê tiến độ', icon: Icons.BarChart3 },
        { id: 'settings', label: 'Cài đặt hệ thống', icon: Icons.Settings }
      ]
    }
  ];

  const total = stats?.total || 184;
  const mastered = stats?.mastered || 0;
  const pct = Math.round((mastered / total) * 100);

  return React.createElement('aside', {
    className: `fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out border-r flex flex-col justify-between select-none ${
      !isOpen ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 pointer-events-auto'
    } w-64 bg-[#fbfbfd]/95 dark:bg-[#161618]/95 backdrop-blur-xl border-neutral-200/80 dark:border-neutral-800/80 max-md:hidden shadow-lg md:shadow-none`
  }, [
    // Top: App brand
    React.createElement('div', { key: 'brand', className: 'p-5 flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/50' }, [
      React.createElement('div', {
        key: 'logo-area',
        onClick: () => setView('dashboard'),
        className: 'flex items-center gap-3 cursor-pointer group'
      }, [
        React.createElement('div', {
          key: 'logo-box',
          className: 'w-10 h-10 rounded-xl overflow-hidden bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform shrink-0'
        }, [
          React.createElement('img', {
            key: 'kuromi-img',
            src: './src/assets/kuromi.png',
            alt: 'Kuromi Logo',
            className: 'w-full h-full object-cover'
          })
        ]),
        React.createElement('div', { key: 'brand-text', className: 'overflow-hidden' }, [
          React.createElement('div', { key: 'app-name', className: 'font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5' }, [
            'TK Study',
            React.createElement('span', { key: 'v-tag', className: 'text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' }, 'TT99')
          ]),
          React.createElement('div', { key: 'app-sub', className: 'text-xs text-neutral-500 dark:text-neutral-400 truncate' }, 'Hệ thống TK kế toán')
        ])
      ]),
      React.createElement('button', {
        key: 'collapse-btn',
        onClick: () => {
          sound.playClick();
          if (toggleCollapse) toggleCollapse();
        },
        title: 'Ẩn thanh điều hướng & tiêu đề',
        className: 'p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors'
      }, React.createElement(Icons.ArrowLeft, { size: 16 }))
    ]),

    // Middle: Navigation links
    React.createElement('div', {
      key: 'nav-links',
      className: 'flex-1 overflow-y-auto px-3 py-4 space-y-6'
    }, menuSections.map((sec, secIdx) => 
      React.createElement('div', { key: 'sec-' + secIdx, className: 'space-y-1' }, [
        React.createElement('div', {
          key: 'sec-title',
          className: 'px-3 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 uppercase'
        }, sec.title),
        sec.items.map(item => {
          const isActive = currentView === item.id || (item.id === 'setup' && currentView === 'setup');
          return React.createElement('button', {
            key: item.id,
            onClick: () => setView(item.id),
            className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative group ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 dark:bg-blue-600'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`
          }, [
            React.createElement(item.icon, {
              key: 'icon',
              size: 18,
              className: isActive ? 'text-white' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors'
            }),
            React.createElement('span', { key: 'label', className: 'flex-1 text-left truncate' }, item.label),
            item.badge && React.createElement('span', {
              key: 'badge',
              className: `text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`
            }, item.badge)
          ]);
        })
      ])
    )),

    // Bottom: Mini Mastery Progress Card
    React.createElement('div', {
      key: 'bottom-card',
      className: 'p-4 m-3 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/60 shadow-sm'
    }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between text-xs mb-1.5' }, [
        React.createElement('span', { key: 'txt', className: 'font-semibold text-neutral-700 dark:text-neutral-300' }, 'Đã thuộc'),
        React.createElement('span', { key: 'num', className: 'font-bold text-blue-600 dark:text-blue-400' }, `${mastered}/${total} (${pct}%)`)
      ]),
      React.createElement('div', { key: 'bar', className: 'w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden' }, [
        React.createElement('div', {
          key: 'fill',
          className: 'h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500',
          style: { width: `${pct}%` }
        })
      ]),
      React.createElement('button', {
        key: 'study-quick-btn',
        onClick: () => setView('setup'),
        className: 'mt-3 w-full py-1.5 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors'
      }, [
        React.createElement(Icons.Play, { key: 'play-icon', size: 12 }),
        'Bắt đầu học ngay'
      ])
    ])
  ]);
}
