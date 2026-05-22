import { useState, useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createMarker } from './models/markerModel'
import { exportSaveFile, readSaveFile } from './services/saveService'
import QuestLogPanel from './components/QuestLogPanel'
import LeftPanel from './components/LeftPanel'

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

  function exportSave() {
    exportSaveFile({
      version: 1,
      exportedAt: new Date().toISOString(),
      markers,
      completedQuests,
      abandonedQuests,
    })
  }

  function importSave(event) {
    const file = event.target.files[0]
    if (!file) return

    readSaveFile(
      file,
      (saveData) => {
        setMarkers(saveData.markers || [])
        setCompletedQuests(saveData.completedQuests || [])
        setAbandonedQuests(saveData.abandonedQuests || [])
        alert('Save imported successfully!')
      },
      () => {
        alert('Import failed. This is not a valid save file.')
      }
    )
  }

  function createPoiIcon(marker) {
    return L.divIcon({
      className: 'poi-marker',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <img 
            src="${
              marker.type === 'settlement'
                ? '/Icons/Settlement.png'
                : '/Icons/Ping.png'
            }"
            style="width: 64px; height: 64px;"
          />

          <div style="
            margin-top: 4px;
            background: rgba(15,15,15,0.9);
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 8px;
            white-space: nowrap;
            border: 2px solid #777;
            text-shadow: 0 1px 2px black;
          ">
            ${marker.name}
          </div>
        </div>
      `,
      iconSize: [64, 90],
      iconAnchor: [32, 90],
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
    border: '2px solid #777',
    padding: '14px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '180px',
    minHeight: '52px',
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
      <LeftPanel
        buttonStyle={buttonStyle}
        setMapLayer={setMapLayer}
        addPoiAtPosition={addPoiAtPosition}
        exportSave={exportSave}
        importSave={importSave}
        markers={markers}
        completedQuests={completedQuests}
        abandonedQuests={abandonedQuests}
      />

      <QuestLogPanel
        markers={markers}
        abandonedQuests={abandonedQuests}
        completedQuests={completedQuests}
      />

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        zoom={-2}
        center={[2605, 3125]}
        style={{ width: '100%', height: '100%' }}
        minZoom={-3}
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
            <Popup offset={[0, -55]}>
              <div
                style={{
                width: '420px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxSizing: 'border-box',
              }}
              >
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
                    height: '44px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    padding: '8px 12px',
                    background: '#111',
                    color: 'white',
                    border: '2px solid #777',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />

                <textarea
                  placeholder="Add notes, rumours, quest info..."
                  value={marker.notes}
                  onChange={(e) => {
                    setMarkers((currentMarkers) =>
                      currentMarkers.map((m) =>
                        m.id === marker.id
                          ? { ...m, notes: e.target.value }
                          : m
                      )
                    )
                  }}
                  style={{
                    width: '100%',
                    height: '140px',
                    fontSize: '16px',
                    padding: '10px 12px',
                    background: '#111',
                    color: 'white',
                    border: '2px solid #777',
                    borderRadius: '8px',
                    resize: 'none',
                    display: 'block',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  {marker.type === 'quest' && (
                    <>
                      <button
                        onClick={() => archiveMarker(marker.id, 'Completed')}
                        style={{
                          flex: 1,
                          fontSize: '16px',
                          fontWeight: 'bold',
                          padding: '10px',
                          background: '#14532d',
                          color: 'white',
                          border: '2px solid #22c55e',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => archiveMarker(marker.id, 'Abandoned')}
                        style={{
                          flex: 1,
                          fontSize: '16px',
                          fontWeight: 'bold',
                          padding: '10px',
                          background: '#5f1d1d',
                          color: 'white',
                          border: '2px solid #ef4444',
                          borderRadius: '8px',
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
                      fontSize: '16px',
                      fontWeight: 'bold',
                      padding: '10px',
                      background: '#222',
                      color: 'white',
                      border: '2px solid #777',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: '100%',
                      boxSizing: 'border-box'
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