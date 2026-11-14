// Apple HIG Session Setup Page Component
import React, { useState, useMemo } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function SessionSetup({
  groups,
  accounts,
  customDecks,
  progress,
  initialMethod = 'flashcard',
  initialGroupId = null,
  onStartSession
}) {
  const [method, setMethod] = useState(initialMethod);
  const [sourceType, setSourceType] = useState(initialGroupId ? 'group' : 'all'); // 'all', 'group', 'deck'
  const [selectedGroups, setSelectedGroups] = useState(initialGroupId ? [initialGroupId] : groups.map(g => g.id));
  const [selectedLevels, setSelectedLevels] = useState([1, 2, 3, 4]);
  const [selectedDeckId, setSelectedDeckId] = useState(customDecks[0]?.id || '');
  const [smartFilter, setSmartFilter] = useState('all'); // 'all', 'unmastered', 'weak', 'due'
  const [direction, setDirection] = useState('code-to-name'); // 'code-to-name', 'name-to-code', 'mixed'
  const [order, setOrder] = useState('shuffle'); // 'sequential', 'shuffle'
  const [questionCount, setQuestionCount] = useState(20); // 10, 20, 50, 0 (all)

  // Toggle group selection
  const toggleGroup = (id) => {
    sound.playClick();
    setSelectedGroups(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(g => g !== id);
      }
      return [...prev, id];
    });
  };

  const toggleLevel = (lvl) => {
    sound.playClick();
    setSelectedLevels(prev => {
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== lvl);
      }
      return [...prev, lvl];
    });
  };

  // Filter accounts according to selections
  const preparedAccounts = useMemo(() => {
    let pool = [...accounts];

    if (sourceType === 'deck') {
      const deck = customDecks.find(d => d.id === selectedDeckId);
      if (deck && deck.account_codes) {
        pool = pool.filter(a => deck.account_codes.includes(a.code));
      }
    } else {
      // Group filter
      pool = pool.filter(a => selectedGroups.includes(a.group));
      // Level filter
      pool = pool.filter(a => selectedLevels.includes(a.level));
    }

    // Smart filters
    if (smartFilter === 'unmastered') {
      pool = pool.filter(a => (progress[a.code]?.state ?? 0) < 3);
    } else if (smartFilter === 'weak') {
      pool = pool.filter(a => (progress[a.code]?.wrong_count ?? 0) > 0);
    } else if (smartFilter === 'due') {
      const now = new Date();
      pool = pool.filter(a => {
        const p = progress[a.code];
        if (!p || !p.next_review) return true; // new
        return new Date(p.next_review) <= now;
      });
    }

    // Order
    if (order === 'shuffle') {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    // Limit count
    if (questionCount > 0 && pool.length > questionCount) {
      pool = pool.slice(0, questionCount);
    }

    return pool;
  }, [
    accounts,
    sourceType,
    selectedDeckId,
    selectedGroups,
    selectedLevels,
    smartFilter,
    order,
    questionCount,
    customDecks,
    progress
  ]);

  const handleStart = () => {
    if (preparedAccounts.length === 0) return;
    sound.playClick();
    onStartSession({
      method,
      accounts: preparedAccounts,
      direction,
      order,
      sourceType
    });
  };

  const methodOptions = [
    { id: 'flashcard', name: 'Flashcard 3D', icon: Icons.Sparkles, desc: 'Lật thẻ 2 mặt ghi nhớ phản xạ' },
    { id: 'quiz', name: 'Trắc nghiệm', icon: Icons.HelpCircle, desc: 'Chọn 1 trong 4 đáp án' },
    { id: 'matching', name: 'Ghép đôi', icon: Icons.Shuffle, desc: 'Nối mã với tên tương ứng' },
    { id: 'smart-review', name: 'Ôn tập Spaced', icon: Icons.Flame, desc: 'Lặp lại ngắt quãng khoa học' }
  ];

  return React.createElement('div', { className: 'max-w-4xl mx-auto space-y-8 animate-fade-in pb-16' }, [
    // Header
    React.createElement('div', { key: 'hdr', className: 'space-y-1' }, [
      React.createElement('h2', { key: 't', className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Thiết lập Buổi học'),
      React.createElement('p', { key: 's', className: 'text-sm text-neutral-500 dark:text-neutral-400' }, 'Tùy biến phương pháp, phạm vi tài khoản và chế độ ôn tập theo nhu cầu của bạn.')
    ]),

    // 1. Phương pháp học (Segmented cards)
    React.createElement('div', {
      key: 'step-method',
      className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-4'
    }, [
      React.createElement('div', { key: 'lbl', className: 'text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider' }, '1. Chọn phương pháp học'),
      React.createElement('div', { key: 'grid', className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3' },
        methodOptions.map(m => {
          const isSel = method === m.id;
          return React.createElement('div', {
            key: m.id,
            onClick: () => {
              sound.playClick();
              setMethod(m.id);
            },
            className: `p-4 rounded-2xl cursor-pointer border transition-all ${
              isSel
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm'
                : 'bg-neutral-50/50 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
            }`
          }, [
            React.createElement('div', { key: 'top', className: 'flex items-center justify-between mb-2' }, [
              React.createElement(m.icon, {
                size: 20,
                className: isSel ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'
              }),
              isSel && React.createElement(Icons.CheckCircle2, { size: 16, className: 'text-blue-600 dark:text-blue-400' })
            ]),
            React.createElement('div', { key: 'name', className: `font-bold text-sm ${isSel ? 'text-blue-900 dark:text-blue-200' : 'text-neutral-800 dark:text-neutral-200'}` }, m.name),
            React.createElement('div', { key: 'desc', className: 'text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-snug' }, m.desc)
          ]);
        })
      )
    ]),

    // 2. Phạm vi tài khoản (Source selection)
    React.createElement('div', {
      key: 'step-source',
      className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-5'
    }, [
      React.createElement('div', { key: 'lbl', className: 'text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider' }, '2. Chọn phạm vi tài khoản'),

      // Source Tabs
      React.createElement('div', { key: 'src-tabs', className: 'flex items-center gap-2' }, [
        { id: 'all', label: 'Tất cả 8 nhóm' },
        { id: 'group', label: 'Lựa chọn nhóm' },
        { id: 'deck', label: `Bộ học cá nhân (${customDecks.length})` }
      ].map(tab => React.createElement('button', {
        key: tab.id,
        onClick: () => {
          sound.playClick();
          setSourceType(tab.id);
        },
        className: `px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
          sourceType === tab.id
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
        }`
      }, tab.label))),

      // If Source is Group: Multi-select 8 groups
      sourceType === 'group' && React.createElement('div', { key: 'group-selector', className: 'space-y-3 pt-2' }, [
        React.createElement('div', { key: 'g-help', className: 'text-xs text-neutral-400' }, 'Click để chọn hoặc bỏ chọn các nhóm bạn muốn ôn tập:'),
        React.createElement('div', { key: 'g-grid', className: 'grid grid-cols-2 sm:grid-cols-4 gap-2.5' },
          groups.map(g => {
            const isSel = selectedGroups.includes(g.id);
            return React.createElement('div', {
              key: g.id,
              onClick: () => toggleGroup(g.id),
              className: `p-3 rounded-2xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                isSel
                  ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 font-semibold'
                  : 'bg-neutral-50/50 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100'
              }`
            }, [
              React.createElement('span', { key: 'name', className: 'truncate' }, `Nhóm ${g.id}: ${g.name}`),
              isSel && React.createElement(Icons.Check, { key: 'chk', size: 14, className: 'text-blue-600 dark:text-blue-400 shrink-0 ml-1' })
            ]);
          })
        )
      ]),

      // If Source is Custom Deck: Select Deck
      sourceType === 'deck' && React.createElement('div', { key: 'deck-selector', className: 'pt-2' },
        customDecks.length > 0 ? React.createElement('select', {
          value: selectedDeckId,
          onChange: (e) => setSelectedDeckId(e.target.value),
          className: 'w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500'
        }, customDecks.map(d => React.createElement('option', { key: d.id, value: d.id }, `${d.name} (${d.account_codes?.length || 0} tài khoản)`)))
        : React.createElement('div', { className: 'p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-500 text-xs text-center' },
          'Bạn chưa có bộ học cá nhân nào. Hãy sang mục "Bộ học cá nhân" để tạo bộ mới.'
        )
      ),

      // Account Level Selector
      sourceType !== 'deck' && React.createElement('div', { key: 'lvl-selector', className: 'space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800' }, [
        React.createElement('div', { key: 'lbl', className: 'text-xs text-neutral-400' }, 'Cấp tài khoản:'),
        React.createElement('div', { key: 'lvl-btns', className: 'flex flex-wrap gap-2' }, [
          { lvl: 1, label: 'Cấp 1 (3 số)' },
          { lvl: 2, label: 'Cấp 2 (4 số)' },
          { lvl: 3, label: 'Cấp 3 (5 số)' },
          { lvl: 4, label: 'Cấp 4 (6 số)' }
        ].map(item => {
          const isSel = selectedLevels.includes(item.lvl);
          return React.createElement('button', {
            key: item.lvl,
            onClick: () => toggleLevel(item.lvl),
            className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSel
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent shadow-sm'
                : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200/60 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100'
            }`
          }, item.label);
        }))
      ])
    ]),

    // 3. Tùy chọn thông minh & Điều kiện học
    React.createElement('div', {
      key: 'step-options',
      className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-5'
    }, [
      React.createElement('div', { key: 'lbl', className: 'text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider' }, '3. Bộ lọc trạng thái & Chiều học'),

      React.createElement('div', { key: 'opts-grid', className: 'grid grid-cols-1 md:grid-cols-3 gap-4' }, [
        // Smart Filter
        React.createElement('div', { key: 'f1', className: 'space-y-1.5' }, [
          React.createElement('label', { className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, 'Lọc theo trạng thái nhớ:'),
          React.createElement('select', {
            value: smartFilter,
            onChange: (e) => setSmartFilter(e.target.value),
            className: 'w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium border-none focus:ring-2 focus:ring-blue-500'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'Tất cả tài khoản trong phạm vi'),
            React.createElement('option', { key: 'unmastered', value: 'unmastered' }, 'Chỉ học tài khoản chưa thuộc'),
            React.createElement('option', { key: 'weak', value: 'weak' }, 'Chỉ ôn tài khoản hay trả lời sai'),
            React.createElement('option', { key: 'due', value: 'due' }, 'Chỉ tài khoản đến hạn ôn Spaced')
          ])
        ]),

        // Direction
        React.createElement('div', { key: 'f2', className: 'space-y-1.5' }, [
          React.createElement('label', { className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, 'Chiều câu hỏi:'),
          React.createElement('select', {
            value: direction,
            onChange: (e) => setDirection(e.target.value),
            className: 'w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium border-none focus:ring-2 focus:ring-blue-500'
          }, [
            React.createElement('option', { key: 'c2n', value: 'code-to-name' }, 'Hỏi Mã → Nhớ Tên tài khoản'),
            React.createElement('option', { key: 'n2c', value: 'name-to-code' }, 'Hỏi Tên → Nhớ Mã tài khoản'),
            React.createElement('option', { key: 'mix', value: 'mixed' }, 'Xáo trộn cả 2 chiều')
          ])
        ]),

        // Question Count
        React.createElement('div', { key: 'f3', className: 'space-y-1.5' }, [
          React.createElement('label', { className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, 'Số lượng tài khoản:'),
          React.createElement('div', { className: 'flex items-center gap-1.5' },
            [10, 20, 50, 0].map(cnt => React.createElement('button', {
              key: cnt,
              onClick: () => {
                sound.playClick();
                setQuestionCount(cnt);
              },
              className: `flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                questionCount === cnt
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`
            }, cnt === 0 ? 'Tất cả' : cnt))
          )
        ])
      ])
    ]),

    // Bottom Action Hero Card
    React.createElement('div', {
      key: 'start-action-card',
      className: 'p-6 rounded-3xl bg-neutral-900 text-white dark:bg-neutral-800/90 border border-neutral-700/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4'
    }, [
      React.createElement('div', { key: 'count-info', className: 'space-y-1' }, [
        React.createElement('div', { key: 'ready-tag', className: 'text-xs text-blue-400 font-bold uppercase tracking-wider' }, 'Sẵn sàng khởi động'),
        React.createElement('div', { key: 'total-txt', className: 'text-xl font-extrabold' },
          `${preparedAccounts.length} tài khoản đã được chuẩn bị`
        ),
        React.createElement('div', { key: 'sub', className: 'text-xs text-neutral-400' },
          `Phương pháp: ${methodOptions.find(m => m.id === method)?.name} • Thứ tự: ${order === 'shuffle' ? 'Ngẫu nhiên' : 'Tuần tự'}`
        )
      ]),

      React.createElement('button', {
        key: 'start-btn',
        disabled: preparedAccounts.length === 0,
        onClick: handleStart,
        className: `px-8 py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
          preparedAccounts.length > 0
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-[0.98]'
            : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
        }`
      }, [
        React.createElement(Icons.Play, { key: 'icon', size: 18 }),
        'BẮT ĐẦU BUỔI HỌC'
      ])
    ])
  ]);
}
