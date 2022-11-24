import NetRegexes from 'cactbot/resources/netregexes';
import ZoneId from 'cactbot/resources/zone_id';
import type { Data as BaseData } from 'cactbot/ui/raidboss/data/04-sb/ultimate/unending_coil_ultimate';

import { defineTrigger } from '@/raidboss/triggers/user_trigger';

export default defineTrigger<{}, BaseData>({
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  triggers: [
    {
      id: 'UCU Nael Your Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      disabled: true,
      condition(data, matches) {
        return data.me === matches.target;
      },
      durationSeconds(_data, matches) {
        if (parseFloat(matches.duration) <= 6) return 3;
        if (parseFloat(matches.duration) <= 10) return 6;
        return 9;
      },
      suppressSeconds: 20,
      alarmText(_data, matches) {
        if (parseFloat(matches.duration) <= 6) return '死宣一号点名';
        if (parseFloat(matches.duration) <= 10) return '死宣二号点名';
        return '死宣三号点名';
      },
    },
    {
      id: 'UCU Nael Cleanse Callout',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Fang Of Light', id: '26CA', capture: false }),
      infoText(data): string | undefined {
        data.doomCount ??= 0;
        let name;
        if (data.dooms) name = data.dooms[data.doomCount];
        data.doomCount++;
        if (name === data.me) return `解除死宣 ${data.doomCount}: ${data.ShortName(name)}`;
      },
    },
  ],
});
