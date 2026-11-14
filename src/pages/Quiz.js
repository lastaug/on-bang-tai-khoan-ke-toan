// Apple HIG Multiple Choice Quiz Component
import React, { useState, useEffect, useMemo, useCallback } from 'https://esm.sh/react@18.2.0';
import { Icons } from '../components/Icons.js';
import { sound } from '../services/audio.js';

export function Quiz({
  sessionConfig,
  allAccounts,
  onCompleteSession,
  onBackToDashboard
}) {
  const [questions, setQuestions] = useState(sessionConfig?.accounts || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersLog, setAnswersLog] = useState([]); // [{ account, isCorrect, chosenOption }]
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const direction = sessionConfig?.direction || 'code-to-name';

  const currentAccount = questions[currentIndex];

  // Generate 4 options (1 correct, 3 distractors from same group or similar level)
  const options = useMemo(() => {
    if (!currentAccount) return [];

    const isCodeToName = direction === 'code-to-name' || (direction === 'mixed' && currentIndex % 2 === 0);

    // Filter potential distractors
    const sameGroup = allAccounts.filter(a => a.code !== currentAccount.code && a.group === currentAccount.group);
    const otherAccounts = allAccounts.filter(a => a.code !== currentAccount.code && a.group !== currentAccount.group);

    // Pick 3 distractors preferentially from same group
    let pool = [...sameGroup];
    if (pool.length < 3) {
      pool = [...pool, ...otherAccounts];
    }
    const shuffledPool = pool.sort(() => Math.random() - 0.5);
    const distractors = shuffledPool.slice(0, 3);

    const rawList = [
      {
        account: currentAccount,
        text: isCodeToName ? currentAccount.name : currentAccount.code,
        isCorrect: true
      },
      ...distractors.map(d => ({
        account: d,
        text: isCodeToName ? d.name : d.code,
        isCorrect: false
      }))
    ];

    // Shuffle options
    return rawList.sort(() => Math.random() - 0.5);
  }, [currentAccount, allAccounts, direction, currentIndex]);

  const isCodeToName = direction === 'code-to-name' || (direction === 'mixed' && currentIndex % 2 === 0);

  const handleSelectOption = useCallback((option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.isCorrect;
    if (isCorrect) {
      sound.playSuccess();
      setStreak(prev => prev + 1);
    } else {
      sound.playWrong();
      setStreak(0);
    }

    setAnswersLog(prev => [
      ...prev,
      {
        account: currentAccount,
        isCorrect,
        chosen: option.text,
        correctText: isCodeToName ? currentAccount.name : currentAccount.code
      }
    ]);
  }, [isAnswered, currentAccount, isCodeToName]);

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      sound.playComplete();
      setIsFinished(true);
      if (onCompleteSession) {
        const correctCount = answersLog.filter(a => a.isCorrect).length + (selectedOption?.isCorrect ? 1 : 0);
        onCompleteSession({
          mode: 'quiz',
          total_items: questions.length,
          correct_items: correctCount,
          answers: answersLog
        });
      }
    }
  };

  const handleRetryFailed = () => {
    const failedAccounts = answersLog.filter(a => !a.isCorrect).map(a => a.account);
    if (failedAccounts.length > 0) {
      sound.playClick();
      setQuestions(failedAccounts);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setAnswersLog([]);
      setIsFinished(false);
      setStreak(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;
      if (!isAnswered) {
        if (e.key === '1' && options[0]) handleSelectOption(options[0]);
        else if (e.key === '2' && options[1]) handleSelectOption(options[1]);
        else if (e.key === '3' && options[2]) handleSelectOption(options[2]);
        else if (e.key === '4' && options[3]) handleSelectOption(options[3]);
      } else {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, options, handleSelectOption]);

  if (!currentAccount || questions.length === 0) {
    return React.createElement('div', { className: 'p-12 text-center space-y-4' }, [
      React.createElement('div', { className: 'text-base font-semibold text-neutral-600 dark:text-neutral-400' }, 'Không có câu hỏi nào trong đề thi này.'),
      React.createElement('button', {
        onClick: onBackToDashboard,
        className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm'
      }, 'Quay về trang chủ')
    ]);
  }

  // Finished Quiz Summary
  if (isFinished) {
    const total = questions.length;
    const correctCount = answersLog.filter(a => a.isCorrect).length;
    const scorePct = Math.round((correctCount / total) * 100);
    const failedItems = answersLog.filter(a => !a.isCorrect);

    return React.createElement('div', { className: 'max-w-2xl mx-auto space-y-6 animate-fade-in p-6' }, [
      React.createElement('div', {
        className: 'p-8 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/80 dark:border-neutral-800 shadow-xl space-y-6 text-center'
      }, [
        React.createElement('div', { className: 'w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-inner' },
          React.createElement(Icons.Trophy, { size: 32 })
        ),
        React.createElement('div', { className: 'space-y-1' }, [
          React.createElement('h3', { className: 'text-2xl font-extrabold text-neutral-900 dark:text-neutral-100' }, 'Hoàn thành bài Trắc nghiệm!'),
          React.createElement('p', { className: 'text-sm text-neutral-500' }, `Bạn đã hoàn tất ${total} câu hỏi trắc nghiệm.`)
        ]),

        React.createElement('div', { className: 'p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/60 grid grid-cols-3 gap-4' }, [
          React.createElement('div', { key: 'q-sc' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1' }, 'Điểm số'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-blue-600 dark:text-blue-400' }, `${scorePct}%`)
          ]),
          React.createElement('div', { key: 'q-cor' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1' }, 'Số câu đúng'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-emerald-600 dark:text-emerald-400' }, `${correctCount}/${total}`)
          ]),
          React.createElement('div', { key: 'q-wrong' }, [
            React.createElement('div', { className: 'text-xs text-neutral-500 mb-1' }, 'Số câu sai'),
            React.createElement('div', { className: 'text-3xl font-extrabold text-red-500' }, failedItems.length)
          ])
        ]),

        // Review Failed Questions
        failedItems.length > 0 && React.createElement('div', { className: 'space-y-3 text-left pt-2' }, [
          React.createElement('div', { className: 'text-xs font-bold text-neutral-400 uppercase tracking-wider' }, `Các câu cần lưu ý (${failedItems.length}):`),
          React.createElement('div', { className: 'max-h-60 overflow-y-auto space-y-2 pr-1' },
            failedItems.map((item, idx) => React.createElement('div', {
              key: idx,
              className: 'p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-xs space-y-1'
            }, [
              React.createElement('div', { key: 'q-name', className: 'font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2' }, [
                React.createElement('span', { key: 'code', className: 'font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' }, item.account.code),
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
            className: 'flex-1 py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2'
          }, [
            React.createElement(Icons.RotateCcw, { size: 16 }),
            `Luyện lại ${failedItems.length} câu làm sai`
          ]),
          React.createElement('button', {
            key: 'home-btn',
            onClick: onBackToDashboard,
            className: 'flex-1 py-3 px-4 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm transition-all'
          }, 'Về Trang chủ')
        ])
      ])
    ]);
  }

  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return React.createElement('div', { className: 'max-w-2xl mx-auto space-y-6 animate-fade-in pb-12 select-none' }, [
    // Top Bar: Back, Progress, Streak
    React.createElement('div', { key: 'top-bar', className: 'flex items-center justify-between gap-4' }, [
      React.createElement('button', {
        key: 'back',
        onClick: onBackToDashboard,
        className: 'flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
      }, [
        React.createElement(Icons.ArrowLeft, { size: 16 }),
        'Dừng'
      ]),

      React.createElement('div', { key: 'progress-box', className: 'flex-1 max-w-xs space-y-1 text-center' }, [
        React.createElement('div', { className: 'text-xs font-semibold text-neutral-500 dark:text-neutral-400' },
          `Câu ${currentIndex + 1} / ${questions.length}`
        ),
        React.createElement('div', { className: 'w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden' },
          React.createElement('div', {
            className: 'h-full bg-blue-600 rounded-full transition-all duration-300',
            style: { width: `${progressPct}%` }
          })
        )
      ]),

      streak > 1 ? React.createElement('div', {
        key: 'streak',
        className: 'flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full'
      }, [
        React.createElement(Icons.Flame, { size: 14 }),
        `${streak} đúng liên tiếp`
      ]) : React.createElement('div', { key: 'sp', className: 'w-16' })
    ]),

    // Question Card
    React.createElement('div', {
      key: 'q-card',
      className: 'p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1c1c1e] border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4 text-center'
    }, [
      React.createElement('div', { key: 'badge', className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400' },
        `Cấp ${currentAccount.level} • Nhóm ${currentAccount.group}`
      ),

      React.createElement('div', { key: 'q-title', className: 'space-y-2' }, [
        React.createElement('div', { key: 'sub', className: 'text-xs font-semibold text-neutral-400 uppercase tracking-widest' },
          isCodeToName ? 'MÃ TÀI KHOẢN SAU ĐÂY CÓ TÊN LÀ GÌ?' : 'TÀI KHOẢN SAU ĐÂY CÓ SỐ HIỆU LÀ GÌ?'
        ),
        React.createElement('div', {
          key: 'main',
          className: `font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 ${
            isCodeToName ? 'font-mono text-5xl md:text-6xl text-blue-600 dark:text-blue-400' : 'text-2xl md:text-3xl'
          }`
        }, isCodeToName ? currentAccount.code : currentAccount.name)
      ])
    ]),

    // 4 Options Grid
    React.createElement('div', { key: 'options-grid', className: 'grid grid-cols-1 gap-3' },
      options.map((opt, idx) => {
        const optionNumber = idx + 1;
        const isSelected = selectedOption === opt;
        let btnStyle = 'bg-white dark:bg-[#1c1c1e] border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200';

        if (isAnswered) {
          if (opt.isCorrect) {
            btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm font-semibold';
          } else if (isSelected && !opt.isCorrect) {
            btnStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 shadow-sm line-through';
          } else {
            btnStyle = 'opacity-40 border-neutral-200 dark:border-neutral-800';
          }
        }

        return React.createElement('button', {
          key: idx,
          disabled: isAnswered,
          onClick: () => handleSelectOption(opt),
          className: `p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${btnStyle}`
        }, [
          React.createElement('div', { key: 'opt-content', className: 'flex items-center gap-3' }, [
            React.createElement('span', {
              key: 'key-pill',
              className: `w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                isAnswered && opt.isCorrect
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`
            }, optionNumber),
            React.createElement('span', {
              key: 'txt',
              className: `text-sm font-medium ${!isCodeToName ? 'font-mono font-bold text-base text-blue-600 dark:text-blue-400' : ''}`
            }, opt.text)
          ]),

          isAnswered && (
            opt.isCorrect
              ? React.createElement(Icons.CheckCircle2, { key: 'cor-ic', size: 20, className: 'text-emerald-600 dark:text-emerald-400 shrink-0' })
              : (isSelected ? React.createElement(Icons.XCircle, { key: 'wr-ic', size: 20, className: 'text-red-500 shrink-0' }) : null)
          )
        ]);
      })
    ),

    // Explanation Banner & Next CTA
    isAnswered && React.createElement('div', { key: 'exp-box', className: 'space-y-4 animate-fade-in' }, [
      React.createElement('div', {
        className: 'p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2'
      }, [
        React.createElement('div', { className: 'flex items-center justify-between text-xs font-bold text-neutral-500' }, [
          React.createElement('span', {}, `TÀI KHOẢN: ${currentAccount.code} - ${currentAccount.name}`),
          React.createElement('span', {}, currentAccount.nature)
        ]),
        currentAccount.tip && React.createElement('div', {
          className: 'text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5 pt-1'
        }, [
          React.createElement(Icons.Lightbulb, { size: 14, className: 'shrink-0 mt-0.5' }),
          React.createElement('span', {}, currentAccount.tip)
        ])
      ]),

      React.createElement('button', {
        key: 'next-btn',
        onClick: handleNext,
        className: 'w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
      }, [
        currentIndex < questions.length - 1 ? 'Câu tiếp theo (Enter)' : 'Xem kết quả bài thi',
        React.createElement(Icons.ArrowRight, { size: 16 })
      ])
    ])
  ]);
}
