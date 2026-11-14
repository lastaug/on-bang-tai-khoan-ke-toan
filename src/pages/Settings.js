// Apple HIG Settings & Data Management Component
import React, { useState } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';
import { db } from '../services/db.js';

export function Settings({
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  onDataReset,
  onDataRestored
}) {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleExportBackup = async () => {
    sound.playClick();
    try {
      const backup = await db.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TK_Study_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Lỗi xuất dữ liệu: ' + err.message);
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        await db.importBackup(json);
        sound.playSuccess();
        setImportStatus('Khôi phục dữ liệu thành công!');
        if (onDataRestored) onDataRestored();
        setTimeout(() => setImportStatus(null), 4000);
      } catch (err) {
        sound.playWrong();
        setImportStatus('Lỗi nhập dữ liệu: File JSON không đúng định dạng.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = async () => {
    sound.playClick();
    await db.resetAll();
    setResetConfirmOpen(false);
    if (onDataReset) onDataReset();
  };

  return React.createElement('div', { className: 'max-w-2xl mx-auto space-y-8 animate-fade-in pb-16' }, [
    // Header
    React.createElement('div', { key: 'hdr', className: 'space-y-1' }, [
      React.createElement('h2', { className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Cài đặt Hệ thống'),
      React.createElement('p', { className: 'text-sm text-neutral-500 dark:text-neutral-400' }, 'Tùy chỉnh giao diện, âm thanh phản hồi và sao lưu tiến độ học tập cá nhân.')
    ]),

    // Giao diện (Theme)
    React.createElement('div', {
      key: 'theme-sec',
      className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-4'
    }, [
      React.createElement('div', { className: 'flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider' }, [
        React.createElement(Icons.Sun, { size: 16 }),
        'Chế độ giao diện (Appearance)'
      ]),
      React.createElement('div', { className: 'grid grid-cols-2 gap-3' }, [
        { id: 'light', label: 'Giao diện Sáng (Light)', icon: Icons.Sun },
        { id: 'dark', label: 'Giao diện Tối (Dark)', icon: Icons.Moon }
      ].map(opt => {
        const isSel = theme === opt.id;
        return React.createElement('button', {
          key: opt.id,
          onClick: () => {
            sound.playClick();
            setTheme(opt.id);
          },
          className: `p-4 rounded-2xl border flex items-center justify-between text-sm font-semibold transition-all ${
            isSel
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm'
              : 'bg-neutral-50/50 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
          }`
        }, [
          React.createElement('div', { className: 'flex items-center gap-2.5' }, [
            React.createElement(opt.icon, { size: 18, className: isSel ? 'text-blue-600' : 'text-neutral-400' }),
            opt.label
          ]),
          isSel && React.createElement(Icons.Check, { size: 16, className: 'text-blue-600 dark:text-blue-400' })
        ]);
      }))
    ]),

    // Âm thanh phản hồi (Sound)
    React.createElement('div', {
      key: 'sound-sec',
      className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm flex items-center justify-between'
    }, [
      React.createElement('div', { className: 'space-y-1' }, [
        React.createElement('div', { className: 'font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2' }, [
          React.createElement(soundEnabled ? Icons.Volume2 : Icons.VolumeX, { size: 18, className: 'text-blue-600' }),
          'Hiệu ứng âm thanh (Web Audio)'
        ]),
        React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Phát âm thanh lật thẻ nhẹ và phản hồi đúng/sai trong quá trình luyện tập.')
      ]),
      React.createElement('button', {
        onClick: () => {
          const next = !soundEnabled;
          sound.setEnabled(next);
          setSoundEnabled(next);
          if (next) sound.playSuccess();
        },
        className: `w-12 h-7 rounded-full p-1 transition-colors ${
          soundEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
        }`
      }, [
        React.createElement('div', {
          className: `w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            soundEnabled ? 'translate-x-5' : 'translate-x-0'
          }`
        })
      ])
    ]),

    // Sao lưu và Phục hồi Dữ liệu (Backup & Restore)
    React.createElement('div', {
      key: 'data-sec',
      className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm space-y-5'
    }, [
      React.createElement('div', { className: 'text-xs font-bold text-neutral-400 uppercase tracking-wider' }, 'Lưu trữ & Sao lưu cục bộ'),
      React.createElement('p', { className: 'text-xs text-neutral-500 leading-relaxed' },
        'Toàn bộ tiến độ học tập, lịch ôn Spaced Repetition và các bộ học cá nhân được lưu hoàn toàn trên trình duyệt của bạn (IndexedDB). Bạn có thể xuất file JSON để đồng bộ sang thiết bị khác.'
      ),

      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }, [
        React.createElement('button', {
          key: 'export-btn',
          onClick: handleExportBackup,
          className: 'p-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors'
        }, [
          React.createElement(Icons.Download, { size: 16 }),
          'Xuất sao lưu (JSON)'
        ]),

        React.createElement('label', {
          key: 'import-btn',
          className: 'p-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer'
        }, [
          React.createElement(Icons.Upload, { size: 16 }),
          'Nhập sao lưu từ file',
          React.createElement('input', {
            type: 'file',
            accept: '.json',
            onChange: handleImportBackup,
            className: 'hidden'
          })
        ])
      ]),

      importStatus && React.createElement('div', {
        className: 'p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs text-center font-medium'
      }, importStatus),

      // Reset Zone
      React.createElement('div', { className: 'pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between' }, [
        React.createElement('div', { className: 'space-y-0.5' }, [
          React.createElement('div', { className: 'text-xs font-bold text-red-600 dark:text-red-400' }, 'Xóa toàn bộ tiến độ'),
          React.createElement('div', { className: 'text-[11px] text-neutral-400' }, 'Đặt lại trạng thái học và xóa lịch sử ôn tập.')
        ]),
        React.createElement('button', {
          onClick: () => setResetConfirmOpen(true),
          className: 'px-3.5 py-1.5 rounded-xl border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors'
        }, 'Đặt lại tiến độ')
      ])
    ]),

    // App Info Card
    React.createElement('div', {
      key: 'info-sec',
      className: 'p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-3 text-xs text-neutral-500'
    }, [
      React.createElement('div', { className: 'font-bold text-neutral-800 dark:text-neutral-200 text-sm' }, 'Về ứng dụng Bunny Stupid'),
      React.createElement('div', { className: 'space-y-1 leading-relaxed' }, [
        React.createElement('div', {}, '• Căn cứ pháp lý: Thông tư số 99/2025/TT-BTC ngày 27/10/2025 của Bộ trưởng Bộ Tài chính.'),
        React.createElement('div', {}, '• Toàn bộ 184 tài khoản kế toán cấp 1, cấp 2, cấp 3 và cấp 4 được phân cấp chính xác theo văn bản gốc.'),
        React.createElement('div', {}, '• Thiết kế tuân thủ nghiêm ngặt theo triết lý Apple Human Interface Guidelines: Tối giản, Rõ ràng, Tinh tế.'),
        React.createElement('div', {}, '• Hoạt động hoàn toàn độc lập, không yêu cầu kết nối mạng hay gửi dữ liệu ra máy chủ bên ngoài.')
      ])
    ]),

    // Confirmation Modal for Reset
    resetConfirmOpen && React.createElement('div', {
      key: 'confirm-modal',
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in'
    }, [
      React.createElement('div', {
        className: 'w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl border border-neutral-200 dark:border-neutral-700 text-center'
      }, [
        React.createElement('div', { className: 'w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto' },
          React.createElement(Icons.Trash2, { size: 28 })
        ),
        React.createElement('div', { className: 'space-y-1' }, [
          React.createElement('h3', { className: 'text-xl font-bold text-neutral-900 dark:text-neutral-100' }, 'Xác nhận xóa tiến độ?'),
          React.createElement('p', { className: 'text-xs text-neutral-500 leading-relaxed' },
            'Thao tác này sẽ xóa toàn bộ trạng thái ghi nhớ của 184 tài khoản, chuỗi streak và lịch sử buổi học. Thao tác này không thể hoàn tác!'
          )
        ]),
        React.createElement('div', { className: 'flex items-center gap-3 pt-2' }, [
          React.createElement('button', {
            onClick: () => setResetConfirmOpen(false),
            className: 'flex-1 py-3 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs'
          }, 'Hủy bỏ'),
          React.createElement('button', {
            onClick: handleConfirmReset,
            className: 'flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm'
          }, 'Đồng ý xóa sạch')
        ])
      ])
    ])
  ]);
}
