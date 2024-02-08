import { NotAuthenticated } from "@/src/components/dashboard-components/NotAuthenticated";
import { CertificateList } from "@/src/components/dashboard-components/CertificatesList";
import { getAllCertificates } from "@/src/app/lib/getCertificates";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function AddProject({}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { allCertificates } = await getAllCertificates();

  return (
    <div className="w-full flex justify-center items-start pt-14">
      {!user && <NotAuthenticated />}
      {user && (
        <div className="flex flex-col justify-center items-center w-full">
          <Link href={`/dashboard/certificates/add`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background">
              Add Certificate
            </Button>
          </Link>
          <CertificateList allCertificates={allCertificates} />
        </div>
      )}
    </div>
  );
}
