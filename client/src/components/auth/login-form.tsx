import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Mail, Lock } from "lucide-react"
import { useState } from "react"

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("nafis@gov.in")
  const [password, setPassword] = useState("admin")
  const [error, setError] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Adding a slight delay to show the loading animation for better UX
    setTimeout(() => {
      if (email === "nafis@gov.in" && password === "admin") {
        localStorage.setItem('isLoggedIn', 'true')
        navigate("/")
      } else {
        setError("Invalid credentials. Please use nafis@gov.in / admin")
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <Card className="w-[450px] shadow-2xl shadow-indigo-900/10 border-0 rounded-2xl overflow-hidden bg-white border">
      <CardHeader className="flex flex-col items-center gap-4 bg-slate-50 pt-10 pb-8 border-b border-slate-100">
        <div className="w-20 h-24 bg-transparent flex items-center justify-center">
           <img src="/logo.png" alt="Logo" width={80} height={96} className="w-full h-full object-contain" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            NAFIS Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Secure Access Portal</p>
        </div>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="flex flex-col gap-5 pt-8 pb-8 px-10">
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              required
              placeholder="Email / Login ID"
              className="pl-10 h-12 bg-slate-50 border-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              required
              placeholder="Password"
              className="pl-10 h-12 bg-slate-50 border-slate-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-1">
             <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Forgot Password?</a>
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-6 px-10 pb-10">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:bg-indigo-400"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Authenticate"
            )}
          </Button>

          <div className="text-center flex flex-col gap-2 text-xs font-medium text-slate-500 bg-slate-50 p-4 rounded-xl w-full border border-slate-100">
            <p className="text-slate-700">National Crime Records Bureau</p>
            <p>Ministry of Home Affairs, New Delhi</p>
            <p className="mt-2 text-indigo-600 cursor-pointer hover:underline">Contact Administrator for Access</p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
