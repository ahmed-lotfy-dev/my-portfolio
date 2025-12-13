import SystemHealth from "@/src/components/dashboard-components/SystemHealth";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BackupsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Check if user is admin
  // We can reuse the same check or just pass the flag. 
  // Ideally, this page should be protected or at least the component handles it.
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
      // Optional: Redirect if strict admin only
      // redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 w-full p-5 pt-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Backups & Disaster Recovery</h1>
        <p className="text-muted-foreground">Manage database and media backups. Restore points are stored in Cloudflare R2.</p>
      </div>

      <SystemHealth 
        isAdmin={!!isAdmin}
        cfAccountId={process.env.CF_ACCOUNT_ID}
        cfBucketName={process.env.CF_BUCKET_NAME} 
      />
    </div>
  );
}
