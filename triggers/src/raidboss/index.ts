import './name_to_job';

import { loadConfig } from './config/config';
import getDsrTriggers from './ultimate/dsr';


async function main() {
  const config = await loadConfig();

  Options.Triggers.push(getDsrTriggers(config));
}

main().catch(e => {
  throw e;
});
