import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FormDataSchema = z.object({
  name: z.string().trim().min(5),
  email: z.string().trim().email(),
  subject: z.string().min(5),
  message: z.string().min(5),
});
// type Data = {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// };

type Response = {
  message: string;
  toastMessage: string;
  error?: Object;
};

export default async function Contact(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const formData = req.body;
  // const { name, email, subject, message } = req.body;

  try {
    const validatedData = FormDataSchema.parse(formData);
    const { name, email, subject, message } = validatedData;
    const msg = {
      to: ["elshenawy19@gmail.com", "contact@ahmedlotfy.me"], // Change to your recipient
      from: "contact@ahmedlotfy.me", // Change to your verified sender
      subject: subject,
      text: message,
      html: `<strong>This Email Is From: ${name},<br>
      His Email Is: ${email}<br>
      And This Is His Message :${message}</strong>`,
    };
    await sgMail.sendMultiple(msg);
    res.status(200).json({
      message: "Email has been sent successfully",
      toastMessage: "Thank you for contacting me",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: "Email Cannot Be Sent",
      toastMessage: "Email Has Not Been Sent",
      error: JSON.parse(err),
    });
  }
}
