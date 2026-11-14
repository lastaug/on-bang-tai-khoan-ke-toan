// Apple HIG Main Application Orchestrator
import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { ACCOUNTS_DATA } from './data/accountsData.js';
import { db } from './services/db.js';
import { sound } from './services/audio.js';
import { Icons } from './components/Icons.js';
import { Sidebar } from './components/Sidebar.js?v=20261114_01';
import { Navbar } from './components/Navbar.js?v=20261114_01';
import { MobileNav } from './components/MobileNav.js';
import { AccountDetailModal } from './components/AccountDetailModal.js';

// Pages
import { Dashboard } from './pages/Dashboard.js';
import { Catalog } from './pages/Catalog.js';
import { GroupDetail } from './pages/GroupDetail.js';
import { SessionSetup } from './pages/SessionSetup.js';
import { Flashcard } from './pages/Flashcard.js';
import { Quiz } from './pages/Quiz.js';
import { Matching } from './pages/Matching.js';
import { SmartReview } from './pages/SmartReview.js';
import { CustomDecks } from './pages/CustomDecks.js';
import { Stats } from './pages/Stats.js';
import { Settings } from './pages/Settings.js';

export function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewParams, setViewParams] = useState({});
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [accounts] = useState(ACCOUNTS_DATA.accounts || []);
  const [groups] = useState(ACCOUNTS_DATA.groups || []);
  const [progress, setProgress] = useState({});
  const [customDecks, setCustomDecks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [settings, setSettings] = useState({});

  // Active Session Config (for Flashcard, Quiz, Matching)
  const [activeSessionConfig, setActiveSessionConfig] = useState(null);

  // Selected Account for Modal
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Quick Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  // Load data from DB
  const loadDatabase = useCallback(async () => {
    try {
      const p = await db.getAllProgress();
      const d = await db.getCustomDecks();
      const s = await db.getSessionHistory(30);
      const st = await db.getSettings();

      setProgress(p || {});
      setCustomDecks(d || []);
      setSessions(s || []);
      setSettings(st || {});

      // Theme
      const savedTheme = st.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Sound
      if (typeof st.sound_enabled === 'boolean') {
        setSoundEnabled(st.sound_enabled);
        sound.setEnabled(st.sound_enabled);
      }
    } catch (err) {
      console.error('Failed to load DB:', err);
    }
  }, []);

  useEffect(() => {
    loadDatabase();
    // Reset any stale collapsed state to ensure sidebar is always visible
    localStorage.removeItem('tk_sidebar_collapsed');
  }, [loadDatabase]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isNavVisible) {
        setIsNavVisible(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavVisible]);

  // Theme switcher
  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    db.saveSetting('theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSetTheme = (nextTheme) => {
    setTheme(nextTheme);
    db.saveSetting('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    db.saveSetting('sound_enabled', next);
  };

  // Navigate view
  const setView = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start study with preset
  const handleStartStudyWithPreset = (method, options = {}) => {
    let pool = [...accounts];

    if (options.groupId) {
      pool = pool.filter(a => a.group === options.groupId);
    } else if (options.customDeckId) {
      const deck = customDecks.find(d => d.id === options.customDeckId);
      if (deck && deck.account_codes) {
        pool = pool.filter(a => deck.account_codes.includes(a.code));
      }
    } else if (options.accountCodes) {
      pool = pool.filter(a => options.accountCodes.includes(a.code));
    }

    // Default shuffle
    const shuffled = pool.sort(() => Math.random() - 0.5);

    setActiveSessionConfig({
      method,
      accounts: shuffled,
      direction: 'code-to-name',
      order: 'shuffle'
    });

    setView(method);
  };

  // Start custom session from SessionSetup
  const handleStartSession = (config) => {
    setActiveSessionConfig(config);
    setView(config.method);
  };

  // Session completed callback
  const handleCompleteSession = async (result) => {
    try {
      // Save session record
      await db.saveSession(result);

      // Update progress for accounts if flashcard rating or quiz
      if (result.ratings) {
        for (const [code, rating] of Object.entries(result.ratings)) {
          const isCorrect = rating >= 2;
          await db.recordReview(code, rating, isCorrect);
        }
      } else if (result.answers) {
        for (const item of result.answers) {
          const rating = item.isCorrect ? 2 : 0;
          await db.recordReview(item.account.code, rating, item.isCorrect);
        }
      } else if (result.mode === 'matching') {
        if (activeSessionConfig?.accounts) {
          for (const acc of activeSessionConfig.accounts) {
            await db.recordReview(acc.code, 2, true);
          }
        }
      }

      // Reload database to refresh all metrics
      await loadDatabase();
    } catch (err) {
      console.error('Error saving session progress:', err);
    }
  };

  // Single account study trigger
  const handleStartSingleAccountStudy = (acc) => {
    setActiveSessionConfig({
      method: 'flashcard',
      accounts: [acc],
      direction: 'code-to-name',
      order: 'sequential'
    });
    setView('flashcard');
  };

  // Custom Decks actions
  const handleSaveDeck = async (deck) => {
    await db.saveCustomDeck(deck);
    await loadDatabase();
  };

  const handleDeleteDeck = async (id) => {
    await db.deleteCustomDeck(id);
    await loadDatabase();
  };

  // Global Quick Search Shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        setQuickSearchQuery('');
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isSearchOpen]);

  // Filtered accounts for Quick Search Modal
  const quickSearchResults = useMemo(() => {
    if (!quickSearchQuery.trim()) return accounts.slice(0, 10);
    const q = quickSearchQuery.toLowerCase().trim();
    return accounts.filter(a => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)).slice(0, 15);
  }, [accounts, quickSearchQuery]);

  // Overall Stats
  const globalStats = useMemo(() => {
    const total = accounts.length;
    let learned = 0;
    let mastered = 0;
    let due = 0;
    let totalRev = 0;
    let totalCor = 0;

    const groupMap = {};
    groups.forEach(g => {
      groupMap[g.id] = { total: 0, learned: 0, mastered: 0 };
    });

    const now = new Date();

    accounts.forEach(acc => {
      if (groupMap[acc.group]) {
        groupMap[acc.group].total += 1;
      }
      const p = progress[acc.code];
      if (p) {
        if (p.state >= 1) {
          learned += 1;
          if (groupMap[acc.group]) groupMap[acc.group].learned += 1;
        }
        if (p.state === 3) {
          mastered += 1;
          if (groupMap[acc.group]) groupMap[acc.group].mastered += 1;
        }
        if (p.next_review && new Date(p.next_review) <= now) {
          due += 1;
        }
        totalRev += (p.review_count || 0);
        totalCor += (p.correct_count || 0);
      }
    });

    const accPct = totalRev > 0 ? Math.round((totalCor / totalRev) * 100) : 0;

    return {
      total,
      learned,
      mastered,
      dueCount: due,
      accuracy: accPct,
      groupStats: groupMap
    };
  }, [accounts, groups, progress]);

  const allAccountsMap = useMemo(() => {
    const map = {};
    accounts.forEach(a => { map[a.code] = a; });
    return map;
  }, [accounts]);

  return React.createElement('div', {
    className: 'min-h-screen bg-[#f5f5f7] dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300'
  }, [
    // Desktop / Tablet Sidebar
    React.createElement(Sidebar, {
      key: 'sidebar',
      currentView,
      setView,
      isOpen: isNavVisible,
      toggleCollapse: () => setIsNavVisible(false),
      stats: globalStats
    }),

    // Main Content Area Wrapper
    React.createElement('div', {
      key: 'main-wrapper',
      className: `flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        !isNavVisible ? 'md:pl-0' : 'md:pl-64'
      }`
    }, [
      // Glass Header
      React.createElement(Navbar, {
        key: 'navbar',
        currentView,
        setView,
        theme,
        toggleTheme: handleToggleTheme,
        soundEnabled,
        toggleSound: handleToggleSound,
        onOpenSearch: () => {
          sound.playClick();
          setIsSearchOpen(true);
        },
        isNavVisible,
        onToggleNav: () => setIsNavVisible(prev => !prev),
        onToggleMobileMenu: () => setIsMobileMenuOpen(prev => !prev)
      }),

      // Page View Routing
      React.createElement('main', {
        key: 'main-content',
        className: 'flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto'
      }, [
        currentView === 'dashboard' && React.createElement(Dashboard, {
          stats: globalStats,
          groups,
          progress,
          sessions,
          settings,
          setView,
          onStartStudyWithPreset: handleStartStudyWithPreset
        }),

        currentView === 'catalog' && React.createElement(Catalog, {
          accounts,
          groups,
          progress,
          onSelectAccount: (acc) => setSelectedAccount(acc),
          onStartStudyWithPreset: handleStartStudyWithPreset
        }),

        currentView === 'groups' && React.createElement(GroupDetail, {
          groups,
          accounts,
          progress,
          initialGroupId: viewParams?.selectedGroupId || 1,
          onSelectAccount: (acc) => setSelectedAccount(acc),
          onStartStudyWithPreset: handleStartStudyWithPreset
        }),

        currentView === 'setup' && React.createElement(SessionSetup, {
          groups,
          accounts,
          customDecks,
          progress,
          initialMethod: viewParams?.initialMethod || 'flashcard',
          initialGroupId: viewParams?.selectedGroupId || null,
          onStartSession: handleStartSession
        }),

        currentView === 'flashcard' && React.createElement(Flashcard, {
          sessionConfig: activeSessionConfig || { accounts: accounts.slice(0, 20) },
          onCompleteSession: handleCompleteSession,
          onBackToDashboard: () => setView('dashboard')
        }),

        currentView === 'quiz' && React.createElement(Quiz, {
          sessionConfig: activeSessionConfig || { accounts: accounts.slice(0, 20) },
          allAccounts: accounts,
          onCompleteSession: handleCompleteSession,
          onBackToDashboard: () => setView('dashboard')
        }),

        currentView === 'matching' && React.createElement(Matching, {
          sessionConfig: activeSessionConfig || { accounts: accounts.slice(0, 18) },
          onCompleteSession: handleCompleteSession,
          onBackToDashboard: () => setView('dashboard')
        }),

        currentView === 'smart-review' && React.createElement(SmartReview, {
          accounts,
          progress,
          onStartSmartStudy: (reviewList) => {
            setActiveSessionConfig({
              method: 'flashcard',
              accounts: reviewList,
              direction: 'code-to-name',
              order: 'shuffle'
            });
            setView('flashcard');
          },
          onSelectAccount: (acc) => setSelectedAccount(acc)
        }),

        currentView === 'decks' && React.createElement(CustomDecks, {
          customDecks,
          accounts,
          progress,
          onSaveDeck: handleSaveDeck,
          onDeleteDeck: handleDeleteDeck,
          onStartStudyWithPreset: handleStartStudyWithPreset
        }),

        currentView === 'stats' && React.createElement(Stats, {
          accounts,
          groups,
          progress,
          sessions,
          settings,
          onSelectAccount: (acc) => setSelectedAccount(acc),
          onStartStudyWithPreset: handleStartStudyWithPreset
        }),

        currentView === 'settings' && React.createElement(Settings, {
          theme,
          setTheme: handleSetTheme,
          soundEnabled,
          setSoundEnabled,
          onDataReset: loadDatabase,
          onDataRestored: loadDatabase
        })
      ])
    ]),

    // Mobile Bottom Navigation Bar
    !isNavVisible && React.createElement(MobileNav, {
      key: 'mobile-nav',
      currentView,
      setView
    }),

    // Mobile Menu Drawer
    isMobileMenuOpen && React.createElement('div', {
      key: 'mobile-drawer',
      className: 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden flex flex-col justify-end'
    }, [
      React.createElement('div', {
        className: 'absolute inset-0',
        onClick: () => setIsMobileMenuOpen(false)
      }),
      React.createElement('div', {
        className: 'relative bg-white dark:bg-[#1c1c1e] rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto'
      }, [
        React.createElement('div', { className: 'flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800' }, [
          React.createElement('div', { className: 'flex items-center gap-2.5' }, [
            React.createElement('div', { className: 'w-8 h-8 rounded-lg overflow-hidden border border-pink-200 dark:border-pink-900/60 shadow-sm shrink-0 bg-pink-50' }, [
              React.createElement('img', { src: './src/assets/kuromi.png', alt: 'Kuromi', className: 'w-full h-full object-cover' })
            ]),
            React.createElement('span', { className: 'font-bold text-base' }, 'For Bunny')
          ]),
          React.createElement('button', {
            onClick: () => setIsMobileMenuOpen(false),
            className: 'p-1 rounded-full text-neutral-400'
          }, React.createElement(Icons.X, { size: 20 }))
        ]),
        [
          { id: 'dashboard', label: 'Trang chủ', icon: Icons.Compass },
          { id: 'catalog', label: 'Danh mục tài khoản', icon: Icons.List },
          { id: 'groups', label: '8 Nhóm tài khoản', icon: Icons.Layers },
          { id: 'flashcard', label: 'Flashcard 3D', icon: Icons.Sparkles },
          { id: 'quiz', label: 'Trắc nghiệm', icon: Icons.HelpCircle },
          { id: 'matching', label: 'Ghép đôi', icon: Icons.Shuffle },
          { id: 'smart-review', label: 'Ôn tập Spaced', icon: Icons.Flame },
          { id: 'decks', label: 'Bộ học cá nhân', icon: Icons.FolderPlus },
          { id: 'stats', label: 'Thống kê tiến độ', icon: Icons.BarChart3 },
          { id: 'settings', label: 'Cài đặt hệ thống', icon: Icons.Settings }
        ].map(item => React.createElement('button', {
          key: item.id,
          onClick: () => setView(item.id),
          className: `w-full p-3 rounded-2xl flex items-center gap-3 text-sm font-semibold ${
            currentView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`
        }, [
          React.createElement(item.icon, { size: 18 }),
          item.label
        ]))
      ])
    ]),

    // Account Detail Modal
    selectedAccount && React.createElement(AccountDetailModal, {
      key: 'detail-modal',
      account: selectedAccount,
      allAccountsMap,
      progress,
      onClose: () => setSelectedAccount(null),
      onSelectAccount: (acc) => setSelectedAccount(acc),
      onStartSingleAccountStudy: handleStartSingleAccountStudy
    }),

    // Quick Search Modal (⌘K)
    isSearchOpen && React.createElement('div', {
      key: 'quick-search-modal',
      className: 'fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/40 backdrop-blur-sm animate-fade-in'
    }, [
      React.createElement('div', {
        className: 'absolute inset-0',
        onClick: () => setIsSearchOpen(false)
      }),
      React.createElement('div', {
        className: 'relative w-full max-w-xl bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden space-y-2 p-4 z-10'
      }, [
        React.createElement('div', { className: 'relative' }, [
          React.createElement(Icons.Search, { size: 18, className: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none' }),
          React.createElement('input', {
            autoFocus: true,
            type: 'text',
            value: quickSearchQuery,
            onChange: (e) => setQuickSearchQuery(e.target.value),
            placeholder: 'Gõ số hiệu (111, 152) hoặc tên tài khoản...',
            className: 'w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500'
          }),
          React.createElement('button', {
            onClick: () => setIsSearchOpen(false),
            className: 'absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600'
          }, React.createElement(Icons.X, { size: 16 }))
        ]),

        React.createElement('div', { className: 'max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800' },
          quickSearchResults.map(acc => React.createElement('div', {
            key: acc.code,
            onClick: () => {
              sound.playClick();
              setIsSearchOpen(false);
              setSelectedAccount(acc);
            },
            className: 'p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-xl flex items-center justify-between cursor-pointer transition-colors group'
          }, [
            React.createElement('div', { className: 'flex items-center gap-2.5' }, [
              React.createElement('span', { className: 'font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' }, acc.code),
              React.createElement('span', { className: 'text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600' }, acc.name)
            ]),
            React.createElement('span', { className: 'text-[11px] text-neutral-400 font-medium' }, `Cấp ${acc.level}`)
          ]))
        )
      ])
    ]),

    // Floating circular button to restore header & sidebar at the same time
    !isNavVisible && React.createElement('button', {
      key: 'floating-nav-btn',
      onClick: () => {
        sound.playClick();
        setIsNavVisible(true);
      },
      title: 'Hiện lại thanh điều hướng & tiêu đề',
      'aria-label': 'Hiện lại thanh điều hướng & tiêu đề',
      className: 'fixed top-3 right-4 md:right-8 z-50 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 dark:bg-[#1c1c1e]/90 hover:bg-neutral-100 dark:hover:bg-neutral-800 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-200 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 animate-fade-in'
    }, React.createElement(Icons.Menu, { size: 19 }))
  ]);
}
