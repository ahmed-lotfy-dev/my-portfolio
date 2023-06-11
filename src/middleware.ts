import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware()

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
// import { authMiddleware } from "@clerk/nextjs"

// export default authMiddleware({
//   publicRoutes: ["/"],
// })

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// }
