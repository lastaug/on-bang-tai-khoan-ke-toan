// Apple HIG Spaced Repetition Smart Review Hub Component
import React, { useMemo } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function SmartReview({
  accounts,
  progress,
  onStartSmartStudy,
  onSelectAccount
}) {
  const now = new Date();

  // Categorize accounts by SRS status
  const { dueList, learningList, masteredList, unlearnedList, weakList } = useMemo(() => {
    const due = [];
    const learning = [];
    const mastered = [];
    const unlearned = [];
    const weak = [];

    accounts.forEach(acc => {
      const p = progress[acc.code];
      if (!p || p.state === 0) {
        unlearned.push(acc);
      } else if (p.state === 3) {
        mastered.push(acc);
      } else {
        learning.push(acc);
      }

      if (p && p.wrong_count > 0 && p.state < 3) {
        weak.push(acc);
      }

      // Check due date
      if (p && p.next_review) {
        if (new Date(p.next_review) <= now) {
          due.push(acc);
        }
      }
    });

    return {
      dueList: due,
      learningList: learning,
      masteredList: mastered,
      unlearnedList: unlearned,
      weakList: weak
    };
  }, [accounts, progress, now]);

  // Queue to study: priority to due, then weak, then learning
  const activeReviewQueue = useMemo(() => {
    if (dueList.length > 0) return dueList;
    if (weakList.length > 0) return weakList;
    if (learningList.length > 0) return learningList;
    return unlearnedList.slice(0, 20);
  }, [dueList, weakList, learningList, unlearnedList]);

  const handleStartReview = () => {
    sound.playClick();
    onStartSmartStudy(activeReviewQueue);
  };

  return React.createElement('div', { className: 'space-y-8 animate-fade-in pb-12' }, [
    // Hero Banner
    React.createElement('div', {
      key: 'hero-card',
      className: 'relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white shadow-xl'
    }, [
      React.createElement('div', { key: 'content', className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6' }, [
        React.createElement('div', { key: 'text', className: 'space-y-2' }, [
          React.createElement('div', { key: 'tag', className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold' }, [
            React.createElement(Icons.Flame, { key: 'ic', size: 14 }),
            'Thuật toán Spaced Repetition (Lặp lại ngắt quãng)'
          ]),
          React.createElement('h2', { key: 'title', className: 'text-2xl md:text-3xl font-extrabold tracking-tight' }, 'Ôn tập Thông minh'),
          React.createElement('p', { key: 'sub', className: 'text-sm text-neutral-300 max-w-xl' },
            'Hệ thống tự động theo dõi đường cong lãng quên của não bộ: nhắc lại các tài khoản khó nhớ thường xuyên hơn và giãn cách tối đa các tài khoản đã nhớ vững.'
          )
        ]),

        React.createElement('button', {
          key: 'start-btn',
          onClick: handleStartReview,
          className: 'px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm md:text-base shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0'
        }, [
          React.createElement(Icons.Play, { key: 'play', size: 18 }),
          `ÔN TẬP NGAY (${activeReviewQueue.length} TÀI KHOẢN)`
        ])
      ])
    ]),

    // 4 Mastery Stages Overview
    React.createElement('div', { key: 'stages-grid', className: 'grid grid-cols-2 md:grid-cols-4 gap-4' }, [
      {
        label: 'Chưa học',
        count: unlearnedList.length,
        sub: 'Cần bắt đầu',
        color: 'text-neutral-500',
        bg: 'bg-neutral-100 dark:bg-neutral-800'
      },
      {
        label: 'Đang học',
        count: learningList.length,
        sub: 'Đang ghi nhớ',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40'
      },
      {
        label: 'Cần ôn hôm nay',
        count: dueList.length,
        sub: dueList.length === 0 ? 'Đã hoàn thành' : 'Đến hạn nhắc lại',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40'
      },
      {
        label: 'Đã thuộc vững',
        count: masteredList.length,
        sub: 'Trí nhớ dài hạn',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40'
      }
    ].map((st, idx) => React.createElement('div', {
      key: 'st-' + idx,
      className: 'p-5 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-2'
    }, [
      React.createElement('div', { key: 'top', className: 'text-xs font-semibold text-neutral-500 dark:text-neutral-400' }, st.label),
      React.createElement('div', { key: 'cnt', className: `text-3xl font-extrabold ${st.color}` }, st.count),
      React.createElement('div', { key: 'sub', className: 'text-xs text-neutral-400' }, st.sub)
    ]))),

    // Active Review Queue Table
    React.createElement('div', {
      key: 'queue-section',
      className: 'bg-white dark:bg-[#1c1c1e] rounded-3xl border border-neutral-200/70 dark:border-neutral-800 shadow-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800'
    }, [
      React.createElement('div', {
        key: 'q-hdr',
        className: 'p-5 bg-neutral-50/70 dark:bg-neutral-800/40 flex items-center justify-between'
      }, [
        React.createElement('div', { key: 'left' }, [
          React.createElement('h3', { className: 'text-sm font-bold text-neutral-800 dark:text-neutral-200' }, 'Hàng đợi ôn tập ưu tiên'),
          React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Các tài khoản đến hạn ôn hoặc hay trả lời sai được xếp lịch tự động.')
        ]),
        React.createElement('button', {
          key: 'start-mini',
          onClick: handleStartReview,
          className: 'px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors'
        }, 'Bắt đầu lượt này')
      ]),

      React.createElement('div', { key: 'q-rows', className: 'divide-y divide-neutral-100 dark:divide-neutral-800' },
        activeReviewQueue.slice(0, 15).map(acc => {
          const prog = progress[acc.code] || { state: 0, wrong_count: 0, interval_days: 0 };
          return React.createElement('div', {
            key: acc.code,
            onClick: () => {
              sound.playClick();
              onSelectAccount(acc);
            },
            className: 'p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between cursor-pointer transition-colors group'
          }, [
            React.createElement('div', { key: 'left', className: 'flex items-center gap-3' }, [
              React.createElement('span', {
                key: 'code',
                className: 'font-mono font-bold text-sm px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-neutral-200/50 dark:border-neutral-700/50 group-hover:bg-blue-600 group-hover:text-white transition-colors'
              }, acc.code),
              React.createElement('div', { key: 'name-wrap' }, [
                React.createElement('div', { key: 'name', className: 'text-sm font-semibold text-neutral-800 dark:text-neutral-200' }, acc.name),
                React.createElement('div', { key: 'sub', className: 'text-xs text-neutral-400' }, `Nhóm ${acc.group} • Cấp ${acc.level}`)
              ])
            ]),

            React.createElement('div', { key: 'right', className: 'flex items-center gap-3' }, [
              prog.wrong_count > 0 && React.createElement('span', {
                key: 'wrong-tag',
                className: 'text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md'
              }, `Đã sai ${prog.wrong_count} lần`),
              React.createElement('span', {
                key: 'int-tag',
                className: 'text-xs text-neutral-400 font-medium'
              }, prog.interval_days ? `Giãn cách: ${prog.interval_days} ngày` : 'Mới'),
              React.createElement(Icons.ChevronRight, { key: 'arr', size: 16, className: 'text-neutral-300 group-hover:text-neutral-600' })
            ])
          ]);
        })
      )
    ])
  ]);
}
