
import React from "react";
import BackButton from "../components/BackButton";

const MedReminders = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-pink-50 to-blue-50">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-pink-600">Medicine Reminders</h1>
      <p className="text-gray-600 mb-8">Track your medicines, refill, and never miss a dose.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Medicine reminders UI will go here]
      </div>
    </div>
  </div>
);

export default MedReminders;
