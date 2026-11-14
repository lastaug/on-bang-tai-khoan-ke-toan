// Apple HIG Flashcard 3D Study Component
import React, { useState, useEffect, useCallback } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Flashcard({
  sessionConfig,
  onCompleteSession,
  onBackToDashboard
}) {
  const [cards, setCards] = useState(sessionConfig?.accounts || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTipDirectly, setShowTipDirectly] = useState(false);
  const [ratings, setRatings] = useState({}); // code -> rating
  const [isFinished, setIsFinished] = useState(false);

  const direction = sessionConfig?.direction || 'code-to-name'; // 'code-to-name', 'name-to-code'

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    sound.playFlip();
    setIsFlipped(prev => !prev);
  }, []);

  const handleRating = (rating) => {
    if (!currentCard) return;
    sound.playClick();

    const newRatings = { ...ratings, [currentCard.code]: rating };
    setRatings(newRatings);

    // Auto next card or finish
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setShowTipDirectly(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    } else {
      sound.playComplete();
      setIsFinished(true);
      if (onCompleteSession) {
        onCompleteSession({
          mode: 'flashcard',
          total_items: cards.length,
          correct_items: Object.values(newRatings).filter(r => r >= 2).length,
          ratings: newRatings
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sound.playClick();
      setIsFlipped(false);
      setShowTipDirectly(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      sound.playClick();
      setIsFlipped(false);
      setShowTipDirectly(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleShuffle = () => {
    sound.playClick();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowTipDirectly(false);
  };

  const handleRetryFailed = () => {
    const failedCards = cards.filter(c => (ratings[c.code] ?? 0) < 2);
    if (failedCards.length > 0) {
      setCards(failedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowTipDirectly(false);
      setRatings({});
      setIsFinished(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (isFlipped) {
        if (e.key === '1') handleRating(0);
        else if (e.key === '2') handleRating(1);
        else if (e.key === '3') handleRating(2);
        else if (e.key === '4') handleRating(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, cards, isFinished, handleFlip]);

  if (!currentCard || cards.length === 0) {
    return React.createElement('div', { className: 'p-12 text-center space-y-4' }, [
      React.createElement('div', { className: 'text-base font-semibold text-neutral-600 dark:text-neutral-400' }, 'Không có thẻ học nào trong buổi học này.'),
      React.createElement('button', {
        onClick: onBackToDashboard,
        className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm apple-btn-press'
      }, 'Quay về trang chủ')
    ]);
  }

  // Finished Session Recap
  if (isFinished) {
    const total = cards.length;
    const ratingCounts = {
      0: Object.values(ratings).filter(r => r === 0).length,
      1: Object.values(ratings).filter(r => r === 1).length,
      2: Object.values(ratings).filter(r => r === 2).length,
      3: Object.values(ratings).filter(r => r === 3).length
    };
    const rememberedCount = ratingCounts[2] + ratingCounts[3];
    const scorePct = Math.round((rememberedCount / total) * 100);

    return React.createElement('div', { className: 'max-w-xl mx-auto space-y-6 animate-fade-in p-6' }, [
      React.createElement('div', {
        className: 'apple-card p-8 text-center space-y-6'
      }, [
        React.createElement('div', { className: 'w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200/50 dark:border-emerald-800/40' },
          React.createElement(Icons.Trophy, { size: 32 })
        ),
        React.createElement('div', { className: 'space-y-1' }, [
          React.createElement('h3', { className: 'text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Hoàn thành buổi Flashcard!'),
          React.createElement('p', { className: 'text-sm text-neutral-500' }, `Bạn đã hoàn tất ôn tập ${total} thẻ ghi nhớ.`)
        ]),

        React.createElement('div', { className: 'p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.06] grid grid-cols-2 gap-4' }, [
          React.createElement('div', { key: 's1' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Tỷ lệ ghi nhớ tốt'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-tabular' }, `${scorePct}%`)
          ]),
          React.createElement('div', { key: 's2' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Số thẻ nhớ tốt / rất tốt'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-tabular' }, `${rememberedCount}/${total}`)
          ])
        ]),

        // Rating Breakdown Bar
        React.createElement('div', { className: 'space-y-2' }, [
          React.createElement('div', { className: 'text-xs font-semibold text-neutral-400 dark:text-neutral-500 text-left uppercase tracking-wider' }, 'Chi tiết đánh giá mức nhớ:'),
          React.createElement('div', { className: 'grid grid-cols-4 gap-2 text-center text-xs' }, [
            React.createElement('div', { key: 'r0', className: 'p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold border border-red-200/40 dark:border-red-900/40' }, [
              React.createElement('div', { className: 'text-[11px]' }, 'Chưa nhớ'),
              React.createElement('div', { className: 'text-base font-bold font-tabular mt-0.5' }, ratingCounts[0])
            ]),
            React.createElement('div', { key: 'r1', className: 'p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold border border-amber-200/40 dark:border-amber-900/40' }, [
              React.createElement('div', { className: 'text-[11px]' }, 'Khó nhớ'),
              React.createElement('div', { className: 'text-base font-bold font-tabular mt-0.5' }, ratingCounts[1])
            ]),
            React.createElement('div', { key: 'r2', className: 'p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/40 dark:border-blue-900/40' }, [
              React.createElement('div', { className: 'text-[11px]' }, 'Đã nhớ'),
              React.createElement('div', { className: 'text-base font-bold font-tabular mt-0.5' }, ratingCounts[2])
            ]),
            React.createElement('div', { key: 'r3', className: 'p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200/40 dark:border-emerald-900/40' }, [
              React.createElement('div', { className: 'text-[11px]' }, 'Rất tốt'),
              React.createElement('div', { className: 'text-base font-bold font-tabular mt-0.5' }, ratingCounts[3])
            ])
          ])
        ]),

        // Action Buttons
        React.createElement('div', { className: 'flex flex-col sm:flex-row gap-3 pt-2' }, [
          ratingCounts[0] + ratingCounts[1] > 0 && React.createElement('button', {
            key: 'retry-failed',
            onClick: handleRetryFailed,
            className: 'flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all flex items-center justify-center gap-2 apple-btn-press'
          }, [
            React.createElement(Icons.RotateCcw, { size: 16 }),
            `Ôn lại ${ratingCounts[0] + ratingCounts[1]} thẻ chưa thuộc`
          ]),
          React.createElement('button', {
            key: 'back-btn',
            onClick: onBackToDashboard,
            className: 'flex-1 py-3 px-4 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm transition-all apple-btn-press'
          }, 'Về Trang chủ')
        ])
      ])
    ]);
  }

  const progressPct = Math.round(((currentIndex + 1) / cards.length) * 100);

  return React.createElement('div', { className: 'max-w-2xl mx-auto space-y-6 animate-fade-in pb-12 select-none' }, [
    // Top Bar: Back, Progress, Shuffle
    React.createElement('div', { key: 'top-bar', className: 'flex items-center justify-between gap-4' }, [
      React.createElement('button', {
        key: 'back',
        onClick: onBackToDashboard,
        className: 'flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors apple-btn-press'
      }, [
        React.createElement(Icons.ArrowLeft, { size: 16 }),
        'Dừng học'
      ]),

      React.createElement('div', { key: 'progress-box', className: 'flex-1 max-w-xs space-y-1 text-center' }, [
        React.createElement('div', { className: 'text-xs font-medium text-neutral-500 dark:text-neutral-400 font-tabular' },
          `Thẻ ${currentIndex + 1} / ${cards.length}`
        ),
        React.createElement('div', { className: 'w-full h-1.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 overflow-hidden' },
          React.createElement('div', {
            className: 'h-full bg-blue-600 rounded-full transition-all duration-300',
            style: { width: `${progressPct}%` }
          })
        )
      ]),

      React.createElement('button', {
        key: 'shuffle',
        onClick: handleShuffle,
        title: 'Xáo trộn thứ tự các thẻ',
        className: 'p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors apple-btn-press'
      }, React.createElement(Icons.Shuffle, { size: 18 }))
    ]),

    // 3D Perspective Card Container
    React.createElement('div', {
      key: 'card-container',
      className: 'perspective-1000 w-full min-h-[340px] md:min-h-[380px] cursor-pointer group',
      onClick: handleFlip
    }, [
      React.createElement('div', {
        key: 'card-flipper',
        className: `relative w-full h-full min-h-[340px] md:min-h-[380px] rounded-3xl transition-all duration-500 transform-style-3d shadow-md border border-black/[0.06] dark:border-white/[0.08] ${
          isFlipped ? 'rotate-y-180' : ''
        }`
      }, [
        // FRONT SIDE
        React.createElement('div', {
          key: 'card-front',
          className: 'absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between backface-hidden bg-white dark:bg-[#1c1c1e]'
        }, [
          // Front Top
          React.createElement('div', { key: 'f-top', className: 'flex items-center justify-between' }, [
            React.createElement('span', {
              key: 'level-badge',
              className: 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-black/[0.04] dark:border-white/[0.06]'
            }, `Cấp ${currentCard.level}`),
            React.createElement('span', {
              key: 'hint-btn',
              onClick: (e) => {
                e.stopPropagation();
                sound.playClick();
                setShowTipDirectly(prev => !prev);
              },
              className: 'inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline p-1'
            }, [
              React.createElement(Icons.Lightbulb, { key: 'i', size: 14 }),
              showTipDirectly ? 'Ẩn gợi ý' : 'Gợi ý'
            ])
          ]),

          // Front Center Question
          React.createElement('div', { key: 'f-center', className: 'text-center space-y-3 my-auto' }, [
            React.createElement('div', { key: 'lbl', className: 'text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500' },
              direction === 'code-to-name' ? 'SỐ HIỆU TÀI KHOẢN' : 'TÊN TÀI KHOẢN'
            ),
            React.createElement('div', {
              key: 'main-q',
              className: `font-bold tracking-tight text-neutral-900 dark:text-neutral-100 ${
                direction === 'code-to-name' ? 'font-mono text-5xl md:text-6xl text-blue-600 dark:text-blue-400 font-tabular' : 'text-2xl md:text-3xl'
              }`
            }, direction === 'code-to-name' ? currentCard.code : currentCard.name),

            showTipDirectly && React.createElement('div', {
              key: 'direct-tip',
              className: 'p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs max-w-md mx-auto animate-fade-in border border-amber-200/50 dark:border-amber-800/40'
            }, currentCard.tip)
          ]),

          // Front Bottom Instruction
          React.createElement('div', { key: 'f-bot', className: 'text-center text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1.5' }, [
            React.createElement(Icons.Sparkles, { size: 14 }),
            'Nhấn vào thẻ hoặc nhấn Phím Cách (Space) để lật xem đáp án'
          ])
        ]),

        // BACK SIDE (Rotated 180deg)
        React.createElement('div', {
          key: 'card-back',
          className: 'absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 bg-[#fbfbfd] dark:bg-[#252528]'
        }, [
          // Back Top
          React.createElement('div', { key: 'b-top', className: 'flex items-center justify-between' }, [
            React.createElement('span', {
              key: 'code-tag',
              className: 'font-mono font-bold text-sm px-2.5 py-1 rounded-xl bg-blue-600 text-white shadow-sm font-tabular'
            }, currentCard.code),
            React.createElement('span', {
              key: 'nature-tag',
              className: 'text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }, currentCard.nature)
          ]),

          // Back Center Answer
          React.createElement('div', { key: 'b-center', className: 'space-y-4 my-auto text-center' }, [
            React.createElement('div', { key: 'b-title', className: 'text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight' },
              currentCard.name
            ),

            currentCard.tip && React.createElement('div', {
              key: 'b-tip',
              className: 'p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs text-left max-w-lg mx-auto space-y-1'
            }, [
              React.createElement('div', { key: 'h', className: 'font-bold uppercase tracking-wider text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1' }, [
                React.createElement(Icons.Lightbulb, { size: 13 }),
                'Mẹo ghi nhớ'
              ]),
              React.createElement('p', { key: 'p', className: 'leading-relaxed' }, currentCard.tip)
            ])
          ]),

          // Back Bottom Hint
          React.createElement('div', { key: 'b-bot', className: 'text-center text-xs text-neutral-400 dark:text-neutral-500' },
            'Đánh giá mức độ ghi nhớ của bạn ở bên dưới để tiếp tục'
          )
        ])
      ])
    ]),

    // Card Controls / SRS Rating Buttons
    isFlipped ? React.createElement('div', { key: 'srs-ratings', className: 'space-y-2 animate-fade-in' }, [
      React.createElement('div', { className: 'text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-center' },
        'Bạn nhớ tài khoản này như thế nào?'
      ),
      React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3' }, [
        { rating: 0, label: 'Chưa nhớ', sub: 'Phím 1', style: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 hover:bg-red-100' },
        { rating: 1, label: 'Khó nhớ', sub: 'Phím 2', style: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50 hover:bg-amber-100' },
        { rating: 2, label: 'Đã nhớ', sub: 'Phím 3', style: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 hover:bg-blue-100' },
        { rating: 3, label: 'Rất tốt', sub: 'Phím 4', style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50 hover:bg-emerald-100' }
      ].map(btn => React.createElement('button', {
        key: btn.rating,
        onClick: () => handleRating(btn.rating),
        className: `py-3 px-4 rounded-2xl font-semibold text-sm transition-all flex flex-col items-center justify-center apple-btn-press ${btn.style}`
      }, [
        React.createElement('span', { key: 'lbl' }, btn.label),
        React.createElement('span', { key: 'sub', className: 'text-[10px] opacity-70 font-normal mt-0.5' }, btn.sub)
      ])))
    ]) : React.createElement('div', { key: 'nav-controls', className: 'flex items-center justify-between gap-3 pt-2' }, [
      React.createElement('button', {
        key: 'prev-btn',
        disabled: currentIndex === 0,
        onClick: handlePrev,
        className: `p-3 rounded-2xl border text-sm font-semibold flex items-center gap-1.5 transition-colors apple-btn-press ${
          currentIndex === 0
            ? 'opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400'
            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
        }`
      }, [
        React.createElement(Icons.ArrowLeft, { size: 16 }),
        'Thẻ trước'
      ]),

      React.createElement('button', {
        key: 'flip-cta',
        onClick: handleFlip,
        className: 'flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 apple-btn-press'
      }, [
        React.createElement(Icons.Sparkles, { size: 16 }),
        'Lật thẻ xem đáp án'
      ]),

      React.createElement('button', {
        key: 'next-btn',
        disabled: currentIndex === cards.length - 1,
        onClick: handleNext,
        className: `p-3 rounded-2xl border text-sm font-semibold flex items-center gap-1.5 transition-colors apple-btn-press ${
          currentIndex === cards.length - 1
            ? 'opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400'
            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
        }`
      }, [
        'Thẻ tiếp',
        React.createElement(Icons.ArrowRight, { size: 16 })
      ])
    ])
  ]);
}
