// Apple HIG Account Detail Modal Component
import React from 'https://esm.sh/react@18.2.0';
import { Icons } from './Icons.js';
import { sound } from '../services/audio.js';

export function AccountDetailModal({
  account,
  allAccountsMap,
  progress,
  onClose,
  onSelectAccount,
  onStartSingleAccountStudy
}) {
  if (!account) return null;

  const prog = progress[account.code] || {
    state: 0,
    review_count: 0,
    correct_count: 0,
    wrong_count: 0,
    interval_days: 0
  };

  const stateLabels = [
    { label: 'Chưa học', color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' },
    { label: 'Đang học', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    { label: 'Sắp thuộc', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    { label: 'Đã thuộc', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' }
  ];

  const parentAcc = account.parent ? allAccountsMap[account.parent] : null;
  const childAccs = (account.children || []).map(code => allAccountsMap[code]).filter(Boolean);

  const accuracy = prog.review_count > 0
    ? Math.round((prog.correct_count / prog.review_count) * 100)
    : null;

  return React.createElement('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in'
  }, [
    React.createElement('div', {
      key: 'backdrop-close',
      className: 'absolute inset-0',
      onClick: onClose
    }),
    React.createElement('div', {
      key: 'modal-body',
      className: 'relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-neutral-200/80 dark:border-neutral-700/80 p-6 md:p-8 space-y-6 z-10 transition-all'
    }, [
      // Header
      React.createElement('div', { key: 'hdr', className: 'flex items-start justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4' }, [
        React.createElement('div', { key: 'title-block', className: 'space-y-1' }, [
          React.createElement('div', { key: 'badges', className: 'flex items-center gap-2 flex-wrap' }, [
            React.createElement('span', {
              key: 'code-pill',
              className: 'px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono font-bold text-base shadow-sm'
            }, account.code),
            React.createElement('span', {
              key: 'level-pill',
              className: 'px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold'
            }, `Cấp ${account.level}`),
            React.createElement('span', {
              key: 'state-pill',
              className: `px-2 py-0.5 rounded-lg text-xs font-semibold ${stateLabels[prog.state]?.color || ''}`
            }, stateLabels[prog.state]?.label || 'Chưa học')
          ]),
          React.createElement('h2', {
            key: 'acc-name',
            className: 'text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 pt-1'
          }, account.name)
        ]),
        React.createElement('button', {
          key: 'close-btn',
          onClick: onClose,
          className: 'p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
        }, React.createElement(Icons.X, { size: 20 }))
      ]),

      // Nature & Group Info Grid
      React.createElement('div', { key: 'info-grid', className: 'grid grid-cols-2 gap-3' }, [
        React.createElement('div', {
          key: 'nature-box',
          className: 'p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50'
        }, [
          React.createElement('div', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1' }, 'Tính chất số dư'),
          React.createElement('div', { key: 'val', className: 'font-semibold text-sm text-neutral-800 dark:text-neutral-200' }, account.nature || 'Dư Nợ')
        ]),
        React.createElement('div', {
          key: 'stats-box',
          className: 'p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50'
        }, [
          React.createElement('div', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1' }, 'Lịch sử ôn tập'),
          React.createElement('div', { key: 'val', className: 'font-semibold text-sm text-neutral-800 dark:text-neutral-200' }, 
            prog.review_count > 0 ? `${prog.correct_count}/${prog.review_count} (${accuracy}% đúng)` : 'Chưa ôn lần nào'
          )
        ])
      ]),

      // Practical Mnemonic Tip
      React.createElement('div', {
        key: 'mnemonic-box',
        className: 'p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 space-y-1.5'
      }, [
        React.createElement('div', { key: 'tip-hdr', className: 'flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider' }, [
          React.createElement(Icons.Lightbulb, { key: 'bulb', size: 16 }),
          'Mẹo ghi nhớ nhanh (Thực chiến)'
        ]),
        React.createElement('p', {
          key: 'tip-body',
          className: 'text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed'
        }, account.tip || 'Liên tưởng mã số và ý nghĩa tài khoản trong thực tế kinh doanh.')
      ]),

      // Hierarchy (Parent & Children)
      React.createElement('div', { key: 'hierarchy-section', className: 'space-y-3' }, [
        parentAcc && React.createElement('div', { key: 'parent-block', className: 'space-y-1' }, [
          React.createElement('div', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, 'Tài khoản cấp cha:'),
          React.createElement('div', {
            key: 'parent-card',
            onClick: () => {
              sound.playClick();
              onSelectAccount(parentAcc);
            },
            className: 'p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/50 flex items-center justify-between cursor-pointer transition-colors'
          }, [
            React.createElement('div', { key: 'info', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'code', className: 'font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300' }, parentAcc.code),
              React.createElement('span', { key: 'name', className: 'text-sm text-neutral-700 dark:text-neutral-300' }, parentAcc.name)
            ]),
            React.createElement(Icons.ChevronRight, { key: 'arr', size: 16, className: 'text-neutral-400' })
          ])
        ]),

        childAccs.length > 0 && React.createElement('div', { key: 'children-block', className: 'space-y-2' }, [
          React.createElement('div', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, `Các tài khoản cấp con (${childAccs.length}):`),
          React.createElement('div', { key: 'child-list', className: 'max-h-40 overflow-y-auto space-y-1.5 pr-1' }, childAccs.map(child =>
            React.createElement('div', {
              key: child.code,
              onClick: () => {
                sound.playClick();
                onSelectAccount(child);
              },
              className: 'p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/50 flex items-center justify-between cursor-pointer transition-colors'
            }, [
              React.createElement('div', { key: 'info', className: 'flex items-center gap-2' }, [
                React.createElement('span', { key: 'code', className: 'font-mono font-bold text-xs px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300' }, child.code),
                React.createElement('span', { key: 'name', className: 'text-sm text-neutral-700 dark:text-neutral-300 truncate' }, child.name)
              ]),
              React.createElement(Icons.ChevronRight, { key: 'arr', size: 14, className: 'text-neutral-400' })
            ])
          ))
        ])
      ]),

      // Actions footer
      React.createElement('div', { key: 'actions-footer', className: 'pt-2 flex items-center gap-3' }, [
        React.createElement('button', {
          key: 'study-single',
          onClick: () => {
            sound.playClick();
            onClose();
            onStartSingleAccountStudy(account);
          },
          className: 'flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30 active:scale-[0.98] transition-all'
        }, [
          React.createElement(Icons.Play, { key: 'icon', size: 16 }),
          'Luyện tập tài khoản này'
        ]),
        React.createElement('button', {
          key: 'close-btn-bottom',
          onClick: onClose,
          className: 'py-3 px-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-colors'
        }, 'Đóng')
      ])
    ])
  ]);
}
