import { posSystemProject } from "./pos-system-project-data";
import { projectsData as selfTrackerProjectData } from "./self-tracker-project-data";
import { tootaArtProject } from "./toota-art-project-data";
import { zamalekStoreProject } from "./zamalek-store-project-data";
import { projectsData as devChallengesProjectData } from "./dev-challenges-data";
import { booksAppProjectData } from "./books-app-project-data";
import { hiXProjectData } from "./hi-x-project-data";

// Extract data from arrays
const selfTracker = selfTrackerProjectData;
const devChallenges = devChallengesProjectData;
const booksApp = booksAppProjectData;
const hiXApp = hiXProjectData;

// Normalize Helper
const normalizeProject = (project: any, type: "flat" | "nested") => {
  if (type === "nested") {
    return {
      title_en: project.basicInfo.titleEn,
      title_ar: project.basicInfo.titleAr,
      desc_en: project.shortDescription.en,
      desc_ar: project.shortDescription.ar,
      content_en: project.caseStudy.en,
      content_ar: project.caseStudy.ar,
      imageLink: project.mediaMetadata.coverImage,
      liveLink: project.mediaMetadata.liveLink,
      repoLink: project.mediaMetadata.repoLink,
      categories: project.mediaMetadata.categories,
      displayOrder: project.displayOrder,
    };
  } else {
    // Flat structure (SelfTracker, DevChallenges, BooksApp, Hi-X)
    return {
      title_en: project.title_en ?? project.title, // Fallback if title is generic
      title_ar: project.title_ar ?? project.title,
      desc_en: project.short_description_en ?? project.desc_en,
      desc_ar: project.short_description_ar ?? project.desc_ar,
      content_en: project.content_en || null,
      content_ar: project.content_ar || null,
      imageLink: project.cover_image ?? project.imageLink,
      liveLink: project.live_link ?? project.liveLink ?? "", // Ensure string
      repoLink: project.repo_link ?? project.repoLink ?? "",
      categories: project.categories,
      displayOrder: project.display_order,
    };
  }
};

export const projectsSeedData = [
  normalizeProject(booksApp, "flat"),          // 1
  normalizeProject(devChallenges, "flat"),     // 2
  normalizeProject(hiXApp, "flat"),            // 3
  normalizeProject(posSystemProject, "nested"),// 4
  normalizeProject(selfTracker, "flat"),       // 5
  normalizeProject(tootaArtProject, "nested"), // 6
  normalizeProject(zamalekStoreProject, "nested") // 7
];
