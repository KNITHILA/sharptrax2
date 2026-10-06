// All static content for the About Us page.
// UI lives in ../components, composition lives in ../page.

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
}

export interface StatContent {
  value: string;
  label: string;
}

export interface HighlightItem {
  title: string;
  text: string;
}

export interface StoryContent {
  image: { src: string; alt: string };
  stat: StatContent;
  headingLead: string;
  headingAccent: string;
  paragraphs: string[];
  highlights: HighlightItem[];
}

export interface ValueItem {
  title: string;
  text: string;
  /** Spans both columns on tablet and 1 column on desktop (last card). */
  fullWidthOnTablet?: boolean;
}

export interface CoreValuesContent {
  title: string;
  items: ValueItem[];
}

export const heroContent: HeroContent = {
  eyebrow: "Our Legacy",
  titleLine1: "Engineering",
  titleLine2: "Excellence",
};

export const storyContent: StoryContent = {
  image: { src: "/4th-bg.svg", alt: "Industrial Facility" },
  stat: { value: "20+", label: "Years of Innovation" },
  headingLead: "Driving the future of",
  headingAccent: "Industrial Automation.",
  paragraphs: [
    "Established in 2005, Sharptrax Technologies has been at the forefront of providing high-precision welding and cutting solutions. We understand that in modern manufacturing, precision isn't just a requirement—it's the foundation of success.",
    "Our facility in Chennai is equipped with the latest engineering tools to design, prototype, and manufacture Special Purpose Machines (SPMs) that solve complex production challenges for the automotive and energy sectors.",
  ],
  highlights: [
    {
      title: "Precision",
      text: "Micron-level accuracy in all automated welding paths.",
    },
    {
      title: "Support",
      text: "24/7 technical assistance for all integrated systems.",
    },
  ],
};

export const coreValuesContent: CoreValuesContent = {
  title: "Why Partners Choose Us",
  items: [
    {
      title: "Reliability",
      text: "Our machines are built for 24/7 operation in the most demanding environments.",
    },
    {
      title: "Expertise",
      text: "Decades of cumulative engineering experience in robotic integration.",
    },
    {
      title: "Innovation",
      text: "Constant R&D to bring the latest plasma and laser tech to your floor.",
      fullWidthOnTablet: true,
    },
  ],
};