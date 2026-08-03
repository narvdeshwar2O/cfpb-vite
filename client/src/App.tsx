import { AppProvider } from "./app/providers";
import { AppRouter } from "./app/routes";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster />
    </AppProvider>
  );
}
