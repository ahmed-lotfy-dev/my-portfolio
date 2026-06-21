type StructuredDataProps = {
  type: 'Person' | 'WebSite' | 'Article' | 'CreativeWork' | 'EducationalOccupationalCredential' | 'CollectionPage' | 'FAQ' | 'SoftwareApplication' | 'BlogPosting'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema: Record<string, unknown> = {}

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
        sameAs: data.sameAs,
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
        ...(data.potentialAction && {
          potentialAction: data.potentialAction,
        }),
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
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
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
        credentialCategory: data.credentialCategory || 'certificate',
        recognizedBy: data.recognizedBy
          ? {
              '@type': 'Organization',
              name: data.recognizedBy,
            }
          : undefined,
        eduDataValidFrom: data.dateCreated,
        ...(data.image && { image: data.image }),
        ...(data.url && { url: data.url }),
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

    case 'FAQ':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.questions.map((q: { question: string; answer: string }) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      }
      break

    case 'SoftwareApplication':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name,
        description: data.description,
        url: data.url,
        image: data.image,
        operatingSystem: data.operatingSystem || 'Web',
        applicationCategory: data.category || 'WebApplication',
        ...(data.offerPrice !== undefined && {
          offers: {
            '@type': 'Offer',
            price: data.offerPrice,
            priceCurrency: data.offerCurrency || 'USD',
          },
        }),
        author: {
          '@type': 'Person',
          name: 'Ahmed Lotfy',
          url: 'https://ahmedlotfy.site',
        },
      }
      break

    case 'BlogPosting':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
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
        inLanguage: data.language,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
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
