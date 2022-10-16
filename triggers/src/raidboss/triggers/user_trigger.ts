import type { RaidbossData } from '@trim21/cactbot-types/types/data';
import type { TriggerSet } from '@trim21/cactbot-types/types/trigger';

// T and Base are not allowed to have same properties.
export type UserTriggerSet<T, Base extends RaidbossData> = keyof T & keyof Base extends never
  ? Omit<TriggerSet<T & Base>, 'initData'> &
      (keyof T extends never ? {} : { initData(): T }) & {
        __helper_user_type?: T;
        __helper_base_type?: Base;
      }
  : never;

export function defineTrigger<T = {}, Base extends RaidbossData = RaidbossData>(
  trigger: UserTriggerSet<T, Base>,
): UserTriggerSet<T, Base> {
  return trigger;
}
