import { EventMap, EventType } from 'cactbot/types/event';

declare global {
  namespace OverlayPlugin {
    function addOverlayListener<T extends EventType>(event: T, cb: EventMap[T]): void;

    function callOverlayHandler(msg: { call: 'saveData'; key: string; data: unknown }): Promise<void>;
    function callOverlayHandler<T = unknown>(msg: { call: 'loadData'; key: string; }): Promise<({ data?: T } | undefined)>;
  }

  const callOverlayHandler: typeof OverlayPlugin.callOverlayHandler;
  const addOverlayListener: typeof OverlayPlugin.addOverlayListener;
}

export {};
