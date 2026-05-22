function LeftPanel({
  buttonStyle,
  setMapLayer,
  addPoiAtPosition,
  exportSave,
  importSave,
  markers,
  completedQuests,
  abandonedQuests,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 70,
        zIndex: 9999,
        background: 'rgba(15,15,15,0.95)',
        padding: 32,
        borderRadius: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        transformOrigin: 'top left',
      }}
    >
      <button
        onClick={() => setMapLayer('/Maps/Abyssal.png')}
        style={buttonStyle}
      >
        Base
      </button>

      <button
        onClick={() => setMapLayer('/Maps/AbyssalNat.png')}
        style={buttonStyle}
      >
        Borders
      </button>

      <button
        onClick={() => setMapLayer('/Maps/London3.png')}
        style={buttonStyle}
      >
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

          addPoiAtPosition(
            [2605, 3125],
            name,
            'quest'
          )
        }}
        style={buttonStyle}
      >
        Add Quest
      </button>

      <button
        onClick={() => {
          const name = prompt('Settlement Name')

          if (!name) return

          addPoiAtPosition(
            [2605, 3125],
            name,
            'settlement'
          )
        }}
        style={buttonStyle}
      >
        Add Settlement
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
        onClick={exportSave}
        style={buttonStyle}
      >
        Export Save
      </button>

      <label
        style={{
            ...buttonStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
        }}
        >
        Import Save

        <input
            type="file"
            accept=".json"
            onChange={importSave}
            style={{ display: 'none' }}
        />
        </label>

      <button
        onClick={() => {
          localStorage.setItem(
            'dndMarkers',
            JSON.stringify(markers)
          )

          localStorage.setItem(
            'completedQuests',
            JSON.stringify(completedQuests)
          )

          localStorage.setItem(
            'abandonedQuests',
            JSON.stringify(abandonedQuests)
          )

          alert('Saved!')
        }}
        style={buttonStyle}
      >
        Save
      </button>
    </div>
  )
}

export default LeftPanel