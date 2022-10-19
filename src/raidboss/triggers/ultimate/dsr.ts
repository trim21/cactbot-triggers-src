import type { PluginCombatantState } from '@trim21/cactbot/types/event';
import type { NetMatches } from '@trim21/cactbot/types/net_matches';
import type { TargetedMatches } from '@trim21/cactbot/types/trigger';
import type { Data as BaseData } from '@trim21/cactbot/ui/raidboss/data/06-ew/ultimate/dragonsongs_reprise_ultimate';

import config, { echoPrefix, sortByJobID } from '@/config/config';
import { jobIDToShow, nameToJobID } from '@/config/job';
import type { MarkType } from '@/raidboss/namazu';
import { clearMark, Command, Commands, Mark } from '@/raidboss/namazu';
import { defineTrigger } from '@/raidboss/triggers/user_trigger';
import { c, p, sleep } from '@/raidboss/utils';

/*

(0, 0)      (100, 0)    (+x, 0)
               A


(0, 100)   (100, 100)



(0, +y)
 */

//  用于跟两个汉字对齐，7个空格
const sep = '       ';

export interface DSRData {
  marked: boolean;
  nameToJobID?: ReturnType<typeof nameToJobID>;
  p5Lightning: Array<{ name: string; jobID: number }>;
  p5DeadCall: Record<string, boolean>;
  tower: Array<{
    num: number;
    target: number;
  }>;

  WhiteDragon: undefined | PluginCombatantState;

  p6Fire: number;

  p6FireSeparation: string[]; // 十字火 分散
  p6FireSharing: string[]; // 十字火 分摊
}

export default defineTrigger<DSRData, BaseData>({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData(): DSRData {
    return {
      marked: false,
      tower: [],
      p5Lightning: [],
      p5DeadCall: {},
      p6FireSeparation: [],
      p6FireSharing: [],
      WhiteDragon: undefined,
      p6Fire: 0,
    };
  },
  timeline: [
    // p6 2冰火
    '3646.9 "say: 黑盾"',
    '3646.9 "say: 铁壁"',
    '3652.9 "say: 30减"',
    // '3663.4 "say: 弃明投暗"',
    // p7
    '4048.4 "say: 铁壁"',
    '4063.9 "say: 30减"',
    '4130 "say: 活死人"',
    '4141 "say: 黑盾"',
    '4142 "say: 奉献"',
    '4143 "say: 弃明投暗"',
    '4176 "say: 黑盾 奉献"',
    `${4202 - 7} "say: 黑盾"`,
    `4203.2 "say: 铁壁"`,
    `4210 "say: 减伤全开"`,
  ],
  timelineTriggers: [
    {
      id: 'DSR P5 三平A',
      regex: /Trinity/,
      beforeSeconds: 5,
      suppressSeconds: 5,
      alertText: '三平A',
    },
    {
      id: 'DSR timeline say',
      regex: /^say: (?<text>.*)$/,
      alertText(data, matches) {
        return matches.text;
      },
    },
  ],
  triggers: [
    {
      id: `DSR Dragon's Rage`,
      disabled: true,
    },
    {
      id: 'DSR p3 八人塔',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6717', '6718', '6719', '671A'] }),
      preRun(data, matches: NetMatches['StartsUsing']) {
        const id = parseInt(matches.id, 16);
        const num = id - 26390;

        const target = parseInt(matches.targetId, 16);

        data.tower.push({ num, target });
      },
      alertText(data) {
        if (data.tower.length !== 4) {
          return;
        }

        const tower = data.tower
          .sort((a: { target: number }, b: { target: number }) => a.target - b.target)
          .map((x) => x.num);

        //  3   1
        //  2   0
        const [rightDown, rightUp, leftDown, leftUp] = tower;
        if (leftUp >= 2) {
          return `原地 ${leftUp}`;
        }

        if (rightUp >= 3) {
          return `左 ${rightUp}`;
        }

        if (leftDown >= 3) {
          return `右 ${leftDown}`;
        }

        if (rightDown >= 3) {
          return `对穿 ${rightDown}`;
        }
      },
    },

    {
      id: 'DSR P5 一运 五连火圈',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B91' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 10,
      alertText: '五连火圈点名',
    },

    {
      id: 'DSR 古代爆震，清除标记',
      disabled: !config.enablePostNamazu,
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C6', source: '骑神托尔丹', capture: false }),
      condition: (data) => data.phase === 'thordan2',
      run(data) {
        if (data.marked) {
          c(clearMark());
          data.marked = false;
        }
      },
    },
    {
      id: 'DSR P5 一运 雷点名',
      disabled: !config.enablePostNamazu,
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8F', source: '暗鳞黑龙' }),
      run(data, matches: TargetedMatches) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = nameToJobID(data);
        }

        data.p5Lightning.push({ name: matches.target, jobID: data.nameToJobID[matches.target] });

        if (data.p5Lightning.length === 2) {
          data.p5Lightning.sort(sortByJobID);
          p(async () => {
            await sleep(1000);
            await Mark({ Name: data.p5Lightning[0].name, MarkType: 'stop1' });
            await sleep(100);
            await Mark({ Name: data.p5Lightning[1].name, MarkType: 'stop2' });
          });
          data.marked = true;
        }
      },
    },
    // {
    //   // This will only fire if you got a marker, so that it's mutually exclusive
    //   // with the "No Marker" trigger above.
    //   id: 'DSR P5 索尼手柄 清除标记',
    //   type: 'HeadMarker',
    //   disabled: !config.enablePostNamazu,
    //   netRegex: NetRegexes.headMarker(),
    //   suppressSeconds: 0.5,
    //   condition: (data, matches) => {
    //     if (data.phase !== 'thordan2') return false;
    //     return playstationHeadmarkerIds.includes(getHeadmarkerId(data, matches));
    //   },
    //   run(data) {
    //     if (data.marked) {
    //       clearMark();
    //       data.marked = false;
    //     }
    //   },
    // },
    {
      id: 'DSR 死宣科技',
      disabled: !config.enablePostNamazu,
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      preRun(data, matches) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = nameToJobID(data);
        }

        data.p5DeadCall[matches.target] = true;

        if (Object.keys(data.p5DeadCall).length === 4) {
          const party = data.party.details.map((v) => ({ name: v.name, jobID: v.job }));
          party.sort(sortByJobID);

          const deadCall: string[] = [];
          const nonDeadCall: string[] = [];

          for (const p of party) {
            if (data.p5DeadCall[p.name]) {
              deadCall.push(jobIDToShow[p.jobID]);
              nonDeadCall.push(sep);
            } else {
              deadCall.push(sep);
              nonDeadCall.push(jobIDToShow[p.jobID]);
            }
          }

          p(async () => {
            await Command(`${echoPrefix} 死宣| ${deadCall.join(' ')}`);
            await sleep(100);
            await Command(`${echoPrefix} 无死| ${nonDeadCall.join(' ')}`);
          });
        }
      },
    },
    {
      id: 'DSR p6 十字火 点名',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({
        effectId: [
          'AC6', // 分散
          'AC7', // 分摊
        ],
        capture: true,
      }),
      alertText(data, matches) {
        if (matches.target !== data.me) {
          return;
        }

        if (matches.effectId === 'AC6') {
          return '分散';
        }
        if (matches.effectId === 'AC7') {
          return '分摊';
        }
      },
      run(data, matches: NetMatches['GainsEffect']) {
        if (matches.effectId === 'AC6') {
          data.p6FireSeparation.push(matches.target);
        }

        if (matches.effectId === 'AC7') {
          data.p6FireSharing.push(matches.target);
        }

        if (data.p6FireSharing.length + data.p6FireSeparation.length !== 6) {
          return;
        }

        p(async function () {
          for (let index = 0; index < data.p6FireSeparation.length; index++) {
            await Mark({ Name: data.p6FireSeparation[index], MarkType: `attack${index + 1}` as MarkType });
          }

          for (let index = 0; index < data.p6FireSharing.length; index++) {
            const name = data.p6FireSharing[index];
            await Mark({ Name: name, MarkType: `bind${index + 1}` as MarkType });
          }

          const names = data.party.details
            .map((x) => x.name)
            .filter((x) => !data.p6FireSeparation.includes(x) && !data.p6FireSharing.includes(x));

          for (let i = 0; i < names.length; i++) {
            await Mark({ Name: names[i], MarkType: `stop${i + 1}` as MarkType });
          }
        });
      },
    },
    {
      id: 'DSR p6 十字火 起跑点',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcBaseId: '13238' }),
      suppressSeconds: 1,
      async promise(data) {
        await sleep(100);
        const WhiteDragon = await callOverlayHandler({ call: 'getCombatants' });
        data.WhiteDragon = WhiteDragon.combatants.filter(
          ({ BNpcID, BNpcNameID }) => BNpcNameID === 4954 && BNpcID === 12613,
        )[0];
      },
      alertText(data, matches) {
        const prefix = `${echoPrefix} 十字火| `;
        data.p6Fire++;
        if (data.p6Fire === 2) {
          if (data.WhiteDragon === undefined) {
            c(Command('/e 圣龙数据为空'));
            return;
          }
          let posX = data.WhiteDragon.PosX;

          // 二火位置
          const y = parseFloat(matches.y);

          // 右半场俯冲
          if (posX >= 100 && y > 106) {
            c(Commands([`■ □ □ `, `□ □ □ `, `□ □ □ `, `左上起跑 (A为12点)`].map((x) => prefix + x)));

            return '右前起跑';
          }
          if (posX >= 100 && y < 106) {
            c(Commands([`□ □ □ `, `□ □ □ `, `■ □ □ `, `左下起跑 (A为12点)`].map((x) => prefix + x)));

            return '左前起跑';
          }

          // 左半场俯冲
          if (posX <= 91 && y > 106) {
            c(Commands([`□ □ ■`, `□ □ □ `, `□ □ □ `, `右上起跑 (A为12点)`].map((x) => prefix + x)));

            return '右后起跑';
          }
          if (posX <= 91 && y < 106) {
            c(Commands([`□ □ □`, `□ □ □`, `□ □ ■`, `右下起跑 (A为12点)`].map((x) => prefix + x)));

            return '左后起跑';
          }
        }
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'cn',
      replaceText: {
        // "Exaflare's Edge": '地火',
        // "Akh Morn's Edge": '分摊',
        // Trinity: '三平A',
        // 'Flames of Ascalon': '钢铁',
        // 'Ice of Ascalon': '月环',
        // "Morn Afah's Edge": '狂暴',
      },
    },
  ],
});
