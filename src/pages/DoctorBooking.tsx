
import React from "react";
import BackButton from "../components/BackButton";

const DoctorBooking = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-purple-700">Doctor Booking</h1>
      <p className="text-gray-600 mb-8">Book an appointment with trusted doctors, online or in-person.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Doctor booking UI will go here]
      </div>
    </div>
  </div>
);

export default DoctorBooking;
