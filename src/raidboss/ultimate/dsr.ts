import { clearMark, Command, Mark, MarkType } from '../namazu';
import { Matches, NetMatches } from 'cactbot/net_matches';
import NetRegexes from '../../../cactbot/resources/netregexes';
import { UnreachableCode } from '../../../cactbot/resources/not_reached';
import {
  Data as BaseData,
} from '../../../cactbot/ui/raidboss/data/06-ew/ultimate/dragonsongs_reprise_ultimate';
import { defineTrigger, UserTriggerSet } from '../cactbot';

const EnablePostNamazu = false;

interface DSRData {
  marked: boolean;
  nameToJobID?: Record<string, number>,
  p5Lightning: Array<{ name: string, jobID: number }>;
  p5DeadCall: Array<{ name: string, jobID: number }>;
  tower: Array<{
    x: number;
    y: number;
    num: number;
  }>;
}

const DisablePostNamazu = !EnablePostNamazu;

export default defineTrigger<DSRData, BaseData>({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData() {
    return {
      marked: false,
      tower: [],
      p5Lightning: [],
      p5DeadCall: [],
    };
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
      id: 'DSR 古代爆震，清除标记',
      disabled: DisablePostNamazu,
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: '63C6',
        source: 'King Thordan',
        capture: false
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
      disabled: DisablePostNamazu,
      type: 'Ability',
      netRegex: NetRegexes.ability({id: '6B8F', source: 'Darkscale'}),
      run(data, matches: NetMatches['Ability']) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
        }

        data.p5Lightning.push({
          name: matches.target,
          jobID: data.nameToJobID[matches.target]
        });

        if (data.p5Lightning.length === 2) {
          data.p5Lightning.sort(jobSorter);
          Mark({Name: data.p5Lightning[0].name, MarkType: 'stop1'});
          Mark({Name: data.p5Lightning[1].name, MarkType: 'stop2'});
          data.marked = true;
        }
      }
    },
    {
      // This will only fire if you got a marker, so that it's mutually exclusive
      // with the "No Marker" trigger above.
      id: 'DSR P5 索尼手柄 清除标记',
      type: 'HeadMarker',
      disabled: DisablePostNamazu,
      netRegex: NetRegexes.headMarker(),
      suppressSeconds: 0.5,
      condition: (data, matches) => {
        if (data.phase !== 'thordan2')
          return false;
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
      disabled: DisablePostNamazu,
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({effectId: 'BA0'}),
      preRun(data, matches) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
        }

        data.p5DeadCall.push({
          name: matches.target,
          jobID: data.nameToJobID[matches.target]
        });

        if (data.p5DeadCall.length === 4) {
          data.p5DeadCall.sort(jobSorter);

          data.p5DeadCall.forEach((el, index) => {
            Mark({Name: el.name, MarkType: `attack${index + 1}` as MarkType});
          });
          data.marked = true;
        }
      }
    },
  ],
});

function jobSorter<T extends { jobID: number }>(a: T, b: T): number {
  return jobOrder[a.jobID] - jobOrder[b.jobID];
}

const jobOrder: Record<number, number> = Object.fromEntries([
  21,// '战士',
  32,//'DK',

  37,//'枪刃',
  19,//'骑士',

  24,//'白魔',
  33,//'占星',
  40,//'贤者',
  28,//'学者',

  22,//'龙骑',
  34,//'武士',

  30,//'忍者',
  20,//'武僧',
  25,//'黑魔',
  39,//'钐刀',

  23,//'诗人',
  31,//'机工',
  38,//'舞者',

  35,//'赤魔',
  27,//'召唤',
].map((v, i) => [v, i]));

console.log(jobOrder);

const getHeadmarkerId = (data: BaseData, matches: NetMatches['HeadMarker'], firstDecimalMarker?: number) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined)
      throw new UnreachableCode();
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  'hyperdimensionalSlash': '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  'firechainCircle': '0119',
  'firechainTriangle': '011A',
  'firechainSquare': '011B',
  'firechainX': '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  'skywardTriple': '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  'sword1': '0032',
  'sword2': '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  'meteor': '011D',
  // vfx/lockon/eff/r1fz_lockon_num01_s5x.avfx through num03
  'dot1': '013F',
  'dot2': '0140',
  'dot3': '0141',
  // vfx/lockon/eff/m0005sp_19o0t.avfx
  'skywardSingle': '000E',
  // vfx/lockon/eff/bahamut_wyvn_glider_target_02tm.avfx
  'cauterize': '0014',
} as const;

const playstationHeadmarkerIds: readonly string[] = [
  headmarkers.firechainCircle,
  headmarkers.firechainTriangle,
  headmarkers.firechainSquare,
  headmarkers.firechainX,
] as const;
