// Apple HIG Account Catalog Page Component with Tree & List View
import React, { useState, useMemo } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Catalog({
  accounts,
  groups,
  progress,
  onSelectAccount,
  onStartStudyWithPreset
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState({});
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'

  const stateLabels = [
    { id: '0', label: 'Chưa học', color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' },
    { id: '1', label: 'Đang học', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    { id: '2', label: 'Sắp thuộc', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    { id: '3', label: 'Đã thuộc', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' }
  ];

  const toggleNode = (code, e) => {
    if (e) e.stopPropagation();
    sound.playClick();
    setExpandedNodes(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const expandAll = () => {
    sound.playClick();
    const map = {};
    accounts.forEach(a => {
      if (a.children && a.children.length > 0) {
        map[a.code] = true;
      }
    });
    setExpandedNodes(map);
  };

  const collapseAll = () => {
    sound.playClick();
    setExpandedNodes({});
  };

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      // Group filter
      if (selectedGroup !== 'all' && acc.group !== parseInt(selectedGroup)) return false;
      // Level filter
      if (selectedLevel !== 'all' && acc.level !== parseInt(selectedLevel)) return false;
      // State filter
      const accState = (progress[acc.code]?.state ?? 0).toString();
      if (selectedState !== 'all' && accState !== selectedState) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = acc.code.toLowerCase().includes(q);
        const matchName = acc.name.toLowerCase().includes(q);
        return matchCode || matchName;
      }
      return true;
    });
  }, [accounts, selectedGroup, selectedLevel, selectedState, searchQuery, progress]);

  // Build tree hierarchy for tree view
  const rootAccounts = useMemo(() => {
    if (searchQuery.trim() || selectedLevel !== 'all' || selectedState !== 'all') {
      // In search or filter mode, show flat results to avoid hiding children
      return filteredAccounts;
    }
    // Normal tree mode: roots are Level 1 (or matched by group)
    return filteredAccounts.filter(a => !a.parent);
  }, [filteredAccounts, searchQuery, selectedLevel, selectedState]);

  const allAccountsMap = useMemo(() => {
    const map = {};
    accounts.forEach(a => { map[a.code] = a; });
    return map;
  }, [accounts]);

  const renderAccountRow = (acc, depth = 0) => {
    const hasChildren = acc.children && acc.children.length > 0;
    const isExpanded = expandedNodes[acc.code] ?? (depth < 1);
    const accProg = progress[acc.code] || { state: 0 };
    const stateObj = stateLabels[accProg.state] || stateLabels[0];

    const childAccounts = hasChildren
      ? acc.children.map(c => allAccountsMap[c]).filter(Boolean)
      : [];

    return React.createElement('div', { key: acc.code, className: 'flex flex-col' }, [
      React.createElement('div', {
        key: 'row',
        onClick: () => {
          sound.playClick();
          onSelectAccount(acc);
        },
        style: { paddingLeft: `${Math.min(depth * 28 + 16, 120)}px` },
        className: 'group pr-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between cursor-pointer transition-colors'
      }, [
        React.createElement('div', { key: 'left', className: 'flex items-center gap-3 min-w-0' }, [
          // Expand toggle icon
          hasChildren && viewMode === 'tree' ? React.createElement('button', {
            key: 'expand-btn',
            onClick: (e) => toggleNode(acc.code, e),
            className: 'w-6 h-6 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 flex items-center justify-center transition-colors'
          }, React.createElement(isExpanded ? Icons.ChevronDown : Icons.ChevronRight, { size: 16 })) : React.createElement('div', { key: 'spacer', className: 'w-6' }),

          // Account code pill
          React.createElement('span', {
            key: 'code',
            className: 'font-mono font-bold text-xs md:text-sm px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-neutral-200/50 dark:border-neutral-700/50 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0'
          }, acc.code),

          // Account Name
          React.createElement('span', {
            key: 'name',
            className: `font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white truncate ${
              acc.level === 1 ? 'font-semibold' : ''
            }`
          }, acc.name)
        ]),

        React.createElement('div', { key: 'right', className: 'flex items-center gap-2 shrink-0' }, [
          // Nature tag (Dư Nợ, Dư Có...)
          React.createElement('span', {
            key: 'nature',
            className: 'hidden lg:inline-block text-[11px] text-neutral-400 font-medium px-2 py-0.5 rounded'
          }, acc.nature),

          // State badge
          React.createElement('span', {
            key: 'state',
            className: `text-[11px] font-semibold px-2 py-0.5 rounded-full ${stateObj.color}`
          }, stateObj.label),

          React.createElement(Icons.ChevronRight, { key: 'arr', size: 16, className: 'text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors' })
        ])
      ]),

      // Render children if tree mode and expanded
      viewMode === 'tree' && hasChildren && isExpanded && React.createElement('div', {
        key: 'children-container',
        className: 'flex flex-col'
      }, childAccounts.map(child => renderAccountRow(child, depth + 1)))
    ]);
  };

  return React.createElement('div', { className: 'space-y-6 animate-fade-in pb-12' }, [
    // Top Controls Bar (Search + Filters)
    React.createElement('div', {
      key: 'controls-bar',
      className: 'p-5 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-4'
    }, [
      // Search Bar Row
      React.createElement('div', { key: 'search-row', className: 'flex flex-col md:flex-row md:items-center gap-3' }, [
        React.createElement('div', { key: 'input-box', className: 'relative flex-1' }, [
          React.createElement(Icons.Search, {
            size: 18,
            className: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none'
          }),
          React.createElement('input', {
            type: 'text',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: 'Tìm kiếm nhanh theo số hiệu tài khoản (VD: 111, 152) hoặc tên tài khoản...',
            className: 'w-full pl-10 pr-10 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 transition-all'
          }),
          searchQuery && React.createElement('button', {
            onClick: () => setSearchQuery(''),
            className: 'absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }, React.createElement(Icons.X, { size: 16 }))
        ]),

        React.createElement('div', { key: 'tree-actions', className: 'flex items-center gap-2' }, [
          React.createElement('button', {
            key: 'expand-all',
            onClick: expandAll,
            className: 'px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          }, 'Mở rộng tất cả'),
          React.createElement('button', {
            key: 'collapse-all',
            onClick: collapseAll,
            className: 'px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          }, 'Thu gọn tất cả')
        ])
      ]),

      // Filter Selectors Row
      React.createElement('div', { key: 'filters-row', className: 'flex flex-wrap items-center gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800/80' }, [
        // Group Filter
        React.createElement('div', { key: 'grp-filter', className: 'flex items-center gap-1.5' }, [
          React.createElement('span', { className: 'text-xs font-medium text-neutral-400' }, 'Nhóm:'),
          React.createElement('select', {
            value: selectedGroup,
            onChange: (e) => setSelectedGroup(e.target.value),
            className: 'text-xs font-medium py-1.5 px-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-none focus:ring-2 focus:ring-blue-500'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'Tất cả 8 nhóm'),
            ...groups.map(g => React.createElement('option', { key: g.id, value: g.id }, `Nhóm ${g.id}: ${g.name}`))
          ])
        ]),

        // Level Filter
        React.createElement('div', { key: 'lvl-filter', className: 'flex items-center gap-1.5' }, [
          React.createElement('span', { className: 'text-xs font-medium text-neutral-400' }, 'Cấp:'),
          React.createElement('select', {
            value: selectedLevel,
            onChange: (e) => setSelectedLevel(e.target.value),
            className: 'text-xs font-medium py-1.5 px-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-none focus:ring-2 focus:ring-blue-500'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'Tất cả các cấp'),
            React.createElement('option', { key: '1', value: '1' }, 'Cấp 1 (3 chữ số)'),
            React.createElement('option', { key: '2', value: '2' }, 'Cấp 2 (4 chữ số)'),
            React.createElement('option', { key: '3', value: '3' }, 'Cấp 3 (5 chữ số)'),
            React.createElement('option', { key: '4', value: '4' }, 'Cấp 4 (6 chữ số)')
          ])
        ]),

        // Status Filter
        React.createElement('div', { key: 'st-filter', className: 'flex items-center gap-1.5' }, [
          React.createElement('span', { className: 'text-xs font-medium text-neutral-400' }, 'Trạng thái:'),
          React.createElement('select', {
            value: selectedState,
            onChange: (e) => setSelectedState(e.target.value),
            className: 'text-xs font-medium py-1.5 px-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-none focus:ring-2 focus:ring-blue-500'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'Tất cả trạng thái'),
            ...stateLabels.map(st => React.createElement('option', { key: st.id, value: st.id }, st.label))
          ])
        ]),

        // Matching Count Pill
        React.createElement('div', { key: 'count-pill', className: 'ml-auto text-xs font-semibold text-neutral-500 dark:text-neutral-400' },
          `Hiển thị ${filteredAccounts.length} / ${accounts.length} tài khoản`
        )
      ])
    ]),

    // Accounts Tree/List Container
    React.createElement('div', {
      key: 'accounts-container',
      className: 'bg-white dark:bg-[#1c1c1e] rounded-3xl border border-neutral-200/70 dark:border-neutral-800 shadow-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800'
    }, [
      // Table Header
      React.createElement('div', {
        key: 'tbl-hdr',
        className: 'px-5 py-3 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between'
      }, [
        React.createElement('div', { key: 'h-left', className: 'flex items-center gap-6' }, [
          React.createElement('span', { key: 'sp' }, 'MÃ & TÊN TÀI KHOẢN'),
        ]),
        React.createElement('div', { key: 'h-right', className: 'flex items-center gap-4' }, [
          React.createElement('span', { key: 'nature', className: 'hidden lg:inline' }, 'TÍNH CHẤT'),
          React.createElement('span', { key: 'st' }, 'TRẠNG THÁI GHI NHỚ')
        ])
      ]),

      // Rows
      filteredAccounts.length > 0 ? (
        viewMode === 'tree' && (!searchQuery.trim() && selectedLevel === 'all' && selectedState === 'all')
          ? rootAccounts.map(root => renderAccountRow(root, 0))
          : filteredAccounts.map(acc => renderAccountRow(acc, 0))
      ) : React.createElement('div', {
        key: 'empty',
        className: 'p-12 text-center space-y-3'
      }, [
        React.createElement(Icons.HelpCircle, { size: 36, className: 'mx-auto text-neutral-300 dark:text-neutral-600' }),
        React.createElement('div', { className: 'font-semibold text-neutral-700 dark:text-neutral-300 text-sm' }, 'Không tìm thấy tài khoản phù hợp'),
        React.createElement('p', { className: 'text-xs text-neutral-400 max-w-sm mx-auto' }, 'Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh các bộ lọc phân cấp.')
      ])
    ])
  ]);
}
