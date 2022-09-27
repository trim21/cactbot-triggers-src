import { RaidbossData } from 'cactbot/data';
import { TriggerSet } from 'cactbot/trigger';

export type UserTriggerSet<T, Base extends RaidbossData> = (keyof T & keyof Base) extends never ?
  Omit<TriggerSet<T & Base>, 'initData'>
  & { initData(): T } : never

export function defineTrigger<T, Base extends RaidbossData>(trigger: UserTriggerSet<T, Base>): UserTriggerSet<T, Base> {
  return trigger;
}
