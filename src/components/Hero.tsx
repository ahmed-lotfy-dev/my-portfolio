import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/alotfy_Programmer_coding_on_laptop_sitting_on_desk_-_-_v4_styli_9fb2f0c6-7665-4891-b42c-89e8e4c6274b.png";

export default async function Hero() {
  return (
    <section className="bg-gray-700 border-b-2 border-gray-900 p-6" id="hero">
      <div className="container mx-auto flex flex-col gap-5 p-5 sm:flex-row mb-10 justify-between items-center max-w-screen-xl">
        <div className=" text-gray-300 flex flex-col gap-2 my-24  text-center sm:text-start">
          <p className="text-1xl mb-4 sm:text-xl md:text-3xl">Hello this is,</p>
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase font-main flex-1 sm:truncate">
            Ahmed Lotfy
          </h1>
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-extrabold font-heading">
            Full-stack software engineer
          </h2>
          <Link
            href="/"
            className="py-3 px-8 mt-10 w-60 self-center text-center sm:self-start bg-yellow-600 rounded-md hover:bg-yellow-500 text-gray-800 hover:text-gray-700 font-bold transition-all hover:rounded-lg border-[3px] border-solid border-gray-800 sm:text-xl"
          >
            Resume
          </Link>
        </div>
        <div className="bg-cover rounded-full">
          <Image
            className=" flex-1 rounded-full w-[250] h-[250] sm:w-[250] sm:h-[250] bg-cover"
            src={HeroImage}
            priority={true}
            alt="Hero Image Developer Illustration"
            width={300}
            height={300}
          ></Image>
        </div>
      </div>
    </section>
  );
}
