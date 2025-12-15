interface StructuredDataProps {
  type: 'Person' | 'WebSite' | 'Article' | 'CreativeWork' | 'EducationalOccupationalCredential' | 'CollectionPage'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema = {}

  switch (type) {
    case 'Person':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
        url: data.url,
        image: data.image,
        jobTitle: data.jobTitle,
        description: data.description,
        sameAs: data.sameAs, // Social media profiles
        knowsAbout: data.skills,
      }
      break

    case 'WebSite':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        description: data.description,
        inLanguage: data.languages,
        author: {
          '@type': 'Person',
          name: data.authorName,
        },
      }
      break

    case 'Article':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishedDate,
        dateModified: data.modifiedDate,
        author: {
          '@type': 'Person',
          name: data.authorName,
          url: data.authorUrl,
        },
        publisher: {
          '@type': 'Person',
          name: data.authorName,
          url: data.authorUrl,
        },
        keywords: data.keywords,
        articleSection: data.categories,
        inLanguage: data.language,
      }
      break

    case 'CreativeWork':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: data.title,
        description: data.description,
        image: data.image,
        url: data.url,
        author: {
          '@type': 'Person',
          name: data.authorName,
          url: data.authorUrl,
        },
        dateCreated: data.createdDate,
        dateModified: data.modifiedDate,
        keywords: data.keywords,
        genre: data.categories,
        inLanguage: data.language,
      }
      break

    case 'EducationalOccupationalCredential':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOccupationalCredential',
        name: data.title,
        description: data.description,
        credentialCategory: 'certificate',
        educationalLevel: data.level,
        competencyRequired: data.skills,
        recognizedBy: {
          '@type': 'Organization',
          name: data.issuingOrganization,
          url: data.organizationUrl,
        },
      }
      break

    case 'CollectionPage':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: data.name,
        description: data.description,
        url: data.url,
        ...(data.numberOfItems !== undefined && { numberOfItems: data.numberOfItems }),
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
