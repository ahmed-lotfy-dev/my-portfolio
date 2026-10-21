"use server";

import { createElement } from "react";
import { getContactSchema } from "@/src/lib/schemas/contactSchema";
import { Resend } from "resend";
import ContactNotificationEmail from "@/src/emails/contact-notification";
import ContactConfirmationEmail from "@/src/emails/contact-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function contactAction(state: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const locale = (formData.get("locale") as string) || "en";

  const schema = await getContactSchema(locale);
  const result = schema.safeParse({ name, email, subject, message });

  if (result.success) {
    const sentAt = new Date().toISOString();
    const preview =
      (message as string).length > 240
        ? `${(message as string).slice(0, 240)} …`
        : (message as string);

    // 1) Notification to the owner with full details.
    await resend.emails.send({
      to: ["elshenawy19@gmail.com", "contact@alotfy.site"],
      // Same domain as the sender identity in Resend, just with a friendly name.
      from: "Portfolio Contact <contact@alotfy.site>",
      // Replies from the inbox go straight to the visitor's email.
      replyTo: email as string,
      subject: subject as string,
      react: createElement(ContactNotificationEmail, {
        name: name as string,
        email: email as string,
        subject: subject as string,
        message: message as string,
        submittedAt: sentAt,
      }),
      text: `New contact form message\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });

    // 2) Auto-confirmation to the visitor: thank-you + phone number ask.
    // Best-effort only — a failure here never blocks the form UX.
    const firstName = (name as string).trim().split(/\s+/)[0] || "there";
    await resend.emails
      .send({
        to: [email as string],
        from: "Ahmed Lotfy <contact@alotfy.site>",
        replyTo: "contact@alotfy.site",
        subject: "Thanks! Your message is in — one quick thing",
        react: createElement(ContactConfirmationEmail, {
          name: name as string,
          messagePreview: preview,
          submittedAt: sentAt,
        }),
        text: `Thanks for reaching out, ${firstName}!

Your message reached me and I will contact you through this email — usually within one business day.

If you'd like, reply to this email with your phone number and the best time to call (optional).

— Ahmed
https://alotfy.site`,
      })
      .catch((error) =>
        console.error("contact confirmation email failed", error)
      );

    return { success: true, data: result.data };
  }

  return { success: false, error: result.error.format() };
}
