export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://alotfy.site/#person",
    name: "Ahmed Lotfy",
    jobTitle: "Senior Full-Stack Software Engineer",
    url: "https://alotfy.site",
    image: "https://alotfy.site/og-image.png",
    sameAs: [
      "https://github.com/ahmed-lotfy-dev",
      "https://www.linkedin.com/in/ahmed-lotfy-dev"
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "JavaScript",
      "PostgreSQL",
      "System Design",
      "DevOps",
      "Linux",
      "Docker",
      "Redis",
      "REST APIs",
      "GraphQL",
      "React Native",
      "Tailwind CSS"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
