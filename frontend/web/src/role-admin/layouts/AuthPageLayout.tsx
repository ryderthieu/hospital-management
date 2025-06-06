import React from "react";
import GridShape from "../components/common/GridShape";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z- sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-teal-950 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
            <div className="tracking-tight text-white font-black text-4xl"><span className="">We</span>care</div>
              <p className="text-center text-gray-400 mt-">
                Cú cuộc đời tao với 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
