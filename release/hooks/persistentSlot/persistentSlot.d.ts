import { Slot } from 'rune-hub';
export type PersistentStorage = Record<string, string | null>;
export type PersistentStorageMapItem = Record<string, Slot<string | null>>;
export declare const persistentStorageMap: Map<PersistentStorage, PersistentStorageMapItem>;
export declare function persistentSlot(key: string, storage?: PersistentStorage): Slot<string | null>;
