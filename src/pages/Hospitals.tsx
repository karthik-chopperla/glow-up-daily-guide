
import React from "react";
import BackButton from "../components/BackButton";

const Hospitals = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-blue-50 to-teal-50">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-teal-700">Hospitals Near Me</h1>
      <p className="text-gray-600 mb-8">Find the best hospitals around you with ratings and services.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Hospital finder UI will go here]
      </div>
    </div>
  </div>
);

export default Hospitals;
