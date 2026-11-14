// Apple HIG Interactive Matching Game Component
import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Matching({
  sessionConfig,
  onCompleteSession,
  onBackToDashboard
}) {
  const allSessionAccounts = useMemo(() => {
    return sessionConfig?.accounts || [];
  }, [sessionConfig]);

  // Game batches (6 pairs per round)
  const [batchSize] = useState(6);
  const [batchIndex, setBatchIndex] = useState(0);

  const currentPairAccounts = useMemo(() => {
    const start = batchIndex * batchSize;
    return allSessionAccounts.slice(start, start + batchSize);
  }, [allSessionAccounts, batchIndex, batchSize]);

  const [leftCards, setLeftCards] = useState([]);
  const [rightCards, setRightCards] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null); // code
  const [selectedRight, setSelectedRight] = useState(null); // code
  const [matchedCodes, setMatchedCodes] = useState([]);
  const [wrongMismatch, setWrongMismatch] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize batch cards
  const setupBatch = useCallback((accs) => {
    const codes = accs.map(a => ({ code: a.code, text: a.code, group: a.group })).sort(() => Math.random() - 0.5);
    const names = accs.map(a => ({ code: a.code, text: a.name, group: a.group })).sort(() => Math.random() - 0.5);
    setLeftCards(codes);
    setRightCards(names);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedCodes([]);
    setWrongMismatch(false);
  }, []);

  useEffect(() => {
    if (currentPairAccounts.length > 0) {
      setupBatch(currentPairAccounts);
    }
  }, [currentPairAccounts, setupBatch]);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Check match logic
  const checkPair = (leftCode, rightCode) => {
    if (leftCode === rightCode) {
      sound.playSuccess();
      const updated = [...matchedCodes, leftCode];
      setMatchedCodes(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if current batch finished
      if (updated.length === currentPairAccounts.length) {
        // Next batch or finish game
        if ((batchIndex + 1) * batchSize < allSessionAccounts.length) {
          setTimeout(() => {
            setBatchIndex(prev => prev + 1);
          }, 400);
        } else {
          setTimeout(() => {
            sound.playComplete();
            setIsFinished(true);
            if (onCompleteSession) {
              onCompleteSession({
                mode: 'matching',
                total_items: allSessionAccounts.length,
                correct_items: allSessionAccounts.length,
                duration_seconds: seconds,
                mistakes
              });
            }
          }, 300);
        }
      }
    } else {
      sound.playWrong();
      setWrongMismatch(true);
      setMistakes(prev => prev + 1);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongMismatch(false);
      }, 500);
    }
  };

  const handleSelectLeft = (code) => {
    if (matchedCodes.includes(code) || wrongMismatch) return;
    sound.playClick();
    setSelectedLeft(code);
    if (selectedRight) {
      checkPair(code, selectedRight);
    }
  };

  const handleSelectRight = (code) => {
    if (matchedCodes.includes(code) || wrongMismatch) return;
    sound.playClick();
    setSelectedRight(code);
    if (selectedLeft) {
      checkPair(selectedLeft, code);
    }
  };

  const handleRestart = () => {
    setBatchIndex(0);
    setMistakes(0);
    setSeconds(0);
    setIsFinished(false);
    setupBatch(allSessionAccounts.slice(0, batchSize));
  };

  if (allSessionAccounts.length === 0) {
    return React.createElement('div', { className: 'p-12 text-center space-y-4' }, [
      React.createElement('div', { className: 'text-base font-semibold text-neutral-600 dark:text-neutral-400' }, 'Không có cặp thẻ nào để ghép.'),
      React.createElement('button', {
        onClick: onBackToDashboard,
        className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm apple-btn-press'
      }, 'Quay về trang chủ')
    ]);
  }

  // Finished Game Screen
  if (isFinished) {
    const totalPairs = allSessionAccounts.length;
    let stars = 3;
    if (mistakes > totalPairs * 0.5) stars = 1;
    else if (mistakes > totalPairs * 0.2) stars = 2;

    return React.createElement('div', { className: 'max-w-xl mx-auto space-y-6 animate-fade-in p-6' }, [
      React.createElement('div', {
        className: 'apple-card p-8 space-y-6 text-center'
      }, [
        React.createElement('div', { className: 'w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto border border-amber-200/50 dark:border-amber-800/40' },
          React.createElement(Icons.Trophy, { size: 32 })
        ),
        React.createElement('div', { className: 'space-y-1' }, [
          React.createElement('h3', { className: 'text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Ghép đôi thành công!'),
          React.createElement('div', { className: 'flex justify-center gap-1.5 pt-1' },
            [1, 2, 3].map(st => React.createElement(Icons.Star, {
              key: st,
              size: 22,
              className: st <= stars ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'
            }))
          )
        ]),

        React.createElement('div', { className: 'p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.06] grid grid-cols-3 gap-4' }, [
          React.createElement('div', { key: 'm1' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Tổng số cặp'),
            React.createElement('div', { className: 'text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 font-tabular' }, totalPairs)
          ]),
          React.createElement('div', { key: 'm2' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Thời gian'),
            React.createElement('div', { className: 'text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-tabular' }, `${seconds}s`)
          ]),
          React.createElement('div', { key: 'm3' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Số lần sai'),
            React.createElement('div', { className: 'text-2xl font-extrabold text-neutral-700 dark:text-neutral-300 font-tabular' }, mistakes)
          ])
        ]),

        React.createElement('div', { className: 'flex flex-col sm:flex-row gap-3 pt-4' }, [
          React.createElement('button', {
            key: 'replay',
            onClick: handleRestart,
            className: 'flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 apple-btn-press'
          }, [
            React.createElement(Icons.RotateCcw, { size: 16 }),
            'Chơi lại màn mới'
          ]),
          React.createElement('button', {
            key: 'home',
            onClick: onBackToDashboard,
            className: 'flex-1 py-3 px-4 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm transition-all apple-btn-press'
          }, 'Về Trang chủ')
        ])
      ])
    ]);
  }

  const totalBatches = Math.ceil(allSessionAccounts.length / batchSize);

  return React.createElement('div', { className: 'max-w-3xl mx-auto space-y-6 animate-fade-in pb-12 select-none' }, [
    // Top Bar: Back, Stats (Timer, Round, Mistakes)
    React.createElement('div', { key: 'top-bar', className: 'flex items-center justify-between gap-4' }, [
      React.createElement('button', {
        key: 'back',
        onClick: onBackToDashboard,
        className: 'flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors apple-btn-press'
      }, [
        React.createElement(Icons.ArrowLeft, { size: 16 }),
        'Dừng'
      ]),

      React.createElement('div', { key: 'stats-pills', className: 'flex items-center gap-2.5 font-tabular' }, [
        React.createElement('div', { className: 'flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-black/[0.04] dark:border-white/[0.06]' }, [
          React.createElement(Icons.Clock, { size: 13, className: 'text-neutral-400' }),
          `${seconds}s`
        ]),
        totalBatches > 1 && React.createElement('div', { className: 'text-xs font-medium px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/40' },
          `Đợt ${batchIndex + 1} / ${totalBatches}`
        ),
        React.createElement('div', { className: 'text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-black/[0.04] dark:border-white/[0.06]' },
          `Sai: ${mistakes}`
        )
      ]),

      React.createElement('button', {
        key: 'restart-btn',
        onClick: handleRestart,
        title: 'Chơi lại từ đầu',
        className: 'p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors apple-btn-press'
      }, React.createElement(Icons.RotateCcw, { size: 16 }))
    ]),

    // Instructions
    React.createElement('div', { key: 'instr', className: 'text-center text-xs text-neutral-500 dark:text-neutral-400' },
      'Chạm vào 1 Mã số bên trái và 1 Tên tài khoản tương ứng bên phải để ghép đôi.'
    ),

    // 2-Column Matching Board
    React.createElement('div', { key: 'board', className: 'grid grid-cols-2 gap-4 md:gap-6' }, [
      // Left Column: Codes
      React.createElement('div', { key: 'col-left', className: 'space-y-3' }, [
        React.createElement('div', { key: 'c-title', className: 'text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-center' }, 'SỐ HIỆU MÃ TK'),
        ...leftCards.map(item => {
          const isMatched = matchedCodes.includes(item.code);
          const isSelected = selectedLeft === item.code;
          const isWrong = wrongMismatch && isSelected;

          let cardStyle = 'bg-white dark:bg-[#1c1c1e] border-black/[0.08] dark:border-white/[0.1] text-neutral-900 dark:text-neutral-100 hover:border-blue-400 shadow-sm';
          if (isMatched) {
            cardStyle = 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 opacity-40 cursor-default';
          } else if (isWrong) {
            cardStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 animate-shake';
          } else if (isSelected) {
            cardStyle = 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-500/20';
          }

          return React.createElement('button', {
            key: item.code,
            disabled: isMatched,
            onClick: () => handleSelectLeft(item.code),
            className: `w-full min-h-[64px] p-4 rounded-2xl border font-mono font-bold text-lg md:text-xl flex items-center justify-center transition-all font-tabular apple-btn-press ${cardStyle}`
          }, [
            item.text,
            isMatched && React.createElement(Icons.Check, { key: 'chk', size: 16, className: 'ml-2 text-emerald-600' })
          ]);
        })
      ]),

      // Right Column: Names
      React.createElement('div', { key: 'col-right', className: 'space-y-3' }, [
        React.createElement('div', { key: 'c-title', className: 'text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-center' }, 'TÊN TÀI KHOẢN'),
        ...rightCards.map(item => {
          const isMatched = matchedCodes.includes(item.code);
          const isSelected = selectedRight === item.code;
          const isWrong = wrongMismatch && isSelected;

          let cardStyle = 'bg-white dark:bg-[#1c1c1e] border-black/[0.08] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 hover:border-blue-400 shadow-sm';
          if (isMatched) {
            cardStyle = 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 opacity-40 cursor-default line-through';
          } else if (isWrong) {
            cardStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 animate-shake';
          } else if (isSelected) {
            cardStyle = 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm ring-2 ring-blue-500/20 font-semibold';
          }

          return React.createElement('button', {
            key: item.code,
            disabled: isMatched,
            onClick: () => handleSelectRight(item.code),
            className: `w-full min-h-[64px] p-3 md:p-4 rounded-2xl border text-xs md:text-sm font-medium text-left flex items-center justify-between transition-all leading-snug apple-btn-press ${cardStyle}`
          }, [
            React.createElement('span', { key: 'txt', className: 'truncate-2' }, item.text),
            isMatched && React.createElement(Icons.Check, { key: 'chk', size: 16, className: 'ml-2 text-emerald-600 shrink-0' })
          ]);
        })
      ])
    ])
  ]);
}
