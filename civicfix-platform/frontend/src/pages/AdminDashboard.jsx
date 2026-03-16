export default function AdminDashboard() {

  const complaints = [
    { id: 1, issue: "Street light not working", area: "Sector 5", status: "Pending" },
    { id: 2, issue: "Garbage not collected", area: "Sector 8", status: "In Progress" },
    { id: 3, issue: "Water leakage", area: "Sector 2", status: "Resolved" }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        CivicFix Admin Dashboard
      </h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Issue</th>
            <th className="p-3 text-left">Area</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.issue}</td>
              <td className="p-3">{c.area}</td>
              <td className="p-3">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}