import { booksAppProjectData } from "./projects/books-app-project-data";
import { devChallengesProjectData } from "./projects/dev-challenges-data";
import { hiXProjectData } from "./projects/hi-x-project-data";
import { posSystemProject } from "./projects/pos-system-project-data";
import { portfolioProjectData } from "./projects/portfolio-project-data";
import { selfTrackerProjectData } from "./projects/self-tracker-project-data";
import { tootaArtProject } from "./projects/toota-art-project-data";
import { zamalekStoreProject } from "./projects/zamalek-store-project-data";

// All project data files now export arrays, so we just flatten them
export const projectsSeedData = [
  ...booksAppProjectData,
  ...devChallengesProjectData,
  ...hiXProjectData,
  ...posSystemProject,
  ...portfolioProjectData,
  ...selfTrackerProjectData,
  ...tootaArtProject,
  ...zamalekStoreProject,
];
