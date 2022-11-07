export const overlayPluginKey = 'trim21-triggers-config-1';

export type Config = {
  enablePostNamazu: boolean;
  jobOrder: Record<string, number>;
  headMark: boolean;
  partyNotification: boolean;
};

export function sortNameByJob(nameToJobID: Record<string, number>): (a: string, b: string) => number {
  return (a, b) => config.jobOrder[nameToJobID[a]] - config.jobOrder[nameToJobID[b]];
}

export function sortByJobID(a: { jobID: number }, b: { jobID: number }) {
  return config.jobOrder[a.jobID] - config.jobOrder[b.jobID];
}

export function defaultConfig(): Config {
  const jobOrder: Record<number, number> = Object.fromEntries(
    [
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
    ].map((v, i) => [v, i]),
  );

  return { partyNotification: true, enablePostNamazu: true, jobOrder, headMark: false };
}

/**
 * load config from overlay plugin.
 * If remote config is not set, return default config.
 * If remove config is not valid JSON, reset remote config to default config.
 *
 */
export async function loadConfig(): Promise<Config> {
  const data = await callOverlayHandler({ call: 'loadData', key: overlayPluginKey });
  if (data?.data) {
    try {
      return JSON.parse(data.data as string);
    } catch {
      await callOverlayHandler({ call: 'saveData', key: overlayPluginKey, data: JSON.stringify(defaultConfig()) });
      return defaultConfig();
    }
  }

  return defaultConfig();
}

export async function StoreConfig(v: Config) {
  await callOverlayHandler({ call: 'saveData', key: overlayPluginKey, data: JSON.stringify(v) });
  await callOverlayHandler({ call: 'cactbotReloadOverlays' });
  console.log('data change', JSON.stringify(v, null, 2));
}

const config: Readonly<Config> = await loadConfig();

if (config.enablePostNamazu) {
  console.log('启用鲶鱼精');
}

if (config.partyNotification) {
  console.log('启用小队指挥');
}

if (config.enablePostNamazu) {
  console.log('启用头顶标点');
}

export const echoPrefix = config.partyNotification ? '/p' : '/e';

export default config;
