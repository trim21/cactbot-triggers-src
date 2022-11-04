import type { RaidbossData } from 'cactbot/types/data';
import type { NetMatches } from 'cactbot/types/net_matches';
import type { NetParams } from 'cactbot/types/net_props';
import type { TriggerTypes } from 'cactbot/types/net_trigger';
import type { TimelineField, ResponseField, TriggerField, TriggerOutput } from 'cactbot/types/trigger';

export type BaseTrigger<Data extends RaidbossData, T extends TriggerTypes> = {
  id: string;
  disabled?: boolean;
  condition?: TriggerField<Data, NetMatches[T], boolean | undefined>;
  preRun?: TriggerField<Data, NetMatches[T], void>;
  delaySeconds?: TriggerField<Data, NetMatches[T], number>;
  // Leave undefined to preserve defaults and default overrides
  durationSeconds?: TriggerField<Data, NetMatches[T], number | undefined>;
  suppressSeconds?: TriggerField<Data, NetMatches[T], number>;
  promise?: TriggerField<Data, NetMatches[T], Promise<void>>;
  response?: ResponseField<Data, NetMatches[T]>;
  alarmText?: TriggerField<Data, NetMatches[T], TriggerOutput<Data, NetMatches[T]>>;
  alertText?: TriggerField<Data, NetMatches[T], TriggerOutput<Data, NetMatches[T]>>;
  infoText?: TriggerField<Data, NetMatches[T], TriggerOutput<Data, NetMatches[T]>>;
  run?: TriggerField<Data, NetMatches[T], void>;
};

export type BaseNetRegexTrigger<Data extends RaidbossData, T extends TriggerTypes> = BaseTrigger<Data, T> & {
  type: T;
  netRegex: NetParams[T];
};

type DisabledTrigger = {
  id: string;
  disabled: true;
};

export type NetRegexTrigger<Data extends RaidbossData> =
  | BaseNetRegexTrigger<Data, 'StartsUsing'>
  | BaseNetRegexTrigger<Data, 'Ability'>
  | BaseNetRegexTrigger<Data, 'GainsEffect'>
  | BaseNetRegexTrigger<Data, 'AddedCombatant'>;

export type TimelineTrigger<Data extends RaidbossData> = BaseTrigger<Data, 'None'> & {
  regex: RegExp;
  beforeSeconds?: number;
};

export type BaseTriggerSet<Data extends RaidbossData> = {
  zoneId: number[] | number | null;

  timeline?: TimelineField;
  triggers?: (NetRegexTrigger<Data> | DisabledTrigger)[];
  timelineTriggers?: TimelineTrigger<Data>[];
};

// T and Base are not allowed to have same properties.
export type UserTriggerSet<T, Base extends RaidbossData> = keyof T & keyof Base extends never
  ? BaseTriggerSet<T & Base> & (keyof T extends never ? {} : { initData(): T })
  : never;

export function defineTrigger<T, Base extends RaidbossData = RaidbossData>(
  trigger: UserTriggerSet<T, Base>,
): UserTriggerSet<T, Base> {
  return trigger;
}
