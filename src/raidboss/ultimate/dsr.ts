import type { RaidbossData } from 'cactbot/data';
import type { TriggerSet } from 'cactbot/trigger';
import { Mark } from '../namazu';

const DisablePostNamazu = true;

interface DSRData extends RaidbossData {
  tower: Array<{
    x: number;
    y: number;
    num: number;
  }>;
}

const triggerSet: TriggerSet<DSRData> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData() {
    return {tower: []};
  },
  triggers: [
    {
      id: 'DSR p2 八人塔',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: ['6717', '6718', '6719', '671A'],
      }),
      preRun: (data, matches) => {
        // 左上0 右上1
        // 左下3 右下2
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);

        let id = parseInt(matches.id, 16);
        const num = id - 26390;

        data.tower.push({x, y, num});
      },
      alertText: (data) => {
        if (data.tower.length !== 4) {
          return;
        }

        // 可能是解析日志的问题，可能游戏机制就这样，有些非常奇怪的塔不在正点。
        // 只有全2的情况能判断要原地
        /*
          [
            {'x': 108.2, 'y': 88.91, 'num': 1},
            {'x': 92.73, 'y': 99.69, 'num': 3},
            {'x': 100.14, 'y': 107.99, 'num': 1},
            {'x': 108.75, 'y': 100.48, 'num': 3}
          ];

          [
            {'x': 92.3, 'y': 90.44, 'num': 1},
            {'x': 93.58, 'y': 99.81, 'num': 3},
            {'x': 99.75, 'y': 106.92, 'num': 1},
            {'x': 106.83, 'y': 99.35, 'num': 3}
          ]

          [
            {'x': 106.1, 'y': 88.3, 'num': 2},
            {'x': 100.39, 'y': 108.05, 'num': 2},
            {'x': 93.77, 'y': 101.03, 'num': 2},
            {'x': 106.65, 'y': 100.08, 'num': 2}
          ]

          [
            {'x': 107.04, 'y': 88.91, 'num': 2},
            {'x': 99.47, 'y': 107.99, 'num': 2},
            {'x': 106.4, 'y': 100.27, 'num': 2},
            {'x': 93.16, 'y': 99.9, 'num': 2},
          ]
        */

        if (!(data.tower[0].x === 108 || data.tower[0].x === 92)) {
          if (data.tower.filter(v => v.num === 2).length === 4) {
            return '原地 2';
          } else {
            return '自行判断';
          }
        }

        const tower = [0, 0, 0, 0];

        for (const {x, y, num} of data.tower) {
          const location = Math.round(2 - (2 * Math.atan2(x - 100, y - 100)) / Math.PI) % 4;
          tower[location] = num;
        }

        if (tower[0] >= 2) {
          return `原地 ${tower[0]}`;
        }

        if (tower[1] >= 3) {
          return `左 ${tower[1]}`;
        }

        if (tower[3] >= 3) {
          return `右 ${tower[3]}`;
        }

        if (tower[2] >= 3) {
          return `对穿 ${tower[2]}`;
        }
      },
    },
    {
      id: 'DSR 死宣科技',
      disabled: DisablePostNamazu,
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({effectId: 'BA0'}),
      run(data, match) {
        const name = (match.target);
        Mark({MarkType: 'attack1', Name: name}).then(r => {
          console.log(r);
        });
      }
    },
  ],
};

export default triggerSet;
