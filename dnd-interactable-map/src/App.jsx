import { useState, useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createMarker } from './models/markerModel'


function App() {
  const [mapLayer, setMapLayer] = useState('/Abyssal.png')
  const [markers, setMarkers] = useState(() => {
    try {
      const savedMarkers = localStorage.getItem('dndMarkers')
      return savedMarkers ? JSON.parse(savedMarkers) : []
    } catch {
      return []
    }
  })

  const [completedQuests, setCompletedQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('completedQuests')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [abandonedQuests, setAbandonedQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('abandonedQuests')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('dndMarkers', JSON.stringify(markers))
  }, [markers])

  useEffect(() => {
    localStorage.setItem('completedQuests', JSON.stringify(completedQuests))
  }, [completedQuests])

  useEffect(() => {
    localStorage.setItem('abandonedQuests', JSON.stringify(abandonedQuests))
  }, [abandonedQuests])
  

  const bounds = [
    [0, 0],
    [5210, 6250],
  ]

  function createPoiIcon(marker) {
  return L.divIcon({
    className: 'poi-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        
        <img 
          src="${
            marker.type === 'settlement'
              ? '/Icons/Settlement.png'
              : '/Icons/Ping.png'
          }"
          style="width: 256px; height: 256px;"
        />

        <div style="
          margin-top: 8px;
          background: rgba(15,15,15,0.9);
          color: white;
          font-size: 42px;
          font-weight: bold;
          padding: 12px 24px;
          border-radius: 16px;
          white-space: nowrap;
          border: 3px solid #777;
          text-shadow: 0 2px 4px black;
        ">
          ${marker.name}
        </div>

      </div>
    `,
    iconSize: [256, 340],
    iconAnchor: [128, 256],
  })
}

  function addPoiAtPosition(position, name, type) {
  const newMarker = createMarker(position, name, type)

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

  function archiveMarker(id, status) {
  const markerToArchive = markers.find((marker) => marker.id === id)

  if (!markerToArchive) return

  if (status === 'Completed') {
    setCompletedQuests((currentCompleted) => [
      ...currentCompleted,
      markerToArchive,
    ])
  }

  if (status === 'Abandoned') {
    setAbandonedQuests((currentAbandoned) => [
      ...currentAbandoned,
      markerToArchive,
    ])
  }

  setMarkers((currentMarkers) =>
    currentMarkers.filter((marker) => marker.id !== id)
  )
}
function deleteMarker(id) {
  setMarkers((currentMarkers) =>
    currentMarkers.filter((marker) => marker.id !== id)
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

        <button onClick={() => setMapLayer('/London3.png')} style={buttonStyle}>
          Test Button
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
            const name = prompt('Quest Name')
            if (!name) return
            addPoiAtPosition([2605, 3125], name, 'quest')
          }}
          style={buttonStyle}
        >
          Add Quest
        </button>

        <button
          onClick={() => {
            const name = prompt('Settlement Name')
            if (!name) return
            addPoiAtPosition([2605, 3125], name, 'settlement')
          }}
          style={buttonStyle}
        >
          Add Settlement
        </button>
      </div>

<div
  style={{
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 9999,
    width: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'rgba(15,15,15,0.95)',
    padding: 48,
    borderRadius: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    color: 'white',
  }}
>
  <div>
    <h2 style={{ fontSize: '120px', marginBottom: '16px' }}>
      Active Quests
    </h2>

    {markers
      .filter((marker) => marker.type === 'quest')
      .map((marker) => (
        <div
          key={marker.id}
          style={{
            background: '#222',
            padding: '18px 24px',
            borderRadius: '16px',
            marginBottom: '12px',
            fontSize: '60px',
            border: '3px solid #555',
          }}
        >
          <button
  onClick={() => {
    alert(`${marker.name}\n\n${marker.notes || 'No notes written.'}`)
  }}
  style={{
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '50px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }}
>
  {marker.name}
</button>
        </div>
      ))}
  </div>

  <div>
    <h2 style={{ fontSize: '120px', marginBottom: '16px', color: '#ef4444' }}>
      Abandoned
    </h2>

    {abandonedQuests.map((marker) => (
      <div
        key={marker.id}
        style={{
          background: '#3a1a1a',
          padding: '18px 24px',
          borderRadius: '16px',
          marginBottom: '12px',
          fontSize: '60px',
          border: '3px solid #ef4444',
        }}
      >
        <button
  onClick={() => {
    alert(`${marker.name}\n\n${marker.notes || 'No notes written.'}`)
  }}
  style={{
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '50px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }}
>
  {marker.name}
</button>
      </div>
    ))}
  </div>

  <div>
    <h2 style={{ fontSize: '120px', marginBottom: '16px', color: '#22c55e' }}>
      Completed
    </h2>

    {completedQuests.map((marker) => (
      <div
        key={marker.id}
        style={{
          background: '#123020',
          padding: '18px 24px',
          borderRadius: '16px',
          marginBottom: '12px',
          fontSize: '60px',
          border: '3px solid #22c55e',
        }}
      >
        <button
  onClick={() => {
    alert(`${marker.name}\n\n${marker.notes || 'No notes written.'}`)
  }}
  style={{
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '50px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }}
>
  {marker.name}
</button>
      </div>
    ))}
  </div>
</div>

<MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        zoom={0}
        center={[2605, 3125]}
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
            icon={createPoiIcon(marker)}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const newPosition = event.target.getLatLng()
                updateMarkerPosition(marker.id, newPosition)
              },
            }}
          >
            <Popup offset={[0, -120]}>
              <div style={{ width: '1200px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <input
                  type="text"
                  value={marker.name}
                  onChange={(e) => {
                    setMarkers((currentMarkers) =>
                      currentMarkers.map((m) =>
                        m.id === marker.id ? { ...m, name: e.target.value } : m
                      )
                    )
                  }}
                  style={{
                    width: '100%',
                    height: '140px',
                    fontSize: '72px',
                    fontWeight: 'bold',
                    padding: '24px 36px',
                    background: '#111',
                    color: 'white',
                    border: '4px solid #555',
                    borderRadius: '24px',
                    boxSizing: 'border-box',
                  }}
                />

                <textarea
                  placeholder="Add notes, rumours, quest info..."
                  value={marker.notes}
                  onChange={(e) => {
                    setMarkers((currentMarkers) =>
                      currentMarkers.map((m) =>
                        m.id === marker.id ? { ...m, notes: e.target.value } : m
                      )
                    )
                  }}
                  style={{
                    width: '100%',
                    height: '420px',
                    fontSize: '54px',
                    padding: '32px 36px',
                    background: '#111',
                    color: 'white',
                    border: '4px solid #555',
                    borderRadius: '24px',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', gap: '24px' }}>
                  {marker.type === 'quest' && (
                    <>
                      <button
                        onClick={() => archiveMarker(marker.id, 'Completed')}
                        style={{
                          flex: 1,
                          fontSize: '48px',
                          fontWeight: 'bold',
                          padding: '28px',
                          background: '#14532d',
                          color: 'white',
                          border: '4px solid #22c55e',
                          borderRadius: '24px',
                          cursor: 'pointer',
                        }}
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => archiveMarker(marker.id, 'Abandoned')}
                        style={{
                          flex: 1,
                          fontSize: '48px',
                          fontWeight: 'bold',
                          padding: '28px',
                          background: '#5f1d1d',
                          color: 'white',
                          border: '4px solid #ef4444',
                          borderRadius: '24px',
                          cursor: 'pointer',
                        }}
                      >
                        Abandon
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteMarker(marker.id)}
                    style={{
                      flex: 1,
                      fontSize: '48px',
                      fontWeight: 'bold',
                      padding: '28px',
                      background: '#222',
                      color: 'white',
                      border: '4px solid #777',
                      borderRadius: '24px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default App