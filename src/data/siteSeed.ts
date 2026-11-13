// Factory defaults for the Home "Automation Solutions" cards and Footer links.
// Slugs point at products in servicesCatalog.ts.

export interface FeaturedItem {
  id: string;
  slug: string;
  title: string;
  desc: string;
  img: string;
}

export interface FooterLink {
  id: string;
  slug: string;
  label: string;
}

export const seedFeatured: FeaturedItem[] = [
  {
    id: "f-1",
    slug: "robotic-automation",
    title: "Robotic Automation",
    desc: "At Sharptrax Technologies, we design and integrate robotic welding systems that deliver consistent weld quality, improved productivity, and reduced manual dependency.",
    img: "/screen5/5ma1.svg",
  },
  {
    id: "f-2",
    slug: "welding-positioners",
    title: "Welding Positioners",
    desc: "Custom-built welding positioners designed to improve accessibility, accuracy, and productivity in complex welding applications.",
    img: "/screen5/5ma2.svg",
  },
  {
    id: "f-3",
    slug: "plasma-transferred-arc-welding-system",
    title: "Plasma Transferred Arc Welding System",
    desc: "Our PTA welding systems provide precise hardfacing and cladding solutions with superior material control and repeatability.",
    img: "/screen5/5ma3.svg",
  },
  {
    id: "f-4",
    slug: "plasma-cnc-machine",
    title: "Plasma CNC Machine",
    desc: "Automated CNC cutting solutions delivering accuracy, efficiency, and clean cuts for industrial fabrication requirements.",
    img: "/screen5/5ma4.svg",
  },
  {
    id: "f-5",
    slug: "welding-rotator",
    title: "Welding Rotator",
    desc: "Engineered for safe and efficient rotation of cylindrical components, ensuring uniform weld quality and operator safety.",
    img: "/screen5/5ma5.svg",
  },
  {
    id: "f-6",
    slug: "port-welding-machine-spm",
    title: "Port Welding Machine SPM",
    desc: "Tailor-made automation and welding SPMs designed to meet unique production and process requirements.",
    img: "/screen5/5ma6.svg",
  },
];

export const seedFooterLinks: FooterLink[] = [
  { id: "l-1", slug: "robotic-automation", label: "Robotic Welding" },
  { id: "l-2", slug: "plasma-transferred-arc-welding-system", label: "PTA Welding Systems" },
  { id: "l-3", slug: "welding-rotator", label: "Welding Rotators" },
  { id: "l-4", slug: "welding-positioners", label: "Welding Positioners" },
  { id: "l-5", slug: "plasma-cnc-machine", label: "CNC Cutting Machines" },
  { id: "l-6", slug: "port-welding-machine-spm", label: "Special Purpose Machines" },
];