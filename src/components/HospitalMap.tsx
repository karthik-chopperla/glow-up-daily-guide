
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, Marker, Popup } from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

// Type for hospital data
type HospitalData = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  // ... more
};

const HospitalMap = ({
  coords,
  hospitals,
}: {
  coords: { lat: number; lng: number } | null;
  hospitals: HospitalData[];
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [token, setToken] = useState<string>(() => localStorage.getItem('mapbox_token') || '');

  useEffect(() => {
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    // Clean up previous map instance on re-init
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coords ? [coords.lng, coords.lat] : [72.87, 19.07],
      zoom: 12,
    });

    hospitals.forEach((h) => {
      new Marker()
        .setLngLat([h.lng, h.lat])
        .setPopup(
          new Popup().setHTML(`<b>${h.name}</b>`)
        )
        .addTo(map.current!);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [token, coords, hospitals]);

  if (!token) {
    return (
      <div className="p-6">
        <div className="mb-2 font-semibold text-center">Enter your Mapbox public token to enable map view:</div>
        <input
          type="text"
          placeholder="Mapbox public token"
          className="w-full border rounded px-3 py-2 mb-2"
          value={token}
          onChange={e => {
            setToken(e.target.value);
            localStorage.setItem('mapbox_token', e.target.value);
          }}
        />
        <div className="text-xs text-gray-400 text-center">Get your public token from <a className="underline text-blue-500" href="https://account.mapbox.com/" target="_blank">mapbox.com</a></div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full min-h-[300px] rounded-md shadow" />;
};

export default HospitalMap;
