import epl from '@/assets/logo/epl.png'
import bundesliga from '@/assets/logo/bundesliga.png'
import laliga from '@/assets/logo/laliga.png'
import seriea from '@/assets/logo/seriea.png'

export interface ITeam {
  league: string;
  logo: string;
  teams: string[];
}

export const teams: ITeam[] = [
  {
    league: "Premier League",
    logo: epl,
    teams: [
      "Manchester United",
      "Manchester City",
      "Liverpool",
      "Chelsea",
      "Arsenal",
    ],
  },
  {
    league: "La Liga",
    logo: laliga,

    teams: [
      "Real Madrid",
      "Barcelona",
      "Atletico Madrid",
      "Sevilla",
      "Valencia",
    ],
  },
  {
    league: "Serie A",
    logo: seriea,

    teams: ["Juventus", "AC Milan", "Inter Milan", "AS Roma", "Napoli"],
  },
  {
    league: "Bundesliga",
    logo: bundesliga,

    teams: [
      "Bayern Munich",
      "Borussia Dortmund",
      "RB Leipzig",
      "Bayer Leverkusen",
      "Schalke 04",
    ],
  },
];
