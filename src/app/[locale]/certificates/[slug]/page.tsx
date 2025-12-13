import { getSingleCertificate } from "@/src/app/actions/certificatesActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { certificate } = await getSingleCertificate(slug);

  if (!certificate) {
    return {
      title: "Certificate Not Found",
    };
  }

  return {
    title: certificate.title,
    description: certificate.desc,
    openGraph: {
      images: [certificate.imageLink],
    },
  };
}

const page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = params;
  const { certificate } = await getSingleCertificate(slug);
  // TODO: Add localized title and description for certificates
  return <div>{certificate?.title}</div>;
};

export default page;
