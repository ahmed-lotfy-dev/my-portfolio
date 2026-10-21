import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt?: string;
}

/*
 * Dark cinematic email matching the portfolio theme.
 * Rendered server-side by Resend via the `react` parameter — no API calls,
 * no images required, degrades gracefully in every client.
 */
export default function ContactNotificationEmail({
  name,
  email,
  subject,
  message,
  submittedAt,
}: ContactNotificationProps) {
  const sentAt = submittedAt
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Cairo",
      }).format(new Date(submittedAt))
    : "";

  return (
    <Html lang="en">
      <Head />
      <Preview>{subject} — message from {name} via the contact form</Preview>
      <Tailwind>
        <Body
          className="m-0 bg-[#05070d] px-4 py-10 font-sans"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <Container className="mx-auto w-full max-w-[560px]">
            {/* Brand header */}
            <Section>
              <Text className="m-0 text-[13px] font-bold tracking-[0.22em] text-[#60a5fa] uppercase">
                Ahmed Lotfy
              </Text>
              <Text className="m-0 mt-1 text-[11px] tracking-[0.14em] text-[#64748b] uppercase">
                Contact form · alotfy.site
              </Text>
            </Section>

            {/* Main card */}
            <Section className="mt-4 rounded-lg border border-[#1e293b] bg-[#0b1120] p-6">
              <Text className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#94a3b8] uppercase">
                Inbox message
              </Text>
              <Text
                dir="auto"
                className="m-0 mt-2 break-words text-[21px] leading-snug font-bold text-white"
              >
                {subject}
              </Text>

              <Hr className="my-5 border-[#1e293b]" />

              <Row>
                <Column className="w-1/2 pr-2" align="left">
                  <Text className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#94a3b8] uppercase">
                    From
                  </Text>
                  <Text dir="auto" className="m-0 mt-1 text-[15px] font-semibold text-white">
                    {name}
                  </Text>
                </Column>
                <Column className="w-1/2 pl-2" align="left">
                  <Text className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#94a3b8] uppercase">
                    Email
                  </Text>
                  <Link
                    href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
                    className="m-0 mt-1 text-[15px] text-[#60a5fa] no-underline"
                  >
                    {email}
                  </Link>
                </Column>
              </Row>

              <Hr className="my-5 border-[#1e293b]" />

              {/* Message body */}
              <Section className="rounded-md border-l-4 border-[#3b82f6] bg-[#0f172a] p-4">
                <Text className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#94a3b8] uppercase">
                  Message
                </Text>
                <Text
                  dir="auto"
                  className="m-0 mt-2 text-[15px] leading-[1.75] whitespace-pre-wrap text-[#e2e8f0]"
                >
                  {message}
                </Text>
              </Section>
            </Section>

            {/* Actions */}
            <Row className="mt-4">
              <Column className="pr-2">
                <Button
                  href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
                  className="rounded-md bg-[#3b82f6] px-5 py-3 text-[14px] font-semibold text-white no-underline"
                >
                  Reply to {name.split(" ")[0]}
                </Button>
              </Column>
              <Column className="pl-2">
                <Button
                  href="https://alotfy.site/en/contact"
                  className="rounded-md border border-[#334155] bg-transparent px-5 py-3 text-[14px] font-semibold text-[#94a3b8] no-underline"
                >
                  Open contact page
                </Button>
              </Column>
            </Row>

            {/* Footer */}
            <Hr className="mt-6 border-[#1e293b]" />
            <Text className="m-0 text-[11px] leading-[1.6] text-[#475569]">
              Sent {sentAt} from the contact form at https://alotfy.site.
              <br />
              You received this because a visitor used the form — replying goes
              directly to their inbox.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
