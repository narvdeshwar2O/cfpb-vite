import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Outlet />
    </div>
  );
}
