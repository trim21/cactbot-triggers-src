import {} from 'overlay-plugin';

declare module 'overlay-plugin' {
  interface ICallOverlayHandler {
    (payload: { call: 'PostNamazu', c: 'command' | 'mark', p: string }): Promise<void>;

    (payload: { call: 'PostNamazu', c: 'mark', p: string }): Promise<void>;
    (payload: { call: 'PostNamazu', c: 'command', p: string }): Promise<void>;
  }
}

