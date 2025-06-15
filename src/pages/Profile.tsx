
import React from "react";
import BackButton from "../components/BackButton";

const Profile = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-green-50 to-blue-100">
    <div className="w-full max-w-md">
      <BackButton label="Home" />
      <h1 className="text-2xl font-bold mb-4 text-green-700">Profile</h1>
      <p className="text-gray-600 mb-8">Edit your profile, settings, and personal info.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[180px] flex items-center justify-center text-gray-400">
        [Profile UI will go here]
      </div>
    </div>
  </div>
);

export default Profile;
