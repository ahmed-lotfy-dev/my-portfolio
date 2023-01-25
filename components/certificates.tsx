import React from "react";
import Accordion from "./accordion";
function Certificates() {
  return (
    <div className="bg-blue-200 flex justify-center items-center text-center sm:text-start ">
      <div className="container max-w-screen-xl justify-center items-center  p-5">
        <div className="py-10">
          <h2 className="text-3xl font-bold">Certificates</h2>
        </div>
        <div>
          <Accordion />
        </div>
      </div>
    </div>
  );
}

export default Certificates;
