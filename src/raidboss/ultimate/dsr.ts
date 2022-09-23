import type { RaidbossData } from 'cactbot/data';
import type { TriggerSet } from 'cactbot/trigger';

interface DSRData extends RaidbossData {
  tower: number[];
}

const triggerSet: TriggerSet<DSRData> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData() {
    return { tower: [] }
  },
  triggers: [
    {
      id: 'DSR 收集tower',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6717', '6718', '6719', '671A'] }),
      run: (data, matches) => {
        // 左上0 右上1
        // 左下3 右下2
        let location = Math.round(2 - 2 * Math.atan2(parseFloat(matches.x) - 100, parseFloat(matches.y) - 100) / Math.PI) % 4;
        let id = parseInt(matches.id, 16);
        let wantID = id - 26390;
        data.tower[location] = wantID;
      },
      alertText: (data) => {
        if (data.tower.filter(Boolean).length !== 4) {
          return
        }

        if (data.tower[0] >= 2) {
          return `原地 ${data.tower[0]}`
        }

        if (data.tower[1] >= 3) {
          return `左 ${data.tower[1]}`
        }

        if (data.tower[3] >= 3) {
          return `右 ${data.tower[3]}`
        }

        if (data.tower[2] >= 3) {
          return `对穿 ${data.tower[2]}`
        }
      },
    },
  ]
}

export default triggerSet;
