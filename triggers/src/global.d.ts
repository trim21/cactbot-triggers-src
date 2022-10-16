import type _Conditions from '@trim21/cactbot-types/resources/conditions';
import type _ContentType from '@trim21/cactbot-types/resources/content_type';
import type _NetRegexes from '@trim21/cactbot-types/resources/netregexes';
import type _Outputs from '@trim21/cactbot-types/resources/outputs';
import type _Regexes from '@trim21/cactbot-types/resources/regexes';
import type { Responses as _Responses } from '@trim21/cactbot-types/resources/responses';
import type _Util from '@trim21/cactbot-types/resources/util';
import type _ZoneId from '@trim21/cactbot-types/resources/zone_id';
import type _ZoneInfo from '@trim21/cactbot-types/resources/zone_info';
import type { RaidbossData } from '@trim21/cactbot-types/types/data';

import type { UserTriggerSet } from './raidboss/triggers/user_trigger';

type Helper<T> = T extends { __helper_user_type?: infer C; __helper_base_type?: infer Base }
  ? Base extends RaidbossData
    ? UserTriggerSet<C, Base>
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
