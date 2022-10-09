import { ICallOverlayHandler, IAddOverlayListener } from 'overlay-plugin';
import './cactbot-plugin';

declare global {
  const callOverlayHandler: ICallOverlayHandler;
  const addOverlayListener: IAddOverlayListener;
}
