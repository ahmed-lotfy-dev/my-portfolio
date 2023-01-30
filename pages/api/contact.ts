import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// type Data = {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// };

type Response = {
  message: string;
  toastMessage: string;
};

export default async function Contact(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { name, email, subject, message } = req.body;
  const msg = {
    to: ["elshenawy19@gmail.com", "contact@ahmedlotfy.me"], // Change to your recipient
    from: "contact@ahmedlotfy.me", // Change to your verified sender
    subject: subject,
    text: message,
    html: `<strong>This Email Is From: ${name},\n
    His Email Is: ${email}\n
    And This Is His Message :${message}</strong>`,
  };
  try {
    await sgMail.sendMultiple(msg);
    res.status(200).json({
      message: "Email Has Been Sent Successfully",
      toastMessage:
        "Thanks For Contacting Me,i'll Get Back To You As Fast As I Can",
    });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Email Cannot Be Sent",
        toastMessage: "Email Has Not Been Sent,Try Again Later Please",
      });
  }
}
