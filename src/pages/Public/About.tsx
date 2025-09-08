import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
}

const team: TeamMember[] = [
  {
    id: 1,
    name: "Saleheen Uddin Sakin",
    role: "Founder & Lead Developer",
    description:
      "A lifelong football fan combining a passion for the beautiful game with cutting-edge web development to build the ultimate hub for jersey enthusiasts.",
    avatarUrl: "https://avatars.githubusercontent.com/u/171696749?s=400&u=ffa547b68d80b144028671c394ed87770e47610b&v=4",
  },
  {
    id: 2,
    name: "Ishrat Jahan",
    role: "UI/UX Designer",
    description:
      "Crafting a seamless and visually appealing shopping experience, making it easy for fans to find and purchase their favorite team's gear.",
    avatarUrl: "https://randomuser.me/api/portraits/women/40.jpg",
  },
  {
    id: 3,
    name: "PiroPanda",
    role: "Backend Engineer",
    description:
      "Building the robust and secure backend infrastructure that powers our store, ensuring every transaction is smooth and reliable.",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQGoZVFcccvgmQ/profile-displayphoto-crop_800_800/B56ZipwWGXG0AQ-/0/1755194680659?e=1759363200&v=beta&t=ozOfbdsGHMFNGkKdEAhHk80XI-c8N3RuUs_rvR7FGqE",
  },
];

export default function About() {
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-3xl px-6 lg:max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            About Jersey Hub
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-7">
            Jersey Hub is the ultimate destination for football fans. We offer a
            curated selection of high-quality jerseys from top leagues around the
            world, so you can wear your passion with pride.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
            Our mission is to connect fans with the game they love by providing
            authentic, high-quality jerseys and an exceptional shopping
            experience. We celebrate the passion, history, and culture of football.
          </p>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold text-center">Meet Our Team</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.id} className="flex flex-col">
                <CardContent className="flex-1 text-center">
                  <img
                    className="mx-auto mb-4 size-20 rounded-full"
                    src={member.avatarUrl}
                    alt={member.name}
                  />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground mb-2 text-xs">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-semibold">Our Core Values</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-6">
              <h3 className="mb-2 text-lg font-medium">Quality</h3>
              <p className="text-muted-foreground text-sm">
                We are committed to offering top-tier jerseys that look and feel
                great.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-6">
              <h3 className="mb-2 text-lg font-medium">Passion</h3>
              <p className="text-muted-foreground text-sm">
                We are fans ourselves, and we share the love for the game that our
                customers have.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-6">
              <h3 className="mb-2 text-lg font-medium">Authenticity</h3>
              <p className="text-muted-foreground text-sm">
                We provide detailed information about our products so you know
                exactly what you're buying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
