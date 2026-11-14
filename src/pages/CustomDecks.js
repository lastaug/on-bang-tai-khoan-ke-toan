// Apple HIG Custom Decks Manager Component
import React, { useState } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function CustomDecks({
  customDecks,
  accounts,
  progress,
  onSaveDeck,
  onDeleteDeck,
  onStartStudyWithPreset
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [searchPicker, setSearchPicker] = useState('');

  const openNewDeckEditor = () => {
    sound.playClick();
    setEditingDeck(null);
    setDeckName('');
    setDeckDesc('');
    setSelectedCodes([]);
    setSearchPicker('');
    setIsEditorOpen(true);
  };

  const openEditDeck = (deck) => {
    sound.playClick();
    setEditingDeck(deck);
    setDeckName(deck.name || '');
    setDeckDesc(deck.description || '');
    setSelectedCodes(deck.account_codes || []);
    setSearchPicker('');
    setIsEditorOpen(true);
  };

  const handleToggleCode = (code) => {
    sound.playClick();
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSelectAllGroup = (groupId) => {
    sound.playClick();
    const grpCodes = accounts.filter(a => a.group === groupId).map(a => a.code);
    const allIn = grpCodes.every(c => selectedCodes.includes(c));
    if (allIn) {
      setSelectedCodes(prev => prev.filter(c => !grpCodes.includes(c)));
    } else {
      setSelectedCodes(prev => Array.from(new Set([...prev, ...grpCodes])));
    }
  };

  const handleSave = () => {
    if (!deckName.trim() || selectedCodes.length === 0) return;
    sound.playSuccess();
    onSaveDeck({
      id: editingDeck?.id,
      name: deckName.trim(),
      description: deckDesc.trim(),
      account_codes: selectedCodes
    });
    setIsEditorOpen(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa bộ học cá nhân này không?')) {
      sound.playClick();
      onDeleteDeck(id);
    }
  };

  // Filtered accounts for picker
  const pickerAccounts = accounts.filter(a => {
    if (!searchPicker.trim()) return true;
    const q = searchPicker.toLowerCase().trim();
    return a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
  });

  return React.createElement('div', { className: 'space-y-8 animate-fade-in pb-12' }, [
    // Header & CTA
    React.createElement('div', { key: 'hdr', className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' }, [
      React.createElement('div', { key: 't-block' }, [
        React.createElement('h2', { className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Bộ học Cá nhân'),
        React.createElement('p', { className: 'text-sm text-neutral-500 dark:text-neutral-400' }, 'Tạo các tập hợp tài khoản chuyên biệt để ôn tập theo chương trình học riêng của bạn.')
      ]),
      React.createElement('button', {
        key: 'new-deck-btn',
        onClick: openNewDeckEditor,
        className: 'px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
      }, [
        React.createElement(Icons.FolderPlus, { size: 18 }),
        'Tạo bộ học mới'
      ])
    ]),

    // Decks List Grid
    customDecks.length > 0 ? React.createElement('div', { key: 'decks-grid', className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
      customDecks.map(deck => {
        const count = deck.account_codes?.length || 0;
        let masteredInDeck = 0;
        (deck.account_codes || []).forEach(c => {
          if (progress[c]?.state === 3) masteredInDeck += 1;
        });
        const pct = count > 0 ? Math.round((masteredInDeck / count) * 100) : 0;

        return React.createElement('div', {
          key: deck.id,
          className: 'p-6 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group'
        }, [
          React.createElement('div', { key: 'top', className: 'space-y-2' }, [
            React.createElement('div', { className: 'flex items-center justify-between' }, [
              React.createElement('span', { className: 'text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-xl' },
                `${count} tài khoản`
              ),
              React.createElement('div', { className: 'flex items-center gap-1' }, [
                React.createElement('button', {
                  onClick: () => openEditDeck(deck),
                  title: 'Chỉnh sửa bộ học',
                  className: 'p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }, React.createElement(Icons.Edit3, { size: 15 })),
                React.createElement('button', {
                  onClick: (e) => handleDelete(deck.id, e),
                  title: 'Xóa bộ học',
                  className: 'p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                }, React.createElement(Icons.Trash2, { size: 15 }))
              ])
            ]),
            React.createElement('h3', { className: 'text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors' }, deck.name),
            deck.description && React.createElement('p', { className: 'text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2' }, deck.description)
          ]),

          React.createElement('div', { key: 'progress', className: 'space-y-1.5' }, [
            React.createElement('div', { className: 'flex items-center justify-between text-xs' }, [
              React.createElement('span', { className: 'text-neutral-500' }, `Đã thuộc: ${masteredInDeck}/${count}`),
              React.createElement('span', { className: 'font-bold text-neutral-700 dark:text-neutral-300' }, `${pct}%`)
            ]),
            React.createElement('div', { className: 'w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden' },
              React.createElement('div', {
                className: 'h-full bg-blue-600 rounded-full',
                style: { width: `${pct}%` }
              })
            )
          ]),

          React.createElement('div', { key: 'actions', className: 'grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800' }, [
            React.createElement('button', {
              key: 'btn-flash',
              onClick: () => {
                sound.playClick();
                onStartStudyWithPreset('flashcard', { customDeckId: deck.id });
              },
              className: 'py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors'
            }, [
              React.createElement(Icons.Sparkles, { size: 13 }),
              'Flashcard'
            ]),
            React.createElement('button', {
              key: 'btn-quiz',
              onClick: () => {
                sound.playClick();
                onStartStudyWithPreset('quiz', { customDeckId: deck.id });
              },
              className: 'py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors'
            }, [
              React.createElement(Icons.HelpCircle, { size: 13 }),
              'Trắc nghiệm'
            ])
          ])
        ]);
      })
    ) : React.createElement('div', {
      key: 'empty-decks',
      className: 'p-12 text-center rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/70 dark:border-neutral-800 space-y-4'
    }, [
      React.createElement(Icons.FolderPlus, { size: 40, className: 'mx-auto text-neutral-300 dark:text-neutral-600' }),
      React.createElement('div', { className: 'text-base font-semibold text-neutral-700 dark:text-neutral-300' }, 'Chưa có bộ học cá nhân nào'),
      React.createElement('p', { className: 'text-xs text-neutral-400 max-w-sm mx-auto' }, 'Tạo bộ học riêng để gom nhóm các tài khoản trọng tâm như Tài khoản Tiền tệ, Tài khoản Hàng tồn kho hoặc Tài khoản Thuế.'),
      React.createElement('button', {
        onClick: openNewDeckEditor,
        className: 'px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-sm'
      }, 'Tạo bộ học đầu tiên')
    ]),

    // Modal Editor: Create / Edit Deck
    isEditorOpen && React.createElement('div', {
      key: 'editor-modal',
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in'
    }, [
      React.createElement('div', {
        className: 'w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-6 md:p-8 space-y-6'
      }, [
        // Modal Header
        React.createElement('div', { className: 'flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4' }, [
          React.createElement('h3', { className: 'text-xl font-bold text-neutral-900 dark:text-neutral-100' },
            editingDeck ? 'Chỉnh sửa bộ học cá nhân' : 'Tạo mới bộ học cá nhân'
          ),
          React.createElement('button', {
            onClick: () => setIsEditorOpen(false),
            className: 'p-2 rounded-full text-neutral-400 hover:text-neutral-600'
          }, React.createElement(Icons.X, { size: 20 }))
        ]),

        // Inputs
        React.createElement('div', { className: 'space-y-4' }, [
          React.createElement('div', { className: 'space-y-1.5' }, [
            React.createElement('label', { className: 'text-xs font-semibold text-neutral-600 dark:text-neutral-300' }, 'Tên bộ học *'),
            React.createElement('input', {
              type: 'text',
              value: deckName,
              onChange: (e) => setDeckName(e.target.value),
              placeholder: 'VD: Tài khoản Tiền và Đầu tư tài chính',
              className: 'w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500'
            })
          ]),
          React.createElement('div', { className: 'space-y-1.5' }, [
            React.createElement('label', { className: 'text-xs font-semibold text-neutral-600 dark:text-neutral-300' }, 'Mô tả ngắn'),
            React.createElement('input', {
              type: 'text',
              value: deckDesc,
              onChange: (e) => setDeckDesc(e.target.value),
              placeholder: 'VD: Ôn tập chuẩn bị cho kỳ thi kết thúc học phần',
              className: 'w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500'
            })
          ])
        ]),

        // Account Selector Tree / Search
        React.createElement('div', { className: 'space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800' }, [
          React.createElement('div', { className: 'flex items-center justify-between' }, [
            React.createElement('span', { className: 'text-xs font-bold text-neutral-700 dark:text-neutral-300' }, `Chọn tài khoản (${selectedCodes.length} đã chọn):`),
            selectedCodes.length > 0 && React.createElement('button', {
              onClick: () => setSelectedCodes([]),
              className: 'text-xs text-red-500 hover:underline'
            }, 'Bỏ chọn tất cả')
          ]),

          React.createElement('div', { className: 'relative' }, [
            React.createElement(Icons.Search, { size: 16, className: 'absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400' }),
            React.createElement('input', {
              type: 'text',
              value: searchPicker,
              onChange: (e) => setSearchPicker(e.target.value),
              placeholder: 'Lọc nhanh tài khoản theo mã hoặc tên...',
              className: 'w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-xs text-neutral-800 dark:text-neutral-200'
            })
          ]),

          // List of accounts to toggle
          React.createElement('div', { className: 'max-h-56 overflow-y-auto space-y-1.5 p-1 border border-neutral-100 dark:border-neutral-800 rounded-2xl' },
            pickerAccounts.map(acc => {
              const isChecked = selectedCodes.includes(acc.code);
              return React.createElement('div', {
                key: acc.code,
                onClick: () => handleToggleCode(acc.code),
                className: `p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`
              }, [
                React.createElement('div', { className: 'flex items-center gap-2' }, [
                  React.createElement('div', {
                    className: `w-4 h-4 rounded border flex items-center justify-center ${
                      isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-neutral-300 dark:border-neutral-600'
                    }`
                  }, isChecked && React.createElement(Icons.Check, { size: 12 })),
                  React.createElement('span', { className: 'font-mono' }, acc.code),
                  React.createElement('span', { className: 'truncate max-w-xs' }, acc.name)
                ]),
                React.createElement('span', { className: 'text-[10px] text-neutral-400' }, `Cấp ${acc.level}`)
              ]);
            })
          )
        ]),

        // Footer Actions
        React.createElement('div', { className: 'flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800' }, [
          React.createElement('button', {
            onClick: () => setIsEditorOpen(false),
            className: 'px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs'
          }, 'Hủy bỏ'),
          React.createElement('button', {
            disabled: !deckName.trim() || selectedCodes.length === 0,
            onClick: handleSave,
            className: `px-6 py-2.5 rounded-xl font-semibold text-xs shadow-sm ${
              deckName.trim() && selectedCodes.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
            }`
          }, 'Lưu bộ học')
        ])
      ])
    ])
  ]);
}
