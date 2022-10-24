import enable_replace_name_with_job from './name_to_job';
import dsr from './triggers/ultimate/dsr';

void enable_replace_name_with_job();
console.log('adding user triggers');
void Options.Triggers.push(dsr);

Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData() {
    return {
      trim_meteorite: [] as number[],
    };
  },
  triggers: [
    {
      id: 'P7 陨石 重置数据',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D9A', '6DD2'] }),
      suppressSeconds: 2,
      delaySeconds: 10,
      run(data) {
        data.trim_meteorite = [];
      },
    },
    {
      id: 'P7 陨石 顺逆',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D9A', '6DD2'] }),
      delaySeconds: 15,
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
});
