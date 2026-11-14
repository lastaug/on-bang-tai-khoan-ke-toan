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

  // Compact, punchy method descriptions optimized for laptop screens
  const methods = [
    {
      id: 'flashcard',
      title: 'Flashcard 3D',
      desc: 'Lật thẻ 3D ghi nhớ phản xạ số hiệu và tên gọi tài khoản.',
      icon: Icons.Sparkles,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
      badge: 'Cơ bản'
    },
    {
      id: 'quiz',
      title: 'Trắc nghiệm thông minh',
      desc: 'Thi thử 4 phương án ngẫu nhiên chống nhầm lẫn tài khoản.',
      icon: Icons.HelpCircle,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
      badge: 'Kiểm tra'
    },
    {
      id: 'matching',
      title: 'Ghép đôi phản xạ',
      desc: 'Nối nhanh số hiệu với tên tài khoản tương ứng ở 2 cột.',
      icon: Icons.Shuffle,
      iconColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500/10 dark:bg-orange-500/15',
      badge: 'Phản xạ'
    },
    {
      id: 'smart-review',
      title: 'Ôn tập Spaced Repetition',
      desc: 'Thuật toán ngắt quãng củng cố trí nhớ dài hạn theo não bộ.',
      icon: Icons.Flame,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      badge: dueCount > 0 ? `${dueCount} đến hạn` : 'Tối ưu'
    }
  ];

  return React.createElement('div', { className: 'space-y-6 animate-fade-in pb-12' }, [
    // Khu vực 2: Hero Section (Tương thích hoàn hảo Light & Dark mode, tỷ lệ cân đối)
    React.createElement('div', {
      key: 'hero-banner',
      className: 'relative overflow-hidden rounded-2xl p-5 md:p-6 bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm'
    }, [
      React.createElement('div', {
        key: 'hero-glow',
        className: 'absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none'
      }),
      React.createElement('div', {
        key: 'hero-content',
        className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5'
      }, [
        React.createElement('div', { key: 'hero-text', className: 'space-y-2 max-w-2xl' }, [
          React.createElement('div', { key: 'streak-pill', className: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold' }, [
            React.createElement(Icons.Flame, { key: 'icon', size: 13 }),
            `Chuỗi ${streak} ngày học liên tục`
          ]),
          React.createElement('h2', { key: 'title', className: 'text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100' },
            'Hệ thống Tài khoản Kế toán Doanh nghiệp'
          ),
          React.createElement('p', { key: 'desc', className: 'text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed' },
            `Chuẩn Thông tư 99/2025/TT-BTC. Bạn đã ghi nhớ thành thạo ${mastered}/${total} tài khoản (${masteredPct}%). Tiếp tục luyện tập để củng cố trí nhớ dài hạn.`
          )
        ]),
        React.createElement('div', { key: 'hero-actions', className: 'flex flex-wrap items-center gap-2.5 shrink-0' }, [
          // Primary Action: Tiếp tục học tập
          React.createElement('button', {
            key: 'btn-study',
            onClick: () => {
              sound.playClick();
              setView('setup');
            },
            className: 'px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm active:scale-95 transition-all flex items-center gap-2 apple-btn-press'
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
            className: 'px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-600/30 font-semibold text-xs md:text-sm active:scale-95 transition-all flex items-center gap-1.5 apple-btn-press'
          }, [
            React.createElement(Icons.Clock, { key: 'c-icon', size: 14 }),
            `Ôn ${dueCount} mục đến hạn`
          ])
        ])
      ])
    ]),

    // Khu vực 3: Learning Statistics (4 chỉ số chuẩn Apple)
    React.createElement('div', { key: 'stats-grid', className: 'grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4' }, [
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
      className: 'p-4 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm flex flex-col justify-between space-y-2.5'
    }, [
      React.createElement('div', { key: 'top', className: 'flex items-center justify-between' }, [
        React.createElement('span', { key: 'lbl', className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400' }, item.label),
        React.createElement('div', { key: 'icon-box', className: `w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center` },
          React.createElement(item.icon, { size: 15 })
        )
      ]),
      React.createElement('div', { key: 'bot' }, [
        React.createElement('div', { key: 'val', className: 'text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-tabular' }, item.value),
        React.createElement('div', { key: 'sub', className: 'text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate' }, item.sub)
      ])
    ]))),

    // Khu vực 4: 4 Phương pháp học tập (Gọn gàng, tối ưu diện tích laptop)
    React.createElement('div', { key: 'methods-section', className: 'space-y-3' }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between' }, [
        React.createElement('div', { key: 'title-block' }, [
          React.createElement('h3', { key: 'title', className: 'text-base md:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Phương pháp học tập'),
          React.createElement('p', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400' }, 'Lựa chọn phương thức ôn luyện phù hợp với mục tiêu ghi nhớ của bạn')
        ]),
        React.createElement('button', {
          key: 'custom-btn',
          onClick: () => {
            sound.playClick();
            setView('setup');
          },
          className: 'text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors apple-btn-press'
        }, [
          'Tùy chỉnh buổi học',
          React.createElement(Icons.ChevronRight, { key: 'arr', size: 14 })
        ])
      ]),

      React.createElement('div', { key: 'methods-grid', className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4' },
        methods.map(method => React.createElement('div', {
          key: method.id,
          onClick: () => {
            sound.playClick();
            onStartStudyWithPreset(method.id);
          },
          className: 'group p-4 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-md hover:border-black/[0.12] dark:hover:border-white/[0.16] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between space-y-3'
        }, [
          React.createElement('div', { key: 'm-top', className: 'space-y-2' }, [
            React.createElement('div', { key: 'icon-row', className: 'flex items-center justify-between' }, [
              React.createElement('div', {
                key: 'icon-wrap',
                className: `w-9 h-9 rounded-xl ${method.iconBg} ${method.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`
              }, React.createElement(method.icon, { size: 18 })),
              React.createElement('span', {
                key: 'badge',
                className: 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }, method.badge)
            ]),
            React.createElement('div', { key: 'm-title', className: 'font-semibold text-sm md:text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' }, method.title),
            React.createElement('p', { key: 'm-desc', className: 'text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2' }, method.desc)
          ]),
          React.createElement('div', {
            key: 'm-cta',
            className: 'pt-1 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform'
          }, [
            'Bắt đầu ngay',
            React.createElement(Icons.ChevronRight, { key: 'arr', size: 13, className: 'ml-0.5' })
          ])
        ]))
      )
    ]),

    // Khu vực 5: Tiến độ theo 8 Nhóm tài khoản (Khoa học, tinh tế)
    React.createElement('div', { key: 'groups-section', className: 'space-y-3' }, [
      React.createElement('div', { key: 'hdr', className: 'flex items-center justify-between' }, [
        React.createElement('div', { key: 'title-block' }, [
          React.createElement('h3', { key: 'title', className: 'text-base md:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Tiến độ theo 8 Nhóm tài khoản'),
          React.createElement('p', { key: 'sub', className: 'text-xs text-neutral-500 dark:text-neutral-400' }, 'Theo dõi tỷ lệ hoàn thành theo từng phân hệ kế toán')
        ]),
        React.createElement('button', {
          key: 'all-groups-btn',
          onClick: () => {
            sound.playClick();
            setView('groups');
          },
          className: 'text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors apple-btn-press'
        }, [
          'Xem danh sách 8 nhóm',
          React.createElement(Icons.ChevronRight, { key: 'arr', size: 14 })
        ])
      ]),

      React.createElement('div', { key: 'groups-grid', className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4' },
        groups.map(grp => {
          const gAccounts = (stats?.groupStats && stats.groupStats[grp.id]) || { total: 0, learned: 0, mastered: 0 };
          const gTotal = gAccounts.total || 1;
          const gMastered = gAccounts.mastered || 0;
          const gLearned = gAccounts.learned || 0;
          const pct = Math.round((gMastered / gTotal) * 100);

          return React.createElement('div', {
            key: grp.id,
            onClick: () => {
              sound.playClick();
              setView('groups');
            },
            className: 'p-4 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5 space-y-3 group'
          }, [
            React.createElement('div', { key: 'g-head', className: 'flex items-center justify-between' }, [
              React.createElement('span', {
                key: 'g-prefix',
                className: 'px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }, `Đầu ${grp.code_prefix.join(', ')}`),
              React.createElement('span', { key: 'g-pct', className: 'text-xs font-bold text-neutral-700 dark:text-neutral-300 font-tabular' }, `${pct}%`)
            ]),
            React.createElement('div', { key: 'g-info', className: 'space-y-0.5' }, [
              React.createElement('div', { key: 'g-name', className: 'font-semibold text-xs md:text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' }, grp.name),
              React.createElement('div', { key: 'g-sub', className: 'text-[11px] text-neutral-400 flex items-center justify-between font-tabular' }, [
                React.createElement('span', { key: 'm' }, `Thuộc: ${gMastered}/${gTotal}`),
                React.createElement('span', { key: 'l' }, `Đã học: ${gLearned}`)
              ])
            ]),
            React.createElement('div', { key: 'g-bar', className: 'w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden' },
              React.createElement('div', {
                className: 'h-full bg-blue-600 rounded-full transition-all duration-500',
                style: { width: `${pct}%` }
              })
            )
          ]);
        })
      )
    ]),

    // Khu vực 6: Lịch sử học tập gần nhất (Tối giản, tinh gọn)
    sessions && sessions.length > 0 && React.createElement('div', { key: 'history-section', className: 'space-y-3' }, [
      React.createElement('h3', { className: 'text-base md:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Lịch sử học tập gần đây'),
      React.createElement('div', { className: 'apple-card overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.05]' },
        sessions.slice(0, 4).map((sess, idx) => {
          const modeLabels = {
            flashcard: { label: 'Flashcard ghi nhớ', icon: Icons.Sparkles, color: 'text-blue-600 bg-blue-500/10' },
            quiz: { label: 'Trắc nghiệm thông minh', icon: Icons.HelpCircle, color: 'text-purple-600 bg-purple-500/10' },
            matching: { label: 'Ghép đôi tài khoản', icon: Icons.Shuffle, color: 'text-orange-600 bg-orange-500/10' },
            srs: { label: 'Ôn tập Spaced Repetition', icon: Icons.Flame, color: 'text-emerald-600 bg-emerald-500/10' }
          };
          const mInfo = modeLabels[sess.mode] || modeLabels.flashcard;
          const dateStr = sess.timestamp
            ? new Date(sess.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' +
              new Date(sess.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' })
            : 'Gần đây';

          const pctScore = sess.total_items > 0 ? Math.round((sess.correct_items / sess.total_items) * 100) : 0;

          return React.createElement('div', {
            key: sess.id || idx,
            className: 'p-3 md:p-3.5 flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors'
          }, [
            React.createElement('div', { key: 'left', className: 'flex items-center gap-3' }, [
              React.createElement('div', { className: `w-8 h-8 rounded-lg ${mInfo.color} flex items-center justify-center shrink-0` },
                React.createElement(mInfo.icon, { size: 16 })
              ),
              React.createElement('div', { key: 'details' }, [
                React.createElement('div', { className: 'text-xs md:text-sm font-semibold text-neutral-800 dark:text-neutral-200' }, mInfo.label),
                React.createElement('div', { className: 'text-[11px] text-neutral-400 font-tabular' }, dateStr)
              ])
            ]),
            React.createElement('div', { key: 'right', className: 'text-right' }, [
              React.createElement('div', { className: 'text-xs md:text-sm font-bold text-neutral-900 dark:text-neutral-100 font-tabular' },
                `${sess.correct_items}/${sess.total_items} (${pctScore}%)`
              ),
              React.createElement('div', { className: 'text-[11px] text-emerald-600 dark:text-emerald-400 font-medium' },
                pctScore >= 80 ? 'Xuất sắc' : pctScore >= 50 ? 'Đạt' : 'Cần ôn thêm'
              )
            ])
          ]);
        })
      )
    ])
  ]);
}
