export async function GET() {
  return Response.json(
    {
      error: "unsupported_operation",
      error_description:
        "A public OIDC userinfo endpoint is not available for this site's current interactive auth model.",
    },
    {
      status: 501,
    }
  )
}
