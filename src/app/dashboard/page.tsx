import React from "react";
import Aside from "./components/aside";
import Welcome from "./components/welcome"

const DashboardIndex = () => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <Welcome/>
    </div>
  );
};

export default DashboardIndex;
