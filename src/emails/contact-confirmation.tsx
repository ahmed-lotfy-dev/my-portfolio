import {
  Body,
  Button,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export interface ContactConfirmationProps {
  name: string;
  messagePreview: string;
  submittedAt?: string;
}

/*
 * Auto-confirmation sent to the visitor after a successful contact form
 * submission. Thanks them, asks for a phone number, and points replies
 * at contact@alotfy.site (the from-address), so the owner gets it.
 * SVG logos are blocked by Gmail, so we use a PNG favicon-sized asset.
 */
export default function ContactConfirmationEmail({
  name,
  messagePreview,
  submittedAt,
}: ContactConfirmationProps) {
  const firstName = (name || "").trim().split(/\s+/)[0] || "there";
  const sentAt = (() => {
    if (!submittedAt) return "";
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Cairo",
    }).format(new Date(submittedAt));
  })();

  const replyHref =
    "mailto:contact@alotfy.site" +
    "?subject=" +
    encodeURIComponent("My phone number") +
    "&body=" +
    encodeURIComponent(`Hi Ahmed,\n\nMy phone number: \nBest time to reach me: \n`);

  return (
    <Html lang="en">
      <Preview>Message received — thanks, {firstName}! One quick thing</Preview>
      <Tailwind>
        <Body
          className="m-0 bg-[#05070d] px-4 py-10 font-sans"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <Section className="mx-auto w-full max-w-[560px] px-2">
            {/* Logo */}
            <Img
              src="https://alotfy.site/icon.png"
              width={72}
              height={72}
              alt="Ahmed Lotfy"
              className="rounded-xl"
            />
            <Text className="m-0 mt-3 text-[13px] font-bold tracking-[0.22em] text-[#60a5fa] uppercase">
              Ahmed Lotfy
            </Text>
            <Text className="m-0 text-[11px] tracking-[0.14em] text-[#64748b] uppercase">
              Senior Full-Stack Engineer · alotfy.site
            </Text>

            {/* Greeting card */}
            <Section className="mt-5 rounded-lg border border-[#1e293b] bg-[#0b1120] p-6">
              <Text className="m-0 text-[24px] leading-snug font-bold text-white">
                Thanks for reaching out, {firstName}! 👋
              </Text>
              <Text dir="auto" className="m-0 mt-3 text-[15px] leading-[1.7] text-[#c7d2e1]">
                Your message landed in my inbox and I&apos;ve got it safe. I
                read every submission myself and will contact you through this
                email — usually within one business day.
              </Text>

              {/* Echo of what they sent */}
              <Text className="m-0 mt-5 text-[11px] font-semibold tracking-[0.18em] text-[#94a3b8] uppercase">
                What you sent
              </Text>
              <Text className="m-0 mt-2 text-[11px] text-[#475569]">{sentAt}</Text>
              <Section className="mt-2 rounded-md border-l-4 border-[#3b82f6] bg-[#0f172a] p-4">
                <Text
                  dir="auto"
                  className="m-0 text-[14px] leading-[1.7] whitespace-pre-wrap text-[#e2e8f0]"
                >
                  {messagePreview}
                </Text>
              </Section>
            </Section>

            {/* Phone number ask */}
            <Section className="mt-4 rounded-lg border border-[#1e40af] bg-[#0c1a33] p-6">
              <Text className="m-0 text-[12px] font-semibold tracking-[0.18em] text-[#93c5fd] uppercase">
                One quick thing 📞
              </Text>
              <Text className="m-0 mt-2 text-[15px] leading-[1.7] text-[#dbeafe]">
                If you&apos;d like, reply to this email with your{" "}
                <strong className="font-bold text-white">phone number</strong>{" "}
                and the best time to call — useful if we end up scheduling a
                call. Totally optional, and never shared.
              </Text>
              <Text className="m-0 mt-2 text-[13px] leading-[1.6] text-[#94a3b8]">
                Just use the button below or hit Reply on this email — it comes
                straight to my inbox.
              </Text>
              <Button
                href={replyHref}
                className="mt-4 rounded-md bg-[#3b82f6] px-5 py-3 text-[14px] font-semibold text-white no-underline"
              >
                Reply with my phone number
              </Button>
            </Section>

            <Hr className="mt-6 border-[#1e293b]" />
            <Text className="m-0 text-[11px] leading-[1.6] text-[#475569]">
              This is an automated confirmation from the contact form at{" "}
              <span className="text-[#60a5fa]">https://alotfy.site</span>.
              <br />
              Sent {sentAt} · You&apos;re receiving this because you submitted
              the form.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
