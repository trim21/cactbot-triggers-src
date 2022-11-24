import type { EventMap, EventType, IOverlayHandler } from 'cactbot/types/event';

import type { BaseTriggerSet } from '@/raidboss/triggers/user_trigger';

type IAddOverlayListener = <T extends EventType>(event: T, cb: EventMap[T]) => void;

type Namazu = (payload: { call: 'PostNamazu'; c: 'command' | 'mark'; p: string }) => Promise<void>;

interface OverlayPlugin {
  (msg: { call: 'saveData'; key: string; data: unknown }): Promise<void>;
  <T = unknown>(msg: { call: 'loadData'; key: string }): Promise<{ data?: T } | undefined>;
}

type Helper<T> = T extends { initData(): infer TriggerData }
  ? T extends BaseTriggerSet<infer BaseData>
    ? BaseTriggerSet<BaseData> & { initData(): TriggerData }
    : never
  : never;

declare global {
  const addOverlayListener: IAddOverlayListener;
  const callOverlayHandler: IOverlayHandler & Namazu & OverlayPlugin;

  const Options: {
    PlayerNicks: Record<string, string>;
    Triggers: {
      push(item: unknown): void;
    };
  };
}
