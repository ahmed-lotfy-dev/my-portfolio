import { getSingleCertificate } from "@/src/app/actions/certificatesActions";

const page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = params;
  const { certificate } = await getSingleCertificate(slug);
  return <div>{certificate?.title}</div>;
};

export default page;
