import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminLogin } from "../api/authApi"
import { useAdmin } from "../context/AdminContext"
import toast from "react-hot-toast"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const { login } = useAdmin()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = e => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleLogin = async e => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await adminLogin({ email, password })
      if (res.data.success) {
        login(res.data.data.access_token)
        navigate("/admin")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

const animationStyles=`
@keyframes blob{
0%{transform:translate(0px,0px) scale(1);}
33%{transform:translate(30px,-50px) scale(1.1);}
66%{transform:translate(-20px,20px) scale(0.9);}
100%{transform:translate(0px,0px) scale(1);}
}
.animate-blob{animation:blob 7s infinite;}

@keyframes float{
0%,100%{transform:translateY(0px);}
50%{transform:translateY(-20px);}
}
.animate-float{animation:float 6s ease-in-out infinite;}

.animate-pulse-slow{
animation:pulse 3s cubic-bezier(0.4,0,0.6,1) infinite;
}

.animation-delay-1000{animation-delay:1s;}
.animation-delay-2000{animation-delay:2s;}
.animation-delay-4000{animation-delay:4s;}

@keyframes pulse{
0%,100%{opacity:1;}
50%{opacity:0.5;}
}
`

return(
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-center justify-center p-4">

<style>{animationStyles}</style>

<div className="absolute inset-0 overflow-hidden">
<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
</div>

<div
className="relative w-full max-w-md transition-transform duration-100 ease-out"
style={{
transform:`perspective(1000px) rotateX(${mousePosition.y*0.5}deg) rotateY(${mousePosition.x*0.5}deg)`
}}
>

<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-75 animate-pulse-slow"></div>

<div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

<div className="text-center mb-8">

<div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
<span className="text-white text-4xl">🏛️</span>
</div>

<h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
<p className="text-blue-100 text-sm">Secure access for civic administrators</p>

</div>

<form onSubmit={handleLogin} className="space-y-6">

<div className="space-y-2">
<label className="block text-sm font-medium text-blue-100">
Email Address
</label>

<div className="relative group">

<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>

<div className="relative">

<input
type="email"
value={email}
onChange={e=>setEmail(e.target.value)}
className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
placeholder="Enter your email"
required
/>

<span className="absolute right-3 top-3 text-blue-200/50">✉️</span>

</div>
</div>
</div>

<div className="space-y-2">
<label className="block text-sm font-medium text-blue-100">
Password
</label>

<div className="relative group">

<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>

<div className="relative">

<input
type={showPassword?"text":"password"}
value={password}
onChange={e=>setPassword(e.target.value)}
className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
placeholder="Enter your password"
required
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-3 text-blue-200/50 hover:text-white transition focus:outline-none"
>
{showPassword?"👁️":"🔒"}
</button>

</div>
</div>
</div>

<div className="flex items-center justify-between">

<label className="flex items-center space-x-2 cursor-pointer">

<input
type="checkbox"
checked={rememberMe}
onChange={e=>setRememberMe(e.target.checked)}
className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
/>

<span className="text-sm text-blue-100">
Remember me
</span>

</label>

<button
type="button"
onClick={()=>toast("Please contact system administrator", { icon: "ℹ️" })}
className="text-sm text-blue-200 hover:text-white transition"
>
Forgot password?
</button>

</div>

<button
type="submit"
disabled={isLoading}
className={`w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ${
isLoading?"opacity-75 cursor-not-allowed":"hover:-translate-y-0.5"
}`}
>

{isLoading?(
<div className="flex items-center justify-center space-x-2">
<div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
<span>Authenticating...</span>
</div>
):(
"Sign In to Dashboard"
)}

</button>

<div className="flex items-center justify-center space-x-2 text-xs text-blue-200/70 pt-4">
<span>🔒</span>
<span>SSL Encrypted Connection</span>
<span>🔒</span>
</div>

</form>

<div className="mt-8 pt-6 border-t border-white/10 text-center">

<p className="text-sm text-blue-200/70">
Need help? Contact{" "}
<button
onClick={()=>toast("Support: admin@civicfix.com", { icon: "ℹ️" })}
className="text-blue-300 hover:text-white transition"
>
system administrator
</button>
</p>

</div>

</div>
</div>

<div className="absolute bottom-10 left-10 text-white/10 text-6xl animate-float">
🏛️
</div>

<div className="absolute top-20 right-20 text-white/10 text-6xl animate-float animation-delay-1000">
🔒
</div>

<div className="absolute bottom-20 right-40 text-white/10 text-4xl animate-float animation-delay-2000">
⚡
</div>

</div>
)
}