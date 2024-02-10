import { getSingleCertificate } from "@/src/app/lib/getCertificates";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { certificate } = await getSingleCertificate(slug);
  return <div>{certificate?.title}</div>;
};

export default page;
