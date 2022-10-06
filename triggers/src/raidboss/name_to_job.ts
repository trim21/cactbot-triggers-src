import { nameToJobEnum } from './job';

const playerNicks: Record<string, string> = (Options.PlayerNicks = {});

addOverlayListener('PartyChanged', (e) => {
  for (const [key] of Object.entries(playerNicks)) {
    delete playerNicks[key];
  }

  // default nickname should be here
  for (const party of e.party) {
    const v = nameToJobEnum[party.job];
    if (v) {
      playerNicks[party.name] = v;
    }
  }
  console.log(JSON.stringify(playerNicks));
});

console.log('enable name to job');
