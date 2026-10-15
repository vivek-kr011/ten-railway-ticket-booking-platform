import AppRoutes from "./routes/AppRoutes";

import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
