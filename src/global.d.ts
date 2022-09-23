import _Conditions from '../../cactbot/resources/conditions';
import _ContentType from '../../cactbot/resources/content_type';
import _NetRegexes from '../../cactbot/resources/netregexes';
import _Regexes from '../../cactbot/resources/regexes';
import { Responses as _Responses } from '../../cactbot/resources/responses';
import _Outputs from '../../cactbot/resources/outputs';
import _Util from '../../cactbot/resources/util';
import _ZoneId from '../../cactbot/resources/zone_id';
import _ZoneInfo from '../../cactbot/resources/zone_info';

import _RaidbossOptions from '../../cactbot/ui/raidboss/raidboss_options';
import {
  addOverlayListener as _addOverlayListener
} from '../cactbot/resources/overlay_plugin_api';

declare global {
  const addOverlayListener: typeof _addOverlayListener;
  const Options: typeof _RaidbossOptions;
  // Global variables
  const Conditions: typeof _Conditions;
  const ContentType: typeof _ContentType;
  const NetRegexes: typeof _NetRegexes;
  const Regexes: typeof _Regexes;
  const Responses: typeof _Responses;
  const Outputs: typeof _Outputs;
  const Util: typeof _Util;
  const ZoneId: typeof _ZoneId;
  const ZoneInfo: typeof _ZoneInfo;
}
