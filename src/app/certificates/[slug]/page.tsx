import { getSingleCertificate } from "@/src/app/actions/certificatesActions";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { certificate } = await getSingleCertificate(slug);
  return <div>{certificate?.certTitle}</div>;
};

export default page;
