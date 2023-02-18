import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import z from "zod";
import multer from "multer";
import prisma from "@/src/lib/prismadb";

interface NextApiRequestExtended extends NextApiRequest {
  file: any;
  files: any;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/images/projects");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + crypto.randomUUID();
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const formSchema = z.object({
  projectTitle: z.string(),
  description: z.string(),
  // file: z.instanceof(File),
});

type FormData = z.infer<typeof formSchema>;

type responseData = {
  message: string;
};

export default async function addProject(
  req: NextApiRequestExtended,
  res: NextApiResponse<responseData>
) {
  const body = req.body;
  const file = req.file;
  console.log("body", body);
  console.log("file", file);
  res.status(200).json({
    message: "Project Created",
  });
}
