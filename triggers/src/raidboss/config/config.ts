export interface Config {
  enablePostNamazu: boolean;
  jobOrder: Record<string, number>;
}


export function defaultConfig(): Config {
  const jobOrder: Record<number, number> = Object.fromEntries([
    21, // 战士,
    32, // DK,
    37, // 枪刃,
    19, // 骑士,

    24, // 白魔,
    33, // 占星,
    40, // 贤者,
    28, // 学者,

    34, // 武士,
    22, // 龙骑,

    30, // 忍者,
    20, // 武僧,
    39, // 钐刀,

    23, // 诗人,
    31, // 机工,
    38, // 舞者,

    25, // 黑魔,
    35, // 赤魔,
    27, // 召唤,
  ].map((v, i) => [v, i]));

  return { enablePostNamazu: true, jobOrder };
}

export async function loadConfig(): Promise<Config> {
  const data = await callOverlayHandler({ call: 'loadData', key: 'trim21-triggers-config' });
  if (data) {
    return data.data as Config;
  }

  return defaultConfig();
}

