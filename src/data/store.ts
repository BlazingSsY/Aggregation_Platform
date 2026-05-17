import { useEffect, useState } from 'react';

/** 简单的持久化 store：内存 singleton + localStorage + 订阅
 * 所有使用相同 key 的组件共享同一份数据，跨路由不会丢失。
 */

interface StoreEntry<T> {
  value: T;
  listeners: Set<(v: T) => void>;
}

const stores: Map<string, StoreEntry<unknown>> = new Map();

function getStore<T>(key: string, initial: T): StoreEntry<T> {
  let entry = stores.get(key) as StoreEntry<T> | undefined;
  if (!entry) {
    let value: T = initial;
    try {
      const raw = localStorage.getItem(`aap.store.${key}`);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
    entry = { value, listeners: new Set<(v: T) => void>() };
    stores.set(key, entry as unknown as StoreEntry<unknown>);
  }
  return entry;
}

export function usePersistedState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const store = getStore<T>(key, initial);
  const [value, setValue] = useState<T>(store.value);

  useEffect(() => {
    const listener = (v: T) => setValue(v);
    store.listeners.add(listener);
    // 挂载时同步一次：避免从其他实例错过最新值
    if (store.value !== value) setValue(store.value);
    return () => {
      store.listeners.delete(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const update = (next: T | ((prev: T) => T)) => {
    const computed =
      typeof next === 'function' ? (next as (p: T) => T)(store.value) : next;
    store.value = computed;
    try {
      localStorage.setItem(`aap.store.${key}`, JSON.stringify(computed));
    } catch {
      /* ignore */
    }
    store.listeners.forEach((l) => l(computed));
  };

  return [value, update];
}

/** 清除某个 key 的持久化（开发调试用） */
export function resetPersistedState(key: string) {
  try {
    localStorage.removeItem(`aap.store.${key}`);
  } catch {
    /* ignore */
  }
  stores.delete(key);
}
