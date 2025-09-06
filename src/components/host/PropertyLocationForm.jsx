"use client";

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for map (client-side only)
const MapPicker = dynamic(() => import('./MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});

export default function PropertyLocationForm({ data, updateData, nextStep }) {
  const [address, setAddress] = useState(data.address || {
    building: '',
    street: '',
    area: '',
    city: 'Doha',
    district: '',
    zone: '',
    buildingNumber: '',
    postalCode: '',
    country: 'Qatar'
  });

  const [coordinates, setCoordinates] = useState(data.coordinates || {
    lat: 25.2854, // Default to Doha
    lng: 51.5310
  });

  const [landmarks, setLandmarks] = useState(data.landmarks || []);
  const [newLandmark, setNewLandmark] = useState('');

  // Qatar specific areas
  const qatarAreas = {
    "Doha": [
      "West Bay", "The Pearl", "Lusail", "Al Dafna", "Al Sadd",
      "Al Rayyan", "Old Airport", "Musheireb", "Al Mansoura",
      "Bin Mahmoud", "Al Nasr", "Corniche", "Katara"
    ],
    "Al Rayyan": [
      "Al Gharrafa", "Al Aziziya", "Al Waab", "Ain Khaled",
      "Al Themaid", "Al Messila", "Muaither", "Al Qutaifiya"
    ],
    "Al Wakrah": [
      "Al Wakrah City", "Al Wukair", "Al Thumama", "Al Mashaf"
    ]
  };

  const handleMapClick = useCallback((lat, lng) => {
    setCoordinates({ lat, lng });
  }, []);

  const addLandmark = () => {
    if (newLandmark.trim()) {
      setLandmarks([...landmarks, { name: newLandmark, distance: '' }]);
      setNewLandmark('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData({
      address,
      coordinates,
      landmarks,
      mapUrl: `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Property Location</h2>
      
      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Building Name/Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.building}
            onChange={(e) => setAddress({...address, building: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Marina Tower, Villa 23"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Zone/Building Number
          </label>
          <input
            type="text"
            value={address.buildingNumber}
            onChange={(e) => setAddress({...address, buildingNumber: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Zone 66, Building 21"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Street Name/Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Al Corniche Street"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value, area: ''})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="Doha">Doha</option>
            <option value="Al Rayyan">Al Rayyan</option>
            <option value="Al Wakrah">Al Wakrah</option>
            <option value="Al Khor">Al Khor</option>
            <option value="Lusail">Lusail</option>
            <option value="Umm Salal">Umm Salal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Area/District <span className="text-red-500">*</span>
          </label>
          <select
            value={address.area}
            onChange={(e) => setAddress({...address, area: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select area</option>
            {qatarAreas[address.city]?.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Postal Code
          </label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => setAddress({...address, postalCode: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Map Section */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Pin Exact Location on Map <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-600 mb-2">
          Drag the pin to mark the exact location of your property
        </p>
        <MapPicker 
          center={coordinates}
          onLocationChange={handleMapClick}
          address={`${address.building}, ${address.street}, ${address.area}, ${address.city}`}
        />
        <div className="mt-2 text-sm text-gray-600">
          Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      </div>

      {/* Nearby Landmarks */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nearby Landmarks (helps guests find your property)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newLandmark}
            onChange={(e) => setNewLandmark(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            placeholder="e.g., City Center Mall - 5 min walk"
          />
          <button
            type="button"
            onClick={addLandmark}
            className="px-4 py-2 bg-brand text-white rounded-lg"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {landmarks.map((landmark, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{landmark.name}</span>
              <button
                type="button"
                onClick={() => setLandmarks(landmarks.filter((_, i) => i !== index))}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border rounded-lg"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand text-white rounded-lg"
        >
          Next: Property Details
        </button>
      </div>
    </form>
  );
}