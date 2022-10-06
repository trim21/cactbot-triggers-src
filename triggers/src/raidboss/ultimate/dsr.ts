import { clearMark, Command, Mark, MarkType } from '../namazu';
import type { NetMatches } from 'cactbot/types/net_matches';
import type { Data as BaseData } from 'cactbot/ui/raidboss/data/06-ew/ultimate/dragonsongs_reprise_ultimate';
import { defineTrigger } from '../user_trigger';
import config, { sortByJobID } from '../config';
import { getHeadmarkerId, sleep } from '../utils';
import { PluginCombatantState } from 'cactbot/types/event';

/*

(0, 0)      (100, 0)    (+x, 0)
               A


(0, 100)   (100, 100)



(0, +y)
 */


interface DSRData {
  marked: boolean;
  nameToJobID?: Record<string, number>;
  p5Lightning: Array<{ name: string; jobID: number }>;
  p5DeadCall: Array<{ name: string; jobID: number }>;
  tower: Array<{
    num: number;
    targetID: number;
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
      p5DeadCall: [],
      p6FireSeparation: [],
      p6FireSharing: [],
      WhiteDragon: undefined,
      p6Fire: 0,
    };
  },
  triggers: [
    {
      id: 'DSR p3 八人塔',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6717', '6718', '6719', '671A'] }),
      preRun: (data, matches) => {
        const id = parseInt(matches.id, 16);
        const num = id - 26390;

        const targetID = parseInt(matches.targetId, 16);

        data.tower.push({ num, targetID });
      },

      alertText: (data) => {
        if (data.tower.length !== 4) {
          return;
        }

        data.tower.sort((a, b) => a.targetID - b.targetID);

        const tower = data.tower.map((x) => x.num);

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
      id: 'DSR p6 火球',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcBaseId: '13238' }),
      suppressSeconds: 1,
      promise: async (data) => {
        const WhiteDragon = await callOverlayHandler({ call: 'getCombatants' });
        data.WhiteDragon = WhiteDragon.combatants.filter((boss) => boss.BNpcNameID === 4954 && boss.BNpcID == 12613)[0];
      },
      alertText: (data, matches) => {
        data.p6Fire++;
        if (data.p6Fire === 2) {
          if (data.WhiteDragon === undefined) {
            Command('/e 圣龙数据为空');
            return;
          }
          let posX = data.WhiteDragon.PosX;

          // 二火位置
          const y = parseFloat(matches.y);

          // 右半场俯冲
          if (posX >= 100 && y > 106) {
            Command('/p 左上安全 (A为12点)');
            return '左上安全';
          }
          if (posX >= 100 && y < 106) {
            Command('/p 左下安全 (A为12点)');
            return '左下安全';
          }

          // 左半场俯冲
          if (posX <= 91 && y > 106) {
            Command('/p 右上安全 (A为12点)');
            return '右上安全';
          }
          if (posX <= 91 && y < 106) {
            Command('/p 右下安全 (A为12点)');
            return '右下安全';
          }
        }
      },
    },

    {
      id: 'DSR 古代爆震，清除标记',
      disabled: !config.enablePostNamazu,
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: '63C6',
        source: '骑神托尔丹',
        capture: false,
      }),
      condition: (data) => data.phase === 'thordan2',
      run(data) {
        if (data.marked) {
          clearMark();
          data.marked = false;
        }
      },
    },
    {
      id: 'DSR P5 一运 雷点名',
      disabled: !config.enablePostNamazu,
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8F', source: '暗鳞黑龙' }),
      run(data, matches: NetMatches['Ability']) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
        }

        data.p5Lightning.push({ name: matches.target, jobID: data.nameToJobID[matches.target] });

        if (data.p5Lightning.length === 2) {
          data.p5Lightning.sort(sortByJobID);
          (async () => {
            await Mark({ Name: data.p5Lightning[0].name, MarkType: 'stop1' });
            await sleep(100);
            await Mark({ Name: data.p5Lightning[1].name, MarkType: 'stop2' });
          })();
          data.marked = true;
        }
      },
    },
    {
      // This will only fire if you got a marker, so that it's mutually exclusive
      // with the "No Marker" trigger above.
      id: 'DSR P5 索尼手柄 清除标记',
      type: 'HeadMarker',
      disabled: !config.enablePostNamazu,
      netRegex: NetRegexes.headMarker(),
      suppressSeconds: 0.5,
      condition: (data, matches) => {
        if (data.phase !== 'thordan2') return false;
        return playstationHeadmarkerIds.includes(getHeadmarkerId(data, matches));
      },
      run(data) {
        if (data.marked) {
          clearMark();
          data.marked = false;
        }
      },
    },
    {
      id: 'DSR 死宣科技',
      disabled: !config.enablePostNamazu,
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      preRun(data, matches) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
        }

        data.p5DeadCall.push({ name: matches.target, jobID: data.nameToJobID[matches.target] });

        if (data.p5DeadCall.length === 4) {
          data.p5DeadCall.sort(sortByJobID);

          (async () => {
            for (let i = 0; i < data.p5DeadCall.length; i++) {
              await sleep(100);
              await Mark({ Name: data.p5DeadCall[i].name, MarkType: `attack${i + 1}` as MarkType });
            }
          })();

          data.marked = true;
        }
      },
    },
    {
      id: 'DSR p6 十字火 收集点名',
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
      run: (data, matches: NetMatches['GainsEffect']) => {
        if (matches.effectId === 'AC6') {
          data.p6FireSeparation.push(matches.target);
        }

        if (matches.effectId === 'AC7') {
          data.p6FireSharing.push(matches.target);
        }


        if (data.p6FireSharing.length + data.p6FireSeparation.length !== 6) {
          return;
        }


        data.p6FireSeparation.forEach((name, index) => {
          Mark({ Name: name, MarkType: `attack${index + 1}` as MarkType });
        });

        data.p6FireSharing.forEach((name, index) => {
          Mark({ Name: name, MarkType: `bind${index + 1}` as MarkType });
        });

        data.party.details.map(x => x.name)
          .filter(x => !data.p6FireSeparation.includes(x))
          .filter(x => !data.p6FireSharing.includes(x))
          .forEach((name, i) => {
            Mark({ Name: name, MarkType: `stop${i + 1}` as MarkType });
          });
      },
    },
  ],
});

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  hyperdimensionalSlash: '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  firechainCircle: '0119',
  firechainTriangle: '011A',
  firechainSquare: '011B',
  firechainX: '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  skywardTriple: '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  sword1: '0032',
  sword2: '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  meteor: '011D',
  // vfx/lockon/eff/r1fz_lockon_num01_s5x.avfx through num03
  dot1: '013F',
  dot2: '0140',
  dot3: '0141',
  // vfx/lockon/eff/m0005sp_19o0t.avfx
  skywardSingle: '000E',
  // vfx/lockon/eff/bahamut_wyvn_glider_target_02tm.avfx
  cauterize: '0014',
} as const;

const playstationHeadmarkerIds: readonly string[] = [
  headmarkers.firechainCircle,
  headmarkers.firechainTriangle,
  headmarkers.firechainSquare,
  headmarkers.firechainX,
] as const;
