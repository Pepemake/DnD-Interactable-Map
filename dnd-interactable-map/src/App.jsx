import { useState } from 'react'
import L from 'leaflet'
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function AddPoiButton({ addPoiAtPosition, buttonStyle }) {
  const map = useMap()

  return (
    <button
      onClick={() => {
        const center = map.getCenter()
        addPoiAtPosition([center.lat, center.lng])
      }}
      style={buttonStyle}
    >
      Add a PoI
    </button>
  )
}

function App() {
  const [mapLayer, setMapLayer] = useState('/Abyssal.png')
  const [markers, setMarkers] = useState([])

  const bounds = [
    [0, 0],
    [1023, 1228],
  ]

  const poiIcon = L.icon({
  iconUrl: '/Icons/Ping.png',
  iconSize: [256, 256],
  iconAnchor: [128, 256],
})

  function addPoiAtPosition(position) {
    const newMarker = {
      id: Date.now(),
      name: 'New PoI',
      position: position,
    }

    setMarkers((currentMarkers) => [...currentMarkers, newMarker])
  }

  function updateMarkerPosition(id, newPosition) {
    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) =>
        marker.id === id
          ? { ...marker, position: [newPosition.lat, newPosition.lng] }
          : marker
      )
    )
  }

  const buttonStyle = {
    background: '#2a2a2a',
    color: 'white',
    border: '4px solid #777',
    padding: '32px 48px',
    borderRadius: '24px',
    cursor: 'pointer',
    fontSize: '42px',
    fontWeight: 'bold',
    minWidth: '360px',
    minHeight: '120px',
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(#1b1b1b, #0b0b0b)',
        boxShadow: 'inset 0 0 200px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          zIndex: 9999,
          background: 'rgba(15,15,15,0.95)',
          padding: 32,
          borderRadius: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          transform: 'scale(2)',
          transformOrigin: 'top left',
        }}
      >
        <button onClick={() => setMapLayer('/Abyssal.png')} style={buttonStyle}>
          Base
        </button>
        <button onClick={() => setMapLayer('/AbyssalNat.png')} style={buttonStyle}>
          Borders
        </button>
        <button onClick={() => setMapLayer('/AbyssalGeo.png')} style={buttonStyle}>
          Geography
        </button>
            <div
        style={{
          height: '4px',
          background: '#555',
          borderRadius: '999px',
          margin: '16px 0',
        }}
      />

      <button
        onClick={() => {
          const center = [511, 614]
          addPoiAtPosition(center)
        }}
        style={buttonStyle}
      >
        Add a PoI
      </button>
      </div>

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        zoom={0}
        center={[511, 614]}
        style={{ width: '100%', height: '100%' }}
        minZoom={0}
        maxZoom={8}
        wheelPxPerZoomLevel={800}
      >
        <ImageOverlay url={mapLayer} bounds={bounds} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={poiIcon}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const newPosition = event.target.getLatLng()
                updateMarkerPosition(marker.id, newPosition)
              },
            }}
          >
            <Popup offset={[0, -120]}>
            <input
              type="text"
              value={marker.name}
              onChange={(e) => {
                setMarkers((currentMarkers) =>
                  currentMarkers.map((m) =>
                    m.id === marker.id
                      ? { ...m, name: e.target.value }
                      : m
                  )
                )
              }}
              style={{
                width: '100%',
                minWidth: '1000px',
                height: '220px',
                fontSize: '96px',
                fontWeight: 'bold',
                padding: '24px 36px',
                background: '#1b1b1b',
                color: 'white',
                border: '4px solid #555',
                borderRadius: '24px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default App