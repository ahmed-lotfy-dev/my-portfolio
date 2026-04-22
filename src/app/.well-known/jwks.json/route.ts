export const dynamic = "force-static"

export async function GET() {
  return Response.json(
    {
      keys: [],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
