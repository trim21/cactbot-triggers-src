export interface PluginCombatantState {
  CurrentWorldID?: number;
  WorldID?: number;
  WorldName?: string;
  BNpcID?: number;
  BNpcNameID?: number;
  PartyType?: number;
  ID?: number;
  OwnerID?: number;
  type?: number;
  Job?: number;
  Level?: number;
  Name?: string;
  CurrentHP: number;
  MaxHP: number;
  CurrentMP: number;
  MaxMP: number;
  PosX: number;
  PosY: number;
  PosZ: number;
  Heading: number;
}

export interface Party {
  id: string;
  name: string;
  worldId: number;
  job: number;
  inParty: boolean;
}

export interface IAddOverlayListener {
  (event: 'LogLine', cb: (ev: { type: 'LogLine'; line: string[]; rawLine: string; }) => void): void;
  (event: 'PartyChanged', cb: (ev: { type: 'PartyChanged'; party: Party[]; }) => void): void;
}

export interface ICallOverlayHandler {
  (msg: { call: 'saveData'; key: string; data: unknown }): Promise<void>;
  <T = unknown>(msg: { call: 'loadData'; key: string; }): Promise<({ data?: T } | undefined)>;
  (msg: { call: 'getCombatants'; ids?: number[]; names?: string[]; props?: string[]; }): Promise<{ combatants: PluginCombatantState[] }>;
  (msg: { call: 'broadcast'; source: string; msg: unknown; }): Promise<void>;
  (msg: { call: 'subscribe'; events: string[]; }): Promise<void>;
  (msg: { call: 'openWebsiteWithWS'; url: string; }): Promise<void>;
}

export const addOverlayListener: IAddOverlayListener;
export const callOverlayHandler: ICallOverlayHandler;

