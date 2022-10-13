import { sleep } from './utils';

import 'overlay-plugin';

declare module 'overlay-plugin' {
  interface ICallOverlayHandler {
    (payload: { call: 'PostNamazu'; c: 'command' | 'mark'; p: string }): Promise<void>;
  }
}

export async function Command(data: string): Promise<void> {
  await call('command', data);
}

export type MarkType =
  | 'attack1'
  | 'attack2'
  | 'attack3'
  | 'attack4'
  | 'attack5'
  | 'bind1'
  | 'bind2'
  | 'bind3'
  | 'stop1'
  | 'stop2'
  | 'square'
  | 'circle'
  | 'cross'
  | 'triangle';

type Mark = {
  MarkType: MarkType;
  LocalOnly?: boolean;
} & ({ ActorID: number } | { Name: string });

export async function Mark(data: Mark): Promise<void> {
  await call('mark', JSON.stringify(data));
}

async function call(command: 'command' | 'mark', data: string) {
  console.log(command, data);
  return await callOverlayHandler({ call: 'PostNamazu', c: command, p: data });
}

export async function clearMark() {
  for (let index = 1; index < 9; index++) {
    await Command(`/mk clear <${index}>`);
  }
}

export async function Commands(commands: string[]): Promise<void> {
  for (const cmd of commands) {
    await Command(cmd);
  }
}
