// Apple HIG Multiple Choice Quiz Component (Zero-Jitter & Arrow Key Navigation)
import React, { useState, useEffect, useCallback } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Quiz({
  sessionConfig,
  allAccounts,
  onCompleteSession,
  onBackToDashboard
}) {
  const rawQuestions = sessionConfig?.accounts || [];
  const direction = sessionConfig?.direction || 'code-to-name';

  // Pre-generate stable questions and options once to guarantee ZERO jitter and consistency when navigating back/forward
  const [preparedQuiz, setPreparedQuiz] = useState(() => {
    return rawQuestions.map((acc, qIdx) => {
      const isCodeToName = direction === 'code-to-name' || (direction === 'mixed' && qIdx % 2 === 0);

      // Distractors from same group or other groups
      const sameGroup = allAccounts.filter(a => a.code !== acc.code && a.group === acc.group);
      const otherAccounts = allAccounts.filter(a => a.code !== acc.code && a.group !== acc.group);

      let pool = [...sameGroup];
      if (pool.length < 3) {
        pool = [...pool, ...otherAccounts];
      }
      const shuffledDistractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);

      const opts = [
        {
          account: acc,
          text: isCodeToName ? acc.name : acc.code,
          isCorrect: true
        },
        ...shuffledDistractors.map(d => ({
          account: d,
          text: isCodeToName ? d.name : d.code,
          isCorrect: false
        }))
      ].sort(() => Math.random() - 0.5);

      return {
        account: acc,
        isCodeToName,
        options: opts,
        correctText: isCodeToName ? acc.name : acc.code
      };
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({}); // { [index]: { selectedOption, isCorrect } }
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentQ = preparedQuiz[currentIndex];
  const currentAnswer = answersMap[currentIndex];
  const isAnswered = !!currentAnswer;

  // Handle select option
  const handleSelectOption = useCallback((option) => {
    if (isAnswered) return;

    const isCorrect = option.isCorrect;
    if (isCorrect) {
      sound.playSuccess();
      setStreak(prev => prev + 1);
    } else {
      sound.playWrong();
      setStreak(0);
    }

    setAnswersMap(prev => ({
      ...prev,
      [currentIndex]: {
        selectedOption: option,
        isCorrect,
        chosen: option.text,
        account: currentQ.account,
        correctText: currentQ.correctText
      }
    }));
  }, [isAnswered, currentIndex, currentQ]);

  // Navigate to previous question (ArrowLeft)
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      sound.playClick();
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Navigate to next question (ArrowRight)
  const handleNext = useCallback(() => {
    if (currentIndex < preparedQuiz.length - 1) {
      sound.playClick();
      setCurrentIndex(prev => prev + 1);
    } else if (Object.keys(answersMap).length >= preparedQuiz.length) {
      sound.playComplete();
      setIsFinished(true);
      if (onCompleteSession) {
        const answersList = Object.values(answersMap);
        const correctCount = answersList.filter(a => a.isCorrect).length;
        onCompleteSession({
          mode: 'quiz',
          total_items: preparedQuiz.length,
          correct_items: correctCount,
          answers: answersList
        });
      }
    } else if (isAnswered) {
      sound.playComplete();
      setIsFinished(true);
      if (onCompleteSession) {
        const answersList = Object.values(answersMap);
        const correctCount = answersList.filter(a => a.isCorrect).length;
        onCompleteSession({
          mode: 'quiz',
          total_items: preparedQuiz.length,
          correct_items: correctCount,
          answers: answersList
        });
      }
    }
  }, [currentIndex, preparedQuiz.length, answersMap, isAnswered, onCompleteSession]);

  // Retry failed questions
  const handleRetryFailed = () => {
    const failedOnes = Object.values(answersMap).filter(a => !a.isCorrect).map(a => a.account);
    if (failedOnes.length > 0) {
      sound.playClick();
      const newPrepared = failedOnes.map((acc) => {
        const isCodeToName = direction === 'code-to-name';
        const sameGroup = allAccounts.filter(a => a.code !== acc.code && a.group === acc.group);
        const otherAccounts = allAccounts.filter(a => a.code !== acc.code && a.group !== acc.group);
        let pool = [...sameGroup];
        if (pool.length < 3) pool = [...pool, ...otherAccounts];
        const shuffledDistractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
        const opts = [
          { account: acc, text: isCodeToName ? acc.name : acc.code, isCorrect: true },
          ...shuffledDistractors.map(d => ({ account: d, text: isCodeToName ? d.name : d.code, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        return {
          account: acc,
          isCodeToName,
          options: opts,
          correctText: isCodeToName ? acc.name : acc.code
        };
      });

      setPreparedQuiz(newPrepared);
      setCurrentIndex(0);
      setAnswersMap({});
      setIsFinished(false);
      setStreak(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (!isAnswered && currentQ) {
        if (e.key === '1' && currentQ.options[0]) handleSelectOption(currentQ.options[0]);
        else if (e.key === '2' && currentQ.options[1]) handleSelectOption(currentQ.options[1]);
        else if (e.key === '3' && currentQ.options[2]) handleSelectOption(currentQ.options[2]);
        else if (e.key === '4' && currentQ.options[3]) handleSelectOption(currentQ.options[3]);
      } else if (isAnswered) {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, currentQ, handleSelectOption, handlePrev, handleNext]);

  if (!currentQ || preparedQuiz.length === 0) {
    return React.createElement('div', { className: 'p-12 text-center space-y-4' }, [
      React.createElement('div', { className: 'text-base font-semibold text-neutral-600 dark:text-neutral-400' }, 'Không có câu hỏi nào trong đề thi này.'),
      React.createElement('button', {
        onClick: onBackToDashboard,
        className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm apple-btn-press'
      }, 'Quay về trang chủ')
    ]);
  }

  // Finished Quiz Summary Screen
  if (isFinished) {
    const total = preparedQuiz.length;
    const answersList = Object.values(answersMap);
    const correctCount = answersList.filter(a => a.isCorrect).length;
    const scorePct = Math.round((correctCount / total) * 100);
    const failedItems = answersList.filter(a => !a.isCorrect);

    return React.createElement('div', { className: 'max-w-2xl mx-auto space-y-6 animate-fade-in p-6' }, [
      React.createElement('div', {
        className: 'apple-card p-8 space-y-6 text-center'
      }, [
        React.createElement('div', { className: 'w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200/50 dark:border-blue-800/40' },
          React.createElement(Icons.Trophy, { size: 32 })
        ),
        React.createElement('div', { className: 'space-y-1' }, [
          React.createElement('h3', { className: 'text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100' }, 'Hoàn thành bài Trắc nghiệm!'),
          React.createElement('p', { className: 'text-sm text-neutral-500' }, `Bạn đã hoàn tất ${total} câu hỏi trắc nghiệm.`)
        ]),

        React.createElement('div', { className: 'p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.06] grid grid-cols-3 gap-4' }, [
          React.createElement('div', { key: 'q-sc' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Điểm số'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-tabular' }, `${scorePct}%`)
          ]),
          React.createElement('div', { key: 'q-cor' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Số câu đúng'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-tabular' }, `${correctCount}/${total}`)
          ]),
          React.createElement('div', { key: 'q-wrong' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1 font-medium' }, 'Số câu sai'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-red-500 font-tabular' }, failedItems.length)
          ])
        ]),

        // Review Failed Questions
        failedItems.length > 0 && React.createElement('div', { className: 'space-y-3 text-left pt-2' }, [
          React.createElement('div', { className: 'text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider' }, `Các câu cần lưu ý (${failedItems.length}):`),
          React.createElement('div', { className: 'max-h-60 overflow-y-auto space-y-2 pr-1' },
            failedItems.map((item, idx) => React.createElement('div', {
              key: idx,
              className: 'p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-xs space-y-1'
            }, [
              React.createElement('div', { key: 'q-name', className: 'font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2' }, [
                React.createElement('span', { key: 'code', className: 'font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-tabular' }, item.account.code),
                item.account.name
              ]),
              React.createElement('div', { key: 'sol', className: 'text-neutral-600 dark:text-neutral-400' }, [
                'Đáp án đúng: ',
                React.createElement('span', { key: 'ans', className: 'font-semibold text-emerald-600 dark:text-emerald-400' }, item.correctText)
              ]),
              item.account.tip && React.createElement('div', { key: 'tip', className: 'text-amber-700 dark:text-amber-300 text-[11px]' }, `Mẹo nhớ: ${item.account.tip}`)
            ]))
          )
        ]),

        // Actions
        React.createElement('div', { className: 'flex flex-col sm:flex-row gap-3 pt-4' }, [
          failedItems.length > 0 && React.createElement('button', {
            key: 'retry-btn',
            onClick: handleRetryFailed,
            className: 'flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all flex items-center justify-center gap-2 apple-btn-press'
          }, [
            React.createElement(Icons.RotateCcw, { size: 16 }),
            `Luyện lại ${failedItems.length} câu làm sai`
          ]),
          React.createElement('button', {
            key: 'home-btn',
            onClick: onBackToDashboard,
            className: 'flex-1 py-3 px-4 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm transition-all apple-btn-press'
          }, 'Về Trang chủ')
        ])
      ])
    ]);
  }

  const answeredCount = Object.keys(answersMap).length;
  const progressPct = Math.round(((currentIndex + 1) / preparedQuiz.length) * 100);

  return React.createElement('div', { className: 'max-w-2xl mx-auto space-y-4 animate-fade-in pb-12 select-none' }, [
    // Top Bar: Back, Progress, Streak
    React.createElement('div', { key: 'top-bar', className: 'flex items-center justify-between gap-4' }, [
      React.createElement('button', {
        key: 'back',
        onClick: onBackToDashboard,
        className: 'flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors apple-btn-press'
      }, [
        React.createElement(Icons.ArrowLeft, { size: 16 }),
        'Dừng'
      ]),

      React.createElement('div', { key: 'progress-box', className: 'flex-1 max-w-xs space-y-1 text-center' }, [
        React.createElement('div', { className: 'flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 font-tabular' }, [
          React.createElement('span', { key: 'cur' }, `Câu ${currentIndex + 1} / ${preparedQuiz.length}`),
          React.createElement('span', { key: 'ans', className: 'text-neutral-400 dark:text-neutral-500' }, `Đã trả lời: ${answeredCount}/${preparedQuiz.length}`)
        ]),
        React.createElement('div', { className: 'w-full h-1.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 overflow-hidden' },
          React.createElement('div', {
            className: 'h-full bg-blue-600 rounded-full transition-all duration-300',
            style: { width: `${progressPct}%` }
          })
        )
      ]),

      streak > 1 ? React.createElement('div', {
        key: 'streak',
        className: 'flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full shrink-0 border border-amber-200/40 dark:border-amber-800/40 font-tabular'
      }, [
        React.createElement(Icons.Flame, { size: 14 }),
        `${streak} đúng liên tiếp`
      ]) : React.createElement('div', { key: 'sp', className: 'w-14' })
    ]),

    // Question Card
    React.createElement('div', {
      key: 'q-card',
      className: 'apple-card p-6 md:p-8 space-y-3 text-center'
    }, [
      React.createElement('div', { key: 'badge', className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-black/[0.04] dark:border-white/[0.06]' },
        `Cấp ${currentQ.account.level} • Nhóm ${currentQ.account.group}`
      ),

      React.createElement('div', { key: 'q-title', className: 'space-y-1.5' }, [
        React.createElement('div', { key: 'sub', className: 'text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest' },
          currentQ.isCodeToName ? 'MÃ TÀI KHOẢN SAU ĐÂY CÓ TÊN LÀ GÌ?' : 'TÀI KHOẢN SAU ĐÂY CÓ SỐ HIỆU LÀ GÌ?'
        ),
        React.createElement('div', {
          key: 'main',
          className: `font-bold tracking-tight text-neutral-900 dark:text-neutral-100 ${
            currentQ.isCodeToName ? 'font-mono text-5xl md:text-6xl text-blue-600 dark:text-blue-400 font-tabular' : 'text-2xl md:text-3xl'
          }`
        }, currentQ.isCodeToName ? currentQ.account.code : currentQ.account.name)
      ])
    ]),

    // 4 Options Grid (ABSOLUTELY FIXED LAYOUT - 0px MOVEMENT GUARANTEED)
    // - Every button has fixed height h-[64px], fixed border-2
    // - Font weight is always font-semibold
    // - Fixed 24px icon slot reserved at all times on the right
    // - Colors change directly without CSS opacity (avoiding Windows ClearType antialiasing jump)
    React.createElement('div', { key: 'options-grid', className: 'grid grid-cols-1 gap-2.5' },
      currentQ.options.map((opt, idx) => {
        const optionNumber = idx + 1;
        const isSelected = currentAnswer?.selectedOption?.text === opt.text;

        let containerClass = 'bg-white dark:bg-[#1c1c1e] border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm';
        let keyPillClass = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400';
        let iconContent = null;

        if (isAnswered) {
          if (opt.isCorrect) {
            containerClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100';
            keyPillClass = 'bg-emerald-600 text-white';
            iconContent = React.createElement(Icons.CheckCircle2, { size: 20, className: 'text-emerald-600 dark:text-emerald-400' });
          } else if (isSelected && !opt.isCorrect) {
            containerClass = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-100';
            keyPillClass = 'bg-red-500 text-white';
            iconContent = React.createElement(Icons.XCircle, { size: 20, className: 'text-red-500' });
          } else {
            // Other options when answered: muted color directly without CSS opacity
            containerClass = 'bg-neutral-50/70 dark:bg-neutral-900/40 border-neutral-200/50 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500';
            keyPillClass = 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-400';
          }
        }

        return React.createElement('button', {
          key: idx,
          disabled: isAnswered,
          onClick: () => handleSelectOption(opt),
          className: `w-full h-[64px] px-4 py-3 rounded-2xl border-2 text-left flex items-center justify-between transition-colors ${containerClass}`
        }, [
          // Left: Key badge (1, 2, 3, 4) + Option Text
          React.createElement('div', { key: 'left-block', className: 'flex items-center gap-3 min-w-0 pr-2' }, [
            React.createElement('span', {
              key: 'num-badge',
              className: `w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${keyPillClass} font-tabular`
            }, optionNumber),
            React.createElement('span', {
              key: 'txt',
              className: `text-sm font-semibold leading-snug truncate ${!currentQ.isCodeToName ? 'font-mono text-base text-blue-600 dark:text-blue-400 font-tabular' : ''}`
            }, opt.text)
          ]),

          // Right: FIXED 24px slot reserved at all times so nothing ever shifts
          React.createElement('div', {
            key: 'fixed-icon-slot',
            className: 'w-6 h-6 flex items-center justify-center shrink-0'
          }, iconContent)
        ]);
      })
    ),

    // Navigation & Explanation Block (PERMANENTLY OCCUPIED - NO LAYOUT DISPLACEMENT)
    React.createElement('div', { key: 'nav-actions-bar', className: 'space-y-2.5 pt-1' }, [
      // Previous & Next Navigation Buttons
      React.createElement('div', { key: 'nav-row', className: 'flex items-center justify-between gap-3' }, [
        React.createElement('button', {
          key: 'btn-prev',
          disabled: currentIndex === 0,
          onClick: handlePrev,
          title: 'Phím Mũi tên trái (←)',
          className: `px-4 py-3 rounded-2xl border-2 text-xs font-semibold flex items-center gap-2 transition-all apple-btn-press ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
          }`
        }, [
          React.createElement(Icons.ArrowLeft, { size: 15 }),
          'Câu trước (←)'
        ]),

        React.createElement('button', {
          key: 'btn-next',
          onClick: handleNext,
          title: 'Phím Mũi tên phải (→) hoặc Enter',
          className: `flex-1 py-3 px-5 rounded-2xl border-2 font-semibold text-xs md:text-sm shadow-sm flex items-center justify-center gap-2 transition-all apple-btn-press ${
            isAnswered
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-blue-600/30'
              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-transparent'
          }`
        }, [
          currentIndex < preparedQuiz.length - 1
            ? (isAnswered ? 'Câu tiếp theo (→)' : 'Bỏ qua / Câu tiếp (→)')
            : 'Xem kết quả bài thi',
          React.createElement(Icons.ArrowRight, { size: 15 })
        ])
      ]),

      // Explanation & Tip Box (PERMANENT FIXED HEIGHT - ALWAYS IN PLACE)
      // When not answered: displays clean hint placeholder so the page never jumps in height!
      React.createElement('div', {
        key: 'explanation-box',
        className: `min-h-[84px] p-3.5 rounded-2xl border-2 transition-colors flex flex-col justify-center ${
          isAnswered
            ? 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200/60 dark:border-neutral-700/60'
            : 'bg-neutral-50/50 dark:bg-neutral-900/30 border-dashed border-neutral-200/50 dark:border-neutral-800 text-neutral-400'
        }`
      }, isAnswered ? [
        React.createElement('div', { key: 'top', className: 'flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1' }, [
          React.createElement('span', { key: 'acc' }, `TÀI KHOẢN: ${currentQ.account.code} - ${currentQ.account.name}`),
          React.createElement('span', { key: 'nat', className: 'font-normal px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300' }, currentQ.account.nature)
        ]),
        currentQ.account.tip && React.createElement('div', {
          key: 'tip',
          className: 'text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5'
        }, [
          React.createElement(Icons.Lightbulb, { size: 14, className: 'shrink-0 mt-0.5 text-amber-500' }),
          React.createElement('span', { className: 'line-clamp-2' }, currentQ.account.tip)
        ])
      ] : [
        React.createElement('div', { key: 'placeholder', className: 'flex items-center justify-center gap-2 text-xs text-neutral-400 select-none py-1' }, [
          React.createElement(Icons.Lightbulb, { size: 15, className: 'text-neutral-300 dark:text-neutral-600' }),
          'Chọn 1 trong 4 phương án trên (hoặc phím 1-4, mũi tên ←/→ để chuyển câu)'
        ])
      ])
    ])
  ]);
}
