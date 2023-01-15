import Image from "next/image";
import HeroImage from "../public/AShouman_3d_vectorhuman_with_glasses_developer_programmer_lapto_0f0c5488-59b0-49da-a7cd-204a7f4c7fd8.png";
Image;
function Hero() {
  return (
    <div className="container mx-auto flex justify-between items-center w-full px-7">
      <div className="py-[12rem]">
        <h2 className=" text-4xl font-extrabold font-main">Ahmed Lotfy</h2>
        <h3 className="  text-2xl font-bold font-heading mt-5">Front-End</h3>
        <h3 className=" text-2xl font-bold font-heading ">
          Software Developer
        </h3>
      </div>
      <div className="rounded-full ">
        <Image
          className="rounded-full w-[200px] w-[200px]"
          src={HeroImage}
          alt="Hero Image Developer Illustration"
          width={250}
          height={250}
        ></Image>
      </div>
    </div>
  );
}

export default Hero;
