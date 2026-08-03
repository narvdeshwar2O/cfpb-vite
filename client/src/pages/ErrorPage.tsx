import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="flex flex-col items-center justify-center max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-2">{errorStatus}</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Oops! Something went wrong</h2>
        
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          {errorMessage}
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100 outline-none"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
