import Image from "next/image"
import myImage from "@/public/images/AShouman_3d_vector_human_with_glasses_developer_coding_09763759-3521-438f-a963-0c61670df468.png"

export default function About() {
  return (
    <section className="flex flex-col items-center my-16" id="about">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight sm:text-5xl">
          About <span className="text-blue-600">Me</span>
        </h2>
      </div>
      <div className="container flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <Image
            src={myImage}
            width={400}
            height={400}
            alt="Ahmed Lotfy"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 text-lg text-gray-700 dark:text-gray-300 space-y-4">
          <p>
            Hello, I&apos;m Ahmed Lotfy, a Full Stack Software Developer with a
            background in PC maintenance. My journey into software development
            is driven by a passion for technology and a desire for continuous
            learning.
          </p>
          <p>
            My experience in hardware gives me a unique perspective on software
            development, allowing me to approach problems with a holistic
            mindset.
          </p>
          <p>
            I am actively seeking opportunities to contribute to innovative
            projects. If you are looking for a dedicated full-stack engineer, I
            would love to connect with you.
          </p>
        </div>
      </div>
    </section>
  )
}
