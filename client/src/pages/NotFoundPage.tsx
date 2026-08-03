import { Link } from "react-router-dom";
import { SearchX, Home } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center max-w-md text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-slate-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-slate-800 mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
        
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        
        <Link 
          to={ROUTES.dashboard}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
