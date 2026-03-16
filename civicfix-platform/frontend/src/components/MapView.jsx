// MapView — placeholder for Phase 9 full implementation
// Renders a simple list of complaint pins with status colors
export default function MapView({ complaints = [] }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-500 text-sm h-64 flex items-center justify-center">
      Map visualization will be implemented in Phase 9.
      <br />({complaints.length} complaints loaded)
    </div>
  )
}
