import { UnreachableCode } from '@trim21/cactbot/resources/not_reached';

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

// shuffle a array **in place**
export function shuffleArray<T>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
