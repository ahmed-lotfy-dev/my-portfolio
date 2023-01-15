import Hero from "@/components/hero";

function Homepage() {
  return (
    <main className="font-main">
      <Hero />
      <h1 className="text-3xl text-purple-700 font-bold underline">
        Hello world!
      </h1>
      <h2 className="font-heading text-5xl text-blue-900 font-bold">
        how r u{" "}
      </h2>
    </main>
  );
}

export default Homepage;
