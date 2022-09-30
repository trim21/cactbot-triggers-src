import { clearMark, Mark, MarkType } from '../namazu';
import type { NetMatches } from 'cactbot/types/net_matches';
import { UnreachableCode } from 'cactbot/resources/not_reached';
import type { Data as BaseData } from 'cactbot/ui/raidboss/data/06-ew/ultimate/dragonsongs_reprise_ultimate';
import { defineTrigger } from '../user_trigger';

const EnablePostNamazu = false;

interface DSRData {
  marked: boolean;
  nameToJobID?: Record<string, number>;
  p5Lightning: Array<{ name: string; jobID: number }>;
  p5DeadCall: Array<{ name: string; jobID: number }>;
  tower: Array<{
    num: number;
    targetID: number;
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
        let id = parseInt(matches.id, 16);
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
      id: 'DSR 古代爆震，清除标记',
      disabled: DisablePostNamazu,
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: '63C6',
        source: 'King Thordan',
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
      disabled: DisablePostNamazu,
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8F', source: 'Darkscale' }),
      run(data, matches: NetMatches['Ability']) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
        }

        data.p5Lightning.push({
          name: matches.target,
          jobID: data.nameToJobID[matches.target],
        });

        if (data.p5Lightning.length === 2) {
          data.p5Lightning.sort(jobSorter);
          Mark({ Name: data.p5Lightning[0].name, MarkType: 'stop1' });
          Mark({ Name: data.p5Lightning[1].name, MarkType: 'stop2' });
          data.marked = true;
        }
      },
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
      disabled: DisablePostNamazu,
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      preRun(data, matches) {
        if (data.nameToJobID === undefined) {
          data.nameToJobID = Object.fromEntries(data.party.details.map((v) => [v.name, v.job]));
        }

        data.p5DeadCall.push({
          name: matches.target,
          jobID: data.nameToJobID[matches.target],
        });

        if (data.p5DeadCall.length === 4) {
          data.p5DeadCall.sort(jobSorter);

          data.p5DeadCall.forEach((el, index) => {
            Mark({ Name: el.name, MarkType: `attack${index + 1}` as MarkType });
          });
          data.marked = true;
        }
      },
    },
  ],
});

function jobSorter<T extends { jobID: number }>(a: T, b: T): number {
  return jobOrder[a.jobID] - jobOrder[b.jobID];
}

const jobOrder: Record<number, number> = Object.fromEntries(
  [
    21, // '战士',
    32, //'DK',

    37, //'枪刃',
    19, //'骑士',

    24, //'白魔',
    33, //'占星',
    40, //'贤者',
    28, //'学者',

    22, //'龙骑',
    34, //'武士',

    30, //'忍者',
    20, //'武僧',
    25, //'黑魔',
    39, //'钐刀',

    23, //'诗人',
    31, //'机工',
    38, //'舞者',

    35, //'赤魔',
    27, //'召唤',
  ].map((v, i) => [v, i])
);

console.log(jobOrder);

const getHeadmarkerId = (data: BaseData, matches: NetMatches['HeadMarker'], firstDecimalMarker?: number) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined) throw new UnreachableCode();
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
