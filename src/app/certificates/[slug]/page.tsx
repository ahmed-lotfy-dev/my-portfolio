import React from "react";
import { getSingleCertificate } from "../../lib/getCertificates";

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { certificate } = await getSingleCertificate(slug);
  return <div>{certificate?.certTitle}</div>;
};

export default page;
