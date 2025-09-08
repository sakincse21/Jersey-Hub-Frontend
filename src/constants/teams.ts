export interface ITeam {
  league: string;
  logo: string;
  teams: string[];
}

export const teams: ITeam[] = [
  {
    league: "Premier League",
    logo: "/src/assets/logo/epl.png",
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
    logo: "/src/assets/logo/laliga.png",

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
    logo: "/src/assets/logo/seriea.png",

    teams: ["Juventus", "AC Milan", "Inter Milan", "AS Roma", "Napoli"],
  },
  {
    league: "Bundesliga",
    logo: "/src/assets/logo/bundesliga.png",

    teams: [
      "Bayern Munich",
      "Borussia Dortmund",
      "RB Leipzig",
      "Bayer Leverkusen",
      "Schalke 04",
    ],
  },
];
