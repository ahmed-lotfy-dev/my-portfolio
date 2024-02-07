import { projects } from "@/src/db/schema";
import { db } from "@/src/app/lib/db";
import { eq } from "drizzle-orm";

async function getAllProjects() {
  try {
    const allProjects = await db.query.projects.findMany({});

    return { allProjects };
  } catch (error) {
    return { error };
  }
}

async function getSingleProject(projectTitle: string) {
  try {
    const singleProject = await db.query.projects.findFirst({
      with: { title: projectTitle },
    });
    return { sucess: true, message: "Project Found", singleProject };
  } catch (error) {
    return { success: false, message: "Projcts Not Found" };
  }
}

async function updateSingleCertificate(project: any) {
  const updatedCertificate = await db.update(projects).set({ ...project });
  return {
    success: true,
    message: "Project Updated Successfully",
    updatedCertificate,
  };
}

async function deleteSingleCertificate(id: number) {
  const deletCertificate = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();
  return {
    success: true,
    message: "Project Deleted Successfully",
  };
}
export {
  getAllProjects,
  getSingleProject,
  updateSingleCertificate,
  deleteSingleCertificate,
};
