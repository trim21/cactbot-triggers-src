import _Conditions from '@trim21/cactbot-types/resources/conditions';
import _ContentType from '@trim21/cactbot-types/resources/content_type';
import _NetRegexes from '@trim21/cactbot-types/resources/netregexes';
import _Regexes from '@trim21/cactbot-types/resources/regexes';
import {
  Responses as _Responses
} from '@trim21/cactbot-types/resources/responses';
import _Outputs from '@trim21/cactbot-types/resources/outputs';
import _Util from '@trim21/cactbot-types/resources/util';
import _ZoneId from '@trim21/cactbot-types/resources/zone_id';
import _ZoneInfo from '@trim21/cactbot-types/resources/zone_info';
import type { RaidbossData } from '@trim21/cactbot-types/types/data';
import type { TriggerSet } from '@trim21/cactbot-types/types/trigger';
import { IOverlayHandler } from '@trim21/cactbot-types/types/event';

declare global {
  const callOverlayHandler: IOverlayHandler;
  // const addOverlayListener: typeof addOverlayListener;
  const Options: {
    PlayerNicks: Record<string, string>;
    Triggers: {
      push<T extends RaidbossData>(item: Omit<TriggerSet<T>, 'initData'> & { initData(): Partial<T> })
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
  // options of modules
  // const RaidbossOptions: typeof _RaidbossOptions;
}
