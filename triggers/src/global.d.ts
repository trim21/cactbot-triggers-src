import _Conditions from 'cactbot/resources/conditions';
import _ContentType from 'cactbot/resources/content_type';
import _NetRegexes from 'cactbot/resources/netregexes';
import _Regexes from 'cactbot/resources/regexes';
import { Responses as _Responses } from 'cactbot/resources/responses';
import _Outputs from 'cactbot/resources/outputs';
import _Util from 'cactbot/resources/util';
import _ZoneId from 'cactbot/resources/zone_id';
import _ZoneInfo from 'cactbot/resources/zone_info';
import type { RaidbossData } from 'cactbot/types/data';
import type { TriggerSet } from 'cactbot/types/trigger';
import { CactbotLoadUserRet, SavedConfig } from 'cactbot/types/event';

// cactbot extended api

declare module 'overlay-plugin' {
  interface ICallOverlayHandler {
    (msg: { call: 'cactbotReloadOverlays'; }): Promise<void>;
    (msg: { call: 'cactbotReloadOverlays'; }): Promise<void>;
    (msg: { call: 'cactbotLoadUser'; source: string; overlayName: string; }): Promise<{ detail: CactbotLoadUserRet }>;
    (msg: { call: 'cactbotRequestPlayerUpdate'; }): Promise<void>;
    (msg: { call: 'cactbotRequestState'; }): Promise<void>;
    (msg: { call: 'cactbotSay'; text: string; }): Promise<void>;
    (msg: { call: 'cactbotSaveData'; overlay: string; data: unknown; }): Promise<void>;
    (msg: { call: 'cactbotLoadData'; overlay: string; }): Promise<{ data: SavedConfig } | undefined>;
    (msg: { call: 'cactbotChooseDirectory'; }): Promise<{ data: string } | undefined>;
  }
}

declare global {
  const Options: {
    PlayerNicks: Record<string, string>;
    Triggers: {
      push<T extends RaidbossData>(item: Omit<TriggerSet<T>, 'initData'> & { initData(): Partial<T> }): void;
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


