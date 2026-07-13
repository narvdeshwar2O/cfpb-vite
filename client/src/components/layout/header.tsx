import { Bell, LogOut } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { NAV_LINKS } from "@/constants/navigation"
import { useAuth } from "@/context/AuthContext"

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const { user, isSuperAdmin, logout } = useAuth();
  
  const currentLink = NAV_LINKS.find(link => link.href === pathname);
  const title = currentLink ? currentLink.label : "NAFIS Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.fullName || "Admin User";
  const displayRole = user?.state ? `${user.state}` : (isSuperAdmin ? "Super Admin" : "User");
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="flex h-[73px] shrink-0 items-center justify-between bg-white border-b border-slate-200 px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {currentLink && <currentLink.icon className="w-6 h-6 text-indigo-600" />}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50 mr-2">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-700">{displayName}</span>
            <span className="text-xs text-slate-500 font-medium">{displayRole}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-inner shadow-indigo-200/50">
            {initials}
          </div>
          <button onClick={handleLogout} className="p-2 ml-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
