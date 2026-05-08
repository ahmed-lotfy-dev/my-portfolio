import { eq, desc } from 'drizzle-orm'
import { db } from '@/src/db'
import { posts } from '@/src/db/schema'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '...'
}

export async function GET() {
  const baseUrl = 'https://ahmedlotfy.site'

  // Fetch latest 50 published posts
  const allPosts = await db.select({
    slug: posts.slug,
    title_en: posts.title_en,
    title_ar: posts.title_ar,
    content_en: posts.content_en,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    categories: posts.categories,
    tags: posts.tags,
    imageLink: posts.imageLink,
    readingTime: posts.readingTime,
  })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(50)

  // Atom feed items
  const entries = allPosts.map((post) => {
    const description = stripHtml(post.content_en || '')
    const summary = truncate(description, 500)

    return `
  <entry>
    <id>${escapeXml(`${baseUrl}/en/blogs/${post.slug}`)}</id>
    <title>${escapeXml(post.title_en)}</title>
    <link href="${escapeXml(`${baseUrl}/en/blogs/${post.slug}`)}" rel="alternate"/>
    <link href="${escapeXml(`${baseUrl}/ar/blogs/${post.slug}`)}" rel="alternate" hreflang="ar"/>
    <published>${post.createdAt?.toISOString() ?? ''}</published>
    <updated>${post.updatedAt?.toISOString() ?? ''}</updated>
    <summary type="text">${escapeXml(summary)}</summary>
    <author>
      <name>Ahmed Lotfy</name>
      <uri>${baseUrl}</uri>
    </author>
    ${post.categories?.map((cat) => `    <category term="${escapeXml(cat)}"/>`).join('\n') ?? ''}
    ${post.tags?.map((tag) => `    <category term="${escapeXml(tag)}"/>`).join('\n') ?? ''}
  </entry>`
  }).join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/"
      xml:lang="en">
  <id>${escapeXml(baseUrl)}/feed.xml</id>
  <title>Ahmed Lotfy - Blog & Portfolio</title>
  <subtitle>Technical blog posts about web development, programming, and technology by Ahmed Lotfy</subtitle>
  <link href="${escapeXml(baseUrl)}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${escapeXml(baseUrl)}/en/blogs" rel="alternate" type="text/html"/>
  <link href="${escapeXml(baseUrl)}/ar/blogs" rel="alternate" type="text/html" hreflang="ar"/>
  <icon>${escapeXml(baseUrl)}/favicon.ico</icon>
  <logo>${escapeXml(baseUrl)}/ahmed-lotfy.jpg</logo>
  <rights>Copyright ${new Date().getFullYear()} Ahmed Lotfy</rights>
  <updated>${allPosts[0]?.updatedAt?.toISOString() ?? new Date().toISOString()}</updated>
  <author>
    <name>Ahmed Lotfy</name>
    <uri>${baseUrl}</uri>
    <email>ahmed@ahmedlotfy.site</email>
  </author>
  <opensearch:totalResults>${allPosts.length}</opensearch:totalResults>
  <opensearch:startIndex>0</opensearch:startIndex>
  <opensearch:itemsPerPage>50</opensearch:itemsPerPage>
${entries}
</feed>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}