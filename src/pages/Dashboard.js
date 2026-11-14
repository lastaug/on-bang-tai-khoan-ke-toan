// Apple HIG Premium Educational Dashboard Page Component
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
  const masteredPct = Math.round((mastered / total) * 100);
  const learnedPct = Math.round((learned / total) * 100);

  const methods = [
    {
      id: 'flashcard',
      title: 'Flashcard 3D',
      desc: 'Lật thẻ 2 chiều ghi nhớ số hiệu và tên gọi tài khoản với tương tác 3D chân thực.',
      icon: Icons.Sparkles,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
      badge: 'Cơ bản'
    },
    {
      id: 'quiz',
      title: 'Trắc nghiệm thông minh',
      desc: 'Chọn 1 trong 4 đáp án thực tế với cơ chế tự động phân bổ câu hỏi chống nhầm lẫn.',
      icon: Icons.HelpCircle,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
      badge: 'Kiểm tra'
    },
    {
      id: 'matching',
      title: 'Ghép đôi phản xạ',
      desc: 'Trò chơi nối nhanh số hiệu với tên tài khoản tương ứng, rèn luyện phản xạ thị giác.',
      icon: Icons.Shuffle,
      iconColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500/10 dark:bg-orange-500/15',
      badge: 'Phản xạ'
    },
    {
      id: 'smart-review',
      title: 'Ôn tập Spaced Repetition',
      desc: 'Thuật toán lặp lại ngắt quãng tự động tối ưu hóa chu kỳ ghi nhớ dài hạn theo khoa học não bộ.',
      icon: Icons.Flame,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      badge: dueCount > 0 ? `${dueCount} đến hạn` : 'Tối ưu'
    }
  ];

  return React.createElement('div', { className: 'space-y-8 animate-fade-in pb-12' }, [
    // Khu vực 2: Hero Section (Tương thích hoàn hảo Light & Dark mode)
    React.createElement('div', {
      key: 'hero-banner',
      className: 'relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm'
    }, [
      React.createElement('div', {
        key: 'hero-glow',
        className: 'absolute -right-16 -top-16 w-72 h-72 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none'
      }),
      React.createElement('div', {
        key: 'hero-content',
        className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'
      }, [
        React.createElement('div', { key: 'hero-text', className: 'space-y-2.5 max-w-2xl' }, [
          React.createElement('div', { key: 'streak-pill', className: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold' }, [
            React.createElement(Icons.Flame, { key: 'icon', size: 14 }),
            `Chuỗi ${streak} ngày học liên tục`
          ]),
          React.createElement('h2', { key: 'title', className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' },
            'Hệ thống Tài khoản Kế toán Doanh nghiệp'
          ),
          React.createElement('p', { key: 'desc', className: 'text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed' },
            `Chuẩn Thông tư 99/2025/TT-BTC. Bạn đã ghi nhớ thành thạo ${mastered}/${total} tài khoản (${masteredPct}%). Tiếp tục luyện tập để củng cố trí nhớ dài hạn.`
          )
        ]),
        React.createElement('div', { key: 'hero-actions', className: 'flex flex-wrap items-center gap-3 shrink-0' }, [
          React.createElement('button', {
            key: 'btn-study',
            onClick: () => {
              sound.playClick();
              setView('setup');
            },
            className: 'px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm active:scale-95 transition-all flex items-center gap-2'
          }, [
            React.createElement(Icons.Play, { key: 'p-icon', size: 15 }),
            'Tiếp tục học tập'
          ]),
          dueCount > 0 && React.createElement('button', {
            key: 'btn-due',
            onClick: () => {
              sound.playClick();
              setView('smart-review');
            },
            className: 'px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-600/30 font-semibold text-sm active:scale-95 transition-all flex items-center gap-2'
          }, [
            React.createElement(Icons.Clock, { key: 'c-icon', size: 15 }),
            `Ôn ${dueCount} mục đến hạn`
          ])
        ])
      ])
    ]),

    // Khu vực 3: Learning Statistics (4 chỉ số chuẩn Apple)
    React.createElement('div', { key: 'stats-grid', className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' }, [
      {
        label: 'Tổng số tài khoản',
        value: total,
        sub: 'Thông tư 99/2025/TT-BTC',
        icon: Icons.BookOpen,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-500/10 dark:bg-blue-500/15'
      },
      {
        label: 'Đã học qua',
        value: learned,
        sub: `${learned}/${total} tài khoản (${learnedPct}%)`,
        icon: Icons.Eye,
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/15'
      },
      {
        label: 'Đã thuộc vững',
        value: mastered,
        sub: `${mastered}/${total} tài khoản (${masteredPct}%)`,
        icon: Icons.Trophy,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15'
      },
      {
        label: 'Cần ôn hôm nay',
        value: dueCount,
        sub: dueCount === 0 ? 'Đã hoàn thành hôm nay' : `${dueCount} tài khoản đến hạn`,
        icon: Icons.Clock,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10 dark:bg-amber-500/15'
      }
    ].map((item, idx) => React.createElement('div', {
      key: 'stat-' + idx,
      className: 'p-5 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm flex flex-col justify-between space-y-3'
    }, [
      React.createElement('div', { key: 'top', className: 'flex items-center justify-between' }, [
        React.createElement('span', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, item.label),
        React.createElement('div', { key: 'icon-box', className: `w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center` },
          React.createElement(item.icon, { size: 16 })
        )
      ]),
      React.createElement('div', { key: 'bot' }, [
        React.createElement('div', { key: 'val', className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 font-tabular' }, item.value),
        React.createElement('div', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate' }, item.sub)
      ])
    ]))),

    // Khu vực 4: 4 Phương pháp học tập (Đồng nhất, tinh tế, không màu mè sặc sỡ)
    React.createElement('div', { key: 'methods-section', className: 'space-y-4' }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between' }, [
        React.createElement('div', { key: 'title-block' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Phương pháp học tập'),
          React.createElement('p', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400' }, 'Lựa chọn phương thức ôn luyện phù hợp với mục tiêu ghi nhớ của bạn')
        ]),
        React.createElement('button', {
          key: 'custom-btn',
          onClick: () => {
            sound.playClick();
            setView('setup');
          },
          className: 'text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors'
        }, [
          'Tùy chỉnh buổi học',
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
          className: 'group p-5 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-md hover:border-black/[0.12] dark:hover:border-white/[0.16] cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4'
        }, [
          React.createElement('div', { key: 'm-top', className: 'space-y-3' }, [
            React.createElement('div', { key: 'icon-row', className: 'flex items-center justify-between' }, [
              React.createElement('div', {
                key: 'icon-wrap',
                className: `w-11 h-11 rounded-xl ${method.iconBg} ${method.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`
              }, React.createElement(method.icon, { size: 20 })),
              React.createElement('span', {
                key: 'badge',
                className: 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }, method.badge)
            ]),
            React.createElement('div', { key: 'm-title', className: 'font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' }, method.title),
            React.createElement('p', { key: 'm-desc', className: 'text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed' }, method.desc)
          ]),
          React.createElement('div', {
            key: 'm-cta',
            className: 'pt-2 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform'
          }, [
            'Bắt đầu ngay',
            React.createElement(Icons.ChevronRight, { key: 'arr', size: 14, className: 'ml-0.5' })
          ])
        ]))
      )
    ]),

    // Khu vực 5: Tiến độ theo 8 Nhóm tài khoản (Khoa học, tinh tế)
    React.createElement('div', { key: 'groups-section', className: 'space-y-4' }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between' }, [
        React.createElement('div', { key: 'title-block' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Tiến độ theo 8 Nhóm tài khoản'),
          React.createElement('p', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400' }, 'Theo dõi tỷ lệ hoàn thành theo từng phân hệ kế toán')
        ]),
        React.createElement('button', {
          key: 'all-groups-btn',
          onClick: () => {
            sound.playClick();
            setView('groups');
          },
          className: 'text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors'
        }, [
          'Xem danh sách 8 nhóm',
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
            className: 'p-4 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-md hover:border-black/[0.12] dark:hover:border-white/[0.16] cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3'
          }, [
            React.createElement('div', { key: 'top', className: 'flex items-center justify-between' }, [
              React.createElement('span', {
                key: 'badge',
                className: 'text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono'
              }, `Đầu ${grp.code_prefix.join(', ')}`),
              React.createElement('span', {
                key: 'pct',
                className: 'text-xs font-bold text-blue-600 dark:text-blue-400 font-tabular'
              }, `${grpPct}%`)
            ]),
            React.createElement('div', { key: 'name', className: 'font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate' }, grp.name),
            React.createElement('div', { key: 'bar-wrap', className: 'space-y-1.5' }, [
              React.createElement('div', { key: 'bar', className: 'w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden' }, [
                React.createElement('div', {
                  key: 'fill',
                  className: 'h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500',
                  style: { width: `${grpPct}%` }
                })
              ]),
              React.createElement('div', { key: 'counts', className: 'flex items-center justify-between text-[11px] text-neutral-400 font-tabular' }, [
                React.createElement('span', { key: 'm' }, `Thuộc: ${grpStats.mastered}/${grpStats.total}`),
                React.createElement('span', { key: 'l' }, `Đã học: ${grpStats.learned}`)
              ])
            ])
          ]);
        })
      )
    ]),

    // Khu vực 6: Lịch sử học tập gần nhất (Gọn gàng, dễ quét mắt)
    sessions && sessions.length > 0 && React.createElement('div', { key: 'recent-sessions', className: 'space-y-3' }, [
      React.createElement('h3', { key: 'title', className: 'text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Lịch sử học tập gần đây'),
      React.createElement('div', { key: 'list', className: 'bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden shadow-sm' },
        sessions.slice(0, 4).map(sess => React.createElement('div', {
          key: sess.id,
          className: 'p-4 flex items-center justify-between text-sm'
        }, [
          React.createElement('div', { key: 'left', className: 'flex items-center gap-3' }, [
            React.createElement('div', {
              key: 'mode-icon',
              className: 'w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300'
            }, React.createElement(sess.mode === 'quiz' ? Icons.HelpCircle : sess.mode === 'matching' ? Icons.Shuffle : Icons.Sparkles, { size: 17 })),
            React.createElement('div', { key: 'meta' }, [
              React.createElement('div', { key: 'name', className: 'font-semibold text-neutral-900 dark:text-neutral-100' },
                sess.mode === 'quiz' ? 'Trắc nghiệm thông minh' : sess.mode === 'matching' ? 'Ghép đôi phản xạ' : sess.mode === 'smart' ? 'Ôn tập Spaced Repetition' : 'Flashcard 3D'
              ),
              React.createElement('div', { key: 'date', className: 'text-xs text-neutral-400' },
                new Date(sess.completed_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
              )
            ])
          ]),
          React.createElement('div', { key: 'right', className: 'text-right' }, [
            React.createElement('div', { key: 'score', className: 'font-bold text-sm text-emerald-600 dark:text-emerald-400 font-tabular' },
              sess.total_items ? `${sess.correct_items}/${sess.total_items} (${Math.round((sess.correct_items / sess.total_items) * 100)}%)` : 'Hoàn thành'
            ),
            sess.duration_seconds && React.createElement('div', { key: 'time', className: 'text-xs text-neutral-400 font-tabular' }, `${sess.duration_seconds} giây`)
          ])
        ]))
      )
    ])
  ]);
}
