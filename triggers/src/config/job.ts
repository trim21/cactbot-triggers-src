export const jobIDToCN: Record<string, string> = {
  20: '武僧',
  21: '战士',
  23: '诗人',
  19: '骑士',
  24: '白魔',
  25: '黑魔',
  27: '召唤',
  22: '龙骑',
  28: '学者',
  30: '忍者',
  31: '机工',
  32: 'DK',
  33: '占星',
  34: '武士',
  35: '赤魔',
  36: '青魔',
  37: '枪刃',
  38: '舞者',
  39: '镰刀',
  40: '贤者',
} as const;

export const jobIDToShow: Record<string, string> = {
  ...jobIDToCN,
  32: '黑骑',
} as const;

import type PartyTracker from 'cactbot/resources/party';

export function nameToJobID(data: { party: PartyTracker; }): Record<string, number> {
  return Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
}
