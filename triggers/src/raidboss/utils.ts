import { UnreachableCode } from 'cactbot/resources/not_reached';

export function getHeadmarkerId(data: { decOffset?: number }, matches: { id: string }) {
  if (data.decOffset === undefined) {
    // 内置触发器会设置
    throw new UnreachableCode();
  }
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function p(h: () => Promise<any>) {
  h().catch((e) => {
    console.log('promise error', e);
  });
}

export function c(h: Promise<any>) {
  h.catch((e) => {
    console.log('promise error', e);
  });
}
