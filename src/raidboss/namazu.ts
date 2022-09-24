const port = 2019;  //鲶鱼精邮差所监听的端口

export async function Command(data: string) {
  return call('Command', data);
}

type MarkType = 'attack1' |
  'attack2' |
  'attack3' |
  'attack4' |
  'attack5' |
  'bind1' |
  'bind2' |
  'bind3' |
  'stop1' |
  'stop2' |
  'square' |
  'circle' |
  'cross' |
  'triangle'

type Mark = ({
  MarkType: MarkType;
  LocalOnly?: boolean;
}) & ({ ActorID: number; } | { Name: string; });

export async function Mark(data: Mark) {
  return call('Mark', JSON.stringify(data));
}

async function call(command: 'Command' | 'Mark', data: string) {
  return await fetch(`http://127.0.0.1:${port}/${command}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: {'Content-Type': 'application/json'},
    body: data
  });
}

