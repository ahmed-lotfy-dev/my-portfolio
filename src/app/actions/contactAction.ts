"use server"

import { contactSchema } from "../../lib/schemas/contactSchema"
import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function contactAction(state: any, formData: FormData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")
  const result = contactSchema.safeParse({ name, email, subject, message })

  if (result.success) {
    const msg = {
      to: ["elshenawy19@gmail.com", "contact@ahmedlotfy.dev"],
      from: "contact@ahmedlotfy.dev",
      subject: subject as string,
      text: message as string,
      html: `<strong>This Email Is From: ${name},<br>
        His Email Is: ${email}<br>
        And This Is His Message :${message}</strong>`,
    }
    const sent = await sgMail.sendMultiple(msg)
    return { success: true, data: result.data }
  }
  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}
