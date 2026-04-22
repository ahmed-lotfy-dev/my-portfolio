export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://ahmedlotfy.site/#organization",
    name: "Ahmed Shoman",
    url: "https://ahmedlotfy.site",
    logo: "https://ahmedlotfy.site/icon.png",
    sameAs: [
      "https://github.com/ahmed-lotfy-dev",
      "https://linkedin.com/in/ahmed-lotfy-dev",
      "https://twitter.com/ahmedlotfy_dev",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "mailto:ahmedlotfy@example.com",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    founder: {
      "@type": "Person",
      name: "Ahmed Shoman",
      jobTitle: "Full-Stack Software Engineer",
      url: "https://ahmedlotfy.site",
    },
    foundingDate: "2024",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 10,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      addressLocality: "Cairo",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
