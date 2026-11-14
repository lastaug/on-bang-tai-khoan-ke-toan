// Apple HIG Glass Navbar Component
import React from 'https://esm.sh/react@18.2.0';
import { Icons } from './Icons.js';
import { sound } from '../services/audio.js';

export function Navbar({
  currentView,
  setView,
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
  onOpenSearch,
  isSidebarCollapsed,
  onToggleMobileMenu
}) {
  const viewTitles = {
    dashboard: 'Tổng quan học tập',
    catalog: 'Danh mục tài khoản',
    groups: '8 Nhóm tài khoản',
    'group-detail': 'Chi tiết nhóm tài khoản',
    flashcard: 'Flashcard ghi nhớ 3D',
    quiz: 'Trắc nghiệm thông minh',
    matching: 'Ghép đôi tài khoản',
    'smart-review': 'Ôn tập Spaced Repetition',
    decks: 'Bộ học cá nhân',
    stats: 'Thống kê tiến độ',
    settings: 'Cài đặt hệ thống',
    setup: 'Thiết lập buổi học'
  };

  const handleSoundClick = () => {
    toggleSound();
    sound.playClick();
  };

  const handleThemeClick = () => {
    toggleTheme();
    sound.playClick();
  };

  return React.createElement('header', {
    className: `sticky top-0 z-20 h-16 border-b transition-all duration-300 glass-header border-neutral-200/70 dark:border-neutral-800/80 px-4 md:px-8 flex items-center justify-between`
  }, [
    // Left: Mobile Menu Trigger + View Breadcrumb
    React.createElement('div', { key: 'left', className: 'flex items-center gap-3' }, [
      React.createElement('button', {
        key: 'mobile-menu',
        onClick: onToggleMobileMenu,
        className: 'p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden'
      }, React.createElement(Icons.Menu, { size: 20 })),

      React.createElement('div', {
        key: 'mobile-logo',
        className: 'w-8 h-8 rounded-lg overflow-hidden border border-pink-200 dark:border-pink-900/60 shadow-sm md:hidden shrink-0'
      }, [
        React.createElement('img', {
          src: './src/assets/kuromi.png',
          alt: 'Kuromi',
          className: 'w-full h-full object-cover'
        })
      ]),

      React.createElement('div', { key: 'titles', className: 'flex items-center gap-2' }, [
        React.createElement('h1', {
          key: 'page-title',
          className: 'text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100'
        }, viewTitles[currentView] || 'TK Study'),
        React.createElement('span', {
          key: 'sub-badge',
          className: 'hidden sm:inline-block text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded-md border border-neutral-200/50 dark:border-neutral-700/50'
        }, 'Thông tư 99/2025/TT-BTC')
      ])
    ]),

    // Right: Global actions
    React.createElement('div', { key: 'right', className: 'flex items-center gap-2 md:gap-3' }, [
      // Search Trigger Button
      React.createElement('button', {
        key: 'search-btn',
        onClick: onOpenSearch,
        className: 'flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 border border-neutral-200/60 dark:border-neutral-700/50 text-neutral-600 dark:text-neutral-300 text-xs md:text-sm font-medium transition-colors'
      }, [
        React.createElement(Icons.Search, { key: 's-icon', size: 15, className: 'text-neutral-400' }),
        React.createElement('span', { key: 's-txt', className: 'hidden sm:inline' }, 'Tìm tài khoản...'),
        React.createElement('kbd', {
          key: 's-kbd',
          className: 'hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-400'
        }, '⌘K')
      ]),

      // Sound Toggle
      React.createElement('button', {
        key: 'sound-btn',
        onClick: handleSoundClick,
        title: soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng',
        className: 'p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
      }, React.createElement(soundEnabled ? Icons.Volume2 : Icons.VolumeX, { size: 18 })),

      // Theme Toggle (Light / Dark)
      React.createElement('button', {
        key: 'theme-btn',
        onClick: handleThemeClick,
        title: theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối',
        className: 'p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
      }, React.createElement(theme === 'dark' ? Icons.Sun : Icons.Moon, { size: 18 })),

      // Quick Setup CTA
      React.createElement('button', {
        key: 'quick-study-btn',
        onClick: () => {
          sound.playClick();
          setView('setup');
        },
        className: 'hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs md:text-sm shadow-sm shadow-blue-600/30 active:scale-[0.98] transition-all'
      }, [
        React.createElement(Icons.Play, { key: 'play-icon', size: 14 }),
        'Tạo buổi học'
      ])
    ])
  ]);
}
