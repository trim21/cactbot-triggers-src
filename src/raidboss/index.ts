import enable_replace_name_with_job from './name_to_job';
import test from './triggers/test';
import dsr from './triggers/ultimate/dsr';

import { defineTrigger } from '@/raidboss/triggers/user_trigger';

void enable_replace_name_with_job();
console.log('adding user triggers');
void Options.Triggers.push(dsr);
void Options.Triggers.push(test);

// @ts-ignore
Options.Triggers.push(
  defineTrigger<{ trim_meteorite: number[] }>({
    zoneId: ZoneId.DragonsongsRepriseUltimate,
    initData() {
      return {
        trim_meteorite: [],
      };
    },
    triggers: [
      {
        id: 'P7 陨石 重置数据',
        type: 'StartsUsing',
        netRegex: NetRegexes.startsUsing({ id: ['6D9A', '6DD2'] }),
        suppressSeconds: 2,
        delaySeconds: 10,
        // @ts-ignore
        run(data) {
          data.trim_meteorite = [];
        },
      },
      {
        id: 'P7 陨石 顺逆',
        type: 'StartsUsing',
        netRegex: NetRegexes.startsUsing({ id: ['6D9A', '6DD2'] }),
        delaySeconds: 15,
        // @ts-ignore
        alertText(data, matches) {
          let location = (Math.atan2(parseFloat(matches.x) - 100, parseFloat(matches.y) - 100) / Math.PI + 1) % 1;

          if (matches.id === '6D9A') {
            data.trim_meteorite[0] = location;
            return;
          }

          if (matches.id === '6DD2') {
            if (location - data.trim_meteorite[0] > 0) {
              return '陨石往左';
            } else {
              return '陨石往右';
            }
          }
        },
      },
    ],
  }),
);
