function QuestLogPanel({
  markers,
  abandonedQuests,
  completedQuests,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 9999,
        width: '360px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'rgba(15,15,15,0.95)',
        padding: 20,
        borderRadius: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        color: 'white',
      }}
    >
      <QuestSection
        title="Active Quests"
        markers={markers.filter((marker) => marker.type === 'quest')}
        titleColor="white"
        background="#222"
        borderColor="#555"
      />

      <QuestSection
        title="Abandoned"
        markers={abandonedQuests}
        titleColor="#ef4444"
        background="#3a1a1a"
        borderColor="#ef4444"
      />

      <QuestSection
        title="Completed"
        markers={completedQuests}
        titleColor="#22c55e"
        background="#123020"
        borderColor="#22c55e"
      />
    </div>
  )
}

function QuestSection({
  title,
  markers,
  titleColor,
  background,
  borderColor,
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: '32px',
          margin: '0 0 12px',
          color: titleColor,
        }}
      >
        {title}
      </h2>

      {markers.map((marker) => (
        <QuestItem
          key={marker.id}
          marker={marker}
          background={background}
          borderColor={borderColor}
        />
      ))}
    </div>
  )
}

function QuestItem({
  marker,
  background,
  borderColor,
}) {
  return (
    <div
      style={{
        background,
        padding: '10px 12px',
        borderRadius: '10px',
        marginBottom: '8px',
        border: `2px solid ${borderColor}`,
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
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {marker.name}
      </button>
    </div>
  )
}

export default QuestLogPanel