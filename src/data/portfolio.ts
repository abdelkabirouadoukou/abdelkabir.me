export const GITHUB = "https://github.com/abdelkabirouadoukou";
export const THEXJS_REPO = "https://github.com/abdelkabirouadoukou/x";

export const SITE_TITLE = "Abdelkabir Ouadoukou · solo developer";
export const SITE_DESCRIPTION =
  "Portfolio of Abdelkabir Ouadoukou, solo developer and student in Marrakesh, Morocco. Building @thexjs, a meta-fullstack framework for Bun, plus micro-SaaS tools and math research.";

export interface NavItem {
  href: string;
  label: string;
}

export const NAV: NavItem[] = [
  { href: "#about", label: "About" },
  { href: "#building", label: "Building" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#math", label: "Math" },
];

export interface Project {
  name: string;
  description: string;
  stack: string[];
  href: string;
}

export const CLIENT_PROJECT = {
  name: "xymathprepa.com",
  description:
    "Online math-training platform for CPGE students I built for a client: video lessons, corrected exercises, and progress tracking that syncs with WhatsApp.",
  language: "TypeScript",
  stack: ["Next.js", "Tailwind CSS", "Supabase", "shadcn/ui"],
  href: "https://www.xymathprepa.com/",
};

export const projects: Project[] = [
  {
    name: "LiveGaffer",
    description:
      "A live soccer assistant manager and AI tactical analyst that tracks match momentum and team shape in real time, then turns it into structured insights through a free LLM pipeline.",
    stack: ["Python", "FastAPI", "Streamlit"],
    href: "https://github.com/abdelkabirouadoukou/LiveGaffer",
  },
  {
    name: "NanoBrainAI",
    description:
      "A neural network built from nothing but linear algebra and calculus, no ML libraries.",
    stack: ["Python"],
    href: "https://github.com/abdelkabirouadoukou/NanoBrainAI",
  },
  {
    name: "minecraft",
    description:
      "A Minecraft-like world rebuilt block by block with React Three Fiber.",
    stack: ["TypeScript", "Three.js / R3F"],
    href: "https://github.com/abdelkabirouadoukou/minecraft",
  },
  {
    name: "nth-roots-visualizer",
    description:
      "An interactive look at n-th roots of unity and modular multiplication patterns on the unit circle.",
    stack: ["Next.js", "TypeScript"],
    href: "https://github.com/abdelkabirouadoukou/nth-roots-visualizer",
  },
  {
    name: "prepa-pcsi",
    description:
      "Math functions and algorithms in Python, with runnable examples.",
    stack: ["Python"],
    href: "https://github.com/abdelkabirouadoukou/prepa-pcsi",
  },
  {
    name: "algebre-lineaire-projecteur",
    description:
      "A 3D visualization of a vector projector, watch x = x_G + x_H decompose live in the browser.",
    stack: ["JavaScript", "Three.js"],
    href: "https://github.com/abdelkabirouadoukou/algebre-lineaire-projecteur",
  },
];

export interface TechGroup {
  label: string;
  items: string[];
}

export const techStack: TechGroup[] = [
  {
    label: "Programming Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "HTML/CSS"],
  },
  {
    label: "Frontend Development",
    items: ["React", "Next.js", "Three.js / React Three Fiber", "Tailwind CSS"],
  },
  {
    label: "Backend Development",
    items: ["Bun", "Node.js", "FastAPI", "@thexjs (own framework)"],
  },
  {
    label: "Database, CMS & Cloud",
    items: ["SQLite", "Prisma", "Drizzle", "Neon", "Vercel", "Cloudinary"],
  },
  {
    label: "AI, Tools & Auth",
    items: ["Groq", "Gemini", "Pydantic", "Clerk", "Git", "Selenium"],
  },
];