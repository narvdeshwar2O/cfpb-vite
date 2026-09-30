import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UnauthorizedPage() {
  const { permissions, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  // Distinguish between "no permissions at all" vs "missing specific permission"
  const hasZeroPermissions = !isSuperAdmin && permissions.length === 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 max-w-md w-full flex flex-col items-center">
        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50">
          <ShieldAlert size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {hasZeroPermissions ? "No Access Granted" : "Access Denied"}
        </h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {hasZeroPermissions 
            ? "Your account currently has no permissions assigned. You cannot view any modules or data."
            : "You do not have the required permissions to view this specific page."}
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full text-sm text-slate-500 mb-6">
          Please contact your System Administrator to request the necessary access rights for your account.
        </div>

        <div className="flex flex-col w-full gap-3">
          {!hasZeroPermissions && (
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          )}
          <Button variant="default" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout Securely
          </Button>
        </div>
      </div>
    </div>
  );
}
