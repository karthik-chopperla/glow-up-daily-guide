
import { useState } from "react";

const FabSOS = () => {
  const [counting, setCounting] = useState(false);
  const [msg, setMsg] = useState("");

  const triggerSOS = () => {
    setCounting(true);
    setMsg("");
    setTimeout(() => {
      setCounting(false);
      // Simulate location
      const coords = { lat: 19.07, lng: 72.87 };
      setMsg(`SOS sent! 📱 SMS/call sent with GPS: (${coords.lat}, ${coords.lng})`);
      setTimeout(() => setMsg(""), 3000);
    }, 3000);
  };

  return (
    <>
      <button
        title="Emergency SOS"
        className="fixed z-50 bottom-20 right-6 md:right-12 bg-red-500 hover:bg-red-700 text-white rounded-full p-5 shadow-lg transition-all flex flex-col items-center"
        onClick={triggerSOS}
        disabled={counting}
        style={{ minWidth: 56, minHeight: 56 }}
      >
        {counting ? <span className="animate-pulse font-bold text-lg">3</span> : "SOS"}
      </button>
      {msg && (
        <div className="fixed right-6 md:right-12 bottom-32 bg-white px-4 py-3 rounded-xl shadow-xl border text-sm z-50">
          {msg}
        </div>
      )}
    </>
  );
};

export default FabSOS;
