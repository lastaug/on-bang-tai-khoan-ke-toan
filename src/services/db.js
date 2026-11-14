// IndexedDB & Local Storage Service for For Bunny

const DB_NAME = 'TKStudyDB';
const DB_VERSION = 1;

class DatabaseService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to localStorage');
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('account_progress')) {
          const progressStore = db.createObjectStore('account_progress', { keyPath: 'code' });
          progressStore.createIndex('state', 'state', { unique: false });
          progressStore.createIndex('next_review', 'next_review', { unique: false });
        }

        if (!db.objectStoreNames.contains('custom_decks')) {
          db.createObjectStore('custom_decks', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('study_sessions')) {
          const sessionStore = db.createObjectStore('study_sessions', { keyPath: 'id' });
          sessionStore.createIndex('started_at', 'started_at', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        resolve(null);
      };
    });

    return this.initPromise;
  }

  // --- Account Progress ---
  async getAllProgress() {
    await this.init();
    if (!this.db) {
      return this._fallbackGet('account_progress') || {};
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction('account_progress', 'readonly');
      const store = tx.objectStore('account_progress');
      const request = store.getAll();
      request.onsuccess = () => {
        const map = {};
        (request.result || []).forEach(item => {
          map[item.code] = item;
        });
        resolve(map);
      };
      request.onerror = () => resolve({});
    });
  }

  async getProgress(code) {
    await this.init();
    if (!this.db) {
      const map = this._fallbackGet('account_progress') || {};
      return map[code] || null;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction('account_progress', 'readonly');
      const store = tx.objectStore('account_progress');
      const request = store.get(code);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  /**
   * Record review with Spaced Repetition (SRS)
   * rating: 
   * 0: Chưa nhớ (Again)
   * 1: Khó nhớ (Hard)
   * 2: Đã nhớ (Good)
   * 3: Nhớ rất tốt (Easy)
   */
  async recordReview(code, rating, isCorrect) {
    await this.init();
    const existing = await this.getProgress(code) || {
      code,
      state: 0, // 0: Chưa học, 1: Đang học, 2: Sắp thuộc, 3: Đã thuộc
      review_count: 0,
      correct_count: 0,
      wrong_count: 0,
      consecutive_correct: 0,
      interval_days: 0,
      ease_factor: 2.5,
      history: []
    };

    const now = new Date();
    const updated = { ...existing };
    updated.review_count += 1;
    updated.last_reviewed = now.toISOString();

    if (isCorrect) {
      updated.correct_count += 1;
      updated.consecutive_correct += 1;
    } else {
      updated.wrong_count += 1;
      updated.consecutive_correct = 0;
    }

    // SRS interval & mastery state logic
    // Rating: 0: Chưa nhớ, 1: Khó nhớ, 2: Đã nhớ, 3: Nhớ rất tốt
    let nextIntervalDays = 1;
    if (rating === 0) {
      // Failed / Chưa nhớ
      updated.interval_days = 0.25; // 6 hours
      updated.state = 1; // Đang học
      updated.ease_factor = Math.max(1.3, updated.ease_factor - 0.2);
      nextIntervalDays = 0.25;
    } else if (rating === 1) {
      // Khó nhớ
      updated.state = updated.consecutive_correct >= 2 ? 2 : 1;
      updated.ease_factor = Math.max(1.3, updated.ease_factor - 0.15);
      nextIntervalDays = Math.max(1, (updated.interval_days || 1) * 1.2);
    } else if (rating === 2) {
      // Đã nhớ
      if (updated.consecutive_correct >= 3) {
        updated.state = 3; // Đã thuộc (Yêu cầu ít nhất 3 lần đúng liên tiếp)
      } else if (updated.consecutive_correct >= 1) {
        updated.state = 2; // Sắp thuộc
      } else {
        updated.state = 1;
      }
      nextIntervalDays = Math.max(1, (updated.interval_days || 1) * updated.ease_factor);
    } else if (rating === 3) {
      // Nhớ rất tốt
      updated.ease_factor += 0.15;
      if (updated.consecutive_correct >= 2) {
        updated.state = 3; // Đã thuộc
      } else {
        updated.state = 2;
      }
      nextIntervalDays = Math.max(3, (updated.interval_days || 1) * updated.ease_factor * 1.3);
    }

    updated.interval_days = Math.round(nextIntervalDays * 10) / 10;
    const nextDate = new Date(now.getTime() + updated.interval_days * 24 * 60 * 60 * 1000);
    updated.next_review = nextDate.toISOString();

    updated.history.push({
      date: now.toISOString(),
      rating,
      isCorrect
    });
    // Keep max 20 history items
    if (updated.history.length > 20) {
      updated.history.shift();
    }

    // Save to DB
    if (this.db) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('account_progress', 'readwrite');
        const store = tx.objectStore('account_progress');
        store.put(updated);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } else {
      const map = this._fallbackGet('account_progress') || {};
      map[code] = updated;
      this._fallbackSet('account_progress', map);
    }

    await this.updateStreak();
    return updated;
  }

  // --- Custom Decks ---
  async getCustomDecks() {
    await this.init();
    if (!this.db) {
      return this._fallbackGet('custom_decks') || [];
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction('custom_decks', 'readonly');
      const store = tx.objectStore('custom_decks');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async saveCustomDeck(deck) {
    await this.init();
    const data = {
      ...deck,
      id: deck.id || 'deck_' + Date.now(),
      updated_at: new Date().toISOString(),
      created_at: deck.created_at || new Date().toISOString()
    };

    if (this.db) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('custom_decks', 'readwrite');
        tx.objectStore('custom_decks').put(data);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } else {
      const decks = this._fallbackGet('custom_decks') || [];
      const idx = decks.findIndex(d => d.id === data.id);
      if (idx >= 0) decks[idx] = data;
      else decks.push(data);
      this._fallbackSet('custom_decks', decks);
    }
    return data;
  }

  async deleteCustomDeck(id) {
    await this.init();
    if (this.db) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('custom_decks', 'readwrite');
        tx.objectStore('custom_decks').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } else {
      let decks = this._fallbackGet('custom_decks') || [];
      decks = decks.filter(d => d.id !== id);
      this._fallbackSet('custom_decks', decks);
    }
  }

  // --- Study Sessions ---
  async saveSession(session) {
    await this.init();
    const data = {
      id: 'session_' + Date.now(),
      completed_at: new Date().toISOString(),
      ...session
    };

    if (this.db) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('study_sessions', 'readwrite');
        tx.objectStore('study_sessions').put(data);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } else {
      const sessions = this._fallbackGet('study_sessions') || [];
      sessions.unshift(data);
      if (sessions.length > 50) sessions.pop();
      this._fallbackSet('study_sessions', sessions);
    }
    return data;
  }

  async getSessionHistory(limit = 10) {
    await this.init();
    if (!this.db) {
      const sessions = this._fallbackGet('study_sessions') || [];
      return sessions.slice(0, limit);
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction('study_sessions', 'readonly');
      const store = tx.objectStore('study_sessions');
      const request = store.getAll();
      request.onsuccess = () => {
        const list = request.result || [];
        list.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
        resolve(list.slice(0, limit));
      };
      request.onerror = () => resolve([]);
    });
  }

  // --- Streak Tracking ---
  async updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const settings = await this.getSettings();
    const lastActive = settings.last_active_date;
    let streak = settings.streak || 0;

    if (!lastActive) {
      streak = 1;
    } else if (lastActive === today) {
      // Same day, streak unchanged
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastActive === yesterday) {
        streak += 1;
      } else {
        streak = 1; // Streak reset
      }
    }

    await this.saveSetting('last_active_date', today);
    await this.saveSetting('streak', streak);
  }

  // --- Settings ---
  async getSettings() {
    await this.init();
    if (!this.db) {
      return this._fallbackGet('tk_settings') || {};
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const request = store.getAll();
      request.onsuccess = () => {
        const res = {};
        (request.result || []).forEach(item => {
          res[item.key] = item.value;
        });
        resolve(res);
      };
      request.onerror = () => resolve({});
    });
  }

  async saveSetting(key, value) {
    await this.init();
    if (this.db) {
      await new Promise((resolve) => {
        const tx = this.db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ key, value });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } else {
      const settings = this._fallbackGet('tk_settings') || {};
      settings[key] = value;
      this._fallbackSet('tk_settings', settings);
    }
  }

  // --- Backup / Export / Import ---
  async exportBackup() {
    const progress = await this.getAllProgress();
    const decks = await this.getCustomDecks();
    const sessions = await this.getSessionHistory(100);
    const settings = await this.getSettings();

    return {
      version: 1,
      exported_at: new Date().toISOString(),
      app: 'For Bunny',
      data: {
        progress,
        decks,
        sessions,
        settings
      }
    };
  }

  async importBackup(jsonData) {
    if (!jsonData || !jsonData.data) throw new Error('Dữ liệu sao lưu không hợp lệ');
    await this.init();

    const { progress, decks, sessions, settings } = jsonData.data;

    if (this.db) {
      // Clear and restore
      const tx = this.db.transaction(['account_progress', 'custom_decks', 'study_sessions', 'settings'], 'readwrite');
      
      const pStore = tx.objectStore('account_progress');
      pStore.clear();
      if (progress) {
        Object.values(progress).forEach(p => pStore.put(p));
      }

      const dStore = tx.objectStore('custom_decks');
      dStore.clear();
      if (Array.isArray(decks)) {
        decks.forEach(d => dStore.put(d));
      }

      const sStore = tx.objectStore('study_sessions');
      sStore.clear();
      if (Array.isArray(sessions)) {
        sessions.forEach(s => sStore.put(s));
      }

      const setStore = tx.objectStore('settings');
      setStore.clear();
      if (settings) {
        Object.entries(settings).forEach(([key, value]) => setStore.put({ key, value }));
      }

      await new Promise(resolve => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } else {
      if (progress) this._fallbackSet('account_progress', progress);
      if (decks) this._fallbackSet('custom_decks', decks);
      if (sessions) this._fallbackSet('study_sessions', sessions);
      if (settings) this._fallbackSet('tk_settings', settings);
    }
    return true;
  }

  async resetAll() {
    await this.init();
    if (this.db) {
      const tx = this.db.transaction(['account_progress', 'custom_decks', 'study_sessions', 'settings'], 'readwrite');
      tx.objectStore('account_progress').clear();
      tx.objectStore('custom_decks').clear();
      tx.objectStore('study_sessions').clear();
      tx.objectStore('settings').clear();
      await new Promise(resolve => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
    localStorage.removeItem('account_progress');
    localStorage.removeItem('custom_decks');
    localStorage.removeItem('study_sessions');
    localStorage.removeItem('tk_settings');
    return true;
  }

  // --- Fallback helpers ---
  _fallbackGet(key) {
    try {
      const s = localStorage.getItem('tk_backup_' + key);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  _fallbackSet(key, val) {
    try {
      localStorage.setItem('tk_backup_' + key, JSON.stringify(val));
    } catch (e) {}
  }
}

export const db = new DatabaseService();
