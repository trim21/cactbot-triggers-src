import type _Conditions from '@trim21/cactbot/resources/conditions';
import type _ContentType from '@trim21/cactbot/resources/content_type';
import type _NetRegexes from '@trim21/cactbot/resources/netregexes';
import type _Outputs from '@trim21/cactbot/resources/outputs';
import type _Regexes from '@trim21/cactbot/resources/regexes';
import type { Responses as _Responses } from '@trim21/cactbot/resources/responses';
import type _Util from '@trim21/cactbot/resources/util';
import type _ZoneId from '@trim21/cactbot/resources/zone_id';
import type _ZoneInfo from '@trim21/cactbot/resources/zone_info';
import type { RaidbossData } from '@trim21/cactbot/types/data';
import type { EventMap, EventType, IOverlayHandler } from '@trim21/cactbot/types/event';

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
  // Global variables
  const Conditions: typeof _Conditions;
  const ContentType: typeof _ContentType;
  const NetRegexes: typeof _NetRegexes;
  const Regexes: typeof _Regexes;
  const Responses: typeof _Responses;
  const Outputs: typeof _Outputs;
  const Util: typeof _Util;
  const ZoneId: typeof _ZoneId;
  const ZoneInfo: typeof _ZoneInfo;
}
