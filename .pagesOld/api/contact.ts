import type { NextApiRequest, NextApiResponse } from "next"
import z from "zod"
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const FormDataSchema = z.object({
  name: z.string().trim().min(5),
  email: z.string().trim().email(),
  subject: z.string().min(5),
  message: z.string().min(5),
})
// type Data = {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// };

type Response = {
  message: string
  toastMessage: string
  error?: Object
}

export default async function Contact(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const formData = req.body
  // const { name, email, subject, message } = req.body;


}
