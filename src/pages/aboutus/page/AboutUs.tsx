import AboutHero from "../components/AboutHero";
import AboutStory from "../components/AboutStory";
import CoreValues from "../components/CoreValues";

export default function AboutUs() {
  return (
    <>
      <div className="w-full min-h-screen bg-white hero-font">
        {/* HEADER SPACING (To clear fixed navbar) */}
        <div className="h-20 w-full bg-white"></div>

        {/* TOP HERO SECTION */}
        <AboutHero />

        {/* CONTENT BLOCK 1: IMAGE LEFT, TEXT RIGHT */}
        <AboutStory />

        {/* CORE VALUES / GRID SECTION */}
        <CoreValues />
      </div>
    </>
  );
}