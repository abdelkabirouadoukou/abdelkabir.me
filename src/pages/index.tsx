import { Island, type LoaderArgs, type RouteProps } from "@thexjs/core";
import ScrollSpy from "../components/scroll-spy";
import About from "../components/sections/About";
import Building from "../components/sections/Building";
import Hero from "../components/sections/Hero";
import LinuxSecurity from "../components/sections/LinuxSecurity";
import Math from "../components/sections/Math";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import { type GitHubData, fetchGithubData } from "../lib/github";

export const mode = "server";

export const islands = { ScrollSpy };

export async function loader(_args: LoaderArgs): Promise<Record<string, unknown>> {
  return { github: await fetchGithubData() };
}

export default function Home({ loaderData }: RouteProps) {
  const github = (loaderData?.github as GitHubData | undefined) ?? null;

  return (
    <div>
      <Island name="ScrollSpy" client="load">
        <ScrollSpy />
      </Island>

      <Hero github={github} />
      <About />
      <Building />
      <Projects github={github} />
      <Skills />
      <Math />
      <LinuxSecurity />
    </div>
  );
}