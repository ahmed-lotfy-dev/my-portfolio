import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import z from "zod";
import multer from "multer";
import prisma from "@/src/lib/prismadb";
import nextConnect from "next-connect";

interface NextApiRequestExtended extends NextApiRequest {
  file: any;
  files: any;
}

const formSchema = z.object({
  projectTitle: z.string(),
  description: z.string(),
  // file: z.instanceof(File),
});

type FormData = z.infer<typeof formSchema>;

type responseData = {
  message: string;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/images/projects  ");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + crypto.randomUUID();
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const apiRoute = nextConnect({
  onError(error, req: NextApiRequestExtended, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Returns middleware that processes multiple files sharing the same field name.
const uploadMiddleware = upload.single("file");

// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);

// Process a POST request
apiRoute.post((req, res) => {
  console.log(req.file);
  console.log(req.body);
  return res.status(200).json({ message: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
