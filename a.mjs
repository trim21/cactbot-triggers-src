// const o = {};
//
// const r = {
//   config: o,
// };
//
//
// const d = { ...r };
//
// Object.assign(o, { 'key': 'value' });
//
// console.log(d);
//
// function loadConfig(key) {
//   const config = {};
//
//   callOverlayHandler({ call: 'loadData', key }).then(data => {
//     if (data?.data) {
//       Object.assign(config, data);
//     }
//   });
//
//   return config;
// }
//
//
// export default {
//   initData() {
//     return {
//       config: loadConfig('kk'),
//     };
//   },
// };
//
import fetch from 'node-fetch';

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const port = 2020; //鲶鱼精邮差所监听的端口

export async function Command(data) {
  await call('Command', data);
}


async function call(command, data) {
  console.log(command, data);
  return await fetch(`http://127.0.0.1:${port}/${command}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
}


const sep = '       ';

(async () => {
  for (const cmd of [
    `/e 十字火 | ■ □ □ `,
    `/e 十字火 | □ □ □ `,
    `/e 十字火 | □ □ □ `,
    '/e 左上安全 (A为12点)',
  ]) {
    await Command(cmd);
    await sleep(100);
  }
})();
