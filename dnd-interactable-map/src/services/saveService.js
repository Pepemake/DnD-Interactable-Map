export function exportSaveFile(saveData) {
  const json = JSON.stringify(saveData, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'dnd-map-save.json'
  link.click()

  URL.revokeObjectURL(url)
}

export function readSaveFile(file, onSuccess, onError) {
  const reader = new FileReader()

  reader.onload = () => {
    try {
      const saveData = JSON.parse(reader.result)
      onSuccess(saveData)
    } catch {
      onError()
    }
  }

  reader.readAsText(file)
}