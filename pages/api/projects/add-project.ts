import { prisma } from "@/src/lib/prismadb";
import nextConnect from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

const upload = multer({
  // Disk Storage option
  storage: multer.diskStorage({
    destination: "./public/projects",
    filename: (req, file, cb) =>
      cb(
        null,
        `${file.originalname}-${crypto.randomUUID()}.${
          file.mimetype.split("/")[1]
        }`
      ),
  }),
});

//const storage = multer.memoryStorage() // Memory Storage option pass along as stream
//const upload = multer({ storage: storage })

const apiRoute = nextConnect({
  onError(error, req: any, res: any) {
    res.status(501).json({ error: `There was an error! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const project = await prisma.project.create({
      data: {
        projectTitle: req.body.projectTitle,
        projectDesc: req.body.projectDescription,
        projectImage: `${req.file.destination}/${req.file.filename}`,
      },
    });
    console.log(project);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "Project Created Image Uploaded" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
