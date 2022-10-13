import _Conditions from 'cactbot/resources/conditions';
import _ContentType from 'cactbot/resources/content_type';
import _NetRegexes from 'cactbot/resources/netregexes';
import _Outputs from 'cactbot/resources/outputs';
import _Regexes from 'cactbot/resources/regexes';
import { Responses as _Responses } from 'cactbot/resources/responses';
import _Util from 'cactbot/resources/util';
import _ZoneId from 'cactbot/resources/zone_id';
import _ZoneInfo from 'cactbot/resources/zone_info';
import type { TriggerSet, BaseTriggerSet } from 'cactbot/types/trigger';

type Helper<T> = T extends { initData(): infer D }
  ? T extends BaseTriggerSet<infer K>
    ? Omit<TriggerSet<Exclude<K, keyof D>>, 'initData'> & { initData(): D }
    : never
  : never;

declare global {
  const Options: {
    PlayerNicks: Record<string, string>;
    Triggers: {
      push<T>(item: T extends Helper<T> ? T : never): T;
      // push<T, Base extends RaidbossData>(trigger: UserTriggerSet<T, Base>): void;
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
