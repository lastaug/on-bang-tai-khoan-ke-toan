// Apple HIG Learning Progress Statistics Component
import React, { useMemo } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Stats({
  accounts,
  groups,
  progress,
  sessions,
  settings,
  onSelectAccount,
  onStartStudyWithPreset
}) {
  const total = accounts.length;

  // Compute detailed analytics
  const {
    learnedCount,
    masteredCount,
    learningCount,
    totalReviews,
    totalCorrect,
    overallAccuracy,
    weakAccounts
  } = useMemo(() => {
    let learned = 0;
    let mastered = 0;
    let learning = 0;
    let reviews = 0;
    let correct = 0;

    const weak = [];

    accounts.forEach(acc => {
      const p = progress[acc.code];
      if (p) {
        if (p.state >= 1) learned += 1;
        if (p.state === 3) mastered += 1;
        if (p.state === 1 || p.state === 2) learning += 1;

        reviews += (p.review_count || 0);
        correct += (p.correct_count || 0);

        if ((p.wrong_count || 0) > 0) {
          weak.push({
            account: acc,
            wrong: p.wrong_count,
            accuracy: p.review_count > 0 ? Math.round((p.correct_count / p.review_count) * 100) : 0
          });
        }
      }
    });

    weak.sort((a, b) => b.wrong - a.wrong);

    const accPct = reviews > 0 ? Math.round((correct / reviews) * 100) : 0;

    return {
      learnedCount: learned,
      masteredCount: mastered,
      learningCount: learning,
      totalReviews: reviews,
      totalCorrect: correct,
      overallAccuracy: accPct,
      weakAccounts: weak.slice(0, 10)
    };
  }, [accounts, progress]);

  const streak = settings?.streak || 1;

  return React.createElement('div', { className: 'space-y-8 animate-fade-in pb-12' }, [
    // Header
    React.createElement('div', { key: 'hdr', className: 'space-y-1' }, [
      React.createElement('h2', { className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Thống kê Tiến độ Học tập'),
      React.createElement('p', { className: 'text-sm text-neutral-500 dark:text-neutral-400' }, 'Phân tích định lượng về khả năng ghi nhớ và các vùng kiến thức cần củng cố.')
    ]),

    // Top 4 Metrics Cards
    React.createElement('div', { key: 'kpi-grid', className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' }, [
      {
        label: 'Tỷ lệ chính xác',
        value: `${overallAccuracy}%`,
        sub: `${totalCorrect}/${totalReviews} lượt trả lời đúng`,
        icon: Icons.CheckCircle2,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40'
      },
      {
        label: 'Tài khoản đã thuộc',
        value: `${masteredCount}/${total}`,
        sub: `${Math.round((masteredCount / total) * 100)}% toàn bộ hệ thống`,
        icon: Icons.Trophy,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40'
      },
      {
        label: 'Chuỗi ngày học',
        value: `${streak} ngày`,
        sub: 'Duy trì hàng ngày',
        icon: Icons.Flame,
        color: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40'
      },
      {
        label: 'Buổi học đã làm',
        value: sessions?.length || 0,
        sub: 'Phiên luyện tập',
        icon: Icons.Sparkles,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/40'
      }
    ].map((kpi, idx) => React.createElement('div', {
      key: 'kpi-' + idx,
      className: 'p-5 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-3'
    }, [
      React.createElement('div', { className: 'flex items-center justify-between' }, [
        React.createElement('span', { className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, kpi.label),
        React.createElement('div', { className: `w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center` },
          React.createElement(kpi.icon, { size: 16 })
        )
      ]),
      React.createElement('div', {}, [
        React.createElement('div', { className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, kpi.value),
        React.createElement('div', { className: 'text-xs text-neutral-500 dark:text-neutral-400 mt-0.5' }, kpi.sub)
      ])
    ]))),

    // Group Progress Comparison (Detailed Bars)
    React.createElement('div', {
      key: 'group-bars-section',
      className: 'p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-6'
    }, [
      React.createElement('div', { className: 'flex items-center justify-between' }, [
        React.createElement('div', {}, [
          React.createElement('h3', { className: 'text-base font-bold text-neutral-900 dark:text-neutral-100' }, 'Mức độ thuộc theo từng nhóm tài khoản'),
          React.createElement('p', { className: 'text-xs text-neutral-500' }, 'So sánh tỷ lệ thành thạo giữa các nhóm tài khoản kế toán')
        ])
      ]),

      React.createElement('div', { className: 'space-y-4' },
        groups.map(grp => {
          const grpAccounts = accounts.filter(a => a.group === grp.id);
          const totalInGrp = grpAccounts.length;
          let masteredInGrp = 0;
          let learningInGrp = 0;

          grpAccounts.forEach(a => {
            const st = progress[a.code]?.state ?? 0;
            if (st === 3) masteredInGrp += 1;
            else if (st >= 1) learningInGrp += 1;
          });

          const masteredPct = totalInGrp > 0 ? Math.round((masteredInGrp / totalInGrp) * 100) : 0;
          const learningPct = totalInGrp > 0 ? Math.round((learningInGrp / totalInGrp) * 100) : 0;

          return React.createElement('div', { key: grp.id, className: 'space-y-1.5' }, [
            React.createElement('div', { className: 'flex items-center justify-between text-xs font-semibold' }, [
              React.createElement('span', { className: 'text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5' }, [
                React.createElement('span', { className: 'font-mono text-[11px] text-blue-600 dark:text-blue-400' }, `Đầu ${grp.code_prefix.join(',')}`),
                grp.name
              ]),
              React.createElement('span', { className: 'text-neutral-500' }, `${masteredInGrp}/${totalInGrp} (${masteredPct}%)`)
            ]),
            React.createElement('div', { className: 'w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex' }, [
              React.createElement('div', {
                key: 'm',
                className: 'h-full bg-blue-600 transition-all duration-500',
                style: { width: `${masteredPct}%` }
              }),
              React.createElement('div', {
                key: 'l',
                className: 'h-full bg-blue-300 dark:bg-blue-900 transition-all duration-500',
                style: { width: `${learningPct}%` }
              })
            ])
          ]);
        })
      )
    ]),

    // Top 10 Weakest Accounts Table
    React.createElement('div', {
      key: 'weak-section',
      className: 'bg-white dark:bg-[#1c1c1e] rounded-3xl border border-neutral-200/70 dark:border-neutral-800 shadow-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800'
    }, [
      React.createElement('div', { className: 'p-5 bg-neutral-50/70 dark:bg-neutral-800/40 flex items-center justify-between' }, [
        React.createElement('div', {}, [
          React.createElement('h3', { className: 'text-sm font-bold text-neutral-800 dark:text-neutral-200' }, 'Tài khoản thường trả lời sai nhất'),
          React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Các tài khoản bạn đã gặp khó khăn trong các buổi thi hoặc flashcard.')
        ]),
        weakAccounts.length > 0 && React.createElement('button', {
          onClick: () => {
            sound.playClick();
            onStartStudyWithPreset('flashcard', {
              accountCodes: weakAccounts.map(w => w.account.code)
            });
          },
          className: 'px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors'
        }, 'Luyện ngay các tài khoản này')
      ]),

      weakAccounts.length > 0 ? React.createElement('div', { className: 'divide-y divide-neutral-100 dark:divide-neutral-800' },
        weakAccounts.map(item => React.createElement('div', {
          key: item.account.code,
          onClick: () => {
            sound.playClick();
            onSelectAccount(item.account);
          },
          className: 'p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between cursor-pointer transition-colors group'
        }, [
          React.createElement('div', { className: 'flex items-center gap-3' }, [
            React.createElement('span', { className: 'font-mono font-bold text-sm px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50' },
              item.account.code
            ),
            React.createElement('div', {}, [
              React.createElement('div', { className: 'text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white' }, item.account.name),
              item.account.tip && React.createElement('div', { className: 'text-xs text-amber-600 dark:text-amber-400 line-clamp-1 mt-0.5' }, item.account.tip)
            ])
          ]),

          React.createElement('div', { className: 'flex items-center gap-4 text-xs font-semibold' }, [
            React.createElement('span', { className: 'text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md' }, `Sai ${item.wrong} lần`),
            React.createElement('span', { className: 'text-neutral-400' }, `${item.accuracy}% đúng`),
            React.createElement(Icons.ChevronRight, { size: 16, className: 'text-neutral-300 group-hover:text-neutral-600' })
          ])
        ]))
      ) : React.createElement('div', { className: 'p-8 text-center text-xs text-neutral-400' },
        'Chưa có tài khoản nào bị sai nhiều lần. Hãy tiếp tục phát huy!'
      )
    ])
  ]);
}
