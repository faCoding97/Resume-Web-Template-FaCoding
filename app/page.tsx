import BackgroundCanvas from "@/components/BackgroundCanvas";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProfilePhoto from "@/components/ProfilePhoto";
import PersonalInfo from "@/components/PersonalInfo";
import PortfolioGrid from "@/components/PortfolioGrid";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import data from "../data.json";

type Profile = {
  image: string;
  linkedin: string;
  email: string;
  domain: string;
};

type PortfolioItem = {
  url: string;
  description: string;
};

type About = { headline: string; summary: string };
type SkillsMap = Record<string, string[]>;

export default function Page() {
  const profile = (data as any).profile as Profile;
  const items = (data as any).portfolio as PortfolioItem[];
  const about = (data as any).about as About;
  const skills = (data as any).skills as SkillsMap;

  return (
    <main className="relative pb-24">
      <BackgroundCanvas
        density={1.6}
        maxParticles={260}
        linkDistance={160}
        repelRadius={130}
        wander={0.012}
        maxSpeed={1.6}
        autoPilot
      />

      {/* محتوا بالای بک‌گراند */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 md:pt-28">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <ProfilePhoto src={profile.image} alt="Profile photo" />
          <Hero name="Faraz Aghababayi" subtitle="Full-stack Developer" />
        </div>

        {/* About */}
        <div className="mt-8">
          <Section title="About" id="about">
            <AboutSection headline={about.headline} summary={about.summary} />
          </Section>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <Section title="Technical Skills" id="skills">
            <SkillsSection skills={skills} />
          </Section>
        </div>

        {/* Personal Info */}
        <div className="mt-8">
          <Section title="Contact & Links" id="contact">
            <PersonalInfo
              linkedin={profile.linkedin}
              email={profile.email}
              domain={profile.domain}
            />
          </Section>
        </div>

        {/* Portfolio */}
        <div className="mt-10">
          <Section title="Portfolio Highlights" id="portfolio">
            <p className="mb-3 text-sm text-gray-400">
              Hover a card to preview details with a type-on effect. Click to
              visit.
            </p>
            <PortfolioGrid items={items} />
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-400">
          <span>
            © {new Date().getFullYear()} Faraz Aghababayi. Built with Next.js,
            Tailwind, and a sprinkle of canvas magic.
          </span>
        </footer>
      </div>
    </main>
  );
}
