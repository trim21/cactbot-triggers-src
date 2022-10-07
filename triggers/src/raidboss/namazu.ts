import { sleep } from './utils';

const port = 2020; //鲶鱼精邮差所监听的端口

export async function Command(data: string): Promise<void> {
  await call('Command', data);
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
  await call('Mark', JSON.stringify(data));
}

async function call(command: 'Command' | 'Mark', data: string) {
  console.log(command, data);
  return await fetch(`http://127.0.0.1:${port}/${command}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
}

export async function clearMark() {
  for (let index = 1; index < 9; index++) {
    await Command(`/mk clear <${index}>`);
  }
}


export async function Commands(commands: string[]): Promise<void> {
  for (const cmd of commands) {
    await Command(cmd);
    await sleep(100);
  }
}
