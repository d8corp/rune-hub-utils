import type { Rune } from 'rune-hub';
export type PersistentStorage = Record<string, string | null>;
export type PersistentStorageMapItem = Record<string, Rune<string | null>>;
export declare const persistentStorageMap: Map<PersistentStorage, PersistentStorageMapItem>;
export declare function persistentRune(key: string, storage?: PersistentStorage): Rune<string | null>;
