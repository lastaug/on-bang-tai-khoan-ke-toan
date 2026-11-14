// Apple HIG 8 Groups Breakdown Page Component
import React, { useState } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function GroupDetail({
  groups,
  accounts,
  progress,
  initialGroupId = 1,
  onSelectAccount,
  onStartStudyWithPreset
}) {
  const [activeGroupId, setActiveGroupId] = useState(initialGroupId);

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
  const groupAccounts = accounts.filter(a => a.group === activeGroupId);

  // Group accounting rules & principles
  const groupPrinciples = {
    1: {
      rule: 'TĂNG BÊN NỢ - GIẢM BÊN CÓ - THƯỜNG CÓ SỐ DƯ BÊN NỢ',
      detail: 'Phản ánh tài sản ngắn hạn và dài hạn của đơn vị. Khi mua thêm tài sản ghi Nợ, khi xuất dùng/bán ghi Có.',
      exceptions: 'ĐẶC BIỆT CẦN NHỚ: TK 214 (Hao mòn TSCĐ) và TK 229 (Dự phòng tổn thất tài sản) mang tính chất điều chỉnh giảm tài sản, do đó có kết cấu ngược lại (Tăng bên Có, Dư bên Có).'
    },
    2: {
      rule: 'TĂNG BÊN CÓ - GIẢM BÊN NỢ - THƯỜNG CÓ SỐ DƯ BÊN CÓ',
      detail: 'Phản ánh các nghĩa vụ nợ phải trả cho nhà cung cấp, nhà nước, người lao động, các khoản vay và nhận ký quỹ.',
      exceptions: 'ĐẶC BIỆT CẦN NHỚ: TK 331 (Phải trả người bán) là tài khoản lưỡng tính: có thể có số dư Bên Nợ (khi ứng trước tiền cho người bán) hoặc số dư Bên Có (khi chưa trả nợ).'
    },
    3: {
      rule: 'TĂNG BÊN CÓ - GIẢM BÊN NỢ - THƯỜNG CÓ SỐ DƯ BÊN CÓ',
      detail: 'Phản ánh nguồn vốn thuộc sở hữu của chủ doanh nghiệp, các nhà đầu tư và các quỹ được tích lũy.',
      exceptions: 'ĐẶC BIỆT CẦN NHỚ: TK 419 (Cổ phiếu mua lại của chính mình) luôn có số Dư Nợ (ghi giảm vốn). TK 421 (Lợi nhuận chưa phân phối) có thể Dư Có (khi có lãi) hoặc Dư Nợ (khi bị lỗ).'
    },
    4: {
      rule: 'TĂNG BÊN CÓ - GIẢM BÊN NỢ - KHÔNG CÓ SỐ DƯ CUỐI KỲ',
      detail: 'Phản ánh doanh thu bán hàng, doanh thu tài chính. Cuối kỳ kế toán được kết chuyển toàn bộ sang Bên Có TK 911 để xác định kết quả kinh doanh.',
      exceptions: 'ĐẶC BIỆT CẦN NHỚ: TK 521 (Các khoản giảm trừ doanh thu) có kết cấu ngược lại: phát sinh tăng ghi Bên Nợ, cuối kỳ kết chuyển sang Bên Nợ TK 511 để tính doanh thu thuần.'
    },
    5: {
      rule: 'TĂNG BÊN NỢ - GIẢM BÊN CÓ - KHÔNG CÓ SỐ DƯ CUỐI KỲ',
      detail: 'Phản ánh chi phí sản xuất (621, 622, 623, 627) kết chuyển sang 154; và chi phí kinh doanh (632, 635, 641, 642) kết chuyển sang Bên Nợ TK 911.',
      exceptions: 'ĐẶC BIỆT CẦN NHỚ: Toàn bộ các tài khoản chi phí đầu 6 đều không có số dư cuối kỳ kế toán.'
    },
    6: {
      rule: 'TĂNG BÊN CÓ - GIẢM BÊN NỢ - KHÔNG CÓ SỐ DƯ CUỐI KỲ',
      detail: 'Bao gồm TK 711: Phản ánh các khoản thu nhập phát sinh ngoài hoạt động sản xuất kinh doanh thông thường (nhượng bán TSCĐ, phạt vi phạm hợp đồng...).',
      exceptions: 'Cuối kỳ kết chuyển toàn bộ sang Bên Có TK 911, không có số dư.'
    },
    7: {
      rule: 'TĂNG BÊN NỢ - GIẢM BÊN CÓ - KHÔNG CÓ SỐ DƯ CUỐI KỲ',
      detail: 'Bao gồm TK 811 (Chi phí khác) và TK 821 (Chi phí thuế TNDN hiện hành và hoãn lại).',
      exceptions: 'Cuối kỳ kết chuyển sang Bên Nợ TK 911 để xác định lãi/lỗ ròng của doanh nghiệp.'
    },
    8: {
      rule: 'TẬP HỢP DOANH THU VÀ CHI PHÍ - KHÔNG CÓ SỐ DƯ CUỐI KỲ',
      detail: 'Bao gồm duy nhất TK 911: Bên Nợ tập hợp chi phí, Bên Có tập hợp doanh thu và thu nhập.',
      exceptions: 'Nếu Bên Có > Bên Nợ => LÃI (kết chuyển sang Bên Có TK 421). Nếu Bên Có < Bên Nợ => LỖ (kết chuyển sang Bên Nợ TK 421).'
    }
  };

  const currentPrinciple = groupPrinciples[activeGroupId] || groupPrinciples[1];

  // Calculate mastery for active group
  let grpMastered = 0;
  let grpLearned = 0;
  groupAccounts.forEach(acc => {
    const st = progress[acc.code]?.state ?? 0;
    if (st >= 1) grpLearned += 1;
    if (st === 3) grpMastered += 1;
  });
  const pct = groupAccounts.length > 0 ? Math.round((grpMastered / groupAccounts.length) * 100) : 0;

  return React.createElement('div', { className: 'space-y-6 animate-fade-in pb-12' }, [
    // 8 Group Tabs Horizontal Bar
    React.createElement('div', {
      key: 'tabs-bar',
      className: 'flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none'
    }, groups.map(g => {
      const isActive = g.id === activeGroupId;
      return React.createElement('button', {
        key: g.id,
        onClick: () => {
          sound.playClick();
          setActiveGroupId(g.id);
        },
        className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all ${
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
            : 'bg-white dark:bg-[#1c1c1e] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800'
        }`
      }, [
        React.createElement('span', {
          key: 'pfx',
          className: `px-1.5 py-0.5 rounded-md font-mono text-[11px] ${
            isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
          }`
        }, `Đầu ${g.code_prefix.join(',')}`),
        g.name
      ]);
    })),

    // Group Information Hero Card
    React.createElement('div', {
      key: 'group-hero',
      className: 'p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-6'
    }, [
      React.createElement('div', { key: 'hero-top', className: 'flex flex-col md:flex-row md:items-center justify-between gap-4' }, [
        React.createElement('div', { key: 'left', className: 'space-y-1' }, [
          React.createElement('div', { key: 'tag', className: 'inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider' }, [
            React.createElement(Icons.Layers, { key: 'icon', size: 16 }),
            `Nhóm ${activeGroup.id} • Đầu số ${activeGroup.code_prefix.join(', ')}`
          ]),
          React.createElement('h2', { key: 'name', className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, activeGroup.name),
          React.createElement('p', { key: 'desc', className: 'text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl' }, activeGroup.description)
        ]),

        React.createElement('div', { key: 'right-actions', className: 'flex flex-wrap items-center gap-3 shrink-0' }, [
          React.createElement('button', {
            key: 'study-flash',
            onClick: () => {
              sound.playClick();
              onStartStudyWithPreset('flashcard', { groupId: activeGroupId });
            },
            className: 'px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm shadow-sm shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center gap-2'
          }, [
            React.createElement(Icons.Sparkles, { key: 'icon', size: 15 }),
            'Luyện Flashcard nhóm'
          ]),
          React.createElement('button', {
            key: 'study-quiz',
            onClick: () => {
              sound.playClick();
              onStartStudyWithPreset('quiz', { groupId: activeGroupId });
            },
            className: 'px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs md:text-sm active:scale-[0.98] transition-all flex items-center gap-2'
          }, [
            React.createElement(Icons.HelpCircle, { key: 'icon', size: 15 }),
            'Trắc nghiệm nhóm'
          ])
        ])
      ]),

      // Progress bar for this group
      React.createElement('div', { key: 'grp-progress', className: 'p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/50 space-y-2' }, [
        React.createElement('div', { key: 'p-labels', className: 'flex items-center justify-between text-xs font-semibold' }, [
          React.createElement('span', { key: 'l', className: 'text-neutral-600 dark:text-neutral-300' }, `Tiến độ thuộc nhóm: ${grpMastered}/${groupAccounts.length} tài khoản`),
          React.createElement('span', { key: 'r', className: 'text-blue-600 dark:text-blue-400 font-bold' }, `${pct}%`)
        ]),
        React.createElement('div', { key: 'bar', className: 'w-full h-2 rounded-full bg-neutral-200/80 dark:bg-neutral-700 overflow-hidden' }, [
          React.createElement('div', {
            key: 'fill',
            className: 'h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500',
            style: { width: `${pct}%` }
          })
        ])
      ]),

      // Accounting Rules Box
      React.createElement('div', { key: 'rules-box', className: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, [
        React.createElement('div', {
          key: 'r1',
          className: 'p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2'
        }, [
          React.createElement('div', { key: 'rh1', className: 'flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase' }, [
            React.createElement(Icons.Bookmark, { key: 'ic', size: 15 }),
            'Quy luật hạch toán'
          ]),
          React.createElement('div', { key: 'rule-txt', className: 'font-mono font-bold text-xs text-blue-900 dark:text-blue-200' }, currentPrinciple.rule),
          React.createElement('p', { key: 'detail', className: 'text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed' }, currentPrinciple.detail)
        ]),

        React.createElement('div', {
          key: 'r2',
          className: 'p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2'
        }, [
          React.createElement('div', { key: 'rh2', className: 'flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase' }, [
            React.createElement(Icons.AlertCircle, { key: 'ic', size: 15 }),
            'Ngoại lệ & Điểm lưu ý cốt lõi'
          ]),
          React.createElement('p', { key: 'exc', className: 'text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium' }, currentPrinciple.exceptions)
        ])
      ])
    ]),

    // Accounts in this group table
    React.createElement('div', {
      key: 'accounts-table',
      className: 'bg-white dark:bg-[#1c1c1e] rounded-3xl border border-neutral-200/70 dark:border-neutral-800 shadow-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800'
    }, [
      React.createElement('div', {
        key: 'tbl-hdr',
        className: 'px-5 py-3.5 bg-neutral-50/70 dark:bg-neutral-800/40 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between'
      }, [
        React.createElement('span', { key: 'title' }, `DANH SÁCH ${groupAccounts.length} TÀI KHOẢN TRONG NHÓM`),
        React.createElement('span', { key: 'hint', className: 'normal-case font-normal text-neutral-400' }, 'Click để xem chi tiết & mẹo nhớ')
      ]),

      React.createElement('div', { key: 'rows', className: 'divide-y divide-neutral-100 dark:divide-neutral-800' },
        groupAccounts.map(acc => {
          const accProg = progress[acc.code] || { state: 0 };
          const stateNames = ['Chưa học', 'Đang học', 'Sắp thuộc', 'Đã thuộc'];
          const stateColors = [
            'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
            'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
            'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
          ];

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
                className: 'font-mono font-bold text-sm px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-neutral-200/50 dark:border-neutral-700/50 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0'
              }, acc.code),
              React.createElement('div', { key: 'name-wrap' }, [
                React.createElement('div', {
                  key: 'name',
                  className: `text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white`
                }, acc.name),
                acc.tip && React.createElement('div', {
                  key: 'tip',
                  className: 'text-xs text-neutral-400 dark:text-neutral-500 line-clamp-1 mt-0.5'
                }, acc.tip)
              ])
            ]),

            React.createElement('div', { key: 'right', className: 'flex items-center gap-2 shrink-0' }, [
              React.createElement('span', {
                key: 'lvl',
                className: 'text-xs text-neutral-400 font-medium'
              }, `Cấp ${acc.level}`),
              React.createElement('span', {
                key: 'state',
                className: `text-xs font-semibold px-2 py-0.5 rounded-full ${stateColors[accProg.state]}`
              }, stateNames[accProg.state]),
              React.createElement(Icons.ChevronRight, { key: 'arr', size: 16, className: 'text-neutral-300 group-hover:text-neutral-600' })
            ])
          ]);
        })
      )
    ])
  ]);
}
