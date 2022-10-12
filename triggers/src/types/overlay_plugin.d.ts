import { ICallOverlayHandler, IAddOverlayListener } from 'overlay-plugin';

declare global {
  const callOverlayHandler: ICallOverlayHandler;
  const addOverlayListener: IAddOverlayListener;
}
