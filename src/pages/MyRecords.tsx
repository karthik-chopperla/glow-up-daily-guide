
import React from "react";
import BackButton from "../components/BackButton";

const MyRecords = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-gray-50 to-blue-100">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-blue-700">My Records</h1>
      <p className="text-gray-600 mb-8">View, upload, and manage all your medical records securely.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Records UI will go here]
      </div>
    </div>
  </div>
);

export default MyRecords;
