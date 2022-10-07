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
import { CactbotLoadUserRet, PluginCombatantState, SavedConfig } from 'cactbot/types/event';

// cactbot extended api

declare global {
  namespace OverlayPlugin {
    function callOverlayHandler(msg: { call: 'broadcast'; source: string; msg: unknown; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'subscribe'; events: string[]; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'getCombatants'; ids?: number[]; names?: string[]; props?: string[]; }): Promise<{ combatants: PluginCombatantState[] }>;
    function callOverlayHandler(msg: { call: 'openWebsiteWithWS'; url: string; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'cactbotReloadOverlays'; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'cactbotLoadUser'; source: string; overlayName: string; }): Promise<{ detail: CactbotLoadUserRet }>;
    function callOverlayHandler(msg: { call: 'cactbotRequestPlayerUpdate'; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'cactbotRequestState'; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'cactbotSay'; text: string; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'cactbotSaveData'; overlay: string; data: unknown; }): Promise<void>;
    function callOverlayHandler(msg: { call: 'cactbotLoadData'; overlay: string; }): Promise<{ data: SavedConfig } | undefined>;
    function callOverlayHandler(msg: { call: 'cactbotChooseDirectory'; }): Promise<{ data: string } | undefined>;
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


