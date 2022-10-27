import type { RaidbossData } from 'cactbot/types/data';
import type { EventMap, EventType, IOverlayHandler } from 'cactbot/types/event';

import type { UserTriggerSet } from '@/raidboss/triggers/user_trigger';

type Helper<T> = T extends { __helper_user_type?: infer C; __helper_base_type?: infer Base }
  ? Base extends RaidbossData
    ? UserTriggerSet<C, Base>
    : never
  : never;

type IAddOverlayListener = <T extends EventType>(event: T, cb: EventMap[T]) => void;

interface Namazu {
  (payload: { call: 'PostNamazu'; c: 'command' | 'mark'; p: string }): Promise<void>;
}

interface OverlayPlugin {
  (msg: { call: 'saveData'; key: string; data: unknown }): Promise<void>;
  <T = unknown>(msg: { call: 'loadData'; key: string }): Promise<{ data?: T } | undefined>;
}

declare global {
  const addOverlayListener: IAddOverlayListener;
  const callOverlayHandler: IOverlayHandler & Namazu & OverlayPlugin;

  const Options: {
    PlayerNicks: Record<string, string>;
    Triggers: {
      push<T>(item: T extends Helper<T> ? T : never): T;
      push<T = {}, Base extends RaidbossData = RaidbossData>(trigger: UserTriggerSet<T, Base>): void;
    };
  };
}
