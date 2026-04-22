export async function POST() {
  return Response.json(
    {
      error: "unsupported_grant_type",
      error_description:
        "This site currently supports interactive browser sign-in only. Programmatic OAuth token issuance is not enabled yet.",
    },
    {
      status: 501,
    }
  )
}
