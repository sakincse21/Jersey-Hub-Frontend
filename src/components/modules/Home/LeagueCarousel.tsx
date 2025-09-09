import { Link } from "react-router";
import { teams } from "@/constants/teams";
import { Card, CardContent } from "@/components/ui/card";

const LeagueCarousel = () => {
  // Duplicate the array for a seamless marquee effect
  const marqueeLeagues = [...teams, ...teams];

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Shop by League</h2>
        <p className="text-muted-foreground text-center mb-10">
          Find your favorite team's jersey from top leagues.
        </p>
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
            {marqueeLeagues.map((team, index) => (
              <Link
                to={`/collections?league=${encodeURIComponent(team.league)}`}
                key={index}
                className="mx-4"
              >
                <Card className="w-48 h-36 transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <img
                      src={team.logo}
                      alt={team.league}
                      className="h-16 object-contain roundemd"
                    />
                    <span className="mt-3 font-semibold text-center text-sm">
                      {team.league}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeagueCarousel;
