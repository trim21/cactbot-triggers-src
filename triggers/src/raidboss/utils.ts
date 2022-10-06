import { UnreachableCode } from 'cactbot/resources/not_reached';

export function getHeadmarkerId(data: { decOffset?: number }, matches: { id: string }) {
  if (data.decOffset === undefined) {
    // 内置触发器会设置
    throw new UnreachableCode();
  }
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
}

