// Apple HIG Dashboard Page Component
import React from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Dashboard({
  stats,
  groups,
  progress,
  sessions,
  settings,
  setView,
  onStartStudyWithPreset
}) {
  const total = stats?.total || 184;
  const learned = stats?.learned || 0;
  const mastered = stats?.mastered || 0;
  const dueCount = stats?.dueCount || 0;
  const streak = settings?.streak || 1;
  const accuracy = stats?.accuracy || 0;

  const methods = [
    {
      id: 'flashcard',
      title: 'Flashcard 3D',
      desc: 'Lật thẻ 2 chiều ghi nhớ mã và tên tài khoản với hiệu ứng 3D',
      icon: Icons.Sparkles,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Phổ biến nhất'
    },
    {
      id: 'quiz',
      title: 'Trắc nghiệm',
      desc: 'Chọn 1 trong 4 đáp án thông minh từ hệ thống tài khoản thực tế',
      icon: Icons.HelpCircle,
      color: 'from-purple-500 to-pink-600',
      badge: 'Thi thử'
    },
    {
      id: 'matching',
      title: 'Ghép đôi',
      desc: 'Trò chơi tương tác nối nhanh mã số với tên tài khoản tương ứng',
      icon: Icons.Shuffle,
      color: 'from-amber-500 to-orange-600',
      badge: 'Phản xạ'
    },
    {
      id: 'smart-review',
      title: 'Ôn tập Spaced Repetition',
      desc: 'Tự động nhắc lại tài khoản sắp quên theo khoa học ngắt quãng',
      icon: Icons.Flame,
      color: 'from-emerald-500 to-teal-600',
      badge: dueCount > 0 ? `${dueCount} cần ôn` : 'Tối ưu'
    }
  ];

  return React.createElement('div', { className: 'space-y-8 animate-fade-in pb-12' }, [
    // Welcome Banner
    React.createElement('div', {
      key: 'welcome-card',
      className: 'relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white shadow-xl'
    }, [
      React.createElement('div', { key: 'bg-accents', className: 'absolute -right-12 -top-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none' }),
      React.createElement('div', { key: 'content', className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6' }, [
        React.createElement('div', { key: 'text-block', className: 'space-y-2' }, [
          React.createElement('div', { key: 'streak-pill', className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold' }, [
            React.createElement(Icons.Flame, { key: 'flame', size: 14 }),
            `Chuỗi ${streak} ngày học liên tục`
          ]),
          React.createElement('h2', { key: 'heading', className: 'text-2xl md:text-3xl font-extrabold tracking-tight' }, 'Ôn tập Hệ thống Tài khoản Kế toán'),
          React.createElement('p', { key: 'sub', className: 'text-sm text-neutral-300 max-w-xl' },
            'Theo chuẩn Thông tư 99/2025/TT-BTC của Bộ Tài chính. Tối ưu hóa trí nhớ dài hạn bằng thuật toán lặp lại ngắt quãng (Spaced Repetition).'
          )
        ]),
        React.createElement('div', { key: 'actions', className: 'flex flex-wrap items-center gap-3' }, [
          React.createElement('button', {
            key: 'btn-continue',
            onClick: () => {
              sound.playClick();
              setView('setup');
            },
            className: 'px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center gap-2'
          }, [
            React.createElement(Icons.Play, { key: 'icon', size: 16 }),
            'Tiếp tục học tập'
          ]),
          dueCount > 0 && React.createElement('button', {
            key: 'btn-review',
            onClick: () => {
              sound.playClick();
              setView('smart-review');
            },
            className: 'px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-semibold text-sm active:scale-[0.98] transition-all flex items-center gap-2'
          }, [
            React.createElement(Icons.Flame, { key: 'flame', size: 16 }),
            `Ôn ${dueCount} tài khoản đến hạn`
          ])
        ])
      ])
    ]),

    // Primary 4 Stat Cards
    React.createElement('div', { key: 'stats-grid', className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' }, [
      {
        label: 'Tổng tài khoản',
        value: total,
        sub: 'Theo Thông tư 99',
        icon: Icons.BookOpen,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40'
      },
      {
        label: 'Đã học',
        value: learned,
        sub: `${Math.round((learned / total) * 100)}% toàn bộ`,
        icon: Icons.Eye,
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40'
      },
      {
        label: 'Đã thuộc vững',
        value: mastered,
        sub: `${Math.round((mastered / total) * 100)}% thành thạo`,
        icon: Icons.Trophy,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40'
      },
      {
        label: 'Cần ôn hôm nay',
        value: dueCount,
        sub: dueCount === 0 ? 'Tuyệt vời, đã xong!' : 'Đến hạn nhắc lại',
        icon: Icons.Clock,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40'
      }
    ].map((item, idx) => React.createElement('div', {
      key: 'stat-' + idx,
      className: 'p-5 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-3'
    }, [
      React.createElement('div', { key: 'top', className: 'flex items-center justify-between' }, [
        React.createElement('span', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, item.label),
        React.createElement('div', { key: 'icon-box', className: `w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center` },
          React.createElement(item.icon, { size: 16 })
        )
      ]),
      React.createElement('div', { key: 'bot' }, [
        React.createElement('div', { key: 'val', className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, item.value),
        React.createElement('div', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400 mt-0.5' }, item.sub)
      ])
    ]))),

    // 4 Learning Methods Section
    React.createElement('div', { key: 'methods-section', className: 'space-y-4' }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between' }, [
        React.createElement('div', { key: 'title-block' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, '4 Phương pháp học tập'),
          React.createElement('p', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400' }, 'Lựa chọn phương pháp phù hợp với giai đoạn ghi nhớ của bạn')
        ]),
        React.createElement('button', {
          key: 'custom-btn',
          onClick: () => {
            sound.playClick();
            setView('setup');
          },
          className: 'text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'
        }, [
          'Tùy chỉnh sâu',
          React.createElement(Icons.ChevronRight, { key: 'arr', size: 14 })
        ])
      ]),

      React.createElement('div', { key: 'methods-grid', className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
        methods.map(method => React.createElement('div', {
          key: method.id,
          onClick: () => {
            sound.playClick();
            onStartStudyWithPreset(method.id);
          },
          className: 'group p-5 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4'
        }, [
          React.createElement('div', { key: 'm-top', className: 'space-y-3' }, [
            React.createElement('div', { key: 'icon-row', className: 'flex items-center justify-between' }, [
              React.createElement('div', {
                key: 'icon-wrap',
                className: `w-12 h-12 rounded-2xl bg-gradient-to-tr ${method.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`
              }, React.createElement(method.icon, { size: 22 })),
              React.createElement('span', {
                key: 'badge',
                className: 'text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }, method.badge)
            ]),
            React.createElement('div', { key: 'm-title', className: 'font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' }, method.title),
            React.createElement('p', { key: 'm-desc', className: 'text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed' }, method.desc)
          ]),
          React.createElement('div', {
            key: 'm-cta',
            className: 'pt-2 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform'
          }, [
            'Bắt đầu ngay',
            React.createElement(Icons.ChevronRight, { key: 'arr', size: 14, className: 'ml-0.5' })
          ])
        ]))
      )
    ]),

    // 8 Groups Mastery Breakdown
    React.createElement('div', { key: 'groups-section', className: 'space-y-4' }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between' }, [
        React.createElement('div', { key: 'title-block' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Tiến độ theo 8 Nhóm tài khoản'),
          React.createElement('p', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400' }, 'Theo dõi tỷ lệ ghi nhớ của từng phân loại tài khoản')
        ]),
        React.createElement('button', {
          key: 'all-groups-btn',
          onClick: () => {
            sound.playClick();
            setView('groups');
          },
          className: 'text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'
        }, [
          'Xem chi tiết 8 nhóm',
          React.createElement(Icons.ChevronRight, { key: 'arr', size: 14 })
        ])
      ]),

      React.createElement('div', { key: 'groups-grid', className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
        groups.map(grp => {
          const grpStats = stats?.groupStats?.[grp.id] || { total: 0, learned: 0, mastered: 0 };
          const grpPct = grpStats.total > 0 ? Math.round((grpStats.mastered / grpStats.total) * 100) : 0;

          return React.createElement('div', {
            key: grp.id,
            onClick: () => {
              sound.playClick();
              setView('groups', { selectedGroupId: grp.id });
            },
            className: 'p-4 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3'
          }, [
            React.createElement('div', { key: 'top', className: 'flex items-center justify-between' }, [
              React.createElement('span', {
                key: 'badge',
                className: 'text-[11px] font-bold px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }, `Đầu ${grp.code_prefix.join(', ')}`),
              React.createElement('span', {
                key: 'pct',
                className: 'text-xs font-bold text-blue-600 dark:text-blue-400'
              }, `${grpPct}%`)
            ]),
            React.createElement('div', { key: 'name', className: 'font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate' }, grp.name),
            React.createElement('div', { key: 'bar-wrap', className: 'space-y-1' }, [
              React.createElement('div', { key: 'bar', className: 'w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden' }, [
                React.createElement('div', {
                  key: 'fill',
                  className: 'h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500',
                  style: { width: `${grpPct}%` }
                })
              ]),
              React.createElement('div', { key: 'counts', className: 'flex items-center justify-between text-[11px] text-neutral-400' }, [
                React.createElement('span', { key: 'm' }, `Thuộc: ${grpStats.mastered}/${grpStats.total}`),
                React.createElement('span', { key: 'l' }, `Đã học: ${grpStats.learned}`)
              ])
            ])
          ]);
        })
      )
    ]),

    // Recent Sessions
    sessions && sessions.length > 0 && React.createElement('div', { key: 'recent-sessions', className: 'space-y-3' }, [
      React.createElement('h3', { key: 'title', className: 'text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Lịch sử buổi học gần đây'),
      React.createElement('div', { key: 'list', className: 'bg-white dark:bg-[#1c1c1e] rounded-3xl border border-neutral-200/70 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-sm' },
        sessions.slice(0, 4).map(sess => React.createElement('div', {
          key: sess.id,
          className: 'p-4 flex items-center justify-between text-sm'
        }, [
          React.createElement('div', { key: 'left', className: 'flex items-center gap-3' }, [
            React.createElement('div', {
              key: 'mode-icon',
              className: 'w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300'
            }, React.createElement(sess.mode === 'quiz' ? Icons.HelpCircle : sess.mode === 'matching' ? Icons.Shuffle : Icons.Sparkles, { size: 18 })),
            React.createElement('div', { key: 'meta' }, [
              React.createElement('div', { key: 'name', className: 'font-semibold text-neutral-800 dark:text-neutral-200' },
                sess.mode === 'quiz' ? 'Trắc nghiệm' : sess.mode === 'matching' ? 'Ghép đôi' : sess.mode === 'smart' ? 'Ôn tập Spaced' : 'Flashcard'
              ),
              React.createElement('div', { key: 'date', className: 'text-xs text-neutral-400' },
                new Date(sess.completed_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
              )
            ])
          ]),
          React.createElement('div', { key: 'right', className: 'text-right' }, [
            React.createElement('div', { key: 'score', className: 'font-bold text-sm text-emerald-600 dark:text-emerald-400' },
              sess.total_items ? `${sess.correct_items}/${sess.total_items} (${Math.round((sess.correct_items / sess.total_items) * 100)}%)` : 'Hoàn thành'
            ),
            sess.duration_seconds && React.createElement('div', { key: 'time', className: 'text-xs text-neutral-400' }, `${sess.duration_seconds} giây`)
          ])
        ]))
      )
    ])
  ]);
}
