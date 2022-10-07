import isEqual from 'lodash-es/isEqual';

export const overlayPluginKey = 'trim21-triggers-config.02';
const localStorageKey = 'trim21-triggers-config.02';

export type Config = {
  enablePostNamazu: boolean;
  jobOrder: Record<string, number>;
  partyNotification: boolean;
}

export function sortByJobID(a: { jobID: number }, b: { jobID: number }) {
  return config.jobOrder[a.jobID] - config.jobOrder[b.jobID];
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

  return { partyNotification: true, enablePostNamazu: true, jobOrder };
}


function loadConfigFromLocalStorage(): Config {
  const raw = localStorage.getItem(localStorageKey);

  if (!raw) {
    return defaultConfig();
  }

  return JSON.parse(raw);
}


export async function loadConfigFromOverlayPlugin(): Promise<Config> {
  const data = await callOverlayHandler({ call: 'loadData', key: overlayPluginKey });
  if (data?.data) {
    return data.data as unknown as Config;
  }

  return defaultConfig();
}


const config = loadConfigFromLocalStorage();
export default config;
export const echoPrefix = config.partyNotification ? '/p' : '/e';

loadConfigFromOverlayPlugin().then(c => {
  if (!isEqual(c, config)) {
    console.log('config change, reload page');
    localStorage.setItem(localStorageKey, JSON.stringify(c));
    location.reload();
  }

  if (config.enablePostNamazu) {
    console.log('启用鲶鱼精');
  }

  if (config.partyNotification) {
    console.log('启用小队指挥');
  }
});


