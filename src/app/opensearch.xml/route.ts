const openSearchXml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>Ahmed Lotfy</ShortName>
  <ShortName xml:lang="ar">أحمد لطفي</ShortName>
  <Description>Search Ahmed Lotfy Portfolio - Explore projects, blog posts, and more</Description>
  <Description xml:lang="ar">ابحث في معرض أعمال أحمد لطفي - استكشف المشاريع والمقالات وأكثر</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">https://ahmedlotfy.site/favicon.ico</Image>
  <Image width="64" height="64" type="image/png">https://ahmedlotfy.site/ahmed-lotfy.jpg</Image>
  <Url type="text/html" method="get" template="https://ahmedlotfy.site/en/search?q={searchTerms}"/>
  <Url type="application/atom+xml"
       template="https://ahmedlotfy.site/feed.xml"
       rel="self"/>
  <Url type="application/opensearchdescription+xml"
       rel="self"
       template="https://ahmedlotfy.site/opensearch.xml"/>
  <moz:SearchForm>https://ahmedlotfy.site/en</moz:SearchForm>
  <Query role="example" searchTerms="Next.js"/>
  <Language>en</Language>
  <Language>ar</Language>
  <OutputEncoding>UTF-8</OutputEncoding>
  <InputEncoding>UTF-8</InputEncoding>
  <Developer>Ahmed Lotfy (ahmed@ahmedlotfy.site)</Developer>
  <Attribution>Copyright ${new Date().getFullYear()} Ahmed Lotfy</Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Tags>portfolio developer web nextjs react typescript fullstack أحمد لطفي مطور ويب</Tags>
</OpenSearchDescription>`

export async function GET() {
  return new Response(openSearchXml, {
    headers: {
      'Content-Type': 'application/opensearchdescription+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}