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
  skywardLeap: '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  sword1: '0032',
  sword2: '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  meteor: '011D',
  majiang1: '013F',
  majiang2: '0140',
  majiang3: '0141',
  lanbiao: '000E',
  fuchong: '0014',
};

function nametocnjob(name, data) {
  let re;
  switch (data.party.jobName(name)) {
    case 'PLD':
      re = '骑士';
      break;
    case 'MNK':
      re = '武僧';
      break;
    case 'WAR':
      re = '战士';
      break;
    case 'DRG':
      re = '龙骑';
      break;
    case 'BRD':
      re = '诗人';
      break;
    case 'WHM':
      re = '白魔';
      break;
    case 'BLM':
      re = '黑魔';
      break;
    case 'SMN':
      re = '召唤';
      break;
    case 'SCH':
      re = '学者';
      break;
    case 'NIN':
      re = '忍者';
      break;
    case 'MCH':
      re = '机工';
      break;
    case 'DRK':
      re = '黑骑';
      break;
    case 'AST':
      re = '占星';
      break;
    case 'SAM':
      re = '武士';
      break;
    case 'RDM':
      re = '赤魔';
      break;
    case 'GNB':
      re = '枪刃';
      break;
    case 'DNC':
      re = '舞者';
      break;
    case 'RPR':
      re = '镰刀';
      break;
    case 'SGE':
      re = '贤者';
      break;
    case 'BLU':
      re = '青魔';
      break;
    default:
      re = name;
      break;
  }
  // 如果有重复职业，则播报职业+ID
  // t同职业
  if (data.party.roleToPartyNames_.tank[0] === data.party.roleToPartyNames_.tank[1]) {
    return re + ' ' + data.ShortName(name);
  }
  // H同职业
  if (data.party.roleToPartyNames_.healer[0] === data.party.roleToPartyNames_.healer[1]) {
    return re + ' ' + data.ShortName(name);
  }
  // DPS同职业
  for (let i = 0; i < 3; i++) {
    for (let a = 1; a < 4; a++) {
      if (i === a) {
        continue;
      }
      if (data.party.roleToPartyNames_.dps[i] === data.party.roleToPartyNames_.dps[a]) {
        return re + ' ' + data.ShortName(name);
      }
    }
  }
  // 没有同职业，播报职业
  return re;
}

let shunxu = [
  {
    job: '白魔',
    order: 16,
  },
  {
    job: '占星',
    order: 17,
  },
  {
    job: '贤者',
    order: 18,
  },
  {
    job: '学者',
    order: 19,
  },
  {
    job: '战士',
    order: 12,
  },
  {
    job: '枪刃',
    order: 13,
  },
  {
    job: '黑骑',
    order: 12,
  },
  {
    job: '骑士',
    order: 15,
  },
  {
    job: '武士',
    order: 1,
  },
  {
    job: '武僧',
    order: 2,
  },
  {
    job: '镰刀',
    order: 3,
  },
  {
    job: '忍者',
    order: 4,
  },
  {
    job: '龙骑',
    order: 5,
  },
  {
    job: '黑魔',
    order: 6,
  },
  {
    job: '诗人',
    order: 7,
  },
  {
    job: '舞者',
    order: 8,
  },
  {
    job: '机工',
    order: 9,
  },
  {
    job: '召唤',
    order: 10,
  },
  {
    job: '赤魔',
    order: 11,
  },
];
let shunxu2 = [
  {
    job: '白魔',
    order: 5,
  },
  {
    job: '占星',
    order: 6,
  },
  {
    job: '贤者',
    order: 7,
  },
  {
    job: '学者',
    order: 8,
  },
  {
    job: '战士',
    order: 1,
  },
  {
    job: '枪刃',
    order: 3,
  },
  {
    job: '黑骑',
    order: 1,
  },
  {
    job: '骑士',
    order: 4,
  },
  {
    job: '武士',
    order: 9,
  },
  {
    job: '武僧',
    order: 10,
  },
  {
    job: '镰刀',
    order: 11,
  },
  {
    job: '龙骑',
    order: 13,
  },
  {
    job: '忍者',
    order: 12,
  },
  {
    job: '黑魔',
    order: 14,
  },
  {
    job: '诗人',
    order: 15,
  },
  {
    job: '舞者',
    order: 16,
  },
  {
    job: '机工',
    order: 17,
  },
  {
    job: '召唤',
    order: 18,
  },
  {
    job: '赤魔',
    order: 19,
  },
];

const getOneMark = (i = 4) => {
  let aPos = camera.ONE;
  if (!aPos.Active) {
    return false;
  }
  let 位置 = 0;
  if (i === 4) {
    位置 = Math.round(2 - (2 * Math.atan2(aPos.X - 100, aPos.Z - 100)) / Math.PI) % 4;
  }
  if (i === 8) {
    位置 = Math.round(4 - (4 * Math.atan2(aPos.X - 100, aPos.Z - 100)) / Math.PI) % 8;
  }
  return 位置;
};
const getCamera = (i = 8) => {
  if (i === 8) {
    return Math.round(4 - (4 * camera.camera.currentHRotation) / Math.PI + 4) % 8;
  }
  if (i === 4) {
    return Math.round(2 - (2 * camera.camera.currentHRotation) / Math.PI + 2) % 4;
  }
};
// 如果不需要改成false
let 打开队伍播放 = false;

const sendMark = (ActorID, MarkType, 是否标记 = 打开队伍播放) => {
  if (是否标记) {
    callOverlayHandler({
      call: 'PostNamazu',
      c: 'mark',
      p: '{"ActorID":0x' + ActorID + ',"MarkType":' + MarkType + '}',
    });
  }
  // else  callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+ActorID+',"MarkType":'+MarkType+',LocalOnly:true}'});
};

const getMark = (size) => {
  let waymark1 = {
    B: {
      X: 100 + size * Math.cos(0),
      Y: 0,
      Z: 100 + size * Math.sin(0),
      Active: true,
    },
    C: {
      X: 100 + size * Math.cos(Math.PI / 2),
      Y: 0,
      Z: 100 + size * Math.sin(Math.PI / 2),
      Active: true,
    },
    D: {
      X: 100 + size * Math.cos(Math.PI),
      Y: 0,
      Z: 100 + size * Math.sin(Math.PI),
      Active: true,
    },
    A: {
      X: 100 + size * Math.cos((3 * Math.PI) / 2),
      Y: 0,
      Z: 100 + size * Math.sin((3 * Math.PI) / 2),
      Active: true,
    },
  };
  return JSON.stringify(waymark1);
};

const getHeadmarkerId = (data, matches, firstDecimalMarker) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined) {
      throw new UnreachableCode();
    }
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
const EyesPositions = [
  [0, [100, 60]],
  [1, [128.28, 71.72]],
  [2, [140.0, 100.0]],
  [3, [128.28, 128.28]],
  [4, [100.0, 140.0]],
  [5, [71.72, 128.28]],
  [6, [60.0, 100.0]],
  [7, [71.72, 71.72]],
];
Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData() {
    return {
      phase: 'doorboss',
      brightwingCounter: 1,
      传毒次数: 0,
      firstAdelphelJump: true,
      p7fire: 0,
      分摊次数: 0,
      背对: false,
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      // 6708 = Final Chorus
      // 62E2 = Spear of the Fury
      // 6B86 = Incarnation
      // 6667 = unknown_6667
      // 71E4 = Shockwave
      netRegex: NetRegexes.startsUsing({
        id: ['62D4', '63C8', '6708', '62E2', '6B86', '6667', '7438'],
        capture: true,
      }),
      run(data, matches) {
        // clearMark();
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            // callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load'});
            data.phase = 'thordan';
            break;
          case '6708':
            data.phase = 'nidhogg';
            break;
          case '62E2':
            data.phase = 'haurchefant';
            break;
          case '6B86':
            data.phase = 'thordan2';
            break;
          case '6667':
            data.phase = 'nidhogg2';
            break;
          case '71E4':
            data.phase = 'dragon-king';
            break;
        }
      },
    },

    {
      id: 'DSR Adelphel KB Direction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4' }),
      alertText(data, matches, output) {
        let distance = Math.hypot(matches.x - 100, matches.y - 100);
        if (distance > 20) {
          data.位置 = Math.round(4 - (4 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 8;
          switch (data.位置) {
            case 0:
              return '面向上边';
            case 2:
              return '面向右边';
            case 4:
              return '面向下边';
            case 6:
              return '面向左边';
          }
        }
      },
    },
    {
      id: 'DSR Adelphel ID Tracker',
      // 62D2 Is Ser Adelphel's Holy Bladedance, casted once during the encounter
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D2' }),
      run: (data, matches) => (data.adelphelId = matches.sourceId),
    },
    // {
    //   id: 'DSR Adelphel KB Direction',
    //   type: 'NameToggle',
    //   netRegex: NetRegexes.nameToggle({ toggle: '01' }),
    //   condition: (data, matches) => data.phase === 'doorboss' && matches.id === data.adelphelId && data.firstAdelphelJump,
    //   // Delay 0.1s here to prevent any race condition issues with getCombatants
    //   delaySeconds: 0.1,
    //   promise: async (data, matches) => {
    //     data.firstAdelphelJump = false;
    //     // Select Ser Adelphel
    //     let adelphelData = null;
    //     adelphelData = await callOverlayHandler({
    //       call: 'getCombatants',
    //       ids: [parseInt(matches.id, 16)],
    //     });

    //     // if we could not retrieve combatant data, the
    //     // trigger will not work, so just resume promise here
    //     if (adelphelData === null) {
    //       console.error(`Ser Adelphel: null data`);
    //       return;
    //     }
    //     if (!adelphelData.combatants) {
    //       console.error(`Ser Adelphel: null combatants`);
    //       return;
    //     }
    //     const adelphelDataLength = adelphelData.combatants.length;
    //     if (adelphelDataLength !== 1) {
    //       console.error(`Ser Adelphel: expected 1 combatants got ${adelphelDataLength}`);
    //       return;
    //     }

    //     // Add the combatant's position
    //     const adelphel = adelphelData.combatants.pop();
    //     if (!adelphel)
    //       throw new UnreachableCode();
    //     data.adelphelDir = matchedPositionTo4Dir(adelphel);
    //   },
    //   infoText: (data, _matches, output) => {
    //     // Map of directions, reversed to call out KB direction
    //     const dirs= {
    //       0: output.south(),
    //       1: output.west(),
    //       2: output.north(),
    //       3: output.east(),
    //       4: output.unknown(),
    //     };
    //     return output.adelphelLocation({
    //       dir: dirs[data.adelphelDir ?? 4],
    //     });
    //   },
    //   outputStrings: {
    //     north: Outputs.north,
    //     east: Outputs.east,
    //     south: Outputs.south,
    //     west: Outputs.west,
    //     unknown: Outputs.unknown,
    //     adelphelLocation: {
    //       en: 'Go ${dir} (knockback)',
    //       de: 'Geh ${dir} (Rückstoß)',
    //       cn: '面相${dir}',
    //       ko: '${dir} (넉백)',
    //     },
    //   },
    // },
    {
      id: "DSR Ascalon's Mercy Concealed",
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C8' }),
      suppressSeconds: 5,
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 0.7,
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Broad Swing Right',
      netRegex: NetRegexes.startsUsing({ id: '63C0' }),
      suppressSeconds: 5,
      alertText: (data, _, output) => '后边=>右边',
    },
    {
      id: 'DSR Broad Swing Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C1' }),
      suppressSeconds: 5,
      alertText: (data, _, output) => '后边=>左边',
    },
    {
      id: 'DSRp1安全区',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62CE' }),
      suppressSeconds: 10,
      duration: 3,
      async promise(data, matches) {
        const me = await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me, matches.source],
        });
        data.myposX = me.combatants.find((c) => c.Name === data.me).PosX;
        data.myposY = me.combatants.find((c) => c.Name === data.me).PosY;
        let p1Boss = me.combatants.find((c) => c.ID === parseInt(matches.sourceId, 16));
        data.heading = p1Boss.Heading;
      },
      alertText(data, matches, output) {
        let distance = Math.hypot(matches.x - data.myposX, matches.y - data.myposY);

        data.面向 = Math.round(4 - (4 * parseFloat(data.heading)) / Math.PI) % 8;
        let left = '左左左';
        let right = '右右右';
        if (distance < 22) {
          switch (data.位置) {
            case 0:
              if (data.面向 === 3) {
                return left;
              }
              if (data.面向 === 5) {
                return right;
              }
              break;
            case 2:
              if (data.面向 === 5) {
                return left;
              }
              if (data.面向 === 7) {
                return right;
              }
              break;
            case 4:
              if (data.面向 === 7) {
                return left;
              }
              if (data.面向 === 1) {
                return right;
              }
              break;
            case 6:
              if (data.面向 === 1) {
                return left;
              }
              if (data.面向 === 3) {
                return right;
              }
              break;
          }
        } else {
          switch (data.位置) {
            case 0:
              if (data.面向 === 3) {
                return left;
              }
              if (data.面向 === 5) {
                return right;
              }
              break;
            case 2:
              if (data.面向 === 5) {
                return left;
              }
              if (data.面向 === 7) {
                return right;
              }
              break;
            case 4:
              if (data.面向 === 7) {
                return left;
              }
              if (data.面向 === 1) {
                return right;
              }
              break;
            case 6:
              if (data.面向 === 1) {
                return left;
              }
              if (data.面向 === 3) {
                return right;
              }
              break;
          }
        }
      },
    },

    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB' }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC' }),
      response: Responses.knockback(),
    },

    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText(data, matches, output) {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.hyperdimensionalSlash) {
          return output.slashOnYou();
        }
      },
      outputStrings: {
        slashOnYou: {
          cn: '激光点名',
        },
      },
    },
    {
      id: '获取同组',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      tts: null,
      delaySeconds: 0.1,
      alertText(data, matches, output) {
        if (data.color === undefined) {
          return;
        }
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainSquare && data.me !== matches.target) {
        }
        switch (data.color) {
          case '红':
            if (id === headmarkers.firechainCircle && data.me !== matches.target) {
              return '同组为' + nametocnjob(matches.target, data);
            }
            break;
          case '绿':
            if (id === headmarkers.firechainTriangle && data.me !== matches.target) {
              return '同组为' + nametocnjob(matches.target, data);
            }
            break;
          case '紫':
            if (id === headmarkers.firechainSquare && data.me !== matches.target) {
              return '同组为' + nametocnjob(matches.target, data);
            }
            break;
          case '蓝':
            if (id === headmarkers.firechainX && data.me !== matches.target) {
              return '同组为' + nametocnjob(matches.target, data);
            }
            break;
          default:
            return;
        }
      },
    },
    {
      id: 'DSR Playstation Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText(data, matches, output) {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle) {
          data.color = '红';
          return output.circle();
        }

        if (id === headmarkers.firechainTriangle) {
          data.color = '绿';
          return output.triangle();
        }

        if (id === headmarkers.firechainSquare) {
          data.color = '紫';
          return output.square();
        }

        if (id === headmarkers.firechainX) {
          data.color = '蓝';
          return output.x();
        }
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          cn: '红',
        },
        triangle: {
          en: 'Green Triangle',
          cn: '绿',
        },
        square: {
          en: 'Purple Square',
          cn: '紫',
        },
        x: {
          en: 'Blue X',
          cn: '蓝',
        },
      },
    },

    {
      id: '测试3213123',
      netRegex: NetRegexes.gameNameLog({ line: '测试' }),
      async promise(data) {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
        });
        data.骑神位置 = boss.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12604)[0];
        data.my = boss.combatants.filter((boss) => boss.Name === data.me)[0];
      },
      alertText(data, matches, output) {
        let vector2X = data.骑神位置.PosX - data.my.PosX;
        let vector2Y = data.骑神位置.PosY - data.my.PosY;
        let vector1X = 0;
        let vector1Y = 1;
        let RelativeAngle =
          ((((Math.atan2(vector2Y, vector2X) - Math.atan2(vector1Y, vector1X)) * (180 / Math.PI) + 360 + 180) % 360) +
            ((data.my.Heading * (180 / Math.PI) + 360) % 360)) %
          360;
        let 面相骑神 = RelativeAngle > 180 - 46 && RelativeAngle < 180 + 46;
        let 龙眼位置 = EyesPositions[0][1];
        let vector3X = 龙眼位置[0] - data.my.PosX;
        let vector3Y = 龙眼位置[1] - data.my.PosY;
        let RelativeAngle1 =
          ((((Math.atan2(vector3Y, vector3X) - Math.atan2(vector1Y, vector1X)) * (180 / Math.PI) + 360 + 180) % 360) +
            ((data.my.Heading * (180 / Math.PI) + 360) % 360)) %
          360;
        let 面相眼睛 = RelativeAngle1 > 180 - 46 && RelativeAngle1 < 180 + 46;
        let 面相正确 = !面相骑神 && !面相眼睛;
        console.log(面相骑神 + ':' + 面相眼睛 + ':' + 面相正确);
        let 面相 = 面相正确 ? '正确' : '错误';
        return '面相' + 面相;
      },
    },

    {
      id: 'DSR 获取marker',
      regex: /^.{15}SignMarker 1D:Add:(?<marker>\d\d?):(?:[^|]*:){2}(?<caster>.*?)$/,
      delaySeconds: 3,
      run(data, matches) {
        if (matches.caster === data.me) {
          data.myMark = +matches.marker;
        }
        if (data.phase === 'thordan' && data.myMark !== undefined) {
          if (data.myMark >= 5 && data.myMark <= 7) {
            data.majiang3[data.myMark - 5].job = nametocnjob(data.me, data);
          }
          if (data.myMark >= 0 && data.myMark <= 2) {
            data.majiang1[data.myMark].job = nametocnjob(data.me, data);
          }
          if (data.myMark >= 8 && data.myMark <= 9) {
            data.majiang2[data.myMark - 8].job = nametocnjob(data.me, data);
          }
        }
      },
    },

    {
      id: 'DSR Gnash and Lash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6712' }),
      delaySeconds: 4,
      durationSeconds: 15,
      response: Responses.getOutThenIn(),
    },
    {
      id: 'DSR Lash and Gnash',
      type: 'StartsUsing',
      delaySeconds: 4,
      netRegex: NetRegexes.startsUsing({ id: '6713' }),
      durationSeconds: 15,
      response: Responses.getInThenOut(),
    },
    {
      id: 'DSR Lash Gnash Followup',
      type: 'Ability',
      // 6715 = Gnashing Wheel
      // 6716 = Lashing Wheel
      netRegex: NetRegexes.ability({ id: ['6715', '6716'] }),
      // These are ~3s apart.  Only call after the first (and ignore multiple people getting hit).
      suppressSeconds: 6,
      infoText: (_data, matches, output) => (matches.id === '6715' ? output.in() : output.out()),
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
      },
    },

    {
      id: '龙眼位置',
      regex: /] ChatLog 00:0:103:.{8}:8003759A:00020001:.{7}(?<index>.+?):/,
      run(data, matches, output) {
        if (data.龙眼 === undefined) {
          data.龙眼 = [];
        }
        data.eye = +matches.index;
        switch (+matches.index) {
          case 0:
            data.龙眼.push('A点');

            break;
          case 1:
            data.龙眼.push('1点');
            break;
          case 2:
            data.龙眼.push('B点');
            break;
          case 3:
            data.龙眼.push('2点');
            break;
          case 4:
            data.龙眼.push('C点');
            break;
          case 5:
            data.龙眼.push('3点');
            break;
          case 6:
            data.龙眼.push('D点');
            break;
          case 7:
            data.龙眼.push('4点');
            break;
          default:
            return '其他';
        }
        // return data.龙眼[0];
      },
    },
    {
      id: 'DSR Dragon',
      regex: /] ChatLog 00:0:103:.{8}:8003759A:00020001:.{7}(?<index>.+?):/,
      delaySeconds(data, matches) {
        if (data.phase === 'thordan') {
          return 2;
        }
        if (data.phase === 'thordan2') {
          return 10;
        }
      },
      delaySeconds(data, matches) {
        if (data.phase === 'thordan') {
          return 2;
        }
        if (data.phase === 'thordan2') {
          return 12;
        }
      },
      durationSeconds: 15,
      async promise(data, matches) {
        let bossData = await callOverlayHandler({
          call: 'getCombatants',
        });
        let bossData2 = bossData.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12611);
        if (bossData2.length > 0) {
          bossData2 = bossData2;
        } else {
          bossData2 = bossData.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12604);
        }
        let bossData123;
        if (data.phase === 'thordan') {
          bossData123 = bossData.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12604)[0];
        }
        if (data.phase === 'thordan2') {
          bossData123 = bossData.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12611)[0];
        }
        data.骑神 = Math.round(
          Math.round(4 - (4 * Math.atan2(bossData123.PosX - 100, bossData123.PosY - 100)) / Math.PI) % 8,
        );
      },
      alertText(data, matches, output) {
        if (data.龙眼 === undefined) {
          data.龙眼 = [];
        }
        switch (data.骑神) {
          case 0:
            data.龙眼.push('A点');
            break;
          case 1:
            data.龙眼.push('1点');
            break;
          case 2:
            data.龙眼.push('B点');
            break;
          case 3:
            data.龙眼.push('2点');
            break;
          case 4:
            data.龙眼.push('C点');
            break;
          case 5:
            data.龙眼.push('3点');
            break;
          case 6:
            data.龙眼.push('D点');
            break;
          case 7:
            data.龙眼.push('4点');
            break;
          default:
            break;
        }
        if (data.龙眼.length === 2) {
          data.背对 = true;
          return '背对' + data.龙眼[0] + data.龙眼[1];
        }
        return data.龙眼[0];
      },
    },
    {
      id: '面相',
      netRegex: /.*?/,
      condition: (data, matches, output) => data.背对,
      tts: null,
      suppressSeconds: 0.4,
      durationSeconds: 0.5,
      sound: '',
      soundVolume: 0,
      async promise(data, matches) {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
        });
        if (data.phase === 'thordan') {
          data.骑神位置 = boss.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12604)[0];
        }
        if (data.phase === 'thordan2') {
          data.骑神位置 = boss.combatants.filter((boss) => boss.BNpcNameID === 3632 && boss.BNpcID === 12611)[0];
        }
        data.my = boss.combatants.filter((boss) => boss.Name === data.me)[0];
        return;
      },
      alertText(data, matches, output) {
        let vector2X = data.骑神位置.PosX - data.my.PosX;
        let vector2Y = data.骑神位置.PosY - data.my.PosY;
        let vector1X = 0;
        let vector1Y = 1;
        let RelativeAngle =
          ((((Math.atan2(vector2Y, vector2X) - Math.atan2(vector1Y, vector1X)) * (180 / Math.PI) + 360 + 180) % 360) +
            ((data.my.Heading * (180 / Math.PI) + 360) % 360)) %
          360;
        let 面相骑神 = RelativeAngle > 180 - 46 && RelativeAngle < 180 + 46;
        let 龙眼位置 = EyesPositions[0][1];
        let vector3X = 龙眼位置[0] - data.my.PosX;
        let vector3Y = 龙眼位置[1] - data.my.PosY;
        let RelativeAngle1 =
          ((((Math.atan2(vector3Y, vector3X) - Math.atan2(vector1Y, vector1X)) * (180 / Math.PI) + 360 + 180) % 360) +
            ((data.my.Heading * (180 / Math.PI) + 360) % 360)) %
          360;
        let 面相眼睛 = RelativeAngle1 > 180 - 46 && RelativeAngle1 < 180 + 46;
        let 面相正确 = !面相骑神 && !面相眼睛;
        console.log(面相骑神 + ':' + 面相眼睛 + ':' + 面相正确);
        let 面相 = 面相正确 ? '正确' : '错误';
        return '面相' + 面相;
      },
    },
    {
      id: '骑神眼位置删除',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0' }),
      delaySeconds: 12,
      run(data, matches, output) {
        if (data.phase === 'thordan2') {
          callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load' });
        }
        {
          data.背对 = false;
          delete data.龙眼;
        }
      },
    },
    {
      id: 'DSR Ancient Quaga',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: '63C6',
        source: 'King Thordan',
        capture: false,
      }),
      response: Responses.aoe(),
    },

    {
      id: 'DSR Heavenly Heel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C7' }),
      response: Responses.tankBusterSwap('alert', 'alert'),
    },

    {
      id: 'DSR Skyblind',
      // 631A Skyblind (2.2s cast) is a targetted ground aoe where A65 Skyblind
      // effect expired on the player.
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A65' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Brightwing Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6319', source: 'Ser Charibert' }),
      condition: Conditions.targetIsYou(),
      // Once hit, drop your Skyblind puddle somewhere else.
      response: Responses.moveAway('alert'),
    },
    {
      id: 'DSR Wrath Spiral Pierce',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0005' }),
      async promise(data, matches) {
        let boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        data.linePos =
          Math.round(
            4 - (4 * Math.atan2(boss.combatants[0]?.PosX - 100, boss.combatants[0]?.PosY - 100)) / Math.PI + 4,
          ) % 8;
        return;
      },
      alertText(data, matches, output) {
        let dirs = {
          0: 'A点',
          1: '1点',
          2: 'B点',
          3: '2点',
          4: 'C点',
          5: '3点',
          6: 'D点',
          7: '4点',
          8: output.unknown(),
        };
        if (getOneMark(8) === 7) {
          dirs = {
            0: 'A点',
            1: '2点',
            2: 'B点',
            3: '3点',
            4: 'C点',
            5: '4点',
            6: 'D点',
            7: '1点',
            8: output.unknown(),
          };
        }
        if (data.P5点名 === undefined) {
          data.P5点名 = [];
        }
        data.P5点名.push(nametocnjob(matches.target, data));
        if (data.me === matches?.target) {
          return output.direction({
            dir: dirs[data.linePos ?? 8],
          });
        }
      },
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        unknown: Outputs.unknown,
        direction: {
          en: 'go to${dir}',
          de: '${dir}',
          fr: '${dir}',
          ja: '${dir}',
          cn: '去${dir}',
          ko: '${dir}',
        },
      },
    },

    {
      id: 'DSR白龙位置',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B89' }),
      tts: null,
      delaySeconds: 4.7,
      async promise(data, matches) {
        let whiteDragons = await callOverlayHandler({
          call: 'getCombatants',
        });

        data.whiteDragon = whiteDragons.combatants.filter((boss) => boss.BNpcNameID === 3984)[0];
      },
      alertText(data, matches, output) {
        let weizhi =
          Math.round(2 - (2 * Math.atan2(data.whiteDragon.PosX - 100, data.whiteDragon.PosY - 100)) / Math.PI) % 4;
        switch (weizhi) {
          case 0:
            return '白龙在A';

          case 1:
            return '白龙在B';
          case 2:
            return '白龙在C';
          case 3:
            return '白龙在D';
          default:
            break;
        }
      },
    },
    {
      id: 'DSRp5二运战士',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({
        npcBaseId: '9020',
        npcNameId: '3641',
      }),
      alertText(data, matches, output) {
        let mark = getMark(7);
        if (data.phase === 'thordan2') {
          callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'save' });
          callOverlayHandler({ call: 'PostNamazu', c: 'place', p: mark });
        }

        let weizhi = Math.round(2 - (2 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 4;
        switch (weizhi) {
          case 0:
            return '战士在A';
          case 1:
            return '战士在B';
          case 2:
            return '战士在C';
          case 3:
            return '战士在D';
          default:
            break;
        }
      },
    },
    {
      id: 'DSRp5二运战士第二次播报',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({
        npcBaseId: '9020',
        npcNameId: '3641',
      }),
      delaySeconds: 11,
      durationSeconds: 14,
      condition: (data, matches) => data.phase === 'thordan2',
      alertText(data, matches, output) {
        let weizhi = Math.round(2 - (2 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 4;
        switch (weizhi) {
          case 0:
            return '战士在A';
          case 1:
            return '战士在B';
          case 2:
            return '战士在C';
          case 3:
            return '战士在D';
          default:
            break;
        }
      },
    },
    {
      id: 'DSR Doom Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      alertText(data, matches, output) {
        if (data.death === undefined) {
          data.death = [];
        }
        data.death.push(nametocnjob(matches.target, data));
        if (matches.target === data.me) {
          data.isDeath = true;
        }
        if (data.death.length === 4) {
          data.death.sort((a, b) => {
            return shunxu2.find((c) => c.job === a).order - shunxu2.find((c) => c.job === b).order;
          });
          let 标记1 = data.death.map((i) => data.partJob.find((j) => j.job === i));
          let notDianMing = data.fenzu.filter((x) => !data.death.some((item) => x === item));
          notDianMing.sort((a, b) => {
            return shunxu2.find((c) => c.job === a).order - shunxu2.find((c) => c.job === b).order;
          });
          let 标记2 = notDianMing.map((i) => data.partJob.find((j) => j.job === i));
          // console.log(标记1);console.log(标记2);
          // sendMark(标记1[0].ID,1);sendMark(标记1[1].ID,2);sendMark(标记1[2].ID,3);sendMark(标记1[3].ID,4);
          // sendMark(标记2[0].ID,6);sendMark(标记2[1].ID,7);sendMark(标记2[2].ID,8);sendMark(标记2[3].ID,9);

          let 死宣分组 = [
            [data.fenzu[0], data.fenzu[2]],
            [data.fenzu[4], data.fenzu[6]],
            [data.fenzu[5], data.fenzu[7]],
            [data.fenzu[1], data.fenzu[3]],
          ];
          // let 死宣分组=[[data.fenzu[2],data.fenzu[3]],[data.fenzu[4],data.fenzu[8]],[data.fenzu[5],data.fenzu[7]],[data.fenzu[0],data.fenzu[1]]];
          let 我的死宣 = 死宣分组.findIndex((i) => i.includes(nametocnjob(data.me, data)));
          let 死宣在数组位置 = data.death.map((i) => 死宣分组.findIndex((j) => j.includes(i)));
          死宣在数组位置.sort((a, b) => a - b);
          let 我的 = 死宣在数组位置.filter((i) => i === 我的死宣);
          let bobao = '';
          let dir = [0, 1, 2, 3];
          console.log('死宣');
          console.log(我的死宣);
          console.log(data.fenzu);
          console.log(死宣在数组位置);
          console.log(我的死宣);
          console.log(data.death);
          let 重复的元素 = 死宣在数组位置.filter(
            (e, i) => 死宣在数组位置.indexOf(e) !== 死宣在数组位置.lastIndexOf(e) && 死宣在数组位置.indexOf(e) === i,
          );
          if (死宣在数组位置[0] === 死宣在数组位置[1] && 死宣在数组位置[2] === 死宣在数组位置[3]) {
            // 情况3
            if (
              死宣在数组位置[3] - 死宣在数组位置[0] === 2 ||
              (死宣在数组位置[3] - 死宣在数组位置[0] === 1 && 重复的元素.length === 2)
            ) {
              bobao = '上下换位';
              if (我的死宣 % 2 === 0) {
                data.我要去的位置 = (我的死宣 + 3) % 4;
              } else {
                data.我要去的位置 = (我的死宣 + 1) % 4;
              }
            }
            // 情况2
            if (
              (死宣在数组位置[3] - 死宣在数组位置[0] === 1 || 死宣在数组位置[3] - 死宣在数组位置[0] === 3) &&
              重复的元素.length === 2
            ) {
              bobao = '左右互换';
              if (我的死宣 % 2 === 0) {
                data.我要去的位置 = (我的死宣 + 1) % 4;
              } else {
                data.我要去的位置 = (我的死宣 + 3) % 4;
              }
            }
          }
          // 情况1
          if ((我的.length === 2 || 我的.length === 0) && 重复的元素.length === 1) {
            let 要移动的位置 = dir.filter((x) => !死宣在数组位置.some((item) => x === item));
            let 移动次数 = 要移动的位置 - 重复的元素[0];
            if (Math.abs(移动次数) === 2) {
              bobao = '斜点交换';
              data.我要去的位置 = (我的死宣 + 2) % 4;
            } else {
              if (死宣在数组位置.includes((重复的元素[0] + 1) % 4)) {
                if (我的.length === 0) {
                  data.我要去的位置 = (我的死宣 + 1) % 4;
                  bobao = '顺时针(左)换';
                }
                if (我的.length === 2) {
                  data.我要去的位置 = (我的死宣 + 3) % 4;
                  bobao = '逆时针(右)换';
                }
              } else {
                if (我的.length === 0) {
                  data.我要去的位置 = (我的死宣 + 3) % 4;
                  bobao = '逆时针(右)换';
                }
                if (我的.length === 2) {
                  data.我要去的位置 = (我的死宣 + 1) % 4;
                  bobao = '顺时针(左)换';
                }
              }
            }
          }
          if (bobao === '') {
            data.我要去的位置 = 我的死宣;
            return '不用换位';
          }
          if (data.role !== 'dps') {
            return bobao;
          } else {
            data.我要去的位置 = 我的死宣;
            return '不用换位';
          }
        }
      },
    },
    {
      id: 'P5死宣去哪',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      delaySeconds: 1.5,
      suppressSeconds: 4,
      alertText(data, matches, output) {
        if (data.我要去的位置 === 0 && data.isDeath) {
          return '去左上边缘';
        }
        if (data.我要去的位置 === 1 && data.isDeath) {
          return '去右上边缘';
        }
        if (data.我要去的位置 === 2 && data.isDeath) {
          return '去右边靠内';
        }
        if (data.我要去的位置 === 3 && data.isDeath) {
          return '去左边靠内';
        }
        if (data.我要去的位置 === 0) {
          return '去左边边缘';
        }
        if (data.我要去的位置 === 1) {
          return '去右边边缘';
        }
        if (data.我要去的位置 === 2) {
          return '去右下边边缘';
        }
        if (data.我要去的位置 === 3) {
          return '去左下边边缘';
        }
      },
    },
    {
      id: 'DSR Playstation2 Fire Chains',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      delaySeconds: 12,
      suppressSeconds: 4,
      alertText(data, matches, output) {
        if (data.我要去的位置 === 0 && data.isDeath) {
          return '去左下靠内';
        }
        if (data.我要去的位置 === 1 && data.isDeath) {
          return '去右下靠内';
        }
        if (data.我要去的位置 === 2 && data.isDeath) {
          return '去右边靠外引导';
        }
        if (data.我要去的位置 === 3 && data.isDeath) {
          return '去左边靠外引导';
        } else {
          return '去上边';
        }
      },
    },
    {
      id: "DSR Dragon's Gaze",
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0' }),
      disabled: true,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'DSR P5索尼',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan2' && data.me === matches.target,
      alertText(data, matches, output) {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle) {
          return '去左右';
        }

        if (id === headmarkers.firechainTriangle) {
          if (data.isDeath) {
            return '去右下';
          } else {
            return '去左上';
          }
        }

        if (id === headmarkers.firechainSquare) {
          if (data.isDeath) {
            return '去左下';
          } else {
            return '去右上';
          }
        }

        if (id === headmarkers.firechainX) {
          return '去上下';
        }
      },
    },
    {
      id: 'DSR Sanctity of the Ward Sword Names',
      disable: true,
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: false }),
    },
    {
      id: 'DSR Mortal Vow',
      disable: true,
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: false }),
    },
    {
      id: 'DSR Spreading/Entangled Flame',
      disable: true,
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: false }),
    },
    {
      id: 'DSR Nidhogg Hot Tail',
      disable: true,
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: false }),
    },
    {
      id: 'DSR Great Wyrmsbreath Nidhogg Not Glowing',
      disable: true,
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: false }),
    },
    {
      id: 'P6连线',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: ['00C4', '00C3', '00C2'] }),
      condition: (data, matches) => matches.source === data.me,
      suppressSeconds: 6,
      async promise(data, matches) {
        const lineBOSS = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        data.lineBOSS = lineBOSS.combatants[0];
        return;
      },
      alertText(data, matches, output) {
        let weizhi = Math.round(2 - (2 * Math.atan2(data.lineBOSS.PosX - 100, data.lineBOSS.PosY - 100)) / Math.PI) % 4;

        if (weizhi === 1) {
          return '冰线点名';
        }
        if (weizhi === 3) {
          return '红线点名';
        }
        return 'ceshi';
      },
    },
    {
      id: 'DSR Hallowed Wings and Plume',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: ['6D23', '6D24', '6D26', '6D27'],
      }),
      // condition: (data) => (data.phase === 'thordan2' && (data.safe = (data.safe ?? 0) + 1) === 1),
      condition: (data) => !data.fire,
      delaySeconds: 0.1,
      async promise(data) {
        const BlackDragon = await callOverlayHandler({
          call: 'getCombatants',
        });
        data.BlackDragon = BlackDragon.combatants.filter(
          (boss) => boss.BNpcNameID === 3458 && boss.BNpcID === 12612,
        )[0];
        return;
      },
      alertText(data, matches, output) {
        let posX = data.BlackDragon.PosX;
        if (matches.id === '6D23' || matches.id === '6D26') {
          if (data.role === 'tank') {
            data.靠近或远离1 = '靠近右边boss';
          } else {
            data.靠近或远离1 = '远离右边boss';
          }
        }
        if (matches.id === '6D24' || matches.id === '6D27') {
          if (data.role === 'tank') {
            data.靠近或远离1 = '远离右边boss';
          } else {
            data.靠近或远离1 = '靠近右边boss';
          }
        }
        if (matches.id === '6D26' || matches.id === '6D27') {
          if (posX < 100) {
            data.翅膀1 = '去右下';
          }
          if (posX > 100) {
            data.翅膀1 = '去左下';
          }
        }
        if (matches.id === '6D23' || matches.id === '6D24') {
          if (posX < 100) {
            data.翅膀1 = '去右上';
          }
          if (posX > 100) {
            data.翅膀1 = '去左上';
          }
        }
        if (data.靠近或远离1 && data.翅膀1) {
          return data.翅膀1 + data.靠近或远离1;
        }
      },
    },
    {
      id: 'DSR Akh Afah',
      // 6D41 Akh Afah from Hraesvelgr, and 64D2 is immediately after
      // 6D43 Akh Afah from Nidhogg, and 6D44 is immediately after
      // Hits highest emnity target
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D41', '6D43'] }),
      suppressSeconds: 2,
      infoText(_data, _matches, output) {
        _data.分摊次数++;
        return output.groups();
      },
      outputStrings: {
        groups: {
          en: 'Tank Groups',
          ja: 'タンクと頭割り',
          ko: '탱커와 그룹 쉐어',
          cn: '上下分摊',
        },
      },
    },
    {
      id: 'DSR 发光位置收集',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D35', '6D33'] }),
      delaySeconds: 10,
      preRun(data, matches, output) {
        let weizhi = (data.位置 = Math.round(2 - (2 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 4);
        if (data.发光位置 === undefined) {
          data.发光位置 = [];
        }
        data.发光位置.push(weizhi);
      },
      run: (data) => delete data.发光位置,
    },
    {
      id: 'DSR 发光位置播报',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D35', '6D33'] }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText(data, matches, output) {
        if (data.role !== 'tank') {
          return;
        }
        if (data.发光位置.length === 2) {
          return '双龙发光';
        }
        if (data.发光位置.length === 1) {
          if (data.发光位置[0] === 1) {
            return '黑龙死刑';
          } else {
            return '白龙死刑';
          }
        }
      },
    },
    {
      id: 'DSR Spreading Flame',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({
        effectId: ['AC6', 'AC7'],
        capture: true,
      }),
      run(data, matches, output) {
        if (data.dark === undefined) {
          data.dark = [];
        }
        if (data.white === undefined) {
          data.white = [];
        }
        if (matches.effectId === 'AC6') {
          data.dark.push(nametocnjob(matches.target, data));
          if (matches.target === data.me) {
            data.p6buff = '暗';
          }
          return;
        }
        if (matches.effectId === 'AC7') {
          data.white.push(nametocnjob(matches.target, data));
          if (matches.target === data.me) {
            data.p6buff = '白';
          }
          return;
        }
      },
    },
    {
      id: 'DSR Entangled Flame',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({
        effectId: ['AC6', 'AC7'],
        capture: true,
      }),
      delaySeconds: 3,
      suppressSeconds: 3,
      // delaySeconds: (data, matches) => parseFloat(matches.duration) - 5,
      run(data, matches, output) {
        data.dark.sort((a, b) => {
          return shunxu2.find((c) => c.job === a).order - shunxu2.find((c) => c.job === b).order;
        });
        data.white.sort((a, b) => {
          return shunxu2.find((c) => c.job === a).order - shunxu2.find((c) => c.job === b).order;
        });
        data.noBuff = data.fenzu.filter(
          (x) => !data.dark.some((item) => x === item) && !data.white.some((item) => x === item),
        );
        data.noBuff.sort((a, b) => {
          return shunxu2.find((c) => c.job === a).order - shunxu2.find((c) => c.job === b).order;
        });
        let 标记1 = data.dark.map((i) => data.partJob.find((j) => j.job === i));
        let 标记2 = data.white.map((i) => data.partJob.find((j) => j.job === i));
        let notDianMing = data.noBuff.map((i) => data.partJob.find((j) => j.job === i));
        sendMark(标记1[0].ID, 1);
        sendMark(标记1[1].ID, 2);
        sendMark(标记1[2].ID, 3);
        sendMark(标记1[3].ID, 4);
        sendMark(标记2[0].ID, 6);
        sendMark(标记2[1].ID, 7);
        sendMark(notDianMing[0].ID, 9);
        sendMark(notDianMing[1].ID, 10);
      },
    },
    {
      id: 'P6传毒',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['B50'], capture: true }),
      suppressSeconds: 5,
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 4,
      suppressSeconds: 2,
      preRun: (data, matches, output) => data.传毒次数++,
      infoText(data, matches, output) {
        if (data.传毒次数 === 1) {
          data.毒分组 = [data.fenzu[2], data.fenzu[6], data.fenzu[3], data.fenzu[7]];
          let 第一次毒点名 = nametocnjob(matches.target, data);
          data.第一次点名顺序 = data.毒分组.indexOf(第一次毒点名);
          console.log(data.毒分组);
          console.log('毒');
          console.log(data.第一次点名顺序);
          let 标记1 = data.partJob.find((j) => j.job === 第一次毒点名);
          let 标记2 = data.partJob.find((j) => j.job === data.fenzu[4]);
          // sendMark(标记1.ID,11);sendMark(标记2.ID,12)
          return '传毒给' + data.fenzu[4];
        }
        let 播报 = (data.第一次点名顺序 + data.传毒次数 - 1) % 4;
        if (data.传毒次数 === 2) {
          let 标记1 = data.partJob.find((j) => j.job === data.fenzu[4]);
          let 标记2 = data.partJob.find((j) => j.job === data.毒分组[播报]);
          // sendMark(标记1.ID,11);sendMark(标记2.ID,12)
          return '传毒给' + data.毒分组[播报];
        }

        let 标记1 = data.partJob.find((j) => j.job === data.毒分组[播报 - 1]);
        let 标记2 = data.partJob.find((j) => (j.job = data.毒分组[播报]));
        // sendMark(标记1.ID,11);sendMark(标记2.ID,12)
        if (data.传毒次数 === 3) {
          return '传毒给' + data.毒分组[播报];
        }
        if (data.传毒次数 === 4) {
          return '传毒给' + data.毒分组[播报];
        }
        if (data.传毒次数 === 5) {
          return '传毒给' + data.毒分组[播报];
        }
        return data.传毒次数 + '传毒';
      },
    },
    {
      id: 'DSR Wyrmsbreath 2 Boiling and Freezing',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['B52', 'B53'] }),
      condition: Conditions.targetIsYou(),
      // Lasts 10.96s, but bosses do not cast Cauterize until 7.5s after debuff
      delaySeconds: 7.6,
      async promise(data) {
        const BlackDragon = await callOverlayHandler({
          call: 'getCombatants',
        });
        data.BlackDragon = BlackDragon.combatants.filter(
          (boss) => boss.BNpcNameID === 3458 && boss.BNpcID === 12612,
        )[0];
        return;
      },
      infoText(data, matches, output) {
        console.log(data.BlackDragon);
        if (matches.effectId === 'B52') {
          if (data.BlackDragon.PosX > 100) {
            return '去左边停下';
          } else {
            return '去右边停下';
          }
        } else {
          if (data.BlackDragon.PosX > 100) {
            return '去右边';
          } else {
            return '去左边';
          }
        }
      },
    },
    {
      id: 'DSR Wyrmsbreath 2 Pyretic',
      type: 'GainsEffect',
      // B52 = Boiling
      // When Boiling expires, Pyretic (3C0) will apply
      // Pyretic will cause damage on movement
      netRegex: NetRegexes.gainsEffect({ effectId: ['B52'] }),
      condition: Conditions.targetIsYou(),
      // Boiling lasts 10.96s, after which Pyretic is applied provide warning
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
      // Player will have Pyretic for about 3s before hit by Cauterize
      durationSeconds: 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stop',
          de: 'Stopp',
          fr: 'Stop',
          ja: '動かない',
          cn: '停停停',
          ko: '멈추기',
        },
      },
    },
    {
      id: 'DSR Trinity Tank Dark Resistance',
      type: 'GainsEffect',
      // C40 = Dark Resistance Down, highest enmity target
      netRegex: NetRegexes.gainsEffect({
        effectId: 'C40',
        count: '02',
      }),
      condition: (data, matches) => data.me === matches.target,
      alertText(_data, matches, output) {
        if (parseFloat(matches.duration) > 10) {
          return output.text();
        }
      },
      outputStrings: {
        text: {
          // Only showing 'swap' is really confusing, in my opinion
          en: 'Get 2nd enmity',
          de: 'Sei 2. in der Aggro',
          ko: '적개심 2순위 잡기',
          cn: '获取2仇',
        },
      },
    },
    {
      id: 'DSR Trinity Tank Dark Resistance',
      type: 'GainsEffect',
      // C40 = Dark Resistance Down, highest enmity target
      netRegex: NetRegexes.gainsEffect({
        effectId: 'C40',
        count: '02',
      }),
      condition: (data, matches) => data.me === matches.target,
      alertText(_data, matches, output) {
        if (parseFloat(matches.duration) > 10) {
          return output.text();
        }
      },
      outputStrings: {
        text: {
          // Only showing 'swap' is really confusing, in my opinion
          en: 'Get 2nd enmity',
          de: 'Sei 2. in der Aggro',
          ko: '적개심 2순위 잡기',
          cn: '获取2仇',
        },
      },
    },
    {
      id: 'DSR Trinity Tank Light Resistance',
      type: 'GainsEffect',
      // C3F = Light Resistance Down, 2nd highest enmity target
      netRegex: NetRegexes.gainsEffect({
        effectId: 'C3F',
        count: '02',
      }),
      condition: (data, matches) => data.me === matches.target,
      // To prevent boss rotating around before Exaflare
      delaySeconds: 2.5,
      alertText(_data, matches, output) {
        if (parseFloat(matches.duration) > 10) {
          return output.text();
        }
      },
      outputStrings: {
        text: {
          en: 'Provoke',
          de: 'Herausforderung',
          ko: '도발하기',
          cn: '挑衅',
        },
      },
    },
    {
      id: 'DSR Flames of Ascalon',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({
        effectId: '808',
        count: ['12A', '12B'],
      }),
      durationSeconds: 10,
      alertText(data, matches, output) {
        if (matches.count === '12A') {
          return '钢铁';
        } else {
          return '月环';
        }
      },
    },
    {
      id: 'DSR Ice of Ascalon',
      disable: true,
      netRegex: NetRegexes.startsUsing({ id: '6D34', capture: false }),
    },
    {
      id: 'P7顺逆',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D9A', '6DD2', '6DD3'] }),
      durationSeconds: 15,
      alertText(data, matches, output) {
        if (data.核爆 === undefined) {
          data.核爆 = [];
        }
        let 方位 = Math.round(4 - (4 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 8;
        if (matches.id === '6D9A') {
          data.核爆[0] = 方位;
        }
        if (matches.id === '6DD2') {
          data.核爆[1] = 方位;
        }
        if (data.核爆.length >= 2) {
          let 核爆位置;
          data.标点 = '';
          if (getCamera() !== undefined) {
            let dir = ['A点', '1点', 'B点', '2点', 'C点', '3点', 'D点', '4点'];
            data.核爆[0] = (data.核爆[0] - getCamera() + 8) % 8;
            if (getCamera(8) === 7) {
              dir = ['A点', '2点', 'B点', '3点', 'C点', '4点', 'D点', '1点'];
            }
            let 安全位置 = (data.核爆[0] + 4) % 8;
            data.标点 = dir[安全位置];
          }
          switch (data.核爆[0]) {
            case 0:
              核爆位置 = '下';
              break;
            case 1:
              核爆位置 = '左下';
              break;
            case 2:
              核爆位置 = '左';
              break;
            case 3:
              核爆位置 = '左上';
              break;
            case 4:
              核爆位置 = '上';
              break;
            case 5:
              核爆位置 = '右上';
              break;
            case 6:
              核爆位置 = '右';
              break;
            case 7:
              核爆位置 = '右下';
              break;
            default:
              break;
          }
          let 顺逆 = data.核爆[1] - data.核爆[0];
          if (顺逆 > 0 || 顺逆 === -5) {
            data.核爆顺逆 = '顺时针(左)核爆';
          } else {
            data.核爆顺逆 = '逆时针(右)核爆';
          }
          if (核爆位置 && data.核爆顺逆) {
            return 核爆位置 + data.标点 + data.核爆顺逆 + '核爆';
          }
        }
      },
    },
    {
      id: 'P7顺逆删除',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D9A', '6DD2'] }),
      suppressSeconds: 1,
      delaySeconds: 10,
      run(data, matches, output) {
        delete data.核爆;
      },
    },
    {
      id: 'P7第一次三位一体D1引导',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9B' }),
      delaySeconds: 11,
      alertText(data, matches, output) {
        data.myIndex = data.fenzu.indexOf(data.myJob);
        if (data.role === 'tank') {
          return;
        }
        if (data.myIndex === 2) {
          return '靠近引导顺劈';
        } else {
          return '远离BOSS';
        }
      },
    },
    {
      id: 'P7第一次三位一体D2引导',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9B' }),
      delaySeconds: 15,
      alertText(data, matches, output) {
        if (data.role === 'tank') {
          return;
        }
        if (data.myIndex === 6) {
          return '靠近引导顺劈';
        } else {
          return '远离BOSS';
        }
      },
    },
    {
      id: 'P7第一次三位一体H1引导',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D99' }),
      delaySeconds: 22,
      alertText(data, matches, output) {
        if (data.role === 'tank') {
          return;
        }
        if (data.myIndex === 1) {
          return '靠近引导顺劈';
        } else {
          return '远离BOSS';
        }
      },
    },
    {
      id: 'P7第一次三位一体H2引导',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D99' }),
      delaySeconds: 26,
      alertText(data, matches, output) {
        if (data.role === 'tank') {
          return;
        }
        if (data.myIndex === 5) {
          return '靠近引导顺劈';
        } else {
          return '远离BOSS';
        }
      },
    },
    {
      id: 'P7第一次三位一体D3引导',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D93' }),
      delaySeconds: 14,
      alertText(data, matches, output) {
        if (data.role === 'tank') {
          return;
        }
        if (data.myIndex === 3) {
          return '靠近引导顺劈';
        } else {
          return '远离BOSS';
        }
      },
    },
    {
      id: 'P7第一次三位一体D4引导',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D93' }),
      delaySeconds: 18,
      alertText(data, matches, output) {
        if (data.role === 'tank') {
          return;
        }
        if (data.myIndex === 7) {
          return '靠近引导顺劈';
        } else {
          return '远离BOSS';
        }
      },
    },
    {
      id: 'P7地火第一次标记',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9C' }),
      async promise(data) {
        const bossData = await callOverlayHandler({
          call: 'getCombatants',
        });
        data.P7BOSS = bossData.combatants.filter((boss) => boss.BNpcNameID === 11319 && boss.BNpcID === 12616)[0];
        // console.log(data.P7BOSS);
      },
      alertText(data, matches, output) {
        let Boss面相 = Math.round(4 - (4 * parseFloat(data.P7BOSS.Heading)) / Math.PI) % 8;
        let 地火位置 = Math.round(4 - (4 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 8;
        if ((Boss面相 + 4) % 8 === 地火位置) {
          console.log(Boss面相 + ':' + 地火位置);
          let waymark = {
            One: {
              X: matches.x,
              Y: matches.z,
              Z: matches.y,
              Active: true,
            },
          };
          callOverlayHandler({
            call: 'PostNamazu',
            c: 'place',
            p: JSON.stringify(waymark),
          });
          return '站在下面地火旁';
        }
      },
    },
    // 吉吉的穷举
    {
      id: 'P7地火形状',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D9C' }),
      async promise(data, matches) {
        const bossData = await callOverlayHandler({
          call: 'getCombatants',
        });
        data.P7BOSS = bossData.combatants.filter((boss) => boss.BNpcNameID === 11319 && boss.BNpcID === 12616)[0];
        data.地火 = bossData.combatants.filter((boss) => boss.ID === matches.ID)[0];
      },
      alertText(data, matches, output) {
        let Boss面相 = Math.round(4 - (4 * parseFloat(data.P7BOSS.Heading)) / Math.PI) % 8;
        let 地火位置 = Math.round(4 - (4 * Math.atan2(matches.x - 100, matches.y - 100)) / Math.PI) % 8;
        console.log('地火');

        if ((地火位置 + 9) % 8 === Boss面相) {
          if (data.地火 === undefined) {
            data.左上地火 = Math.round(4 - (4 * matches.heading) / Math.PI + Boss面相) % 8;
          } else {
            data.左上地火 = Math.round(4 - (4 * data.地火.Heading) / Math.PI + Boss面相) % 8;
          }
        }
        if ((地火位置 + 7) % 8 === Boss面相) {
          if (data.地火 === undefined) {
            data.右上地火 = Math.round(4 - (4 * matches.heading) / Math.PI + Boss面相) % 8;
          } else {
            data.右上地火 = Math.round(4 - (4 * data.地火.Heading) / Math.PI + Boss面相) % 8;
          }
        }
        if ((地火位置 + 4) % 8 === Boss面相) {
          if (data.地火 === undefined) {
            data.下面地火 = Math.round(4 - (4 * matches.heading) / Math.PI + Boss面相) % 8;
          } else {
            data.下面地火 = Math.round(4 - (4 * data.地火.Heading) / Math.PI + Boss面相) % 8;
          }
        }
        console.log(data.左上地火 + ':' + data.右上地火 + ':' + data.下面地火);
        if (data.下面地火 !== undefined && data.右上地火 !== undefined && data.左上地火 !== undefined) {
          if (/[02346]/.test(data.下面地火) && /[12357]/.test(data.右上地火)) {
            return '左上安全';
          }
          if (/[02456]/.test(data.下面地火) && /[13567]/.test(data.左上地火)) {
            return '右上安全';
          }
          if (/[01246]/.test(data.右上地火) && /[02467]/.test(data.左上地火)) {
            return '背后安全';
          }
        }
      },
    },
    {
      id: 'P7地火第二次标记',
      type: 'StartsUsing',
      netRegex: NetRegexes.ability({ id: '6D9C' }),
      suppressSeconds: 1,
      alertText(data, matches, output) {
        let mark = getMark(13.2);
        callOverlayHandler({ call: 'PostNamazu', c: 'place', p: mark });
        return '走走走';
      },
    },
    {
      id: 'P7地火标点恢复',
      type: 'StartsUsing',
      netRegex: NetRegexes.ability({ id: '6D9C' }),
      suppressSeconds: 1,
      delaySeconds: 7,
      run(data, matches, output) {
        delete data.左上地火;
        delete data.右上地火;
        delete data.下面地火;
        callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load' });
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'cn',
      replaceSync: {
        '(?<!Dragon-)King Thordan': '.*?',
        'Ser Adelphel': '.*?',
        'Ser Charibert': '.*?',
        'Ser Grinnaux': '.*?',
        'Ser Guerrique': '.*?',
        'Ser Hermenost': '.*?',
        'Ser Ignasse': '.*?',
        'Ser Janlenoux': '.*?',
        'Ser Zephirin': '.*?',
        Nidhogg: '.*?',
        Hraesvelgr: '.*?',
        Darkscale: '.*?',
        Vedrfolnir: '.*?',
        'Right Eye': '.*?',
        'Ser Noudenet': '.*?',
        'Left Eye:': '.*?',
        'Dragon-king Thordan': '.*?',
      },
    },
  ],
});
