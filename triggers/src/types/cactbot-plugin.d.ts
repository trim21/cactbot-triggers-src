import type {} from 'overlay-plugin';
import type { SavedConfig } from '@trim21/cactbot/types/event';

declare module 'overlay-plugin' {
  interface ICallOverlayHandler {
    (msg: { call: 'cactbotReloadOverlays' }): Promise<void>;
    (msg: { call: 'cactbotRequestPlayerUpdate' }): Promise<void>;
    (msg: { call: 'cactbotRequestState' }): Promise<void>;
    (msg: { call: 'cactbotSay'; text: string }): Promise<void>;
    (msg: { call: 'cactbotSaveData'; overlay: string; data: unknown }): Promise<void>;
    (msg: { call: 'cactbotLoadData'; overlay: string }): Promise<{ data: SavedConfig } | undefined>;
    (msg: { call: 'cactbotChooseDirectory' }): Promise<{ data: string } | undefined>;
  }
}
