import { jobIDToCN } from '@/config/job';

export default () => {
  const playerNicks: Record<string, string> = (Options.PlayerNicks = {});

  addOverlayListener('PartyChanged', (e) => {
    for (const [key] of Object.entries(playerNicks)) {
      delete playerNicks[key];
    }

    // default nickname should be here
    for (const party of e.party) {
      // console.log(party.name, party.job, jobIDToCN[party.job]);

      const v = jobIDToCN[party.job];
      if (v) {
        playerNicks[party.name] = v;
      }
    }

    console.log(JSON.stringify(playerNicks));
  });

  console.log('enable name to job');
};
