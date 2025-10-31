'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix missing marker icons
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface EnvironmentalMapProps {
  centerLocation: [number, number]
  heatmapData: { lat: number; lng: number; intensity?: number }[]
}

export default function EnvironmentalMap({ centerLocation, heatmapData }: EnvironmentalMapProps) {
  if (!centerLocation || centerLocation.some((c) => c === undefined)) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-400">
        Waiting for location data...
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={centerLocation as LatLngExpression}
        zoom={12}
        scrollWheelZoom={true}
        className="absolute inset-0 w-full h-full rounded-xl z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {heatmapData.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>
              <strong>Gas Intensity:</strong> {point.intensity || 'Normal'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
