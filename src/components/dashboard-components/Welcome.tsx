import { authClient } from "@/src/lib/auth-client"
import { getTranslations } from "next-intl/server"

export default async function Welcome() {
  const { data: session } = await authClient.getSession()
  const user = session?.user
  const t = await getTranslations("dashboard.welcome")

  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-start flex-col pl-10">
        <h2 className="mb-6">
          {t("greeting", { name: user?.name || t("guest") })}
        </h2>

        {isAdmin ? <p>{t("admin_message")}</p> : <p>{t("user_message")}</p>}
      </div>
    </div>
  )
}
