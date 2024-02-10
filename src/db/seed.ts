import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { projects } from "@/src/db/schema/projects";
import { certificates } from "@/src/db/schema/certificates";

export const certificatesData = [
  {
    id: 1,
    certTitle: "Linked-in Programming Foundation",
    certDesc: "LinkedIn",
    courseLink:
      "https://drive.google.com/drive/folders/1FP8XyG7QuFQzhco6y5AlLUSlgcPVPC…",
    profLink:
      "https://drive.google.com/drive/folders/1FP8XyG7QuFQzhco6y5AlLUSlgcPVPC…",
    certImageLink: "https://images.ahmedlotfy.dev/Full-List.png",
    createdAt: new Date("2024-01-24T17:17:53.791Z"),
  },
  {
    id: 2,
    certTitle: "Build Responsive Real World Websited With HTML and,CSS",
    certDesc: "Jonas Schmedtmann",
    courseLink:
      "https://www.udemy.com/course/design-and-develop-a-killer-website-with-…",
    profLink:
      "https://www.udemy.com/certificate/UC-155b5546-9c7a-4009-9266-78c078671…",
    certImageLink:
      "https://images.ahmedlotfy.dev/Build Responsive Real-World Website With…",
    createdAt: new Date("2024-01-24T17:22:10.313Z"),
  },
  {
    id: 3,
    certTitle: "The Complete JavaScript Course 2022: From Zero to Expert!",
    certDesc: "Jonas Schmedtmann",
    courseLink:
      "https://www.udemy.com/certificate/UC-3dec0b65-0644-4004-a320-37ead834e…",
    profLink:
      "https://www.udemy.com/certificate/UC-3dec0b65-0644-4004-a320-37ead834e…",
    certImageLink:
      "https://images.ahmedlotfy.dev/The Complete Javascript 2022 From ZERO T…",
    createdAt: new Date("2024-01-24T17:25:05.379Z"),
  },
  {
    id: 4,
    certTitle: "React Development Cross-Skilling",
    certDesc: "Udacity NanoDegree",
    courseLink: "https://egfwd.com/specializtion/react-development/",
    profLink: "https://learn.udacity.com/view-certificate/nd019-fwd-t4",
    certImageLink:
      "https://images.ahmedlotfy.dev/Screenshot 2024-01-24 192613.png",
    createdAt: new Date("2024-01-24T17:28:43.303Z"),
  },
  {
    id: 5,
    certTitle: "Complete React Developer (w/ Redux, Hooks, GraphQL)",
    certDesc: "Andrei Neagoie, Yihua Zhang (Zero To Mastery)",
    courseLink:
      "https://www.udemy.com/course/complete-react-developer-zero-to-mastery/",
    profLink:
      "https://www.udemy.com/certificate/UC-8ac9c151-b8f4-4440-a4b5-3595a71c6…",
    certImageLink:
      "https://images.ahmedlotfy.dev/Complete React Developer In 2023 w(Redux…",
    createdAt: new Date("2024-01-24T17:33:06.901Z"),
  },
  {
    id: 6,
    certTitle: "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)",
    certDesc: "Maximilian Schwarzmüller",
    courseLink: "https://www.udemy.com/course/nodejs-the-complete-guide/",
    profLink:
      "https://www.udemy.com/certificate/UC-00adb84c-49c5-4066-a82c-ab267a745…",
    certImageLink:
      "https://images.ahmedlotfy.dev/NodeJS - The Complete Guide (MVC,REST AP…",
    createdAt: new Date("2024-01-24T17:35:14.555Z"),
  },
  {
    id: 7,
    certTitle: "ChatGPT Basics Course",
    certDesc: "Almadrasa",
    courseLink: "https://almdrasa.com/tracks/ai/courses/chatgpt/",
    profLink:
      "https://almdrasa.com/certificate-verification/1332CB4B3-1332CB4B0-312A…",
    certImageLink: "https://images.ahmedlotfy.dev/Almadrasa chatgpt .png",
    createdAt: new Date("2024-01-24T17:41:47.137Z"),
  },
];

export const projectsData = [
  {
    projTitle: "Books App",
    projDesc:
      "This project was part of the 6 weeks internship with Chingu.io i worked with a team of 4 people on the project project is built on Vite as the front-end and express on the backend, the authentication part is built with passportjs practiced much and learned how to work on team based projects and practice on (agile) methodoligy",
    projImageLink:
      "https://images.ahmedlotfy.dev/Screenshot from 2023-06-13 16-51-11.png",
    liveLink: "https://chingu-v43-team14f.ahmedlotfy.dev/",
    repoLink: "https://github.com/chingu-voyages/v43-tier2-team-14",
    projCategories: ["featured"],
    createdAt: new Date("2023-06-13T14:25:32.566Z"),
  },
  {
    projTitle: "Pos System App",
    projDesc:
      "It is a full stack applciation POS System that serve any bussiness on their work with customers and maybe multiple customers at the same time if needed worked on the backend with nestjs with authenticaion and authorisation and jwt and everything and on the front-end the projct uses Vite App , routing is built on react router v6 i did it to practice more on all what i learned and practice on Nestjs Also",
    projImageLink:
      "https://images.ahmedlotfy.dev/Screenshot from 2024-01-21 00-01-00.png",
    liveLink: "https://pos-system-f.ahmedlotfy.dev/",
    repoLink: "https://github.com/ahmed-lotfy-dev/POS-System",
    projCategories: ["featured"],
    createdAt: new Date("2024-01-20T22:09:35.455Z"),
  },
];

// if (!("DATABASE_URL" in process.env))
//   throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  const client = new Pool({
    connectionString:
      "postgres://postgres:i4O9hcjlXUsz1IgKPvRoLb0ehE3OAZZpzF95JwYzezrH54qzuakajLnvMDZlZj6Q@193.123.91.169:5432/postgres",
  });
  const db = drizzle(client);

  console.log("Seed start");
  await db.insert(certificates).values(certificatesData);
  await db.insert(projects).values(projectsData);

  console.log("Seed done");
};

main();
