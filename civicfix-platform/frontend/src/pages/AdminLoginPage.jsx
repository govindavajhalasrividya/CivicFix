import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminLoginPage() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // simple demo login
    if (username === "admin" && password === "admin123") {
      navigate("/admin")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          CivicFix Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  )
}