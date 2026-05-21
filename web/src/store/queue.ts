import { create } from 'zustand';

export type QueueSource = 'ONLINE' | 'OFFLINE' | 'QR';
export type QueueStatus = 'Consultation' | 'Queue' | 'Waiting';

export interface QueueEntry {
  id: string;
  token: number;
  patientName: string;
  patientMobile: string;
  source: QueueSource;
  status: QueueStatus;
  joinedAt: string;
}

interface QueueState {
  entries: QueueEntry[];
  setEntries: (e: QueueEntry[]) => void;
  addEntry: (e: QueueEntry) => void;
  advance: () => void;
  skipCurrent: () => void;
}

const sortAndStatus = (list: QueueEntry[]): QueueEntry[] => {
  const sorted = [...list].sort((a, b) => a.token - b.token);
  return sorted.map((e, i) => ({
    ...e,
    status: i === 0 ? 'Consultation' : i === 1 ? 'Queue' : 'Waiting',
  }));
};

// ─── Cross-tab sync via BroadcastChannel ───────────────────────────────────
// The TV display opens in a separate browser tab (target="_blank"), which gets
// its own Zustand store. Without a sync layer, calling `advance()` in the
// dashboard tab would never reach the TV display tab. We use BroadcastChannel
// so every action in any tab is mirrored to all other tabs of the same origin.
//
// Persistence to localStorage is the secondary safety net — if the TV display
// is opened *after* state has been set elsewhere, it can hydrate from storage
// instead of starting empty and waiting for the next message.

const CHANNEL_NAME = 'dh-queue-sync';
const STORAGE_KEY = 'dh-queue-entries';

let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try { channel = new BroadcastChannel(CHANNEL_NAME); } catch { channel = null; }
}

// When applying an entries update that came from another tab (or from storage
// hydration), don't broadcast it back out — that would cause echo loops.
let applyingRemote = false;

const persist = (entries: QueueEntry[]) => {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
};

const broadcast = (entries: QueueEntry[]) => {
  if (applyingRemote) return;
  persist(entries);
  if (channel) {
    try { channel.postMessage({ type: 'sync', entries }); } catch {}
  }
};

const readPersisted = (): QueueEntry[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as QueueEntry[];
  } catch {
    return null;
  }
};

export const useQueue = create<QueueState>((set, get) => {
  // Hydrate from localStorage on first store creation so a freshly-opened TV
  // tab can pick up the queue without waiting for a broadcast.
  const initial = readPersisted() ?? [];

  // Listen for sync messages from other tabs and for hydrate requests.
  if (channel) {
    channel.addEventListener('message', (e) => {
      const msg = e.data as { type?: string; entries?: QueueEntry[] } | null;
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'sync' && Array.isArray(msg.entries)) {
        applyingRemote = true;
        try { set({ entries: msg.entries }); } finally { applyingRemote = false; }
      } else if (msg.type === 'request') {
        // Another tab just opened — respond with our current state so it can
        // hydrate even if localStorage hasn't been written yet.
        const current = get().entries;
        if (current.length > 0) {
          try { channel?.postMessage({ type: 'sync', entries: current }); } catch {}
        }
      }
    });
    // Ask other tabs for their current state. Useful when a tab loads with an
    // empty localStorage but another tab already has live entries in memory.
    setTimeout(() => {
      try { channel?.postMessage({ type: 'request' }); } catch {}
    }, 50);
  }

  return {
    entries: initial,
    setEntries: (e) => {
      const next = sortAndStatus(e);
      set({ entries: next });
      broadcast(next);
    },
    addEntry: (e) => {
      const next = sortAndStatus([...get().entries, e]);
      set({ entries: next });
      broadcast(next);
    },
    advance: () => {
      const next = sortAndStatus(get().entries.slice(1));
      set({ entries: next });
      broadcast(next);
    },
    skipCurrent: () => {
      const [first, ...rest] = get().entries;
      if (!first) return;
      const next = sortAndStatus([...rest, first]);
      set({ entries: next });
      broadcast(next);
    },
  };
});
